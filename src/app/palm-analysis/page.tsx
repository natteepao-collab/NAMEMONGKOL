import React from 'react';
import { Metadata } from 'next';
import PalmAnalysisClient from './PalmAnalysisClient';

export const metadata: Metadata = {
  title: 'วิเคราะห์ลายมือด้วย AI - ค้นหาจุดเด่นและตัวตนของคุณ | NameMongkol',
  description: 'ระบบวิเคราะห์ลายมือด้วย AI อัจฉริยะ (Palmistry AI) ค้นหาจุดเด่น จุดด้อย และตัวตนที่แท้จริงของคุณผ่านเส้นลายมือ พร้อมคำแนะนำเชิงบวก',
  openGraph: {
    title: 'วิเคราะห์ลายมือด้วย AI - ค้นหาจุดเด่นและตัวตนของคุณ',
    description: 'ระบบวิเคราะห์ลายมือด้วย AI อัจฉริยะ (Palmistry AI) ค้นหาจุดเด่น จุดด้อย และตัวตนที่แท้จริงของคุณผ่านเส้นลายมือ',
    type: 'website',
  },
};

export default function PalmAnalysisPage() {
  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Galaxy Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4 tracking-tight">
            AI Palmistry Analysis
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            อัปโหลดรูปภาพลายมือของคุณ เพื่อให้ AI ผู้เชี่ยวชาญด้านหัตถศาสตร์วิเคราะห์ตัวตน จุดเด่น และศักยภาพที่ซ่อนอยู่
          </p>
        </div>

        <PalmAnalysisClient />
      </div>
    </main>
  );
}
