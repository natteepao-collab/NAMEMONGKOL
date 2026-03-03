'use client';

import React from 'react';
import { Heart, Briefcase, Activity, Star, TrendingUp, TrendingDown, Sparkles, Eye, Brain, HeartPulse, Compass } from 'lucide-react';
import { PalmAnalysisResult, PalmLineAnalysis } from '@/types/palm-analysis';

interface PalmResultsProps {
  result: PalmAnalysisResult;
}

// ── Circular Score Ring ──
function ScoreRing({
  score,
  label,
  icon: Icon,
  color,
}: {
  score: number;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap: Record<string, { stroke: string; text: string; glow: string; bg: string }> = {
    pink: {
      stroke: 'stroke-pink-400',
      text: 'text-pink-400',
      glow: 'drop-shadow-[0_0_6px_rgba(236,72,153,0.5)]',
      bg: 'from-pink-500/10 to-pink-900/5',
    },
    blue: {
      stroke: 'stroke-blue-400',
      text: 'text-blue-400',
      glow: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
      bg: 'from-blue-500/10 to-blue-900/5',
    },
    emerald: {
      stroke: 'stroke-emerald-400',
      text: 'text-emerald-400',
      glow: 'drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]',
      bg: 'from-emerald-500/10 to-emerald-900/5',
    },
    amber: {
      stroke: 'stroke-amber-400',
      text: 'text-amber-400',
      glow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]',
      bg: 'from-amber-500/10 to-amber-900/5',
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-b ${c.bg} backdrop-blur-xl border border-white/10`}>
      <div className={`relative w-24 h-24 ${c.glow}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" className="stroke-slate-800" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={c.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${c.text}`}>{score}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className={`w-4 h-4 ${c.text}`} />
        <span className="text-slate-200 text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

// ── Line Analysis Card ──
function LineCard({
  analysis,
  icon: Icon,
  accentColor,
}: {
  analysis: PalmLineAnalysis;
  icon: React.ElementType;
  accentColor: string;
}) {
  const colorMap: Record<string, { icon: string; border: string; badge: string }> = {
    emerald: { icon: 'text-emerald-400', border: 'border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-300' },
    blue: { icon: 'text-blue-400', border: 'border-blue-500/20', badge: 'bg-blue-500/10 text-blue-300' },
    pink: { icon: 'text-pink-400', border: 'border-pink-500/20', badge: 'bg-pink-500/10 text-pink-300' },
    amber: { icon: 'text-amber-400', border: 'border-amber-500/20', badge: 'bg-amber-500/10 text-amber-300' },
  };
  const c = colorMap[accentColor] || colorMap.blue;

  return (
    <div className={`bg-slate-900/40 backdrop-blur-xl border ${c.border} border-white/5 rounded-2xl p-5 shadow-xl`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${c.icon}`} />
        <h4 className="text-white font-semibold text-lg">{analysis.title}</h4>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-3">{analysis.description}</p>
      {analysis.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {analysis.highlights.map((h, i) => (
            <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${c.badge} font-medium`}>
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PalmResults({ result }: PalmResultsProps) {
  return (
    <section className="w-full max-w-3xl mx-auto space-y-6" aria-label="ผลการวิเคราะห์ลายมือ">
      {/* Header */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-amber-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          ผลการวิเคราะห์ลายมือ
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">สรุปภาพรวมจาก AI ตามหลักหัตถศาสตร์ ใช้เป็นแนวโน้มเพื่อสะท้อนตัวเองและวางแผนเชิงบวก</p>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          สรุปผลการวิเคราะห์
        </h3>
        <p className="text-slate-200 leading-relaxed">{result.summary}</p>
      </div>

      {/* ── Score Rings (Love / Career / Health / Destiny) ── */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">คะแนนภาพรวม 4 ด้าน</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <ScoreRing score={result.scores.love} label="ความรัก" icon={Heart} color="pink" />
          <ScoreRing score={result.scores.career} label="การงาน" icon={Briefcase} color="blue" />
          <ScoreRing score={result.scores.health} label="สุขภาพ" icon={Activity} color="emerald" />
          <ScoreRing score={result.scores.destiny} label="วาสนา" icon={Compass} color="amber" />
        </div>
      </div>

      {/* ── Line Analysis (Life / Head / Heart) ── */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          วิเคราะห์เส้นลายมือ
        </h3>
        <div className="space-y-4">
          <LineCard analysis={result.line_analysis.life_line} icon={HeartPulse} accentColor="emerald" />
          <LineCard analysis={result.line_analysis.head_line} icon={Brain} accentColor="blue" />
          <LineCard analysis={result.line_analysis.heart_line} icon={Heart} accentColor="pink" />
          <LineCard analysis={result.line_analysis.fate_line} icon={Compass} accentColor="amber" />
        </div>
      </div>

      {/* ── Personality Traits ── */}
      {result.personality_traits.length > 0 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            บุคลิกภาพและตัวตน
          </h3>
          <div className="space-y-4">
            {result.personality_traits.map((trait, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-200">{trait.name}</span>
                  <span className="text-purple-300">{trait.score}%</span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                    style={{ width: `${trait.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Strengths & Areas for Growth ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.strengths.length > 0 && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/10 border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              จุดเด่น
            </h3>
            <ul className="space-y-2.5">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.areas_for_growth.length > 0 && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-amber-500/10 border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-400" />
              จุดที่ควรพัฒนา
            </h3>
            <ul className="space-y-2.5">
              {result.areas_for_growth.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Spiritual Guidance ── */}
      <div className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 backdrop-blur-xl border border-amber-500/15 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/8 rounded-full blur-3xl pointer-events-none"></div>

        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 relative z-10">
          <Sparkles className="w-5 h-5 text-amber-400" />
          คำแนะนำเสริมมงคล
        </h3>
        <p className="text-amber-100/80 leading-relaxed text-base italic border-l-4 border-amber-500/40 pl-4 py-1 relative z-10">
          &ldquo;{result.spiritual_guidance}&rdquo;
        </p>
      </div>
    </section>
  );
}
