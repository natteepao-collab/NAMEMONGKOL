'use client';

import { useState, useEffect } from 'react';
import { X, Star, Send, Sparkles, MessageCircle, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/utils/supabase'; // Import supabase

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        id: string;
        nickname: string;
        role?: string;
        content: string;
        rating: number;
        tags: string[];
    } | null;
    onSuccess?: () => void;
}

const CATEGORIES = [
    { id: 'การเงิน', label: 'การเงิน 💰' },
    { id: 'การงาน', label: 'การงาน 💼' },
    { id: 'ความรัก', label: 'ความรัก ❤️' },
    { id: 'สุขภาพ', label: 'สุขภาพ 🏥' },
    { id: 'โชคลาภ', label: 'โชคลาภ 🍀' }
];

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [rating, setRating] = useState(initialData?.rating || 5);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState<{
        nickname: string;
        role: string;
        categories: string[];
        content: string;
    }>({
        nickname: initialData?.nickname || '',
        role: initialData?.role || '',
        categories: initialData?.tags || [],
        content: initialData?.content || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Sync state with initialData when it changes or modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    nickname: initialData.nickname,
                    role: initialData.role || '',
                    categories: initialData.tags || [],
                    content: initialData.content
                });
                setRating(initialData.rating);
            } else {
                // Reset for new entry
                setFormData({
                    nickname: '',
                    role: '',
                    categories: [],
                    content: ''
                });
                setRating(5);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation: Content Length
        if (formData.content.length < 50) {
            const Swal = (await import('sweetalert2/dist/sweetalert2.js')).default;
            Swal.fire({
                icon: 'warning',
                title: 'เนื้อหาสั้นเกินไป',
                text: 'กรุณาเขียนรีวิวอย่างน้อย 50 ตัวอักษร เพื่อแบ่งปันประสบการณ์ที่เป็นประโยชน์',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#f59e0b'
            });
            setIsSubmitting(false);
            return;
        }

        try {

            // Prepare tags based on categories
            const tags = formData.categories;

            if (initialData?.id) {
                // Update Mode
                const { error } = await supabase
                    .from('reviews')
                    .update({
                        nickname: formData.nickname,
                        role: formData.role,
                        content: formData.content,
                        category: formData.categories[0],
                        rating: rating,
                        tags: tags,
                        // status: 'pending' // Optionally reset status to pending on edit if you want re-approval
                        // For now let's assume if they edit it, it might need re-approval, or just let it be.
                        // Let's safe side: usually edits require re-approval. But for user simplicity, let's keep approved if it was approved, 
                        // UNLESS we want strict control. Let's just update fields.
                    })
                    .eq('id', initialData.id);

                if (error) throw error;

                // Show simple success for edit (no credits or confetti usually)
                const Swal = (await import('sweetalert2/dist/sweetalert2.js')).default;
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกการแก้ไขสำเร็จ',
                    background: '#1e293b',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
                // Close directly
                onClose();
                if (onSuccess) onSuccess();
                return;

            } else {
                // Insert Mode (Existing Logic)
                const { data, error } = await supabase.rpc('submit_review', {
                    p_nickname: formData.nickname,
                    p_role: formData.role,
                    p_content: formData.content,
                    p_category: formData.categories[0], // Use first category as primary
                    p_rating: rating,
                    p_tags: tags
                });

                if (error) {
                    console.error('RPC Error:', error);
                    throw error;
                }

                if (data && data.success) {
                    // setEarnedCredits(data.bonus_credits || 0); // Removed: Credits awarded on approval
                    setStep('success');
                    if (onSuccess) onSuccess();

                    // if (data.bonus_credits > 0) {
                    //    window.dispatchEvent(new Event('force_credits_update'));
                    // }

                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
                    });
                } else {
                    console.error('Submission failed logic:', data);
                    const Swal = (await import('sweetalert2/dist/sweetalert2.js')).default;
                    Swal.fire({
                        icon: 'error',
                        title: 'บันทึกไม่สำเร็จ',
                        text: data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            }

        } catch (err: unknown) {
            console.error('Error submitting review (Full):', err);
            const Swal = (await import('sweetalert2/dist/sweetalert2.js')).default;
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: (err instanceof Error ? err.message : 'ไม่สามารถเชื่อต่อกับระบบได้'),
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset state after transition
        setTimeout(() => {
            setStep('form');
            setFormData({ nickname: '', role: '', categories: [], content: '' });
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
                                <h2 className="text-xl sm:text-2xl font-bold text-white">{initialData ? 'แก้ไขรีวิว' : 'เล่าประสบการณ์ของคุณ'}</h2>
                                <p className="text-slate-400 text-sm">{initialData ? 'แก้ไขข้อมูลรีวิวของคุณ' : 'รับฟรี 50 Credits เมื่อรีวิวได้รับการอนุมัติ'}</p>
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
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">เรื่องที่ต้องการรีวิว (เลือกได้สูงสุด 3 ข้อ)</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {CATEGORIES.map(cat => {
                                        const isSelected = formData.categories.includes(cat.id);
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => {
                                                        const current = prev.categories;
                                                        if (current.includes(cat.id)) {
                                                            return { ...prev, categories: current.filter(c => c !== cat.id) };
                                                        }
                                                        if (current.length >= 3) return prev;
                                                        return { ...prev, categories: [...current, cat.id] };
                                                    });
                                                }}
                                                className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium border transition-all ${isSelected
                                                    ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-lg shadow-amber-500/20'
                                                    : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-slate-500'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">ความประทับใจ</label>
                                <textarea
                                    required
                                    rows={4}
                                    minLength={50}
                                    maxLength={1500}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-600 text-sm resize-none ${formData.content.length > 0 && formData.content.length < 50
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-slate-700 focus:border-amber-500'
                                        }`}
                                    placeholder="เล่าความเปลี่ยนแปลงหลังจากเปลี่ยนชื่อ หรือเบอร์มงคล... (อย่างน้อย 50 ตัวอักษร)"
                                />
                                <div className="flex justify-between items-center mt-1.5 px-1">
                                    <span className={`text-[10px] ${formData.content.length > 0 && formData.content.length < 50 ? 'text-red-400' : 'text-slate-500'
                                        }`}>
                                        {formData.content.length < 50 ? `อีก ${50 - formData.content.length} ตัวอักษร` : 'ครบจำนวนแล้ว'}
                                    </span>
                                    <span className={`text-[10px] ${formData.content.length >= 1500 ? 'text-red-400' : 'text-slate-500'
                                        }`}>
                                        {formData.content.length} / 1,500
                                    </span>
                                </div>
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
                                disabled={isSubmitting || formData.categories.length === 0}
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
                                <p className="text-xs text-slate-400">เมื่อได้รับการอนุมัติ</p>
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
