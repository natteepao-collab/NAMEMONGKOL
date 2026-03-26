'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Sparkles,
    User,
    Baby,
    Briefcase,
    Download,
    Share2,
    Crown,
    MessageCircle,
    Shield,
    Palette,
    RotateCcw,
    BookOpen,
    Zap,
    Users,
    Volume2,
    Eye,
    ChevronDown,
    Code,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import type { AuraResult } from '@/data/auraAnalysis';
import { LOADING_MESSAGES, IMAGE_STYLE_OPTIONS } from '@/data/auraAnalysis';
import type { ImageStyle } from '@/data/auraAnalysis';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Step = 'input' | 'loading' | 'result';
type Purpose = 'self' | 'baby' | 'brand';
type Gender = 'male' | 'female';

const PURPOSE_OPTIONS: { value: Purpose; label: string; icon: React.ElementType }[] = [
    { value: 'self', label: 'ชื่อตัวเอง', icon: User },
    { value: 'baby', label: 'ชื่อลูก', icon: Baby },
    { value: 'brand', label: 'ชื่อแบรนด์', icon: Briefcase },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClientPage() {
    // State
    const [step, setStep] = useState<Step>('input');
    const [name, setName] = useState('');
    const [context, setContext] = useState('');
    const [style, setStyle] = useState<ImageStyle>('auto');
    const [purpose, setPurpose] = useState<Purpose>('self');
    const [gender, setGender] = useState<Gender>('male');
    const [result, setResult] = useState<AuraResult | null>(null);
    const [error, setError] = useState('');
    const [loadingIdx, setLoadingIdx] = useState(0);
    const [imagePrompt, setImagePrompt] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);

    const resultRef = useRef<HTMLDivElement>(null);

    // -----------------------------------------------------------------------
    // Loading animation — cycle through messages
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (step !== 'loading') return;

        const interval = setInterval(() => {
            setLoadingIdx((prev) => {
                if (prev >= LOADING_MESSAGES.length - 1) return prev;
                return prev + 1;
            });
        }, 1200);

        return () => clearInterval(interval);
    }, [step]);

    // -----------------------------------------------------------------------
    // Submit handler
    // -----------------------------------------------------------------------
    const handleSubmit = useCallback(async () => {
        setError('');
        const trimmed = name.trim();

        if (!trimmed) {
            setError('กรุณากรอกชื่อ');
            return;
        }

        // Transition to loading
        setLoadingIdx(0);
        setStep('loading');

        try {
            const res = await fetch('/api/analyze-aura', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: trimmed,
                    context: context.trim() || undefined,
                    style,
                    purpose,
                    gender: purpose === 'brand' ? undefined : gender,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.error || 'เกิดข้อผิดพลาด');
            }

            // Wait for loading animation to finish (minimum display time)
            const minDelay = LOADING_MESSAGES.length * 1200;
            await new Promise((r) => setTimeout(r, minDelay));

            setResult(json.data as AuraResult);
            setImagePrompt(json.imagePrompt ?? '');
            setStep('result');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่';
            setError(message);
            setStep('input');
        }
    }, [name, context, style, purpose, gender]);

    // -----------------------------------------------------------------------
    // Download as image
    // -----------------------------------------------------------------------
    const handleDownload = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await toPng(resultRef.current, {
                backgroundColor: '#0f172a',
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `aura-${result?.name ?? 'result'}.png`;
            link.href = dataUrl;
            link.click();
        } catch {
            // silent fallback
        }
    }, [result]);

    // -----------------------------------------------------------------------
    // Share
    // -----------------------------------------------------------------------
    const handleShare = useCallback(async () => {
        const shareData = {
            title: `ออร่าของ "${result?.name}" — ${result?.archetype}`,
            text: `ค้นพบตัวตนที่ซ่อนอยู่ในชื่อ "${result?.name}" กับ NameMongkol`,
            url: `${window.location.origin}/aura-analysis`,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // user cancelled
            }
        } else {
            await navigator.clipboard.writeText(shareData.url);
            alert('คัดลอกลิงก์แล้ว!');
        }
    }, [result]);

    // -----------------------------------------------------------------------
    // Reset
    // -----------------------------------------------------------------------
    const handleReset = () => {
        setStep('input');
        setResult(null);
        setError('');
        setName('');
        setContext('');
        setStyle('auto');
        setLoadingIdx(0);
        setImagePrompt('');
        setShowPrompt(false);
    };

    // =======================================================================
    // RENDER
    // =======================================================================

    return (
        <div className="min-h-screen relative">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f172a] to-[#1a1040] -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,147,58,0.08)_0%,_transparent_60%)] -z-10" />

            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                        <Sparkles size={14} className="text-amber-400" />
                        <span className="text-xs font-medium text-amber-300 tracking-wide">AI Personality Analysis</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                        วิเคราะห์<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">ออร่า</span>และตัวตนผ่านชื่อ
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                        ค้นพบบุคลิกภาพ พลังงาน และภาพลักษณ์ที่ซ่อนอยู่ในชื่อของคุณ ด้วยระบบ AI
                    </p>
                </div>

                {/* ============================================================= */}
                {/* STEP 1: INPUT FORM                                            */}
                {/* ============================================================= */}
                {step === 'input' && (
                    <div className="max-w-lg mx-auto animate-fade-in-up">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                            {/* Name Input */}
                            <label className="block mb-1.5 text-sm font-medium text-slate-300">
                                ชื่อที่ต้องการวิเคราะห์
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="พิมพ์ชื่อที่นี่..."
                                maxLength={100}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all text-base"
                            />

                            {/* Optional Context */}
                            <label className="block mt-4 mb-1.5 text-sm font-medium text-slate-300">
                                บริบทเพิ่มเติม (ไม่บังคับ)
                            </label>
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="เช่น ใช้สำหรับนักธุรกิจ, ใช้ในสายงานครีเอทีฟ, ต้องการภาพลักษณ์มืออาชีพ"
                                maxLength={140}
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all text-sm resize-none"
                            />
                            <p className="mt-1 text-[11px] text-slate-500 text-right">{context.length}/140</p>

                            {/* Image Style Selector */}
                            <label className="block mt-5 mb-2 text-sm font-medium text-slate-300">
                                สไตล์ภาพ AI
                            </label>
                            <div className="grid grid-cols-5 gap-1.5">
                                {IMAGE_STYLE_OPTIONS.map((opt) => {
                                    const active = style === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setStyle(opt.value)}
                                            className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all duration-200 text-[11px] sm:text-xs font-medium ${active
                                                ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(201,147,58,0.15)]'
                                                : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <span className="text-base">{opt.emoji}</span>
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Purpose Selector */}
                            <label className="block mt-5 mb-2 text-sm font-medium text-slate-300">
                                จุดประสงค์
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {PURPOSE_OPTIONS.map((opt) => {
                                    const Icon = opt.icon;
                                    const active = purpose === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setPurpose(opt.value)}
                                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 text-xs sm:text-sm font-medium ${active
                                                ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(201,147,58,0.15)]'
                                                : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <Icon size={20} className={active ? 'text-amber-400' : 'text-slate-500'} />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Gender Selector — hidden for brand */}
                            {purpose !== 'brand' && (
                                <div className="mt-5">
                                    <label className="block mb-2 text-sm font-medium text-slate-300">เพศ</label>
                                    <div className="flex gap-3">
                                        {(['male', 'female'] as const).map((g) => (
                                            <label
                                                key={g}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-medium ${gender === g
                                                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                                                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g}
                                                    checked={gender === g}
                                                    onChange={() => setGender(g)}
                                                    className="sr-only"
                                                />
                                                {g === 'male' ? '👨 ชาย' : '👩 หญิง'}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
                            )}

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={!name.trim()}
                                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Sparkles size={18} />
                                เริ่มวิเคราะห์ออร่าด้วย AI
                            </button>
                        </div>
                    </div>
                )}

                {/* ============================================================= */}
                {/* STEP 2: LOADING STATE                                         */}
                {/* ============================================================= */}
                {step === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <Sparkles size={40} className="text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                        </div>
                        <p className="text-lg font-medium text-amber-300 transition-all duration-300 min-h-[28px]">
                            {LOADING_MESSAGES[loadingIdx]}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">กรุณารอสักครู่...</p>
                    </div>
                )}

                {/* ============================================================= */}
                {/* STEP 3: RESULT CARD                                           */}
                {/* ============================================================= */}
                {step === 'result' && result && (
                    <div className="animate-fade-in-up">
                        <div
                            ref={resultRef}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-2xl"
                        >
                            {/* Two-column layout: image + data */}
                            <div className="grid md:grid-cols-2">
                                {/* LEFT — Persona Image */}
                                <div className="relative min-h-[320px] md:min-h-[480px] bg-gradient-to-br from-[#1a1040] to-[#0f172a] flex items-center justify-center overflow-hidden">
                                    {/* Decorative radial */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,147,58,0.12)_0%,_transparent_70%)]" />

                                    {result.imageSource === 'generated' ? (
                                        /* AI-generated image */
                                        <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-8">
                                            <div className="relative">
                                                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-xl" />
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={result.imageUrl}
                                                    alt={`AI-generated aura portrait for ${result.name}`}
                                                    className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl object-cover border-2 border-amber-500/30 shadow-[0_0_40px_rgba(201,147,58,0.2)]"
                                                />
                                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
                                                    <span className="text-[10px] font-medium text-amber-300">AI Generated</span>
                                                </div>
                                            </div>
                                            {/* Name + Archetype */}
                                            <div className="text-center">
                                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{result.name}</h2>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                                                    <Crown size={14} className="text-amber-400" />
                                                    <span className="text-xs sm:text-sm font-medium text-amber-300">{result.archetype}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Placeholder — moodboard gradient + emoji */
                                        <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-8">
                                            <div
                                                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-amber-500/30 shadow-[0_0_40px_rgba(201,147,58,0.2)] flex items-center justify-center overflow-hidden"
                                                style={{
                                                    background: `linear-gradient(135deg, ${result.moodboard[0]?.hex ?? '#D4AF37'}40, ${result.moodboard[1]?.hex ?? '#1B1464'}40, ${result.moodboard[2]?.hex ?? '#8B0000'}40)`,
                                                }}
                                            >
                                                <span className="text-6xl sm:text-7xl">
                                                    {result.spiritIdentity.match(/\p{Emoji_Presentation}/u)?.[0] ?? '✨'}
                                                </span>
                                            </div>
                                            {/* Name + Archetype */}
                                            <div className="text-center">
                                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{result.name}</h2>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                                                    <Crown size={14} className="text-amber-400" />
                                                    <span className="text-xs sm:text-sm font-medium text-amber-300">{result.archetype}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT — Analysis Data */}
                                <div className="p-5 sm:p-6 md:p-8 space-y-5">
                                    {/* Score Badge */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Shield size={18} className="text-amber-400" />
                                            ผลวิเคราะห์ออร่า
                                        </h3>
                                        <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-500/20">
                                            {result.score}
                                        </span>
                                    </div>

                                    {/* Personality Traits */}
                                    <div>
                                        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Personality Traits</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.personalityTraits.map((trait) => (
                                                <span
                                                    key={trait}
                                                    className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-300 text-xs sm:text-sm font-medium"
                                                >
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Vibe Analysis */}
                                    <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageCircle size={16} className="text-amber-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">Vibe Analysis</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed">{result.vibeAnalysis}</p>
                                    </div>

                                    {/* 4-Grid Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Career Fit */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Briefcase size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Career Fit</span>
                                            </div>
                                            <p className="text-sm text-slate-200 font-medium">{result.careerFit}</p>
                                        </div>

                                        {/* Voice & Tone */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <MessageCircle size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Voice & Tone</span>
                                            </div>
                                            <p className="text-sm text-slate-200 font-medium">{result.voiceTone}</p>
                                        </div>

                                        {/* Spirit Identity */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Shield size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Spirit Identity</span>
                                            </div>
                                            <p className="text-sm text-slate-200 font-medium">{result.spiritIdentity}</p>
                                        </div>

                                        {/* Visual Moodboard */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Palette size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Moodboard</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                {result.moodboard.map((color) => (
                                                    <div key={color.hex} className="flex items-center gap-1.5 group">
                                                        <div
                                                            className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                                                            style={{ backgroundColor: color.hex }}
                                                            title={`${color.name} (${color.hex})`}
                                                        />
                                                        <span className="text-[10px] text-slate-400 hidden sm:inline group-hover:text-slate-200 transition-colors">
                                                            {color.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Enhanced Analysis Sections ── */}

                                    {/* First Impression Score */}
                                    <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Eye size={16} className="text-amber-400" />
                                                <span className="text-xs text-slate-400 uppercase tracking-wider">คะแนนความประทับใจแรก</span>
                                            </div>
                                            <span className="text-lg font-bold text-amber-300">{result.firstImpressionScore}/100</span>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000"
                                                style={{ width: `${result.firstImpressionScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Phonetic Analysis */}
                                    <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Volume2 size={16} className="text-indigo-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">การวิเคราะห์เสียงของชื่อ (Phonetics)</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed">{result.phoneticAnalysis}</p>
                                    </div>

                                    {/* Semantic Analysis */}
                                    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen size={16} className="text-purple-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">ความหมายเชิงสัญลักษณ์ (Semantics)</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed">{result.semanticAnalysis}</p>
                                    </div>

                                    {/* Name Energy Breakdown */}
                                    <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap size={16} className="text-emerald-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">พลังงานแต่ละพยางค์</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed">{result.nameEnergyBreakdown}</p>
                                    </div>

                                    {/* Social Perception */}
                                    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users size={16} className="text-cyan-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">การรับรู้จากคนรอบข้าง</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed">{result.socialPerception}</p>
                                    </div>

                                    {/* Visual Mood Keywords */}
                                    <div>
                                        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Visual Style Keywords</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.visualMoodKeywords.map((keyword) => (
                                                <span
                                                    key={keyword}
                                                    className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 text-xs sm:text-sm font-medium"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prompt Viewer — outside resultRef so it's excluded from image export */}
                        {imagePrompt && (
                            <div className="mt-4 rounded-2xl border border-slate-500/20 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                                <button
                                    onClick={() => setShowPrompt((v) => !v)}
                                    className="w-full flex items-center justify-between px-5 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Code size={16} className="text-slate-400" />
                                        ดู Prompt ที่ใช้สร้างภาพ (AI)
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-200 ${showPrompt ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {showPrompt && (
                                    <div className="px-5 pb-4">
                                        <pre className="text-xs text-slate-400 bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 whitespace-pre-wrap break-words max-h-40 overflow-y-auto font-mono leading-relaxed">
                                            {imagePrompt}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
                            >
                                <Download size={16} />
                                บันทึกรูป
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
                            >
                                <Share2 size={16} />
                                แชร์
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <RotateCcw size={16} />
                                วิเคราะห์ชื่อใหม่
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
