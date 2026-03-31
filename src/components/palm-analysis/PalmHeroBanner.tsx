'use client';

import React from 'react';
import Image from 'next/image';

export default function PalmHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-b from-slate-950 via-slate-950 to-amber-950/20 mb-2 sm:mb-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 w-64 h-64 rounded-full bg-amber-500/8 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full bg-amber-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-5 sm:px-10 sm:py-10 items-center">
        {/* Text content */}
        <div className="md:col-span-7 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 sm:py-1.5 mb-3 sm:mb-4 text-xs font-medium text-amber-200">
            ✦ วิเคราะห์ลายมือด้วย AI
          </span>

          <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            วิเคราะห์ลายมือออนไลน์
            <span className="block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mt-1 sm:text-3xl">แบบมืออาชีพด้วย AI</span>
          </h1>

          <div className="mt-4 sm:mt-6 flex items-center justify-center md:justify-start gap-2 sm:gap-3 flex-wrap">
            <span className="rounded-full border border-amber-500/20 bg-amber-950/30 px-3 py-1.5 text-xs text-amber-200">4 เส้นหลัก</span>
            <span className="rounded-full border border-amber-500/20 bg-amber-950/30 px-3 py-1.5 text-xs text-amber-200">20 เครดิต / ครั้ง</span>
            <span className="rounded-full border border-amber-500/20 bg-amber-950/30 px-3 py-1.5 text-xs text-amber-200">ผลลัพธ์ทันที</span>
          </div>
        </div>

        {/* Palm image */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border border-amber-500/15 bg-slate-950/50 shadow-lg shadow-amber-900/10">
            <Image
              src="/images/palm-analysis/palm-reference-style.svg"
              alt="ตัวอย่างเส้นลายมือ — เส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 144px, (max-width: 1024px) 224px, 256px"
              priority
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
