'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PalmScanner from '@/components/palm-analysis/PalmScanner';
import PalmResults from '@/components/palm-analysis/PalmResults';
import { PalmAnalysisResult } from '@/types/palm-analysis';

// Compress image adaptively to reduce Gemini API token usage and speed up processing.
// Strategy: resize first, then lower JPEG quality/width until payload is near target size.
function estimateDataUriBytes(dataUri: string): number {
  const base64 = dataUri.split(',')[1] || '';
  return Math.floor((base64.length * 3) / 4);
}

function compressImage(dataUri: string, maxWidth = 768, initialQuality = 0.68): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const TARGET_MAX_BYTES = 220 * 1024; // ~220KB
      const MIN_QUALITY = 0.45;
      const MIN_WIDTH = 512;

      let { width: originalWidth, height: originalHeight } = img;
      let width = originalWidth;
      let height = originalHeight;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context error'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const render = (targetWidth: number, targetHeight: number, quality: number) => {
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }
        // Slightly boost contrast to keep palm lines clear after compression
        ctx.filter = 'contrast(1.12) saturate(1.02)';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        ctx.filter = 'none';
        return canvas.toDataURL('image/jpeg', quality);
      };

      let quality = initialQuality;
      let compressed = render(width, height, quality);

      // Pass 1: reduce JPEG quality while keeping resolution
      while (estimateDataUriBytes(compressed) > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
        quality = Math.max(MIN_QUALITY, Number((quality - 0.06).toFixed(2)));
        compressed = render(width, height, quality);
      }

      // Pass 2: if still too large, reduce resolution gradually
      while (estimateDataUriBytes(compressed) > TARGET_MAX_BYTES && width > MIN_WIDTH) {
        const nextWidth = Math.max(MIN_WIDTH, Math.round(width * 0.85));
        const nextHeight = Math.round((originalHeight * nextWidth) / originalWidth);
        width = nextWidth;
        height = nextHeight;
        compressed = render(width, height, quality);
      }

      resolve(compressed);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUri;
  });
}

const COOLDOWN_SECONDS = 30;

function parseRetryAfterSeconds(retryAfterHeader: string | null): number | null {
  if (!retryAfterHeader) return null;

  const numeric = Number(retryAfterHeader);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return Math.max(1, Math.ceil(numeric));
  }

  const parsedDate = Date.parse(retryAfterHeader);
  if (!Number.isNaN(parsedDate)) {
    const diffMs = parsedDate - Date.now();
    return diffMs > 0 ? Math.max(1, Math.ceil(diffMs / 1000)) : 1;
  }

  return null;
}

async function safeParseResponseBody(response: Response): Promise<Record<string, any>> {
  const rawText = await response.text();
  if (!rawText) return {};

  try {
    const parsed = JSON.parse(rawText);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return { error: rawText.slice(0, 200) };
  }
}

function isPalmAnalysisResult(value: Record<string, any>): value is PalmAnalysisResult {
  return Boolean(
    value &&
      typeof value === 'object' &&
      value.scores &&
      value.line_analysis &&
      Array.isArray(value.personality_traits) &&
      Array.isArray(value.strengths) &&
      Array.isArray(value.areas_for_growth) &&
      typeof value.summary === 'string' &&
      typeof value.spiritual_guidance === 'string'
  );
}

export default function PalmAnalysisClient() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(false);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = useCallback((seconds = COOLDOWN_SECONDS) => {
    const safeSeconds = Math.max(1, Math.ceil(seconds));
    setCooldown(safeSeconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleAnalyze = async (imageBase64: string) => {
    if (cooldown > 0 || inFlightRef.current) return; // Block during cooldown or in-flight request
    inFlightRef.current = true;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Compress image before sending
      const compressed = await compressImage(imageBase64);

      const response = await fetch('/api/analyze-palm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: compressed }),
      });

      const data = await safeParseResponseBody(response);

      if (!response.ok) {
        console.error('[palm] API error:', JSON.stringify(data));

        // User-friendly message for quota errors
        if (response.status === 429 || data.code === 'QUOTA_EXHAUSTED' || data.code === 'RATE_LIMITED') {
          const retryAfterSeconds = parseRetryAfterSeconds(response.headers.get('retry-after'));
          startCooldown(retryAfterSeconds ?? COOLDOWN_SECONDS);
          throw new Error('QUOTA');
        }

        throw new Error(data.details || data.error || 'ไม่สามารถวิเคราะห์ภาพได้');
      }

      if (!isPalmAnalysisResult(data)) {
        throw new Error('รูปแบบข้อมูลผลวิเคราะห์ไม่ถูกต้อง');
      }

      setResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      setError(message);
    } finally {
      inFlightRef.current = false;
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 xl:gap-12 items-start justify-center w-full">
      {/* Left Column: Scanner */}
      <motion.div 
        className={`w-full transition-all duration-700 ease-in-out ${result ? 'xl:w-1/3' : 'xl:w-1/2 mx-auto'}`}
        layout
      >
        <PalmScanner 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
          result={result} 
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-800 rounded-xl text-red-200 text-center text-sm backdrop-blur-sm">
            {error === 'QUOTA' ? (
              <div className="flex flex-col items-center gap-3">
                <p>ระบบมีผู้ใช้งานจำนวนมากในขณะนี้ กรุณารอสักครู่แล้วลองใหม่</p>
                <button
                  onClick={() => setError(null)}
                  disabled={cooldown > 0}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {cooldown > 0 ? `รอสักครู่... (${cooldown}วินาที)` : 'ลองอีกครั้ง'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Right Column: Results */}
      <AnimatePresence>
        {result && (
          <motion.div 
            className="w-full xl:w-2/3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PalmResults result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
