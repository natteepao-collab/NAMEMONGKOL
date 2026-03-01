'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, TrendingDown, Sparkles, Activity } from 'lucide-react';
import { PalmAnalysisResult } from '@/types/palm-analysis';

interface PalmResultsProps {
  result: PalmAnalysisResult;
}

export default function PalmResults({ result }: PalmResultsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          ผลการวิเคราะห์ลายมือ
        </h2>
        <p className="text-slate-300 text-lg">ค้นพบตัวตนและศักยภาพที่ซ่อนอยู่ในเส้นลายมือของคุณ</p>
      </motion.div>

      {/* Personality Traits */}
      <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          บุคลิกภาพและตัวตน (Personality Traits)
        </h3>
        <div className="space-y-5">
          {result.personality_traits.map((trait, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-200">{trait.name}</span>
                <span className="text-blue-400">{trait.score}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.score}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            จุดเด่น (Strengths)
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((strength, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3 text-slate-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span>{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-400" />
            จุดที่ควรพัฒนา (Areas for Growth)
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((weakness, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3 text-slate-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                <span>{weakness}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Spiritual Guidance */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-900/80 to-blue-900/40 backdrop-blur-md border border-blue-800/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
          คำแนะนำเชิงบวก (Spiritual Guidance)
        </h3>
        <p className="text-slate-200 leading-relaxed text-lg italic border-l-4 border-blue-500 pl-4 py-2">
          "{result.spiritual_guidance}"
        </p>
      </motion.div>

    </motion.div>
  );
}
