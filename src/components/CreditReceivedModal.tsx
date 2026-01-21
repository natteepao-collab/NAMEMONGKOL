'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreditReceivedModalProps {
    isOpen: boolean;
    onClose: () => void;
    creditAmount: number;
}

export const CreditReceivedModal = ({ isOpen, onClose, creditAmount }: CreditReceivedModalProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Trigger confetti
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={`relative bg-[#1e293b] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl shadow-emerald-500/10 transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Background Decor */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[50px] pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full z-10"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-40 animate-pulse"></div>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3 border-2 border-emerald-200/20">
                            <CheckCircle2 size={40} className="text-white drop-shadow-md" />
                        </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        เติมเครดิตสำเร็จ!
                    </h2>
                    <p className="text-slate-300 text-sm mb-6">
                        ระบบได้ทำการเพิ่มเครดิตเข้าสู่บัญชี<br />ของคุณเรียบร้อยแล้ว
                    </p>

                    {/* Credit Box */}
                    <div className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Sparkles size={20} className="text-amber-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">ได้รับเครดิต</p>
                                <p className="text-white font-bold">Top-up Credits</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">
                                +{creditAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
};
