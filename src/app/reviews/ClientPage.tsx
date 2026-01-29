'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, Filter, Quote, Plus, Trash2, Edit, Search, Sparkles, ThumbsUp, BadgeCheck, Share2 } from 'lucide-react';
import { Review, ReviewServiceType } from '@/types';
import { ReviewFormModal } from '@/components/ReviewFormModal';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';

// Service type mapping for SEO - ชื่อบริการและ URL
const SERVICE_INFO: Record<ReviewServiceType, { name: string; url: string; shortName: string }> = {
    'name-analysis': { name: 'วิเคราะห์ชื่อมงคล', url: '/name-analysis', shortName: 'วิเคราะห์ชื่อ' },
    'phone-analysis': { name: 'วิเคราะห์เบอร์มงคล', url: '/phone-analysis', shortName: 'วิเคราะห์เบอร์' },
    'premium-search': { name: 'ค้นหาชื่อมงคลพรีเมียม', url: '/premium-search', shortName: 'ค้นหาชื่อพรีเมียม' },
    'premium-analysis': { name: 'วิเคราะห์ชื่อแบบพรีเมียม', url: '/premium-analysis', shortName: 'วิเคราะห์พรีเมียม' },
    'wallpapers': { name: 'วอลเปเปอร์มงคล', url: '/wallpapers', shortName: 'วอลเปเปอร์' },
    'general': { name: 'บริการ NameMongkol', url: '/', shortName: 'ทั่วไป' }
};

// Category URL mapping for clickable tags - SEO Internal Linking
const TAG_URLS: Record<string, string> = {
    'การเงิน': '/reviews?category=การเงิน',
    'การงาน': '/reviews?category=การงาน',
    'ความรัก': '/reviews?category=ความรัก',
    'สุขภาพ': '/reviews?category=สุขภาพ',
    'โชคลาภ': '/reviews?category=โชคลาภ'
};

export default function ClientPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
    const [userVotedReviews, setUserVotedReviews] = useState<Set<string>>(new Set());
    const router = useRouter();
    const { t } = useLanguage();

    const categories = useMemo(() => ([
        { id: 'all', label: t('pages.reviews.categories.all') },
        { id: 'การเงิน', label: t('pages.reviews.categories.finance') },
        { id: 'การงาน', label: t('pages.reviews.categories.career') },
        { id: 'ความรัก', label: t('pages.reviews.categories.love') },
        { id: 'สุขภาพ', label: t('pages.reviews.categories.health') },
        { id: 'โชคลาภ', label: t('pages.reviews.categories.fortune') }
    ]), [t]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUser(session?.user || null);

            if (session?.user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                }
            }
        };
        checkUser();
    }, []);

    const handleWriteStory = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
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

        setEditingReview(null); // Reset editing state for new story
        setIsModalOpen(true);
    };

    const handleEdit = (review: Review) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleDelete = async (reviewId: string) => {
        // @ts-ignore
        const Swal = (await import('sweetalert2')).default;

        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบรีวิวนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบรีวิว',
            cancelButtonText: 'ยกเลิก',
            background: '#1e293b',
            color: '#fff'
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                try {
                    const { error } = await supabase
                        .from('reviews')
                        .delete()
                        .eq('id', reviewId);

                    if (error) throw error;

                    // Update UI by fetching from DB to ensure sync
                    await fetchReviews();

                    Swal.fire({
                        title: 'ลบสำเร็จ!',
                        text: 'รีวิวของคุณถูกลบเรียบร้อยแล้ว',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error: any) {
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: error.message || 'ไม่สามารถลบรีวิวได้',
                        icon: 'error',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            }
        });
    };

    const [dbReviews, setDbReviews] = useState<Review[]>([]);

    // Helper function to format date with <time> tag for SEO
    const formatDateForSEO = (dateString: string) => {
        const date = new Date(dateString);
        const isoDate = date.toISOString().split('T')[0]; // ISO 8601 format
        const thaiDate = date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
        return { isoDate, thaiDate };
    };

    // Handle helpful vote
    const handleHelpfulVote = async (reviewId: string) => {
        if (userVotedReviews.has(reviewId)) {
            // Already voted, could implement unvote logic
            return;
        }

        try {
            // Optimistic update
            setHelpfulVotes(prev => ({
                ...prev,
                [reviewId]: (prev[reviewId] || 0) + 1
            }));
            setUserVotedReviews(prev => new Set(prev).add(reviewId));

            // Store vote in localStorage to persist
            const storedVotes = JSON.parse(localStorage.getItem('helpfulVotes') || '[]');
            storedVotes.push(reviewId);
            localStorage.setItem('helpfulVotes', JSON.stringify(storedVotes));

            // Update in database (optional - for real implementation)
            await supabase
                .from('reviews')
                .update({ helpful_count: (helpfulVotes[reviewId] || 0) + 1 })
                .eq('id', reviewId);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    // Share review
    const handleShareReview = async (review: Review) => {
        const shareUrl = `${window.location.origin}/reviews#review-${review.id}`;
        const shareText = `รีวิวจาก ${review.nickname}: "${review.content.substring(0, 100)}..."`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'รีวิวจาก NameMongkol',
                    text: shareText,
                    url: shareUrl
                });
            } catch (error) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl);
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                title: 'คัดลอกลิงก์แล้ว!',
                icon: 'success',
                background: '#1e293b',
                color: '#fff',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    // Load user's previous votes from localStorage
    useEffect(() => {
        const storedVotes = JSON.parse(localStorage.getItem('helpfulVotes') || '[]');
        setUserVotedReviews(new Set(storedVotes));
    }, []);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (data) {
            // Map Supabase data to Review interface if needed, or use directly
            const formatted = data.map(r => ({
                ...r,
                date: r.created_at, // Map created_at to date
                tags: r.tags || [r.category], // Ensure tags exist
                // Infer service_type from tags if not set
                service_type: r.service_type || inferServiceType(r.tags || [r.category]),
                // Default is_verified to true if user_id exists
                is_verified: r.is_verified ?? !!r.user_id,
                helpful_count: r.helpful_count || 0
            }));
            setDbReviews(formatted);
            
            // Initialize helpful votes from database
            const votesMap: Record<string, number> = {};
            formatted.forEach(r => {
                votesMap[r.id] = r.helpful_count || 0;
            });
            setHelpfulVotes(votesMap);
        }
    };

    // Infer service type from tags for backward compatibility
    const inferServiceType = (tags: string[]): ReviewServiceType => {
        if (tags.some(t => t.includes('เบอร์') || t.includes('โทร'))) return 'phone-analysis';
        if (tags.some(t => t.includes('ชื่อ'))) return 'name-analysis';
        if (tags.some(t => t.includes('วอลเปเปอร์'))) return 'wallpapers';
        return 'general';
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const filteredReviews = useMemo(() => {
        const target = dbReviews;
        if (selectedCategory === 'all') return target;
        return target.filter(review => review.tags && review.tags.includes(selectedCategory));
    }, [selectedCategory, dbReviews]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-28">
            {/* Header Section */}
            <div className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold uppercase tracking-wider mb-6"
                    >
                        <MessageCircle size={16} />
                        <span>{t('pages.reviews.badge')}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                    >
                        {t('pages.reviews.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        {t('pages.reviews.description')}
                    </motion.p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 0.3 }}
                            onClick={handleWriteStory}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all group"
                        >
                            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            {t('pages.reviews.ctaWrite')}
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 0.4 }}
                            onClick={() => router.push('/')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-amber-500/30 text-amber-500 font-bold text-lg hover:bg-amber-500/10 transition-all"
                        >
                            <Search size={24} />
                            {t('pages.reviews.ctaAnalyze')}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-4xl mx-auto text-center mb-12 mt-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-500 mb-6">
                        {t('pages.reviews.subheading')}
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        ที่ NameMongkol เราเชื่อว่าชื่อและตัวเลขมีพลังในการเปลี่ยนแปลงชีวิต หน้านี้ได้รวบรวม <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>รีวิวเปลี่ยนชื่อมงคล</strong></Link> และ <Link href="/phone-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>ประสบการณ์เปลี่ยนเบอร์มงคล</strong></Link> จากผู้ใช้งานจริงของเรา ไม่ว่าคุณจะกำลังมองหา <Link href="/search" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>ชื่อมงคล</strong></Link> เพื่อเสริมดวงการเงิน แก้เคล็ดเรื่องสุขภาพ หรือเสริมเสน่ห์ความรัก เรื่องราวเหล่านี้คือบทพิสูจน์ว่าศาสตร์แห่งการตั้งชื่อและเลขศาสตร์ประยุกต์สามารถช่วยพลิกฟื้นชะตาชีวิตและสร้างความมั่นใจให้คุณได้อย่างไร
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === category.id
                                ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 scale-105'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid Simulation (Responsive Columns) */}
                <motion.div
                    layout
                    className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
                >
                    <AnimatePresence>
                        {filteredReviews.map((review) => (
                            <motion.div
                                layout
                                key={review.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="break-inside-avoid bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group relative overflow-hidden"
                            >
                                {/* Owner Actions - Adjusted z-index and position */}
                                {currentUser && (currentUser.id === review.user_id || isAdmin) && (
                                    <div className="absolute top-4 right-4 z-30 flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(review); }}
                                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                            title="แก้ไข"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(review.id); }}
                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                            title="ลบ"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Decorative Quote - Hide if owner or admin to prevent overlap or move left */}
                                {(!currentUser || (currentUser.id !== review.user_id && !isAdmin)) && (
                                    <Quote className="absolute top-4 right-4 text-white/5 w-12 h-12 rotate-12 group-hover:text-amber-500/10 transition-colors pointer-events-none" />
                                )}

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {review.avatar ? (
                                            <img src={review.avatar} alt={review.nickname} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            review.nickname.charAt(0)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold">{review.nickname}</span>
                                            {/* Verified Badge - E-E-A-T Signal */}
                                            {review.is_verified && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                                                    <BadgeCheck size={12} className="fill-emerald-400 text-emerald-900" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-amber-500/80 text-xs font-medium uppercase tracking-wide flex items-center gap-2 flex-wrap">
                                            {review.role}
                                            {/* Service Type with Internal Link - SEO */}
                                            {review.service_type && SERVICE_INFO[review.service_type] && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                    <Link 
                                                        href={SERVICE_INFO[review.service_type].url}
                                                        className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors normal-case"
                                                    >
                                                        ใช้บริการ: {SERVICE_INFO[review.service_type].shortName}
                                                    </Link>
                                                </>
                                            )}
                                            {/* Date with <time> tag for SEO - ISO 8601 datetime */}
                                            {review.date && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                    <time 
                                                        dateTime={formatDateForSEO(review.date).isoDate}
                                                        className="text-slate-500"
                                                    >
                                                        {formatDateForSEO(review.date).thaiDate}
                                                    </time>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-slate-300 leading-relaxed mb-6 relative z-10">
                                    &quot;{review.content}&quot;
                                </p>

                                {review.image && (
                                    <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                                        <div className="aspect-[4/3] bg-slate-800 flex items-center justify-center text-slate-600 text-xs">
                                            {/* In real app, use Next Image */}
                                            [รูปประกอบการรีวิว]
                                        </div>
                                    </div>
                                )}

                                {/* Tags - Clickable for Internal Linking */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                    {review.tags.map((tag) => (
                                        <Link 
                                            key={tag} 
                                            href={TAG_URLS[tag] || `/reviews?category=${encodeURIComponent(tag)}`}
                                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>

                                {/* Helpful Vote & Share - User Engagement */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleHelpfulVote(review.id); }}
                                        disabled={userVotedReviews.has(review.id)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            userVotedReviews.has(review.id)
                                                ? 'bg-amber-500/20 text-amber-400 cursor-default'
                                                : 'bg-white/5 text-slate-400 hover:bg-amber-500/10 hover:text-amber-400'
                                        }`}
                                    >
                                        <ThumbsUp size={14} className={userVotedReviews.has(review.id) ? 'fill-amber-400' : ''} />
                                        <span>{t('pages.reviews.helpful')}</span>
                                        {(helpfulVotes[review.id] || 0) > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-amber-400 font-semibold">
                                                {helpfulVotes[review.id]}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleShareReview(review); }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <Share2 size={14} />
                                        <span>{t('pages.reviews.share')}</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('pages.reviews.empty')}</p>
                    </div>
                )}

                {/* FAQ Section - SEO Optimized */}
                <div className="mt-20 border-t border-white/10 pt-16 pb-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">
                        {t('pages.reviews.faqTitle')}
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
                            <h3 className="text-xl font-bold text-amber-400 mb-3">
                                Q: {t('pages.reviews.faq1Q')}
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                A: {t('pages.reviews.faq1A')}
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
                            <h3 className="text-xl font-bold text-amber-400 mb-3">
                                Q: {t('pages.reviews.faq2Q')}
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                A: {t('pages.reviews.faq2A')}
                            </p>
                        </div>

                        <div className="text-center mt-8 text-slate-500 text-sm">
                            <p>กำลังมองหาที่ <Link href="/search" className="text-amber-400 hover:text-amber-300 hover:underline"><strong>ตั้งชื่อมงคลที่ไหนดี</strong></Link> หรือต้องการ <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 hover:underline"><strong>แก้กรรมด้วยชื่อ</strong></Link>? ปรึกษา NameMongkol ได้ทันที</p>
                        </div>

                        {/* Bottom CTA */}
                        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-8 text-center mt-12">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {t('pages.reviews.bottomTitle')}
                            </h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                {t('pages.reviews.bottomDesc')}
                            </p>
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                            >
                                <Sparkles size={20} />
                                {t('pages.reviews.bottomCta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <ReviewFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingReview(null); }}
                initialData={editingReview}
                onSuccess={fetchReviews}
            />
        </div>
    );
}
