'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, Filter, Quote, Plus, Trash2, Edit, Search, Sparkles } from 'lucide-react';
// import { reviews } from '@/data/reviews'; // Deprecated mock data
import { Review } from '@/types';
import { ReviewFormModal } from '@/components/ReviewFormModal';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'การเงิน', label: 'การเงิน' },
    { id: 'การงาน', label: 'การงาน' },
    { id: 'ความรัก', label: 'ความรัก' },
    { id: 'สุขภาพ', label: 'สุขภาพ' },
    { id: 'โชคลาภ', label: 'โชคลาภ' }
];

export default function ClientPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

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
                tags: r.tags || [r.category] // Ensure tags exist
            }));
            setDbReviews(formatted);
        }
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
                        <span>Hall of Fame</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                    >
                        ทำเนียบ <span className="text-amber-500">คนดวงเฮง</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        รวมประสบการณ์จริงจากผู้ใช้ที่เปลี่ยนชื่อและเบอร์มงคลกับเรา
                        <br className="hidden sm:block" />
                        ผลลัพธ์ที่พิสูจน์ได้ด้วยตัวคุณเอง
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
                            เขียนเรื่องราวของคุณ (รับเครดิตฟรี)
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
                            วิเคราะห์ชื่อฟรี
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-4xl mx-auto text-center mb-12 mt-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-500 mb-6">
                        เสียงตอบรับจากผู้ใช้งานจริง เปลี่ยนชื่อมงคลและเบอร์มงคลกับ NameMongkol
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        ที่ NameMongkol เราเชื่อว่าชื่อและตัวเลขมีพลังในการเปลี่ยนแปลงชีวิต หน้านี้ได้รวบรวม <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>รีวิวเปลี่ยนชื่อมงคล</strong></Link> และ <Link href="/phone-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>ประสบการณ์เปลี่ยนเบอร์มงคล</strong></Link> จากผู้ใช้งานจริงของเรา ไม่ว่าคุณจะกำลังมองหา <Link href="/search" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>ชื่อมงคล</strong></Link> เพื่อเสริมดวงการเงิน แก้เคล็ดเรื่องสุขภาพ หรือเสริมเสน่ห์ความรัก เรื่องราวเหล่านี้คือบทพิสูจน์ว่าศาสตร์แห่งการตั้งชื่อและเลขศาสตร์ประยุกต์สามารถช่วยพลิกฟื้นชะตาชีวิตและสร้างความมั่นใจให้คุณได้อย่างไร
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {CATEGORIES.map((category) => (
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
                                    <div>
                                        <div className="text-white font-bold">{review.nickname}</div>
                                        <div className="text-amber-500/80 text-xs font-medium uppercase tracking-wide flex items-center gap-2">
                                            {review.role}
                                            {review.date && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                    <span className="text-slate-500">
                                                        {new Date(review.date).toLocaleDateString('th-TH', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: '2-digit'
                                                        })}
                                                    </span>
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

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                    {review.tags.map((tag) => (
                                        <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>ยังไม่มีรีวิวในหมวดหมู่นี้</p>
                    </div>
                )}

                {/* FAQ Section - SEO Optimized */}
                <div className="mt-20 border-t border-white/10 pt-16 pb-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">
                        คำถามที่พบบ่อย (FAQ)
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
                            <h3 className="text-xl font-bold text-amber-400 mb-3">
                                Q: เปลี่ยนชื่อมงคลแล้วนานแค่ไหนถึงจะเห็นผล?
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                A: จาก <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>รีวิวเปลี่ยนชื่อมงคล</strong></Link> ของผู้ใช้งานส่วนใหญ่ การเปลี่ยนแปลงมักเริ่มเห็นผลชัดเจนภายใน 3-6 เดือน โดยเริ่มจากความรู้สึกมั่นใจและความสบายใจ ซึ่งส่งผลดีต่อการตัดสินใจในชีวิตประจำวัน ทั้งนี้ขึ้นอยู่กับพื้นดวงเดิมและการปฏิบัติตัวของแต่ละบุคคล
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
                            <h3 className="text-xl font-bold text-amber-400 mb-3">
                                Q: วิเคราะห์เบอร์โทรศัพท์กับ NameMongkol แม่นยำแค่ไหน?
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                A: ระบบ <Link href="/phone-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>วิเคราะห์เบอร์โทรแม่นๆ</strong></Link> ของเราใช้หลักเลขศาสตร์สากลและโหราศาสตร์ไทยประยุกต์ ผสานกับฐานข้อมูลสถิติจากผู้ใช้จริง ทำให้ผลลัพธ์มีความละเอียดและตรงกับสถานการณ์ชีวิตของผู้ใช้ ดังที่เห็นได้จากรีวิวเบอร์มงคลในหน้านี้
                            </p>
                        </div>

                        <div className="text-center mt-8 text-slate-500 text-sm">
                            <p>กำลังมองหาที่ <Link href="/search" className="text-amber-400 hover:text-amber-300 hover:underline"><strong>ตั้งชื่อมงคลที่ไหนดี</strong></Link> หรือต้องการ <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 hover:underline"><strong>แก้กรรมด้วยชื่อ</strong></Link>? ปรึกษา NameMongkol ได้ทันที</p>
                        </div>

                        {/* Bottom CTA */}
                        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-8 text-center mt-12">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                อยากมีชีวิตดีๆ แบบนี้บ้างไหม?
                            </h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                เริ่มต้นเปลี่ยนแปลงชะตาชีวิตของคุณวันด้วยชื่อมงคลและเบอร์โทรศัพท์ที่ส่งเสริมดวงชะตา
                            </p>
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                            >
                                <Sparkles size={20} />
                                เช็กชื่อมงคลของคุณเลย
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
