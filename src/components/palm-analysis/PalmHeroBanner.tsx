'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Crown, ScanLine, ShieldCheck } from 'lucide-react';

function StatBadge({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start justify-center text-center sm:text-left rounded-lg sm:rounded-xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-slate-900/60 px-2 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[11px] sm:text-sm font-semibold text-amber-100 leading-tight">{title}</p>
      <p className="text-[9px] sm:text-xs text-amber-300/60 mt-0.5 sm:mt-1 leading-tight">{description}</p>
    </div>
  );
}

export default function PalmHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-b from-slate-950 via-slate-950 to-amber-950/20 mb-2 sm:mb-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 w-64 h-64 rounded-full bg-amber-500/8 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-400/5 blur-[100px]" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-y-4 gap-x-8 px-4 py-4 sm:px-10 sm:py-12">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 sm:py-1.5 mb-2 sm:mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-medium text-amber-200">Premium AI Palm Analysis</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            วิเคราะห์ลายมือออนไลน์
            <span className="block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mt-1 sm:text-3xl lg:text-4xl">แบบมืออาชีพด้วย AI</span>
          </h1>

          <p className="hidden sm:block mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนาในภาพเดียว พร้อมสรุปผลที่เข้าใจง่าย ใช้ได้จริง และออกแบบมาเพื่อประสบการณ์ใช้งานที่ชัดเจนบนทุกอุปกรณ์
          </p>

          <div className="mt-3 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <StatBadge title="4 เส้นหลัก" description="วิเคราะห์ครบทุกมิติ" />
            <StatBadge title="30 เครดิต" description="ต่อการวิเคราะห์" />
            <StatBadge title="ผลลัพธ์ทันที" description="ภายในไม่กี่วินาที" />
          </div>

          <div className="hidden sm:grid sm:grid-cols-2 gap-3 mt-6">
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-slate-900/60 p-3">
              <ScanLine className="w-4 h-4 text-amber-300 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-100">ขั้นตอนใช้งานสั้น 3 ขั้น</p>
                <p className="text-xs text-amber-300/50">อัปโหลดรูป → ตรวจคุณภาพ → ดูผลวิเคราะห์</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-slate-900/60 p-3">
              <ShieldCheck className="w-4 h-4 text-amber-300 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-100">แนวทางเชิงบวก</p>
                <p className="text-xs text-amber-300/50">ผลวิเคราะห์เน้นสะท้อนตัวเอง ไม่ฟันธงรุนแรง</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:col-span-5 lg:flex items-center">
          <div className="w-full rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-slate-900/70 p-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-amber-500/15 bg-slate-950">
              <Image
                src="/images/palm-analysis/palm-reference-style.svg"
                alt="ภาพประกอบการวิเคราะห์ลายมือด้วย AI"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-amber-500/20 bg-amber-950/30 px-3 py-2 text-xs text-amber-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> ความคมของภาพ
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-950/30 px-3 py-2 text-xs text-amber-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> คุณภาพแสง
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
