'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, RefreshCw, ScanLine, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import SvgOverlay from './SvgOverlay';
import { PalmAnalysisResult } from '@/types/palm-analysis';

interface PalmScannerProps {
  onAnalyze: (imageBase64: string) => void;
  onReset?: () => void;
  isAnalyzing: boolean;
  result: PalmAnalysisResult | null;
}

interface PhotoQuality {
  sharpness: number;
  lighting: number;
  contrast: number;
  overall: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toRounded(value: number): number {
  return Math.round(value);
}

function getPhotoQualityFromImageData(imageData: ImageData): PhotoQuality {
  const data = imageData.data;
  const pixelCount = data.length / 4;
  const luminance = new Float32Array(pixelCount);

  let brightnessSum = 0;
  for (let index = 0; index < pixelCount; index++) {
    const base = index * 4;
    const red = data[base];
    const green = data[base + 1];
    const blue = data[base + 2];
    const value = 0.299 * red + 0.587 * green + 0.114 * blue;
    luminance[index] = value;
    brightnessSum += value;
  }

  const width = imageData.width;
  const height = imageData.height;
  const avgBrightness = brightnessSum / pixelCount;

  let varianceSum = 0;
  for (let index = 0; index < pixelCount; index++) {
    const diff = luminance[index] - avgBrightness;
    varianceSum += diff * diff;
  }
  const stdDev = Math.sqrt(varianceSum / pixelCount);

  let edgeSum = 0;
  let edgeCount = 0;
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const currentIndex = y * width + x;
      const rightIndex = currentIndex + 1;
      const downIndex = currentIndex + width;
      const gx = Math.abs(luminance[currentIndex] - luminance[rightIndex]);
      const gy = Math.abs(luminance[currentIndex] - luminance[downIndex]);
      edgeSum += gx + gy;
      edgeCount++;
    }
  }

  const edgeMean = edgeCount > 0 ? edgeSum / edgeCount : 0;
  const lightingScore = clamp(100 - Math.abs(avgBrightness - 145) * 1.3, 0, 100);
  const contrastScore = clamp((stdDev / 64) * 100, 0, 100);
  const sharpnessScore = clamp((edgeMean / 45) * 100, 0, 100);
  const overall = clamp(sharpnessScore * 0.48 + lightingScore * 0.34 + contrastScore * 0.18, 0, 100);

  return {
    sharpness: toRounded(sharpnessScore),
    lighting: toRounded(lightingScore),
    contrast: toRounded(contrastScore),
    overall: toRounded(overall),
  };
}

async function evaluateDataUrlQuality(dataUrl: string): Promise<PhotoQuality> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context error'));
        return;
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(getPhotoQualityFromImageData(imageData));
    };
    image.onerror = () => reject(new Error('Failed to load image for quality check'));
    image.src = dataUrl;
  });
}

function qualityHint(quality: PhotoQuality): string {
  if (quality.overall >= 75) return 'คุณภาพภาพดีมาก เหมาะกับการวิเคราะห์เส้นละเอียด';
  if (quality.overall >= 60) return 'คุณภาพภาพพอใช้ แนะนำเพิ่มแสงหรือถือกล้องให้นิ่งขึ้น';
  return 'คุณภาพภาพยังต่ำ แนะนำเพิ่มแสง วางฝ่ามือเต็มเฟรม และถ่ายมุมตรง';
}

export default function PalmScanner({ onAnalyze, onReset, isAnalyzing, result }: PalmScannerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [liveQuality, setLiveQuality] = useState<PhotoQuality | null>(null);
  const [capturedQuality, setCapturedQuality] = useState<PhotoQuality | null>(null);

  const hasLowLineDetail = React.useMemo(() => {
    if (!result) return false;
    const avgLinePoints =
      result.lines.length > 0 ? result.lines.reduce((sum, line) => sum + line.points.length, 0) / result.lines.length : 0;
    const quality = result.image_quality;
    const lowQuality = !!quality && (quality.sharpness < 55 || quality.lighting < 50 || quality.perspective < 50 || quality.occlusion < 45);
    return avgLinePoints < 6 || lowQuality;
  }, [result]);

  const hasLowCaptureQuality = !result && !!capturedQuality && capturedQuality.overall < 60;
  const currentStep = isAnalyzing ? 3 : imageSrc ? 2 : 1;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
      setIsCameraOpen(false);
      setCameraError(null);
      setLiveQuality(null);

      evaluateDataUrlQuality(dataUrl)
        .then((quality) => setCapturedQuality(quality))
        .catch(() => setCapturedQuality(null));
    };
    reader.readAsDataURL(file);
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
    setLiveQuality(null);
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง กรุณาใช้อัปโหลดรูปแทน');
      return;
    }

    if (!window.isSecureContext) {
      setCameraError('ไม่สามารถเปิดกล้องได้ในโหมดไม่ปลอดภัย กรุณาเปิดผ่าน HTTPS หรือ localhost');
      return;
    }

    try {
      setCameraError(null);
      stopCamera();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setIsCameraOpen(true);
      setImageSrc(null);
      setCapturedQuality(null);
      setLiveQuality(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      const error = err as DOMException;
      if (error?.name === 'NotAllowedError') {
        setCameraError('เบราว์เซอร์ปฏิเสธสิทธิ์กล้อง กรุณาอนุญาต Camera ใน Site Settings แล้วลองใหม่');
      } else if (error?.name === 'NotFoundError') {
        setCameraError('ไม่พบอุปกรณ์กล้องในเครื่อง กรุณาตรวจสอบว่ากล้องพร้อมใช้งาน');
      } else {
        setCameraError('ไม่สามารถเข้าถึงกล้องได้ในขณะนี้ กรุณาลองใหม่ หรือใช้แอปกล้องแทน');
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);
    setCapturedQuality(liveQuality);
    if (navigator.vibrate) navigator.vibrate(50);
    stopCamera();
  };

  const handleAnalyze = () => {
    if (!imageSrc) return;
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    onAnalyze(imageSrc);
  };

  const reset = () => {
    setImageSrc(null);
    setIsCameraOpen(false);
    setCameraError(null);
    setCapturedQuality(null);
    setLiveQuality(null);
    stopCamera();
    onReset?.();
  };

  React.useEffect(() => {
    if (!isCameraOpen) return;

    const timer = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = 360;
      canvas.height = 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setLiveQuality(getPhotoQualityFromImageData(imageData));
    }, 600);

    return () => {
      window.clearInterval(timer);
    };
  }, [isCameraOpen]);

  React.useEffect(() => {
    if (!isCameraOpen || !videoRef.current || !streamRef.current) return;
    const video = videoRef.current;
    video.srcObject = streamRef.current;

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((error) => {
        console.error('Video play() failed:', error);
      });
    }
  }, [isCameraOpen]);

  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const updateDimensions = () => {
      if (!imageContainerRef.current) return;
      const container = imageContainerRef.current;
      const containerRatio = container.clientWidth / container.clientHeight;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let renderWidth: number;
      let renderHeight: number;

      if (imgRatio > containerRatio) {
        renderWidth = container.clientWidth;
        renderHeight = container.clientWidth / imgRatio;
      } else {
        renderHeight = container.clientHeight;
        renderWidth = container.clientHeight * imgRatio;
      }

      setImageDimensions({ width: renderWidth, height: renderHeight });
    };

    updateDimensions();
    (window as any)._updatePalmImageDimensions = updateDimensions;
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if ((window as any)._updatePalmImageDimensions) {
        (window as any)._updatePalmImageDimensions();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      delete (window as any)._updatePalmImageDimensions;
    };
  }, [imageSrc]);

  return (
    <section className="w-full max-w-2xl mx-auto bg-gradient-to-b from-slate-900/60 to-amber-950/10 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-amber-900/10 relative overflow-hidden" aria-label="เครื่องมือสแกนลายมือ">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-[90px] pointer-events-none" />

      <header className="mb-3 sm:mb-6">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-amber-400" />
            Palm Scanner
          </h2>
          <span className="text-xs text-amber-300/60 border border-amber-500/30 bg-amber-500/10 rounded-full px-2.5 py-1 shrink-0">Step {currentStep}/3</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {[1, 2, 3].map((step) => {
            const active = currentStep >= step;
            return (
              <div key={step} className={`rounded-lg border px-2 py-1.5 sm:py-2 text-center text-xs ${active ? 'border-amber-500/40 bg-amber-500/10 text-amber-200' : 'border-slate-700 bg-slate-900/60 text-slate-500'}`}>
                {step === 1 && 'เลือกภาพ'}
                {step === 2 && 'ตรวจคุณภาพ'}
                {step === 3 && 'วิเคราะห์'}
              </div>
            );
          })}
        </div>
      </header>

      <div className="relative w-full aspect-square sm:aspect-[3/4] bg-slate-950 rounded-xl overflow-hidden border border-amber-500/15 flex flex-col items-center justify-center mb-3 sm:mb-6">
        {isCameraOpen && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 rounded-xl border-2 border-blue-500/30" />
            <div className="absolute inset-2 rounded-lg border border-slate-300/20" />
          </div>
        )}

        {!imageSrc && !isCameraOpen && (
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center mb-2">
              <Upload className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              อัปโหลดรูปภาพลายมือของคุณ
              <br />
              หรือถ่ายรูปใหม่เพื่อวิเคราะห์
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-blue-200/90 text-xs leading-relaxed">
              💡 แนะนำให้ใช้แสงธรรมชาติ และวางฝ่ามือเต็มเฟรม
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                <Upload className="w-4 h-4" />
                อัปโหลดรูป
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={startCamera}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700 w-full sm:w-auto"
              >
                <Camera className="w-4 h-4" />
                ถ่ายรูป
              </button>
              <input ref={captureInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
            </div>

            {cameraError && (
              <div className="w-full mt-2 space-y-2">
                <p className="text-xs text-rose-300 leading-relaxed" role="alert">{cameraError}</p>
                <button
                  onClick={() => captureInputRef.current?.click()}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                >
                  ใช้แอปกล้องมือถือแทน
                </button>
              </div>
            )}
          </div>
        )}

        {isCameraOpen && (
          <div className="relative w-full h-full">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            <div className="absolute bottom-20 left-0 right-0 text-center z-10 pointer-events-none">
              <span className="bg-black/60 backdrop-blur-sm text-slate-200 text-xs px-3 py-1.5 rounded-full">วางฝ่ามือให้เต็มกรอบ • ถือกล้องนิ่ง • ใช้แสงธรรมชาติ</span>
            </div>

            {liveQuality && (
              <div className="absolute top-3 left-3 right-3 bg-slate-950/75 backdrop-blur-sm border border-slate-700 rounded-lg p-3 text-xs text-slate-200 z-10">
                <div className="flex items-center justify-between mb-2">
                  <span>คุณภาพภาพก่อนถ่าย</span>
                  <span className="font-semibold text-blue-300">{liveQuality.overall}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>ความคม: <span className="text-slate-100">{liveQuality.sharpness}</span></div>
                  <div>แสง: <span className="text-slate-100">{liveQuality.lighting}</span></div>
                  <div>คอนทราสต์: <span className="text-slate-100">{liveQuality.contrast}</span></div>
                </div>
                <p className="mt-2 text-[11px] text-amber-200">{qualityHint(liveQuality)}</p>
              </div>
            )}

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={captureImage}
                className="w-18 h-18 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                title={liveQuality ? qualityHint(liveQuality) : 'ถ่ายภาพ'}
              >
                <div className="w-14 h-14 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-slate-700" />
                </div>
              </button>
              <button onClick={stopCamera} className="absolute right-6 bottom-2 bg-slate-800/90 text-white p-3 rounded-full backdrop-blur-sm">
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        {imageSrc && (
          <div ref={imageContainerRef} className="relative w-full h-full flex items-center justify-center bg-black">
            <img src={imageSrc} alt="ภาพฝ่ามือสำหรับการวิเคราะห์" className="max-w-full max-h-full object-contain" onLoad={handleImageLoad} />

            {isAnalyzing && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-20" />}

            {result && result.lines && imageDimensions.width > 0 && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{ width: `${imageDimensions.width}px`, height: `${imageDimensions.height}px` }}
              >
                <SvgOverlay lines={result.lines} width={imageDimensions.width} height={imageDimensions.height} />
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {imageSrc && !isAnalyzing && !result && (
        <>
          {capturedQuality && (
            <div className="mb-3 p-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-200 text-sm" aria-live="polite">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5">
                  {hasLowCaptureQuality ? <AlertTriangle className="w-4 h-4 text-amber-300" /> : <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                  คุณภาพภาพที่ใช้วิเคราะห์
                </span>
                <span className="font-semibold text-blue-300">{capturedQuality.overall}%</span>
              </div>
              <p className={`mt-1 text-xs ${hasLowCaptureQuality ? 'text-amber-200' : 'text-emerald-300'}`}>{qualityHint(capturedQuality)}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <RefreshCw className="w-5 h-5" />
              เปลี่ยนรูป
            </button>
            <button
              onClick={handleAnalyze}
              className="sm:flex-[2] bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2"
            >
              <ScanLine className="w-5 h-5" />
              เริ่มวิเคราะห์ลายมือ (30 เครดิต)
            </button>
          </div>
        </>
      )}

      {isAnalyzing && (
        <div className="w-full space-y-3 mb-4" role="status" aria-live="polite">
          <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-amber-400 h-2 rounded-full animate-pulse" style={{ width: '78%' }} />
          </div>
          <p className="text-center text-blue-300 text-sm inline-flex items-center justify-center gap-2 w-full">
            <Sparkles className="w-4 h-4" /> กำลังประมวลผลภาพลายมือ โปรดรอสักครู่...
          </p>
        </div>
      )}

      {result && (
        <>
          {hasLowLineDetail && (
            <div className="w-full mt-4 p-3 rounded-xl border border-amber-700/60 bg-amber-900/20 text-amber-200 text-sm text-center">
              ระบบพบว่ารายละเอียดเส้นลายมือยังไม่ชัดพอ แนะนำถ่ายใหม่ในที่แสงสว่างมากขึ้น ให้ฝ่ามือเต็มเฟรม และถือกล้องตรงกับฝ่ามือ
            </div>
          )}

          <button
            onClick={reset}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700 mt-4"
          >
            <RefreshCw className="w-5 h-5" />
            วิเคราะห์รูปใหม่
          </button>
        </>
      )}
    </section>
  );
}
