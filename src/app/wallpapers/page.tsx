'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Share2, Sparkles, Filter, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import Swal from 'sweetalert2';

const WALLPAPERS = [
    { id: 1, name: 'มหาเทพประทานทรัพย์ (วันอาทิตย์)', image: '/Wallpaper/คนเกิดวันเอาทิตย์.png', day: 'sunday', tags: ['การเงิน', 'อำนาจ'], premium: false },
    { id: 2, name: 'เสน่ห์เมตตามหานิยม (วันจันทร์)', image: '/Wallpaper/คนเกิดวันจันทร์.png', day: 'monday', tags: ['ความรัก', 'เมตตา'], premium: false },
    { id: 3, name: 'นักรบกล้าหาญ (วันอังคาร)', image: '/Wallpaper/คนเกิดวันอังคาร.png', day: 'tuesday', tags: ['การงาน', 'แข่งขัน'], premium: false },
    { id: 4, name: 'วาจาเรียกทรัพย์ (วันพุธ)', image: '/Wallpaper/คนเกิดพุธ.png', day: 'wednesday', tags: ['การเจรจา', 'ค้าขาย'], premium: false },
    { id: 5, name: 'ปัญญาบารมี (วันพฤหัสบดี)', image: '/Wallpaper/คนเกิดพฤหัส.png', day: 'thursday', tags: ['การเรียน', 'ผู้ใหญ่เมตตา'], premium: false },
    { id: 6, name: 'ทรัพย์สินพอกพูน (วันศุกร์)', image: '/Wallpaper/คนเกิดศุกร์.png', day: 'friday', tags: ['การเงิน', 'ความสุข'], premium: false },
    { id: 7, name: 'อำนาจบารมี (วันเสาร์)', image: '/Wallpaper/คนเกิดวันเสาร์.png', day: 'saturday', tags: ['อำนาจ', 'แคล้วคลาด'], premium: false },
    { id: 8, name: 'ท้าวเวสสุวรรณ ปลดหนี้', image: '/Wallpaper/thao-wessuwan-v2.png', day: 'all', tags: ['ปลดหนี้', 'กันชง'], premium: true },
];

const DAYS = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'sunday', label: 'วันอาทิตย์' },
    { value: 'monday', label: 'วันจันทร์' },
    { value: 'tuesday', label: 'วันอังคาร' },
    { value: 'wednesday', label: 'วันพุธ' },
    { value: 'thursday', label: 'วันพฤหัส' },
    { value: 'friday', label: 'วันศุกร์' },
    { value: 'saturday', label: 'วันเสาร์' },
];

export default function WallpapersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDay = searchParams.get('day') || 'all';
    const [selectedDay, setSelectedDay] = useState(initialDay);
    const [selectedWallpaper, setSelectedWallpaper] = useState<typeof WALLPAPERS[0] | null>(null);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    // Fetch User Credits
    React.useEffect(() => {
        const fetchCredits = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('credits')
                    .eq('id', session.user.id)
                    .maybeSingle();
                if (data) setUserCredits(data.credits);
            }
        };
        fetchCredits();
    }, []);

    const filteredWallpapers = WALLPAPERS.filter(wp =>
        selectedDay === 'all' || wp.day === selectedDay || wp.day === 'all'
    );

    const handleDownload = async (wallpaper: typeof WALLPAPERS[0]) => {
        // 1. Check Auth
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านต้องเข้าสู่ระบบก่อนจึงจะสามารถดาวน์โหลดวอลเปเปอร์มงคลได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#d33',
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/login');
                }
            });
            return;
        }

        // 2. Handle Premium Logic
        if (wallpaper.premium) {
            const COST = 15;

            // Check balance
            if (userCredits === null || userCredits < COST) {
                Swal.fire({
                    title: 'เครดิตไม่เพียงพอ',
                    text: `วอลเปเปอร์นี้ต้องใช้ ${COST} เครดิต (ท่านมี ${userCredits || 0})`,
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#10b981',
                    background: '#1e293b',
                    color: '#fff'
                }).then((res) => {
                    if (res.isConfirmed) router.push('/topup');
                });
                return;
            }

            // Confirm
            const confirm = await Swal.fire({
                title: 'ยืนยันการดาวน์โหลด',
                text: `ต้องการใช้ ${COST} เครดิตเพื่อดาวน์โหลดภาพนี้หรือไม่?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `ยืนยัน (หัก ${COST} เครดิต)`,
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });

            if (!confirm.isConfirmed) return;

            // Deduct
            try {
                const { error } = await supabase.rpc('deduct_credits', { amount: COST });
                if (error) throw error;

                // Update local state
                setUserCredits(prev => (prev !== null ? prev - COST : null));

                // Success Message (Toast)
                Swal.fire({
                    icon: 'success',
                    title: 'ดาวน์โหลดสำเร็จ',
                    text: `หัก ${COST} เครดิตเรียบร้อยแล้ว`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    background: '#1e293b',
                    color: '#fff'
                });

            } catch (error) {
                console.error('Deduct error:', error);
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถตัดเครดิตได้ กรุณาลองใหม่', 'error');
                return;
            }
        }

        // 3. Download Logic (Shared)
        const link = document.createElement('a');
        link.href = wallpaper.image;
        link.download = `namemongkol-${wallpaper.name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20">
            {/* Header */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-amber-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
                            Wallpaper มงคล
                        </span>
                    </h1>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                {/* Hero / Intro */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
                        เสริมดวงชะตาด้วย<br />
                        <span className="text-amber-400">ภาพหน้าจอมงคลเฉพาะคุณ</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                        คัดสรรภาพมงคลที่ออกแบบตามหลักทักษาและเลขศาสตร์ เพื่อเสริมสิริมงคลในด้านต่างๆ
                    </p>
                </div>

                {/* Filter */}
                <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap justify-start md:justify-center gap-2 mb-8 no-scrollbar px-1">
                    {DAYS.map((day) => (
                        <button
                            key={day.value}
                            onClick={() => setSelectedDay(day.value)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${selectedDay === day.value
                                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                                }`}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>

                {/* Grid - Adjusted for Mobile (2 cols) and Compact Laptop (5-6 cols) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {filteredWallpapers.map((wp, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={wp.id}
                            onClick={() => setSelectedWallpaper(wp)}
                            className="group relative bg-[#1e293b]/50 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all active:scale-95 cursor-pointer"
                        >
                            <div className="aspect-[9/16] relative overflow-hidden">
                                <Image
                                    src={wp.image}
                                    alt={wp.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                {wp.premium && (
                                    <div className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg flex items-center gap-0.5">
                                        <Lock size={8} /> Pro
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-2.5 md:p-4">
                                <h3 className="text-xs md:text-base font-bold text-white truncate drop-shadow-md">
                                    {wp.name}
                                </h3>
                                <p className="text-[10px] md:text-xs text-amber-300 truncate">
                                    {wp.tags.map(t => `#${t}`).join(' ')}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Fullscreen Preview Modal */}
            {selectedWallpaper && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedWallpaper(null)}
                    />

                    <div className="relative w-full max-w-sm md:max-w-md bg-[#1e293b] rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0f172a]/50">
                            <h3 className="font-bold text-white truncate pr-4">{selectedWallpaper.name}</h3>
                            <button
                                onClick={() => setSelectedWallpaper(null)}
                                className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <Lock className="hidden" /> {/* Dummy to keep layout if needed, or just X */}
                                <span className="text-xl leading-none">&times;</span>
                            </button>
                        </div>

                        {/* Image Container - Scrollable/Contain */}
                        <div className="relative flex-1 bg-[#0f172a] overflow-hidden group">
                            <div className="w-full h-full relative">
                                <Image
                                    src={selectedWallpaper.image}
                                    alt={selectedWallpaper.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-4 bg-[#0f172a]/50 border-t border-white/5 space-y-3">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {selectedWallpaper.tags.map(tag => (
                                    <span key={tag} className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => handleDownload(selectedWallpaper)}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
                            >
                                <Download size={18} />
                                {selectedWallpaper.premium ? 'แลกแต้มดาวน์โหลด' : 'ดาวน์โหลดฟรี'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
