'use client';

import React, { useState } from 'react';
import { ChevronRight, Share2, Sparkles } from 'lucide-react';
import { saveAnalysisResult } from '@/services/analysisService';
import { InputForm } from '@/components/InputForm';
import { ResultHeader } from '@/components/ResultHeader';
import { PairAnalysisCard } from '@/components/PairAnalysisCard';
import { ThaksaTable } from '@/components/ThaksaTable';
import { AyatanaCard } from '@/components/AyatanaCard';
import { PredictionCard } from '@/components/PredictionCard';
import { calculateScore } from '@/utils/calculateScore';
import { analyzePairs } from '@/utils/analyzePairs';
import { analyzeThaksa } from '@/utils/analyzeThaksa';
import { getPrediction } from '@/utils/getPrediction';
import { calculateAyatana } from '@/utils/ayatana';
import { AnalysisResult } from '@/types';

export default function Home() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [day, setDay] = useState('sunday');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!name.trim()) return;

    setLoading(true);
    setTimeout(async () => {
      const nameScore = calculateScore(name);
      const surnameScore = calculateScore(surname);
      const totalScore = nameScore + surnameScore;

      const namePairs = analyzePairs(name);
      const surnamePairs = analyzePairs(surname);
      const cleanName = name.replace(/\s/g, '');
      const cleanSurname = surname.replace(/\s/g, '');

      // Get predictions for all scores
      const namePrediction = getPrediction(nameScore);
      const surnamePrediction = getPrediction(surnameScore);
      const totalPrediction = getPrediction(totalScore);

      setResult({
        name,
        surname,
        nameScore,
        surnameScore,
        totalScore,
        namePairs,
        surnamePairs,
        namePrediction,
        surnamePrediction,
        prediction: totalPrediction,
        thaksa: analyzeThaksa(cleanName, day, cleanSurname),
        ayatana: calculateAyatana(totalScore)
      });
      setLoading(false);

      // Auto-save to Supabase
      try {
        await saveAnalysisResult({
          name,
          surname,
          day,
          nameScore,
          surnameScore,
          totalScore
        });
        console.log('Auto-saved analysis result');
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, 800);
  };

  const resetForm = () => {
    setResult(null);
    setName('');
    setSurname('');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[20%] w-[2px] h-[2px] bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-[40%] left-[10%] w-[3px] h-[3px] bg-amber-200 rounded-full animate-pulse delay-75"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-[#0f172a]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
            NAMEMONGKOL
          </span>
        </div>
        <button className="text-sm text-slate-400 hover:text-white transition-colors">
          เกี่ยวกับเรา
        </button>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">

        {!result ? (
          <InputForm
            name={name}
            surname={surname}
            day={day}
            onNameChange={setName}
            onSurnameChange={setSurname}
            onDayChange={setDay}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        ) : (
          <div className="w-full max-w-5xl animate-fade-in flex flex-col gap-6">
            <div className="flex justify-start">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> กลับหน้าหลัก
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main Score & Ayatana (Left Column - 4 cols) */}
              <div className="md:col-span-4 space-y-6">
                <ResultHeader result={result} />
                <AyatanaCard ayatana={result.ayatana} />
                <PredictionCard prediction={result.prediction} />
              </div>

              {/* Details (Right Column - 8 cols) */}
              <div className="md:col-span-8 space-y-6">
                <PairAnalysisCard namePairs={result.namePairs} surnamePairs={result.surnamePairs} />
                {result.thaksa && <ThaksaTable thaksa={result.thaksa} day={day} />}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> แบ่งปันผลลัพธ์
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-600 text-sm relative z-10">
        © 2024 NameMongkol.com - ศาสตร์แห่งตัวเลขเพื่อชีวิตที่ดีกว่า
      </footer>
    </div>
  );
}
