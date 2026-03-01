'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, RefreshCw, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';
import SvgOverlay from './SvgOverlay';
import { PalmAnalysisResult } from '@/types/palm-analysis';

interface PalmScannerProps {
  onAnalyze: (imageBase64: string) => void;
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

export default function PalmScanner({
  onAnalyze,
  isAnalyzing,
  result,
}: PalmScannerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [liveQuality, setLiveQuality] = useState<PhotoQuality | null>(null);
  const [capturedQuality, setCapturedQuality] = useState<PhotoQuality | null>(null);

  const hasLowLineDetail = React.useMemo(() => {
    if (!result) return false;
    const avgLinePoints =
      result.lines.length > 0
        ? result.lines.reduce((sum, line) => sum + line.points.length, 0) / result.lines.length
        : 0;
    const quality = result.image_quality;
    const lowQuality =
      !!quality &&
      (quality.sharpness < 55 ||
        quality.lighting < 50 ||
        quality.perspective < 50 ||
        quality.occlusion < 45);
    return avgLinePoints < 24 || lowQuality;
  }, [result]);

  const hasLowCaptureQuality = !result && !!capturedQuality && capturedQuality.overall < 60;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImageSrc(dataUrl);
        setIsCameraOpen(false);
        setLiveQuality(null);

        evaluateDataUrlQuality(dataUrl)
          .then((quality) => setCapturedQuality(quality))
          .catch(() => setCapturedQuality(null));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        setImageSrc(null);
        setCapturedQuality(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึง');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraOpen(false);
      setLiveQuality(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
        setCapturedQuality(liveQuality);
        stopCamera();
      }
    }
  };

  const handleAnalyze = () => {
    if (imageSrc) {
      onAnalyze(imageSrc);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setIsCameraOpen(false);
    setCapturedQuality(null);
    setLiveQuality(null);
    stopCamera();
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

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const updateDimensions = () => {
      if (imageContainerRef.current) {
        const container = imageContainerRef.current;
        const containerRatio = container.clientWidth / container.clientHeight;
        const imgRatio = img.naturalWidth / img.naturalHeight;

        let renderWidth, renderHeight;

        if (imgRatio > containerRatio) {
          renderWidth = container.clientWidth;
          renderHeight = container.clientWidth / imgRatio;
        } else {
          renderHeight = container.clientHeight;
          renderWidth = container.clientHeight * imgRatio;
        }

        setImageDimensions({ width: renderWidth, height: renderHeight });
      }
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
    <div className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
        <ScanLine className="w-6 h-6 text-blue-400" />
        สแกนลายมือของคุณ
      </h2>

      <div className="relative w-full aspect-[3/4] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center mb-6">
        {!imageSrc && !isCameraOpen && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-2">
              <Upload className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-300 text-sm">
              อัปโหลดรูปภาพลายมือของคุณ
              <br />
              หรือถ่ายรูปใหม่เพื่อวิเคราะห์
            </p>

            <div className="flex gap-3 mt-4">
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                อัปโหลดรูป
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={startCamera}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700"
              >
                <Camera className="w-4 h-4" />
                ถ่ายรูป
              </button>
            </div>
          </div>
        )}

        {isCameraOpen && (
          <div className="relative w-full h-full">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

            {liveQuality && (
              <div className="absolute top-3 left-3 right-3 bg-slate-950/75 backdrop-blur-sm border border-slate-700 rounded-lg p-3 text-xs text-slate-200 z-10">
                <div className="flex items-center justify-between mb-2">
                  <span>คุณภาพภาพก่อนถ่าย</span>
                  <span className="font-semibold text-blue-300">{liveQuality.overall}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    ความคม: <span className="text-slate-100">{liveQuality.sharpness}</span>
                  </div>
                  <div>
                    แสง: <span className="text-slate-100">{liveQuality.lighting}</span>
                  </div>
                  <div>
                    คอนทราสต์: <span className="text-slate-100">{liveQuality.contrast}</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-amber-200">{qualityHint(liveQuality)}</p>
              </div>
            )}

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={captureImage}
                className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                title={liveQuality ? qualityHint(liveQuality) : 'ถ่ายภาพ'}
              >
                <div className="w-12 h-12 bg-white rounded-full border border-slate-200"></div>
              </button>
              <button
                onClick={stopCamera}
                className="absolute right-6 bottom-2 bg-slate-800/80 text-white p-3 rounded-full backdrop-blur-sm"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        {imageSrc && (
          <div ref={imageContainerRef} className="relative w-full h-full flex items-center justify-center bg-black">
            <img src={imageSrc} alt="Palm" className="max-w-full max-h-full object-contain" onLoad={handleImageLoad} />

            {isAnalyzing && (
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {result && result.lines && imageDimensions.width > 0 && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{
                  width: `${imageDimensions.width}px`,
                  height: `${imageDimensions.height}px`,
                }}
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
            <div className="mb-3 p-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-200 text-sm">
              <div className="flex items-center justify-between">
                <span>คุณภาพภาพที่ใช้วิเคราะห์</span>
                <span className="font-semibold text-blue-300">{capturedQuality.overall}%</span>
              </div>
              <p className={`mt-1 text-xs ${hasLowCaptureQuality ? 'text-amber-200' : 'text-emerald-300'}`}>
                {qualityHint(capturedQuality)}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <RefreshCw className="w-5 h-5" />
              เปลี่ยนรูป
            </button>
            <button
              onClick={handleAnalyze}
              className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              <ScanLine className="w-5 h-5" />
              เริ่มวิเคราะห์ลายมือ
            </button>
          </div>
        </>
      )}

      {isAnalyzing && (
        <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 15, ease: 'linear' }}
          />
          <p className="text-center text-slate-400 text-sm mt-3 animate-pulse">กำลังให้ AI วิเคราะห์เส้นลายมือของคุณ...</p>
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
    </div>
  );
}
