'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PalmScanner from '@/components/palm-analysis/PalmScanner';
import PalmResults from '@/components/palm-analysis/PalmResults';
import { PalmAnalysisResult } from '@/types/palm-analysis';
import { supabase } from '@/utils/supabase';
import { getEffectiveCredits } from '@/utils/credits';

const PALM_ANALYSIS_COST = 30;

// Compress image adaptively to reduce Gemini API token usage and speed up processing.
// Strategy: resize first, then lower JPEG quality/width until payload is near target size.
function estimateDataUriBytes(dataUri: string): number {
  const base64 = dataUri.split(',')[1] || '';
  return Math.floor((base64.length * 3) / 4);
}

function compressImage(dataUri: string, maxWidth = 1024, initialQuality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const TARGET_MAX_BYTES = 350 * 1024; // ~350KB — balanced: fast upload + enough detail for AI
      const MIN_QUALITY = 0.50;
      const MIN_WIDTH = 600;

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

      // Apply unsharp mask to enhance palm creases & ridges for better AI detection
      const applyUnsharpMask = (ctx: CanvasRenderingContext2D, w: number, h: number, amount = 0.45, radius = 1) => {
        const original = ctx.getImageData(0, 0, w, h);
        // Create blurred version using a temporary canvas
        const blurCanvas = document.createElement('canvas');
        blurCanvas.width = w;
        blurCanvas.height = h;
        const blurCtx = blurCanvas.getContext('2d');
        if (!blurCtx) return;
        blurCtx.filter = `blur(${radius}px)`;
        blurCtx.drawImage(canvas, 0, 0, w, h);
        const blurred = blurCtx.getImageData(0, 0, w, h);

        const data = original.data;
        const blurData = blurred.data;
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            const diff = data[i + c] - blurData[i + c];
            data[i + c] = Math.min(255, Math.max(0, data[i + c] + diff * amount));
          }
        }
        ctx.putImageData(original, 0, 0);
      };

      const render = (targetWidth: number, targetHeight: number, quality: number) => {
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }
        // Boost contrast & sharpen to make palm creases stand out
        ctx.filter = 'contrast(1.18) saturate(1.05) brightness(1.02)';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        ctx.filter = 'none';
        // Unsharp mask to enhance fine crease details
        applyUnsharpMask(ctx, targetWidth, targetHeight, 0.45, 1);
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
      typeof value.summary === 'string'
  );
}

export default function PalmAnalysisClient() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(false);

  // Fetch user credits on mount + listen for auth changes
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const credits = await getEffectiveCredits(user.id);
          setUserCredits(credits.total);
        }
      } catch {
        // Not logged in
      }
    };
    fetchCredits();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const credits = await getEffectiveCredits(session.user.id);
        setUserCredits(credits.total);
      } else {
        setUserCredits(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // Called when user clicks "วิเคราะห์รูปใหม่" to clear all previous state
  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

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
    if (cooldown > 0 || inFlightRef.current) return;

    // ── Fix: Lock immediately to prevent double-tap race condition ──
    inFlightRef.current = true;
    let creditDeducted = false;

    try {
      const Swal = (await import('sweetalert2')).default;

      // Step 1: Auth check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const authResult = await Swal.fire({
          title: '🔒 กรุณาเข้าสู่ระบบ',
          html: '<p style="color:#94a3b8">คุณต้องเข้าสู่ระบบก่อนจึงจะใช้งานวิเคราะห์ลายมือได้</p>',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'เข้าสู่ระบบ',
          cancelButtonText: 'ยกเลิก',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#d97706',
          customClass: { popup: 'rounded-2xl border border-amber-500/20' },
        });
        if (authResult.isConfirmed) {
          router.push('/login?redirect=/palm-analysis');
        }
        return;
      }

      // Step 2: Credit check
      const latestCredits = await getEffectiveCredits(user.id);
      setUserCredits(latestCredits.total);

      if (latestCredits.total < PALM_ANALYSIS_COST) {
        const topupResult = await Swal.fire({
          title: '💰 เครดิตไม่เพียงพอ',
          html: `<p style="color:#94a3b8">การวิเคราะห์ลายมือใช้ <strong style="color:#fbbf24">${PALM_ANALYSIS_COST} เครดิต</strong></p><p style="color:#94a3b8;margin-top:4px">คุณมี <strong style="color:#ef4444">${latestCredits.total} เครดิต</strong></p>`,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'เติมเครดิต',
          cancelButtonText: 'ยกเลิก',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#d97706',
          customClass: { popup: 'rounded-2xl border border-amber-500/20' },
        });
        if (topupResult.isConfirmed) {
          router.push('/topup');
        }
        return;
      }

      // Step 3: Confirmation
      const confirmResult = await Swal.fire({
        title: '✨ ยืนยันการวิเคราะห์',
        html: `<p style="color:#94a3b8">การวิเคราะห์ลายมือจะใช้ <strong style="color:#fbbf24">${PALM_ANALYSIS_COST} เครดิต</strong></p><p style="color:#94a3b8;margin-top:4px">คุณมี <strong style="color:#34d399">${latestCredits.total} เครดิต</strong> (คงเหลือ ${latestCredits.total - PALM_ANALYSIS_COST} เครดิต)</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `ยืนยัน (ใช้ ${PALM_ANALYSIS_COST} เครดิต)`,
        cancelButtonText: 'ยกเลิก',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#d97706',
        customClass: { popup: 'rounded-2xl border border-amber-500/20' },
      });
      if (!confirmResult.isConfirmed) return;

      // Step 4: Deduct credits
      const { error: deductError } = await supabase.rpc('deduct_credits', { amount: PALM_ANALYSIS_COST });
      if (deductError) {
        await Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถหักเครดิตได้ กรุณาลองใหม่',
          icon: 'error',
          background: '#1e293b',
          color: '#fff',
          customClass: { popup: 'rounded-2xl' },
        });
        return;
      }

      creditDeducted = true;
      setUserCredits((prev) => (prev !== null ? prev - PALM_ANALYSIS_COST : null));
      window.dispatchEvent(new Event('force_credits_update'));

      // Proceed with analysis
      setIsAnalyzing(true);
      setError(null);
      setResult(null);

      // Compress image before sending
      const compressed = await compressImage(imageBase64);

      // ── Fix: Add timeout to prevent infinite spinner ──
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40_000);

      try {
        const response = await fetch('/api/analyze-palm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageBase64: compressed }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

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

        // Success — mark credits as consumed (no refund needed)
        creditDeducted = false;
        setResult(data);
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      console.error('Analysis error:', err);

      // ── Fix: Refund credits if deducted but analysis failed ──
      if (creditDeducted) {
        try {
          await supabase.rpc('deduct_credits', { amount: -PALM_ANALYSIS_COST });
          setUserCredits((prev) => (prev !== null ? prev + PALM_ANALYSIS_COST : null));
          window.dispatchEvent(new Event('force_credits_update'));
          console.log('[palm] Credits refunded after failed analysis');
        } catch (refundErr) {
          console.error('[palm] Failed to refund credits:', refundErr);
        }
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('การวิเคราะห์ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง');
      } else {
        const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
        setError(message);
      }
    } finally {
      inFlightRef.current = false;
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 lg:gap-8 items-start">
        <div className="xl:col-span-5 space-y-3 sm:space-y-4">
          <div className="hidden sm:block rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-slate-900/60 p-4 sm:p-5">
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">เริ่มวิเคราะห์ลายมือ</h2>
            <p className="text-sm text-amber-200/50 mt-1">ระบบจะประเมินคุณภาพภาพก่อน แล้วจึงประมวลผลเพื่อให้ผลลัพธ์อ่านง่ายและนำไปใช้ต่อได้</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-300">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5">💰 {PALM_ANALYSIS_COST} เครดิต / ครั้ง</span>
              {userCredits !== null && <span className="text-amber-400/60">คงเหลือ {userCredits} เครดิต</span>}
            </div>
          </div>

        <PalmScanner 
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          isAnalyzing={isAnalyzing} 
          result={result} 
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-900/40 border border-red-800 rounded-xl text-red-200 text-center text-sm backdrop-blur-sm" role="alert" aria-live="assertive">
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

          {!result && !isAnalyzing && !error && (
            <div className="hidden sm:block rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-slate-900/50 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-amber-200 mb-2">Checklist ก่อนวิเคราะห์</h3>
              <ul className="space-y-1.5 text-xs text-amber-300/50">
                <li>• ฝ่ามือเต็มเฟรม และไม่ถูกตัดขอบ</li>
                <li>• ภาพไม่เบลอ และมีแสงเพียงพอ</li>
                <li>• มือหงายตรงกับกล้องให้มากที่สุด</li>
              </ul>
            </div>
          )}
        </div>

        <div className="xl:col-span-7">
          {result ? (
            <PalmResults result={result} />
          ) : (
            <div className="hidden xl:flex rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-950/10 to-slate-900/30 p-6 sm:p-8 min-h-[320px] items-center justify-center">
              <div className="text-center max-w-md">
                <p className="text-amber-100 font-medium">ผลวิเคราะห์จะแสดงที่นี่</p>
                <p className="text-sm text-amber-300/50 mt-2">
                  อัปโหลดภาพฝ่ามือและกด “เริ่มวิเคราะห์ลายมือ” เพื่อดูคะแนนทั้ง 4 ด้าน พร้อมสรุปเชิงแนวโน้ม
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
