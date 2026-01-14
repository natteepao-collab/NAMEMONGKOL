'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { X, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WelcomeCreditModalProps {
    user: User | null;
}

export const WelcomeCreditModal: React.FC<WelcomeCreditModalProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Check if user was created within the last 24 hours
        // user.created_at is an ISO string
        const createdAt = new Date(user.created_at).getTime();
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const isNewUser = (now - createdAt) < oneDay;

        // Check localStorage to ensure we don't show it again
        const hasSeenWelcome = localStorage.getItem(`welcome_bonus_seen_${user.id}`);

        if (isNewUser && !hasSeenWelcome) {
            // Delay slightly for better UX (wait for page load)
            const timer = setTimeout(() => {
                setIsOpen(true);
                // Trigger confetti
                const duration = 3 * 1000;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 3,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#fbbf24', '#f59e0b', '#d97706'] // Amber colors
                    });
                    confetti({
                        particleCount: 3,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#fbbf24', '#f59e0b', '#d97706']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleClose = () => {
        setIsOpen(false);
        if (user) {
            localStorage.setItem(`welcome_bonus_seen_${user.id}`, 'true');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Card */}
            <div className="relative bg-[#1e293b] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-amber-500/20 transform scale-100 animate-scale-in overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-[50px] pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-amber-500 blur-xl opacity-40 animate-pulse"></div>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 rotate-3 border-2 border-amber-200/20">
                            <Gift size={40} className="text-white drop-shadow-md" />
                        </div>
                        <div className="absolute -right-2 -top-2 bg-white text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg rotate-12">
                            FREE!
                        </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        ยินดีต้อนรับสมาชิกใหม่!
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base mb-6 px-4">
                        ขอบคุณที่สมัครสมาชิกกับ NameMongkol <br />
                        รับเครดิตฟรีทันที เพื่อเริ่มต้นความเป็นมงคล
                    </p>

                    {/* Credit Box */}
                    <div className="w-full bg-slate-900/50 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Sparkles size={20} className="text-amber-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">โบนัสต้อนรับ</p>
                                <p className="text-white font-bold">Welcome Gift</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                                +100
                            </span>
                            <span className="text-amber-500/70 text-xs font-bold ml-1">Credits</span>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                        รับเครดิตฟรีทันที
                        <Sparkles size={18} className="animate-pulse" />
                    </button>

                    <p className="mt-4 text-[10px] text-slate-500">
                        *เครดิตมีอายุการใช้งาน 30 วัน
                    </p>
                </div>
            </div>
        </div>
    );
};
