'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PalmScanner from '@/components/palm-analysis/PalmScanner';
import PalmResults from '@/components/palm-analysis/PalmResults';
import { PalmAnalysisResult } from '@/types/palm-analysis';

// Prepare image with higher quality while keeping payload manageable
function compressImage(dataUri: string, maxWidth = 1600, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down if needed
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
      ctx.filter = 'contrast(1.08) saturate(1.04)';
      ctx.drawImage(img, 0, 0, width, height);
      ctx.filter = 'none';
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUri;
  });
}

export default function PalmAnalysisClient() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (imageBase64: string) => {
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

      const data = await response.json();

      if (!response.ok) {
        console.error('[palm] API error:', data);

        // User-friendly message for quota errors
        if (response.status === 429 || data.code === 'QUOTA_EXHAUSTED') {
          throw new Error('ระบบมีผู้ใช้งานจำนวนมากในขณะนี้ กรุณารอ 1-2 นาที แล้วลองใหม่อีกครั้ง');
        }

        throw new Error(data.details || data.error || 'ไม่สามารถวิเคราะห์ภาพได้');
      }

      setResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center w-full">
      {/* Left Column: Scanner */}
      <motion.div 
        className={`w-full transition-all duration-700 ease-in-out ${result ? 'lg:w-1/3' : 'lg:w-1/2 mx-auto'}`}
        layout
      >
        <PalmScanner 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
          result={result} 
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-800 rounded-xl text-red-200 text-center text-sm backdrop-blur-sm">
            {error}
          </div>
        )}
      </motion.div>

      {/* Right Column: Results */}
      <AnimatePresence>
        {result && (
          <motion.div 
            className="w-full lg:w-2/3"
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
