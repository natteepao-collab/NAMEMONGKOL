'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Smartphone, Monitor, Loader2, Sparkles, Crown, Lock, Star, User, Calendar, Shield, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

// Template Types
type TemplateType = 'birthday' | 'vessavana';

// Premium Day Themes - Each day has unique sacred design
const dayThemes: Record<string, {
    primary: string;
    secondary: string;
    tertiary: string;
    gradient: string;
    bgGradient: string;
    deity: string;
    deityEmoji: string;
    yantra: string;
    mantra: string;
    element: string;
    blessing: string;
    sacredSymbol: string;
    pattern: 'lotus' | 'star' | 'flame' | 'leaf' | 'moon' | 'diamond' | 'saturn';
}> = {
    sunday: {
        primary: '#dc2626',
        secondary: '#f97316',
        tertiary: '#fbbf24',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #ea580c 30%, #f97316 60%, #fbbf24 100%)',
        bgGradient: `
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(220, 38, 38, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 50% 120%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 30%),
            radial-gradient(circle at 80% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 30%)
        `,
        deity: 'พระอาทิตย์',
        deityEmoji: '☀️',
        yantra: 'ॐ सूर्याय',
        mantra: 'โอม สุริยายะ นะมะฮา',
        element: 'อัคนี (ไฟ)',
        blessing: 'เดชะบารมี อำนาจวาสนา',
        sacredSymbol: '۞',
        pattern: 'star',
    },
    monday: {
        primary: '#fbbf24',
        secondary: '#fde68a',
        tertiary: '#fffbeb',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #fde68a 80%, #fffbeb 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 100% at 50% 0%, rgba(251, 191, 36, 0.35) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(253, 230, 138, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)
        `,
        deity: 'พระจันทร์',
        deityEmoji: '🌙',
        yantra: 'ॐ चन्द्राय',
        mantra: 'โอม จันทรายะ นะมะฮา',
        element: 'อาโป (น้ำ)',
        blessing: 'เมตตามหานิยม เสน่ห์แรงกล้า',
        sacredSymbol: '☽',
        pattern: 'moon',
    },
    tuesday: {
        primary: '#ec4899',
        secondary: '#f472b6',
        tertiary: '#fce7f3',
        gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 40%, #f472b6 80%, #fce7f3 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(244, 114, 182, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 15% 40%, rgba(219, 39, 119, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 85% 60%, rgba(219, 39, 119, 0.15) 0%, transparent 35%)
        `,
        deity: 'พระอังคาร',
        deityEmoji: '🔥',
        yantra: 'ॐ अंगारक',
        mantra: 'โอม อังคารกายะ นะมะฮา',
        element: 'เตโช (ไฟ)',
        blessing: 'ชัยชนะ เดชานุภาพ',
        sacredSymbol: '♂',
        pattern: 'flame',
    },
    wednesday: {
        primary: '#22c55e',
        secondary: '#4ade80',
        tertiary: '#dcfce7',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 40%, #4ade80 80%, #dcfce7 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(34, 197, 94, 0.35) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(74, 222, 128, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 35%, rgba(22, 163, 74, 0.12) 0%, transparent 35%),
            radial-gradient(circle at 80% 65%, rgba(22, 163, 74, 0.12) 0%, transparent 35%)
        `,
        deity: 'พระพุธ',
        deityEmoji: '🌿',
        yantra: 'ॐ बुधाय',
        mantra: 'โอม พุทธายะ นะมะฮา',
        element: 'ปฐวี (ดิน)',
        blessing: 'ปัญญาเฉียบแหลม การค้าเจริญ',
        sacredSymbol: '☿',
        pattern: 'leaf',
    },
    thursday: {
        primary: '#f97316',
        secondary: '#fb923c',
        tertiary: '#fed7aa',
        gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 40%, #fb923c 80%, #fed7aa 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(249, 115, 22, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(251, 146, 60, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 25% 40%, rgba(234, 88, 12, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 75% 60%, rgba(234, 88, 12, 0.15) 0%, transparent 35%)
        `,
        deity: 'พระพฤหัสบดี',
        deityEmoji: '⚡',
        yantra: 'ॐ गुरवे',
        mantra: 'โอม คุรเว นะมะฮา',
        element: 'อากาศ (ลม)',
        blessing: 'ครูบาอาจารย์ ความรู้สูงส่ง',
        sacredSymbol: '♃',
        pattern: 'lotus',
    },
    friday: {
        primary: '#06b6d4',
        secondary: '#22d3ee',
        tertiary: '#a5f3fc',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #22d3ee 80%, #a5f3fc 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(6, 182, 212, 0.35) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(34, 211, 238, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 40%, rgba(8, 145, 178, 0.12) 0%, transparent 35%),
            radial-gradient(circle at 80% 60%, rgba(8, 145, 178, 0.12) 0%, transparent 35%)
        `,
        deity: 'พระศุกร์',
        deityEmoji: '💎',
        yantra: 'ॐ शुक्राय',
        mantra: 'โอม ศุกรายะ นะมะฮา',
        element: 'อาโป (น้ำ)',
        blessing: 'โชคลาภ ความมั่งคั่ง ความรัก',
        sacredSymbol: '♀',
        pattern: 'diamond',
    },
    saturday: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        tertiary: '#c4b5fd',
        gradient: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #8b5cf6 80%, #c4b5fd 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(124, 58, 237, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 15% 45%, rgba(109, 40, 217, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 85% 55%, rgba(109, 40, 217, 0.15) 0%, transparent 35%)
        `,
        deity: 'พระเสาร์',
        deityEmoji: '🪐',
        yantra: 'ॐ शनैश्चर',
        mantra: 'โอม ศไนศจรายะ นะมะฮา',
        element: 'ปฐวี (ดิน)',
        blessing: 'ความมั่นคง อดทน ป้องกันภัย',
        sacredSymbol: '♄',
        pattern: 'saturn',
    },
};

const dayNames: Record<string, string> = {
    sunday: 'อาทิตย์',
    monday: 'จันทร์',
    tuesday: 'อังคาร',
    wednesday: 'พุธ',
    thursday: 'พฤหัสบดี',
    friday: 'ศุกร์',
    saturday: 'เสาร์',
};

const WALLPAPER_COST = 29;

// Vessavana Theme Variants - Different blessing types
const vessavanaThemes = {
    wealth: {
        id: 'wealth',
        name: 'ร่ำรวย มั่งคั่ง',
        mantra: 'เวสสะ พุสะ มหาลาโภ นะโม พุทธายะ',
        primaryColor: '#c9a227',
        secondaryColor: '#1a365d',
        bgGradient: 'linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 50%, #d9d9d9 100%)',
        blessing: 'เสริมโชคลาภ การเงิน ค้าขาย',
        icon: '💰',
    },
    protection: {
        id: 'protection',
        name: 'ปกป้อง คุ้มครอง',
        mantra: 'โอม เวสสุวรรณ มหาเทวะ รักษะ',
        primaryColor: '#1a365d',
        secondaryColor: '#c9a227',
        bgGradient: 'linear-gradient(180deg, #0a1628 0%, #1a365d 50%, #0a1628 100%)',
        blessing: 'ปกป้องภัยอันตราย ไสยศาสตร์',
        icon: '🛡️',
    },
    authority: {
        id: 'authority',
        name: 'บารมี อำนาจ',
        mantra: 'อิติสุคโต ภควา นะโม พุทธายะ',
        primaryColor: '#7c2d12',
        secondaryColor: '#f59e0b',
        bgGradient: 'linear-gradient(180deg, #1c1917 0%, #44403c 50%, #1c1917 100%)',
        blessing: 'เสริมบารมี อำนาจวาสนา',
        icon: '👑',
    },
    success: {
        id: 'success',
        name: 'สำเร็จ รุ่งเรือง',
        mantra: 'นะโม ไตรรัตนะ เวสสุวรรณายะ',
        primaryColor: '#047857',
        secondaryColor: '#fbbf24',
        bgGradient: 'linear-gradient(180deg, #022c22 0%, #064e3b 50%, #022c22 100%)',
        blessing: 'การงานรุ่งเรือง ประสบความสำเร็จ',
        icon: '🌟',
    },
};

// Generate lucky numbers based on name
const generateLuckyNumbers = (name: string): number[] => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash = hash & hash;
    }
    const numbers: number[] = [];
    for (let i = 0; i < 4; i++) {
        numbers.push(Math.abs((hash >> (i * 8)) % 100));
    }
    return numbers;
};

// Sacred Pattern Generator for each day
const getSacredPattern = (pattern: string, color: string): React.ReactNode[] => {
    const patterns: { [key: string]: React.ReactNode[] } = {
        lotus: [...Array(8)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${20 + (i * 10) % 60}%`,
                left: `${5 + (i * 12) % 90}%`,
                fontSize: 20 + (i % 3) * 8,
                opacity: 0.15 + (i % 3) * 0.05,
                transform: `rotate(${i * 45}deg)`,
                color: color,
            }}>✿</div>
        )),
        star: [...Array(10)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${10 + (i * 9) % 80}%`,
                left: `${8 + (i * 11) % 84}%`,
                fontSize: 14 + (i % 4) * 6,
                opacity: 0.1 + (i % 3) * 0.05,
                color: color,
            }}>✦</div>
        )),
        flame: [...Array(6)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${15 + (i * 15) % 70}%`,
                left: `${10 + (i * 16) % 80}%`,
                fontSize: 24 + (i % 3) * 10,
                opacity: 0.12 + (i % 3) * 0.04,
                transform: `scaleX(${i % 2 ? -1 : 1})`,
                color: color,
            }}>🔥</div>
        )),
        leaf: [...Array(8)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${12 + (i * 12) % 76}%`,
                left: `${6 + (i * 13) % 88}%`,
                fontSize: 18 + (i % 3) * 8,
                opacity: 0.1 + (i % 3) * 0.05,
                transform: `rotate(${i * 45 + 20}deg)`,
                color: color,
            }}>🌿</div>
        )),
        moon: [...Array(7)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${8 + (i * 14) % 84}%`,
                left: `${12 + (i * 14) % 76}%`,
                fontSize: 16 + (i % 4) * 8,
                opacity: 0.08 + (i % 3) * 0.04,
                transform: `rotate(${i * 30}deg)`,
                color: color,
            }}>☽</div>
        )),
        diamond: [...Array(9)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${10 + (i * 11) % 80}%`,
                left: `${8 + (i * 12) % 84}%`,
                fontSize: 12 + (i % 4) * 6,
                opacity: 0.1 + (i % 3) * 0.04,
                transform: `rotate(45deg)`,
                color: color,
            }}>◆</div>
        )),
        saturn: [...Array(6)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${15 + (i * 14) % 70}%`,
                left: `${10 + (i * 15) % 80}%`,
                fontSize: 18 + (i % 3) * 10,
                opacity: 0.08 + (i % 3) * 0.04,
                color: color,
            }}>♄</div>
        )),
    };
    return patterns[pattern] || patterns.star;
};

// Wallpaper Content Component (simplified for standalone)
interface WallpaperContentProps {
    name: string;
    surname: string;
    luckyNumbers: number[];
    theme: typeof dayThemes.sunday;
    dayName: string;
    format: 'mobile' | 'desktop';
    dimensions: { width: number; height: number };
    isPremiumUnlocked: boolean;
}

const WallpaperContent = React.forwardRef<HTMLDivElement, WallpaperContentProps>(
    ({ name, surname, luckyNumbers, theme, dayName, format, dimensions, isPremiumUnlocked }, ref) => {
        const isMobile = format === 'mobile';
        const fullName = surname ? `${name} ${surname}` : name;

        return (
            <div
                ref={ref}
                data-wallpaper-content="true"
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    background: `linear-gradient(180deg, #050510 0%, #0a0a18 20%, #0d1020 50%, #0a0a18 80%, #050510 100%)`,
                    fontFamily: 'var(--font-geist-sans), "Sarabun", sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Base Background */}
                <div style={{ position: 'absolute', inset: 0, background: theme.bgGradient }} />
                
                {/* Sacred Pattern */}
                {getSacredPattern(theme.pattern, theme.primary)}

                {/* Glow layers */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `
                            radial-gradient(ellipse 100% 60% at 50% -10%, ${theme.primary}35 0%, transparent 60%),
                            radial-gradient(ellipse 80% 50% at 50% 110%, ${theme.secondary}25 0%, transparent 50%)
                        `,
                    }}
                />

                {/* Mandala circles */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '150%' : '100%', height: isMobile ? '80%' : '100%', opacity: 0.15 }}>
                    {[180, 150, 120, 90, 60].map((r, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: `${r}%`,
                            height: `${r}%`,
                            borderRadius: '50%',
                            border: `1px solid ${theme.primary}`,
                            opacity: 0.3 - (i * 0.05),
                        }} />
                    ))}
                </div>

                {/* Frame */}
                <div style={{ position: 'absolute', inset: isMobile ? 25 : 35, border: `2px solid ${theme.primary}40`, borderRadius: 24 }} />

                {/* Main Content */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: isMobile ? '90px 50px' : '70px 120px',
                        textAlign: 'center',
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', marginBottom: isMobile ? 25 : 20 }}>
                            <div style={{ position: 'absolute', inset: -50, background: `radial-gradient(circle, ${theme.primary}40 0%, transparent 50%)`, borderRadius: '50%' }} />
                            <div style={{ position: 'relative', fontSize: isMobile ? 85 : 70, filter: `drop-shadow(0 0 25px ${theme.primary})` }}>
                                {theme.deityEmoji}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 20 : 15, marginBottom: isMobile ? 12 : 8 }}>
                            <div style={{ fontSize: isMobile ? 26 : 16, color: 'rgba(255,255,255,0.8)' }}>{theme.sacredSymbol}</div>
                            <div style={{ width: isMobile ? 60 : 50, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6))' }} />
                            <div style={{ fontSize: isMobile ? 38 : 24, fontWeight: 800, color: '#ffffff', letterSpacing: '0.1em', textShadow: '0 2px 15px rgba(0,0,0,0.9)' }}>
                                {theme.deity}
                            </div>
                            <div style={{ width: isMobile ? 60 : 50, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)' }} />
                            <div style={{ fontSize: isMobile ? 26 : 16, color: 'rgba(255,255,255,0.8)' }}>{theme.sacredSymbol}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 12 }}>
                            <div style={{ fontSize: isMobile ? 22 : 14, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.15em', textShadow: '0 2px 12px rgba(0,0,0,0.9)', fontWeight: 600 }}>
                                คนเกิดวัน{dayName}
                            </div>
                            <div style={{ padding: isMobile ? '6px 16px' : '4px 12px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 20, fontSize: isMobile ? 18 : 12, color: '#ffffff', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                {theme.element}
                            </div>
                        </div>
                    </div>

                    {/* Center - Yantra & Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                        {/* Yantra */}
                        <div style={{ position: 'relative', marginBottom: isMobile ? 40 : 35 }}>
                            <div style={{ position: 'absolute', inset: -60, background: `radial-gradient(circle, ${theme.primary}15 0%, transparent 50%)`, borderRadius: '50%' }} />
                            <div style={{ position: 'relative', padding: isMobile ? '30px 45px' : '25px 40px', background: `linear-gradient(145deg, ${theme.primary}15 0%, ${theme.secondary}08 50%, ${theme.tertiary}05 100%)`, border: `3px solid ${theme.primary}60`, borderRadius: 24, boxShadow: `0 0 50px ${theme.primary}25, inset 0 0 40px ${theme.primary}10` }}>
                                <div style={{ fontSize: isMobile ? 90 : 75, fontWeight: 900, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 40%, ${theme.tertiary} 70%, ${theme.primary} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'serif', lineHeight: 1 }}>
                                    {theme.yantra}
                                </div>
                            </div>
                        </div>

                        {/* Mantra */}
                        <div style={{ fontSize: isMobile ? 24 : 15, color: '#ffffff', fontStyle: 'italic', marginBottom: isMobile ? 35 : 25, letterSpacing: '0.12em', textShadow: '0 2px 15px rgba(0,0,0,0.9)', fontWeight: 500 }}>
                            ✦ {theme.mantra} ✦
                        </div>

                        {/* Name */}
                        <div style={{ fontSize: isMobile ? 62 : 52, fontWeight: 800, color: '#ffffff', textShadow: '0 0 60px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.9)', letterSpacing: '0.06em', marginBottom: isMobile ? 30 : 25, lineHeight: 1.2 }}>
                            {isPremiumUnlocked ? fullName : '●●● ●●●'}
                        </div>

                        {/* Blessing */}
                        <div style={{ marginTop: isMobile ? 25 : 15, fontSize: isMobile ? 24 : 14, color: '#ffffff', maxWidth: '90%', lineHeight: 1.5, textShadow: '0 2px 15px rgba(0,0,0,0.9)', fontWeight: 600, letterSpacing: '0.05em' }}>
                            「 {theme.blessing} 」
                        </div>
                    </div>

                    {/* Bottom - Lucky Numbers */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 40 : 30 }}>
                        <div>
                            <div style={{ fontSize: isMobile ? 22 : 13, color: '#ffffff', marginBottom: isMobile ? 24 : 18, letterSpacing: '0.15em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 14 : 10, textShadow: '0 2px 12px rgba(0,0,0,0.9)', fontWeight: 600 }}>
                                <span style={{ color: '#ffffff' }}>◆</span>
                                เลขมงคลประจำตัว
                                <span style={{ color: '#ffffff' }}>◆</span>
                            </div>
                            <div style={{ display: 'flex', gap: isMobile ? 18 : 12, justifyContent: 'center' }}>
                                {(isPremiumUnlocked ? luckyNumbers : [0, 0, 0, 0]).slice(0, 4).map((num, i) => (
                                    <div key={i} style={{ width: isMobile ? 85 : 60, height: isMobile ? 85 : 60, borderRadius: isMobile ? 20 : 16, background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 38 : 26, fontWeight: 800, color: isPremiumUnlocked ? '#ffffff' : 'rgba(255,255,255,0.3)', boxShadow: '0 4px 25px rgba(0,0,0,0.4)', textShadow: isPremiumUnlocked ? '0 2px 10px rgba(0,0,0,0.7)' : 'none' }}>
                                        {isPremiumUnlocked ? num : '?'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Branding */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 10, padding: isMobile ? '16px 40px' : '12px 30px', background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)', border: '1px solid rgba(251,191,36,0.40)', borderRadius: 100, boxShadow: '0 4px 30px rgba(0,0,0,0.4)' }}>
                            <span style={{ fontSize: isMobile ? 26 : 16 }}>⭐</span>
                            <span style={{ fontSize: isMobile ? 24 : 15, color: '#fde68a', fontWeight: 700, letterSpacing: '0.1em', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>NAMEMONGKOL</span>
                            <span style={{ fontSize: isMobile ? 16 : 10, color: 'rgba(255,255,255,0.6)' }}>• namemongkol.com</span>
                        </div>
                    </div>

                    {/* Lock Overlay */}
                    {!isPremiumUnlocked && (
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25 }}>
                            <div style={{ padding: 25, background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)`, borderRadius: '50%' }}>
                                <span style={{ fontSize: 70 }}>🔒</span>
                            </div>
                            <div style={{ fontSize: 26, color: 'white', fontWeight: 700, letterSpacing: '0.05em' }}>ปลดล็อกเพื่อดาวน์โหลด</div>
                            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>{WALLPAPER_COST} เครดิต</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

WallpaperContent.displayName = 'WallpaperContent';

// Main Standalone Component
// ===== Vessavana Wallpaper Content =====
interface VessavanaWallpaperContentProps {
    name: string;
    surname: string;
    vessavanaTheme: typeof vessavanaThemes.wealth;
    format: 'mobile' | 'desktop';
    dimensions: { width: number; height: number };
    isPremiumUnlocked: boolean;
}

const VessavanaWallpaperContent = React.forwardRef<HTMLDivElement, VessavanaWallpaperContentProps>(
    ({ name, surname, vessavanaTheme, format, dimensions, isPremiumUnlocked }, ref) => {
        const isMobile = format === 'mobile';
        const fullName = surname ? `${name} ${surname}` : name;
        const goldColor = '#c9a227';

        return (
            <div
                ref={ref}
                data-wallpaper-content="true"
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    fontFamily: '"Sarabun", sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Image - ท้าวเวสสุวรรณ (มีพรและมนตราในรูปอยู่แล้ว) */}
                <img 
                    src="/Wallpaper/vessavana-main.png"
                    alt="ท้าวเวสสุวรรณ"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                    }}
                />

                {/* Stamp เฉพาะชื่อผู้ใช้ - ตำแหน่งด้านล่างของภาพ (ไม่มีกรอบ) */}
                {isPremiumUnlocked && fullName && (
                    <div style={{
                        position: 'absolute',
                        bottom: isMobile ? '12%' : '10%',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        padding: '0 40px',
                    }}>
                        <p style={{
                            fontSize: isMobile ? 56 : 40,
                            fontWeight: 700,
                            color: '#1a365d',
                            margin: 0,
                            letterSpacing: '0.15em',
                            lineHeight: 1.8,
                            textShadow: '0 1px 2px rgba(255,255,255,0.5)',
                        }}>
                            {fullName}
                        </p>
                    </div>
                )}

                {/* Premium Lock Overlay */}
                {!isPremiumUnlocked && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 20,
                    }}>
                        <Lock size={72} color="#fbbf24" />
                        <span style={{ color: '#fbbf24', fontSize: 28, fontWeight: 600 }}>Premium</span>
                    </div>
                )}
            </div>
        );
    }
);
VessavanaWallpaperContent.displayName = 'VessavanaWallpaperContent';

// ===== Main Component =====
export default function StandaloneWallpaperGenerator() {
    const [template, setTemplate] = useState<TemplateType>('birthday');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [day, setDay] = useState('sunday');
    const [vessavanaVariant, setVessavanaVariant] = useState('wealth');
    const [format, setFormat] = useState<'mobile' | 'desktop'>('mobile');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [userCredits, setUserCredits] = useState<number>(0);
    const [showPreview, setShowPreview] = useState(false);
    
    const wallpaperRef = useRef<HTMLDivElement>(null);
    const vessavanaWallpaperRef = useRef<HTMLDivElement>(null);

    const theme = dayThemes[day];
    const luckyNumbers = generateLuckyNumbers(name + surname);
    
    const dimensions = format === 'mobile'
        ? { width: 1080, height: 1920 }
        : { width: 1920, height: 1080 };

    // Fetch user and credits
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data } = await supabase
                    .from('user_profiles')
                    .select('credits')
                    .eq('id', session.user.id)
                    .maybeSingle();
                if (data) setUserCredits(data.credits);
            }
        };
        fetchUser();
    }, []);

    const handleUnlock = async () => {
        const Swal = (await import('sweetalert2')).default;

        if (!user) {
            Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านต้องเข้าสู่ระบบก่อนจึงจะสามารถสร้างวอลเปเปอร์ส่วนตัวได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
            return;
        }

        if (!name.trim()) {
            Swal.fire({
                title: 'กรุณากรอกชื่อ',
                text: 'กรุณากรอกชื่อก่อนสร้างวอลเปเปอร์',
                icon: 'warning',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        if (userCredits < WALLPAPER_COST) {
            Swal.fire({
                title: 'เครดิตไม่เพียงพอ',
                text: `ต้องใช้ ${WALLPAPER_COST} เครดิต (มี ${userCredits})`,
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'เติมเครดิต',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#10b981',
                background: '#1e293b',
                color: '#fff'
            }).then((res) => {
                if (res.isConfirmed) window.location.href = '/topup';
            });
            return;
        }

        const templateInfo = template === 'birthday' 
            ? `<p><strong>วันเกิด:</strong> วัน${dayNames[day]}</p>`
            : `<p><strong>แบบ:</strong> ${vessavanaThemes[vessavanaVariant as keyof typeof vessavanaThemes].name}</p>`;

        const confirm = await Swal.fire({
            title: 'สร้างวอลเปเปอร์ส่วนตัว',
            html: `
                <div style="text-align: left; color: #cbd5e1;">
                    <p><strong>รูปแบบ:</strong> ${template === 'birthday' ? 'ตามวันเกิด' : 'ท้าวเวสสุวรรณ'}</p>
                    <p><strong>ชื่อ:</strong> ${name} ${surname}</p>
                    ${templateInfo}
                    <p><strong>ราคา:</strong> ${WALLPAPER_COST} เครดิต</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `ยืนยัน (หัก ${WALLPAPER_COST} เครดิต)`,
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#8b5cf6',
            background: '#1e293b',
            color: '#fff'
        });

        if (!confirm.isConfirmed) return;

        try {
            const { error } = await supabase.rpc('deduct_credits', { amount: WALLPAPER_COST });
            if (error) throw error;

            setUserCredits(prev => prev - WALLPAPER_COST);
            setIsPremiumUnlocked(true);

            Swal.fire({
                icon: 'success',
                title: 'ปลดล็อกสำเร็จ!',
                text: 'ท่านสามารถดาวน์โหลดวอลเปเปอร์ได้แล้ว',
                background: '#1e293b',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Deduct error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถตัดเครดิตได้ กรุณาลองใหม่',
                background: '#1e293b',
                color: '#fff'
            });
        }
    };

    // Fix for unsupported CSS color functions like lab(), oklch() etc.
    const fixColorFunctions = (element: HTMLElement) => {
        const unsupportedColorRegex = /lab\(|oklch\(|oklab\(|lch\(/;
        
        const processElement = (el: Element) => {
            if (el instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(el);
                const properties = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor', 'fill', 'stroke', 'boxShadow', 'textShadow'];
                
                properties.forEach(prop => {
                    const cssProperty = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                    const value = computedStyle.getPropertyValue(cssProperty);
                    if (value && unsupportedColorRegex.test(value)) {
                        // Replace with fallback color based on property
                        let fallback = 'rgba(255, 255, 255, 0.9)';
                        if (prop === 'backgroundColor') {
                            fallback = 'transparent';
                        } else if (prop === 'boxShadow' || prop === 'textShadow') {
                            fallback = 'none';
                        }
                        el.style.setProperty(cssProperty, fallback, 'important');
                    }
                });
                
                // Also check inline styles
                const inlineStyle = el.getAttribute('style');
                if (inlineStyle && unsupportedColorRegex.test(inlineStyle)) {
                    const fixedStyle = inlineStyle.replace(/lab\([^)]+\)/g, 'rgba(255,255,255,0.9)')
                        .replace(/oklch\([^)]+\)/g, 'rgba(255,255,255,0.9)')
                        .replace(/oklab\([^)]+\)/g, 'rgba(255,255,255,0.9)')
                        .replace(/lch\([^)]+\)/g, 'rgba(255,255,255,0.9)');
                    el.setAttribute('style', fixedStyle);
                }
            }
            
            // Process SVG elements separately
            if (el instanceof SVGElement && !(el instanceof HTMLElement)) {
                const svgProps = ['fill', 'stroke', 'stop-color'];
                svgProps.forEach(prop => {
                    const value = el.getAttribute(prop);
                    if (value && unsupportedColorRegex.test(value)) {
                        el.setAttribute(prop, '#ffffff');
                    }
                });
            }
            
            Array.from(el.children).forEach(child => processElement(child));
        };
        
        processElement(element);
    };

    const handleDownload = async () => {
        const targetRef = template === 'vessavana' ? vessavanaWallpaperRef : wallpaperRef;
        if (!targetRef.current || !isPremiumUnlocked) return;

        setIsGenerating(true);
        try {
            // Create a temporary container with inline styles only
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.left = '-99999px';
            tempContainer.style.top = '0';
            tempContainer.style.zIndex = '-9999';
            document.body.appendChild(tempContainer);

            // Deep clone the element
            const clonedElement = targetRef.current.cloneNode(true) as HTMLElement;
            tempContainer.appendChild(clonedElement);

            // Function to compute and inline all styles
            const inlineAllStyles = (original: Element, clone: Element) => {
                if (original instanceof HTMLElement && clone instanceof HTMLElement) {
                    const computed = window.getComputedStyle(original);
                    const unsupportedColorRegex = /lab\(|oklch\(|oklab\(|lch\(/;
                    
                    // Copy computed styles but replace unsupported color functions
                    const importantProps = [
                        'color', 'background-color', 'background', 'border-color', 
                        'font-size', 'font-weight', 'font-family', 'text-align',
                        'padding', 'margin', 'width', 'height', 'display',
                        'flex-direction', 'align-items', 'justify-content', 'gap',
                        'position', 'top', 'left', 'right', 'bottom', 'transform',
                        'border-radius', 'opacity', 'overflow', 'letter-spacing',
                        'line-height', 'text-shadow', 'box-shadow'
                    ];
                    
                    importantProps.forEach(prop => {
                        let value = computed.getPropertyValue(prop);
                        if (value && unsupportedColorRegex.test(value)) {
                            // Replace lab/oklch colors with fallbacks
                            if (prop.includes('background')) {
                                value = 'transparent';
                            } else if (prop.includes('shadow')) {
                                value = 'none';
                            } else {
                                value = 'rgb(255, 255, 255)';
                            }
                        }
                        if (value) {
                            clone.style.setProperty(prop, value);
                        }
                    });
                }
                
                const originalChildren = Array.from(original.children);
                const cloneChildren = Array.from(clone.children);
                originalChildren.forEach((child, i) => {
                    if (cloneChildren[i]) {
                        inlineAllStyles(child, cloneChildren[i]);
                    }
                });
            };
            
            inlineAllStyles(targetRef.current, clonedElement);

            const canvas = await html2canvas(clonedElement, {
                useCORS: true,
                allowTaint: true,
                background: undefined,
                width: dimensions.width,
                height: dimensions.height,
                logging: false,
                foreignObjectRendering: false,
                ignoreElements: (element: Element) => {
                    // Ignore style and link elements to prevent CSS parsing
                    return element.tagName === 'STYLE' || 
                           (element.tagName === 'LINK' && element.getAttribute('rel') === 'stylesheet');
                },
            } as Parameters<typeof html2canvas>[1]);

            // Cleanup
            document.body.removeChild(tempContainer);

            const link = document.createElement('a');
            const templateName = template === 'vessavana' ? 'vessavana' : day;
            link.download = `namemongkol-${name}-${templateName}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Download error:', error);
            // Show error to user
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถสร้างภาพได้ กรุณาลองใหม่อีกครั้ง',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Crown className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">สร้างวอลเปเปอร์ส่วนตัว</h2>
                        <p className="text-slate-400 text-sm">
                            ใส่ชื่อของคุณและเลือกวันเกิด เพื่อสร้างวอลเปเปอร์มงคลเฉพาะบุคคล 
                            พร้อมยันต์ศักดิ์สิทธิ์ มนตรา และเลขมงคลประจำตัว
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="text-amber-400 font-bold">{WALLPAPER_COST} เครดิต / ภาพ</span>
                            {user && (
                                <span className="text-slate-500 text-sm">เครดิตคงเหลือ: {userCredits}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left - Form */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-5">
                        {/* Template Selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                <Palette size={16} className="inline mr-2" />
                                เลือกรูปแบบ
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { setTemplate('birthday'); setIsPremiumUnlocked(false); }}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        template === 'birthday'
                                            ? 'border-purple-500 bg-purple-500/10'
                                            : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={20} className={template === 'birthday' ? 'text-purple-400' : 'text-slate-400'} />
                                        <span className={`font-semibold ${template === 'birthday' ? 'text-purple-300' : 'text-slate-300'}`}>ตามวันเกิด</span>
                                    </div>
                                    <p className="text-xs text-slate-500">วอลเปเปอร์ตามสีและเทพประจำวันเกิด</p>
                                </button>
                                <button
                                    onClick={() => { setTemplate('vessavana'); setIsPremiumUnlocked(false); }}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        template === 'vessavana'
                                            ? 'border-amber-500 bg-amber-500/10'
                                            : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield size={20} className={template === 'vessavana' ? 'text-amber-400' : 'text-slate-400'} />
                                        <span className={`font-semibold ${template === 'vessavana' ? 'text-amber-300' : 'text-slate-300'}`}>ท้าวเวสสุวรรณ</span>
                                    </div>
                                    <p className="text-xs text-slate-500">เสริมโชคลาภ ป้องกันภัย อำนาจบารมี</p>
                                </button>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <User size={16} className="inline mr-2" />
                                ชื่อ <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="กรอกชื่อ"
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Surname */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                นามสกุล (ไม่บังคับ)
                            </label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder="กรอกนามสกุล"
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Day Selector - Only for birthday template */}
                        {template === 'birthday' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Calendar size={16} className="inline mr-2" />
                                วันเกิด
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {Object.entries(dayNames).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setDay(key)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                            day === key
                                                ? 'text-white shadow-lg'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                        style={day === key ? { background: dayThemes[key].gradient } : {}}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        )}

                        {/* Vessavana Variant Selector - Only for vessavana template */}
                        {template === 'vessavana' && (
                            <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Shield size={16} className="inline mr-2" />
                                เลือกพรที่ต้องการ
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(vessavanaThemes).map((vTheme) => (
                                    <button
                                        key={vTheme.id}
                                        onClick={() => setVessavanaVariant(vTheme.id)}
                                        className={`p-3 rounded-lg text-left transition-all ${
                                            vessavanaVariant === vTheme.id
                                                ? 'bg-amber-500/20 border-2 border-amber-500'
                                                : 'bg-slate-800 border-2 border-transparent hover:bg-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{vTheme.icon}</span>
                                            <span className={`font-medium ${vessavanaVariant === vTheme.id ? 'text-amber-300' : 'text-slate-300'}`}>
                                                {vTheme.name}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{vTheme.blessing}</p>
                                    </button>
                                ))}
                            </div>
                            </div>
                        )}

                        {/* Format Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                ขนาดภาพ
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFormat('mobile')}
                                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                                        format === 'mobile'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    <Smartphone size={18} />
                                    มือถือ (9:16)
                                </button>
                                <button
                                    onClick={() => setFormat('desktop')}
                                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                                        format === 'desktop'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    <Monitor size={18} />
                                    คอมพิวเตอร์ (16:9)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {!isPremiumUnlocked ? (
                            <button
                                onClick={handleUnlock}
                                disabled={!name.trim()}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-purple-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                            >
                                <Lock size={20} />
                                ปลดล็อก ({WALLPAPER_COST} เครดิต)
                            </button>
                        ) : (
                            <button
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        กำลังสร้างภาพ...
                                    </>
                                ) : (
                                    <>
                                        <Download size={20} />
                                        ดาวน์โหลดวอลเปเปอร์
                                    </>
                                )}
                            </button>
                        )}

                        {!user && (
                            <p className="text-center text-slate-500 text-sm">
                                <Link href="/login" className="text-purple-400 hover:underline">เข้าสู่ระบบ</Link> เพื่อสร้างวอลเปเปอร์
                            </p>
                        )}
                    </div>
                </div>

                {/* Right - Preview */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">ตัวอย่างวอลเปเปอร์</h3>
                    <div 
                        className="relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center"
                        style={{ 
                            aspectRatio: format === 'mobile' ? '9/16' : '16/9',
                            maxHeight: format === 'mobile' ? '70vh' : '50vh'
                        }}
                    >
                        {name.trim() ? (
                            <div 
                                className="w-full h-full"
                                style={{ 
                                    transform: `scale(${format === 'mobile' ? 0.25 : 0.3})`,
                                    transformOrigin: 'top left',
                                    width: dimensions.width,
                                    height: dimensions.height,
                                }}
                            >
                                {template === 'birthday' ? (
                                    <WallpaperContent
                                        name={name}
                                        surname={surname}
                                        luckyNumbers={luckyNumbers}
                                        theme={theme}
                                        dayName={dayNames[day]}
                                        format={format}
                                        dimensions={dimensions}
                                        isPremiumUnlocked={isPremiumUnlocked}
                                    />
                                ) : (
                                    <VessavanaWallpaperContent
                                        name={name}
                                        surname={surname}
                                        vessavanaTheme={vessavanaThemes[vessavanaVariant as keyof typeof vessavanaThemes]}
                                        format={format}
                                        dimensions={dimensions}
                                        isPremiumUnlocked={isPremiumUnlocked}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 p-8">
                                <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                                <p>กรอกชื่อเพื่อดูตัวอย่างวอลเปเปอร์</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden full-size for capture */}
            <div style={{ position: 'fixed', left: '-30000px', top: 0, zIndex: -9999 }}>
                {template === 'birthday' ? (
                    <WallpaperContent
                        ref={wallpaperRef}
                        name={name}
                        surname={surname}
                        luckyNumbers={luckyNumbers}
                        theme={theme}
                        dayName={dayNames[day]}
                        format={format}
                        dimensions={dimensions}
                        isPremiumUnlocked={true}
                    />
                ) : (
                    <VessavanaWallpaperContent
                        ref={vessavanaWallpaperRef}
                        name={name}
                        surname={surname}
                        vessavanaTheme={vessavanaThemes[vessavanaVariant as keyof typeof vessavanaThemes]}
                        format={format}
                        dimensions={dimensions}
                        isPremiumUnlocked={true}
                    />
                )}
            </div>
        </div>
    );
}
