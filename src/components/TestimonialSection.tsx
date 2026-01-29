'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MessageCircle, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Review } from '@/types';
import { ReviewFormModal } from '@/components/ReviewFormModal';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageProvider';

export const TestimonialSection = () => {
    // Select top 3-4 reviews for the homepage
    const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    useEffect(() => {
        const getReviews = async () => {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('status', 'approved')
                .order('rating', { ascending: false }) // Show highest rated or created_at
                .limit(4);

            if (data) {
                const formatted: Review[] = data.map(r => ({
                    ...r,
                    date: r.created_at
                }));
                setFeaturedReviews(formatted);
            }
        };
        getReviews();
    }, []);

    const handleWriteStory = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // Dynamic import SweetAlert2
            // Dynamic import SweetAlert2 - Rebuild trigger
            // @ts-ignore
            const Swal = (await import('sweetalert2')).default;

            Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านต้องเข้าสู่ระบบก่อนจึงจะสามารถเขียนรีวิวได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#d33',
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff'
            }).then((result: any) => {
                if (result.isConfirmed) {
                    router.push('/login');
                }
            });
            return;
        }

        setIsModalOpen(true);
    };

    return (
        <section className="w-full py-16 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col items-center mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <MessageCircle size={14} />
                        <span>{t('sections.testimonials.badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t('sections.testimonials.title')}
                    </h2>
                    <p className="text-slate-400 max-w-2xl">
                        {t('sections.testimonials.description')}
                    </p>
                </div>

                {/* Carousel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative hover:bg-white/10 transition-colors group"
                        >
                            <Quote className="absolute top-4 right-4 text-white/5 w-8 h-8 group-hover:text-amber-500/20 transition-colors" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    {review.nickname.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">{review.nickname}</div>
                                    <div className="text-slate-500 text-xs">{review.role}</div>
                                </div>
                            </div>

                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mb-4 min-h-[60px]">
                                &quot;{review.content}&quot;
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {review.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/reviews"
                        className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-1 flex items-center gap-2"
                    >
                        {t('sections.testimonials.viewAll')}
                    </Link>
                    <button
                        onClick={handleWriteStory}
                        className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10 hover:border-white/20 flex items-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {t('sections.testimonials.write')}
                    </button>
                </div>
            </div>

            <ReviewFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};
