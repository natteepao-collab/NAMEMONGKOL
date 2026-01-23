'use client';

import { useState } from 'react';
import { X, Star, Send, Sparkles, MessageCircle, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { id: 'การเงิน', label: 'การเงิน 💰' },
    { id: 'การงาน', label: 'การงาน 💼' },
    { id: 'ความรัก', label: 'ความรัก ❤️' },
    { id: 'สุขภาพ', label: 'สุขภาพ 🏥' },
    { id: 'โชคลาภ', label: 'โชคลาภ 🍀' }
];

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        nickname: '',
        role: '',
        category: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setStep('success');

        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#d97706']
        });
    };

    const handleClose = () => {
        onClose();
        // Reset state after transition
        setTimeout(() => {
            setStep('form');
            setFormData({ nickname: '', role: '', category: '', content: '' });
            setRating(5);
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Card */}
            <div className="relative bg-[#1e293b] border border-amber-500/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-amber-500/10 transform animate-scale-in overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full z-20"
                >
                    <X size={20} />
                </button>

                {step === 'form' ? (
                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <MessageCircle className="text-amber-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">เล่าประสบการณ์ของคุณ</h2>
                                <p className="text-slate-400 text-sm">รับฟรี 50 Credits เมื่อรีวิวได้รับการอนุมัติ</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">ชื่อเล่น (ที่ใช้แสดง)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.nickname}
                                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-600 text-sm"
                                        placeholder="เช่น คุณส้ม"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">อาชีพ (ระบุหรือไม่ก็ได้)</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-600 text-sm"
                                        placeholder="เช่น ธุรกิจส่วนตัว"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">เรื่องที่ต้องการรีวิว</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat.id })}
                                            className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium border transition-all ${formData.category === cat.id
                                                    ? 'bg-amber-500 text-slate-900 border-amber-500'
                                                    : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-slate-500'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">ความประทับใจ</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-600 text-sm resize-none"
                                    placeholder="เล่าความเปลี่ยนแปลงหลังจากเปลี่ยนชื่อ หรือเบอร์มงคล..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">ให้คะแนนความพึงพอใจ</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                className={`${star <= (hoverRating || rating)
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-slate-800 text-slate-700'
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.category}
                                className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        กำลังส่งข้อมูล...
                                    </>
                                ) : (
                                    <>
                                        ส่งเรื่องราว <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="relative z-10 flex flex-col items-center text-center py-6">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-40 animate-pulse"></div>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3 border-2 border-emerald-200/20 animate-scale-in">
                                <Gift size={40} className="text-white drop-shadow-md" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">ขอบคุณที่ร่วมแบ่งปัน!</h2>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs">
                            เรื่องราวของคุณถูกส่งเรียบร้อยแล้ว <br />
                            ทีมงานจะตรวจสอบและอนุมัติภายใน 24 ชม.
                        </p>

                        <div className="bg-slate-900/50 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <Sparkles className="text-emerald-400" size={20} />
                            <div className="text-left">
                                <p className="text-xs text-slate-400">รางวัลรออนุมัติ</p>
                                <p className="text-emerald-400 font-bold">+50 Credits</p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="text-slate-400 hover:text-white font-medium text-sm underline decoration-slate-600 hover:decoration-white transition-all"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
