'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Sparkles, Lock, Palette, ImageIcon, Crown, Sun, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import dynamic from 'next/dynamic';

import { Wallpaper } from '@/types';

// Dynamic import for CustomWallpaperGenerator (standalone version)
const StandaloneWallpaperGenerator = dynamic(
    () => import('@/components/StandaloneWallpaperGenerator'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        )
    }
);

// Fallback constant for immediate load/SSR if needed, but we will rely on DB
const INITIAL_WALLPAPERS: Wallpaper[] = [
    { id: 1, name: 'มหาเทพประทานทรัพย์ (วันอาทิตย์)', image: '/wallpapers/sunday.webp', day: 'sunday', tags: ['การเงิน', 'อำนาจ'], premium: false, downloads: 2540 },
    { id: 2, name: 'เสน่ห์เมตตามหานิยม (วันจันทร์)', image: '/wallpapers/monday.webp', day: 'monday', tags: ['ความรัก', 'เมตตา'], premium: false, downloads: 3120 },
    { id: 3, name: 'นักรบกล้าหาญ (วันอังคาร)', image: '/wallpapers/tuesday.webp', day: 'tuesday', tags: ['การงาน', 'แข่งขัน'], premium: false, downloads: 1890 },
    { id: 4, name: 'วาจาเรียกทรัพย์ (วันพุธ)', image: '/wallpapers/wednesday.webp', day: 'wednesday', tags: ['การเจรจา', 'ค้าขาย'], premium: false, downloads: 2100 },
    { id: 5, name: 'ปัญญาบารมี (วันพฤหัสบดี)', image: '/wallpapers/thursday.webp', day: 'thursday', tags: ['การเรียน', 'ผู้ใหญ่เมตตา'], premium: false, downloads: 2750 },
    { id: 6, name: 'ทรัพย์สินพอกพูน (วันศุกร์)', image: '/wallpapers/friday.webp', day: 'friday', tags: ['การเงิน', 'ความสุข'], premium: false, downloads: 3420 },
    { id: 7, name: 'อำนาจบารมี (วันเสาร์)', image: '/wallpapers/saturday.webp', day: 'saturday', tags: ['อำนาจ', 'แคล้วคลาด'], premium: false, downloads: 1980 },
    { id: 8, name: 'ท้าวเวสสุวรรณ ปลดหนี้', image: '/wallpapers/thao-wessuwan-v2.webp', day: 'all', tags: ['ปลดหนี้', 'กันชง'], premium: true, downloads: 4500 },
    { id: 9, name: '4289 ท้าวเวสสุวรรณ (สีชมพู)', image: '/wallpapers/4289-vessavana-pink.webp', day: 'all', tags: ['การเงิน', 'โชคลาภ', '4289'], premium: false, downloads: 0, description: 'เหมาะอย่างยิ่งสำหรับ \"คนทำมาค้าขาย, เจ้าของธุรกิจ, Sales, และคนที่ต้องการเสริมดวงโชคลาภและการเงิน\" โดยเน้นที่ความราบรื่น (ปางเด็ก) และเงินทองไหลมาเทมา (4289 + ถุงเงิน) ครับ' },
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

// Zodiac categories
type CategoryType = 'day' | 'zodiac';

const ZODIAC_SIGNS = [
    { value: 'all', label: 'ทั้งหมด', emoji: '✨' },
    { value: 'aries', label: 'เมษ', emoji: '♈', date: '13 เม.ย. - 14 พ.ค.' },
    { value: 'taurus', label: 'พฤษภ', emoji: '♉', date: '14 พ.ค. - 14 มิ.ย.' },
    { value: 'gemini', label: 'เมถุน', emoji: '♊', date: '14 มิ.ย. - 14 ก.ค.' },
    { value: 'cancer', label: 'กรกฎ', emoji: '♋', date: '14 ก.ค. - 16 ส.ค.' },
    { value: 'leo', label: 'สิงห์', emoji: '♌', date: '16 ส.ค. - 16 ก.ย.' },
    { value: 'virgo', label: 'กันย์', emoji: '♍', date: '16 ก.ย. - 16 ต.ค.' },
    { value: 'libra', label: 'ตุลย์', emoji: '♎', date: '16 ต.ค. - 15 พ.ย.' },
    { value: 'scorpio', label: 'พิจิก', emoji: '♏', date: '15 พ.ย. - 15 ธ.ค.' },
    { value: 'sagittarius', label: 'ธนู', emoji: '♐', date: '15 ธ.ค. - 14 ม.ค.' },
    { value: 'capricorn', label: 'มังกร', emoji: '♑', date: '14 ม.ค. - 12 ก.พ.' },
    { value: 'aquarius', label: 'กุมภ์', emoji: '♒', date: '12 ก.พ. - 14 มี.ค.' },
    { value: 'pisces', label: 'มีน', emoji: '♓', date: '14 มี.ค. - 13 เม.ย.' },
];

const ZODIAC_WALLPAPERS: Wallpaper[] = [
    { id: 1001, name: 'ราศีเมษ', image: '/wallpapers/ราศีเมษ.webp', day: 'aries', tags: ['ราศีเมษ', 'ผู้นำ', 'กล้าหาญ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีเมษ เสริมความเป็นผู้นำ กล้าตัดสินใจ พลังขับเคลื่อนชีวิตไปข้างหน้า' },
    { id: 1002, name: 'ราศีพฤษภ', image: '/wallpapers/ราศีพฤษภ.webp', day: 'taurus', tags: ['ราศีพฤษภ', 'มั่นคง', 'ร่ำรวย'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีพฤษภ เสริมความมั่นคง ร่ำรวย อดทนสู่ความสำเร็จ' },
    { id: 1003, name: 'ราศีเมถุน', image: '/wallpapers/ราศีเมถุน.webp', day: 'gemini', tags: ['ราศีเมถุน', 'สื่อสาร', 'เฉลียวฉลาด'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีเมถุน เสริมทักษะการสื่อสาร ความเฉลียวฉลาด และไหวพริบ' },
    { id: 1004, name: 'ราศีกรกฎ', image: '/wallpapers/ราศีกรกฎ .webp', day: 'cancer', tags: ['ราศีกรกฎ', 'ครอบครัว', 'อ่อนโยน'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีกรกฎ เสริมพลังรัก ครอบครัว และความอบอุ่น' },
    { id: 1005, name: 'ราศีสิงห์', image: '/wallpapers/ราศีสิงห์.webp', day: 'leo', tags: ['ราศีสิงห์', 'บารมี', 'เกียรติยศ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีสิงห์ เสริมบารมี เกียรติยศ ความโดดเด่น' },
    { id: 1006, name: 'ราศีกันย์', image: '/wallpapers/ราศีกันย์.webp', day: 'virgo', tags: ['ราศีกันย์', 'รอบคอบ', 'สติปัญญา'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีกันย์ เสริมสติปัญญา ความรอบคอบ และวิจารณญาณ' },
    { id: 1007, name: 'ราศีตุลย์', image: '/wallpapers/ราศีตุลย์ .webp', day: 'libra', tags: ['ราศีตุลย์', 'ความรัก', 'สมดุล'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีตุลย์ เสริมความรัก ความสมดุลในชีวิต และเสน่ห์' },
    { id: 1008, name: 'ราศีพิจิก', image: '/wallpapers/ราศีพิจิก.webp', day: 'scorpio', tags: ['ราศีพิจิก', 'พลัง', 'ลึกซึ้ง'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีพิจิก เสริมพลังภายใน ความมุ่งมั่น และความลึกซึ้ง' },
    { id: 1009, name: 'ราศีธนู', image: '/wallpapers/ราศีธนู.webp', day: 'sagittarius', tags: ['ราศีธนู', 'โชคลาภ', 'อิสระ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีธนู เสริมโชคลาภ ความอิสรเสรี และการเดินทาง' },
    { id: 1010, name: 'ราศีมังกร', image: '/wallpapers/ราศีมังกร .webp', day: 'capricorn', tags: ['ราศีมังกร', 'ความสำเร็จ', 'อำนาจ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีมังกร เสริมความสำเร็จ อำนาจ และความก้าวหน้า' },
    { id: 1011, name: 'ราศีกุมภ์', image: '/wallpapers/ราศีกุมภ์.webp', day: 'aquarius', tags: ['ราศีกุมภ์', 'สร้างสรรค์', 'อัจฉริยะ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีกุมภ์ เสริมความคิดสร้างสรรค์ นวัตกรรม และความเป็นอัจฉริยะ' },
    { id: 1012, name: 'ราศีมีน', image: '/wallpapers/ราศีมีน.webp', day: 'pisces', tags: ['ราศีมีน', 'จิตวิญญาณ', 'เมตตา'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีมีน เสริมญาณทิพย์ พลังจิตวิญญาณ และเมตตา' },
];

// Zodiac wallpaper IDs for cost lookup
const ZODIAC_IDS = new Set(ZODIAC_WALLPAPERS.map(w => w.id));
const getWallpaperCost = (wallpaper: Wallpaper) => ZODIAC_IDS.has(wallpaper.id) ? 10 : 15;

// Tab types
type TabType = 'collection' | 'custom';

function WallpapersContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDay = searchParams.get('day') || 'all';
    const initialTab = (searchParams.get('tab') as TabType) || 'collection';

    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [selectedDay, setSelectedDay] = useState(initialDay);
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>(INITIAL_WALLPAPERS);
    const [zodiacWallpapers, setZodiacWallpapers] = useState<Wallpaper[]>(ZODIAC_WALLPAPERS);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('day');
    const [selectedZodiac, setSelectedZodiac] = useState('all');

    // Fetch Wallpapers from Supabase
    useEffect(() => {
        const fetchWallpapers = async () => {
            try {
                const { data, error } = await supabase
                    .from('wallpapers')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) {
                    console.error('Error fetching wallpapers:', error);
                    // use fallback
                } else if (data && data.length > 0) {
                    setWallpapers(data);
                    setZodiacWallpapers(prev => prev.map(zodiacWallpaper => {
                        const matchedWallpaper = data.find(item => item.id === zodiacWallpaper.id);
                        return matchedWallpaper ? { ...zodiacWallpaper, downloads: matchedWallpaper.downloads } : zodiacWallpaper;
                    }));
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, []);

    // Deep link to wallpaper via ID
    const wallpaperId = searchParams.get('id');
    useEffect(() => {
        if (wallpaperId && wallpapers.length > 0) {
            const wp = wallpapers.find(w => w.id === Number(wallpaperId));
            if (wp) setSelectedWallpaper(wp);
        }
    }, [wallpaperId, wallpapers]);


    // Fetch User Credits
    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('credits, welcome_credits, welcome_credits_granted_at')
                    .eq('id', session.user.id)
                    .maybeSingle();
                if (data) {
                    let total = data.credits ?? 0;
                    if (data.welcome_credits && data.welcome_credits > 0 && data.welcome_credits_granted_at) {
                        const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                        if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                            total += data.welcome_credits;
                        }
                    }
                    setUserCredits(total);
                }
            }
        };
        fetchCredits();
    }, []);

    const filteredWallpapers = wallpapers.filter(wp =>
        selectedDay === 'all' || wp.day === selectedDay || wp.day === 'all'
    );

    const filteredZodiacWallpapers = zodiacWallpapers.filter(wp =>
        selectedZodiac === 'all' || wp.day === selectedZodiac
    );

    const incrementLocalDownloads = (wallpaper: Wallpaper) => {
        if (ZODIAC_IDS.has(wallpaper.id)) {
            setZodiacWallpapers(prev => prev.map(item =>
                item.id === wallpaper.id ? { ...item, downloads: item.downloads + 1 } : item
            ));
            return;
        }

        setWallpapers(prev => prev.map(item =>
            item.id === wallpaper.id ? { ...item, downloads: item.downloads + 1 } : item
        ));
    };

    const handleDownload = async (wallpaper: Wallpaper) => {
        // Dynamic import SweetAlert2
        const Swal = (await import('sweetalert2')).default;

        // 1. Check Auth (Skip if not premium? No, require auth for tracking usually, but for now lets require auth for all as per previous logic)
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
            const COST = getWallpaperCost(wallpaper);

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
            } catch (error) {
                console.error('Deduct error:', error);
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถตัดเครดิตได้ กรุณาลองใหม่', 'error');
                return;
            }
        }

        // 3. Increment Download Count (Realtime)
        try {
            const { error: rpcError } = await supabase.rpc('increment_wallpaper_downloads', { wallpaper_id: wallpaper.id });
            if (!rpcError) {
                incrementLocalDownloads(wallpaper);
            } else {
                console.error("Failed to increment downloads", rpcError);
                if (ZODIAC_IDS.has(wallpaper.id)) {
                    incrementLocalDownloads(wallpaper);
                }
            }
        } catch (e) {
            console.error("Failed to increment downloads", e);
            if (ZODIAC_IDS.has(wallpaper.id)) {
                incrementLocalDownloads(wallpaper);
            }
        }

        // 4. Download Logic
        const link = document.createElement('a');
        link.href = wallpaper.image;
        link.download = `namemongkol-${wallpaper.id}-${Date.now()}.webp`; // Unique name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSelectedWallpaper(prev => prev && prev.id === wallpaper.id
            ? { ...prev, downloads: prev.downloads + 1 }
            : prev
        );

        // Success Message (for premium mostly, but useful for all)
        if (wallpaper.premium) {
            Swal.fire({
                icon: 'success',
                title: 'ดาวน์โหลดสำเร็จ',
                text: `หัก ${getWallpaperCost(wallpaper)} เครดิตเรียบร้อยแล้ว`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });
        }
    };

    return (
        <div className="w-full max-w-[1400px] px-4 pt-24 md:pt-32 pb-28 min-h-screen bg-[#0f172a] text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 animate-gradient-x mb-2">
                            วอลเปเปอร์มงคล เสริมดวงชะตา บารมี และโชคลาภ
                        </h1>
                        <p className="text-slate-400">
                            ยกระดับพลังบวกให้กับชีวิตทุกครั้งที่เปิดหน้าจอมือถือ ด้วยพลังแห่งภาพมงคลและสีมงคลตามวันเกิด
                        </p>
                    </div>

                    {/* Main Tabs */}
                    <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 w-fit">
                        <button
                            onClick={() => setActiveTab('collection')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'collection'
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <ImageIcon size={18} />
                            คอลเลกชันมงคล
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'custom'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Palette size={18} />
                            สร้างวอลเปเปอร์ส่วนตัว
                            <Crown size={14} className="text-amber-400" />
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'collection' ? (
                        <motion.div
                            key="collection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Category Selector */}
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedCategory('day')}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === 'day'
                                                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                                                : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        <Sun size={16} />
                                        ตามวันเกิด
                                    </button>
                                    <button
                                        onClick={() => setSelectedCategory('zodiac')}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === 'zodiac'
                                                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                                                : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        <Star size={16} />
                                        ตามราศี
                                    </button>
                                </div>

                                {/* Day Filter - show when 'day' category is selected */}
                                {selectedCategory === 'day' && (
                                    <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar w-fit">
                                        {DAYS.map((d) => (
                                            <button
                                                key={d.value}
                                                onClick={() => setSelectedDay(d.value)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDay === d.value
                                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Zodiac Filter - show when 'zodiac' category is selected */}
                                {selectedCategory === 'zodiac' && (
                                    <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar">
                                        {ZODIAC_SIGNS.map((z) => (
                                            <button
                                                key={z.value}
                                                onClick={() => setSelectedZodiac(z.value)}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedZodiac === z.value
                                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                <span className="text-base">{z.emoji}</span>
                                                {z.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedCategory === 'day' && loading && (
                                <div className="flex items-center justify-center py-4">
                                    <span className="animate-pulse text-slate-400">กำลังโหลดข้อมูล...</span>
                                </div>
                            )}

                            {/* Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {(selectedCategory === 'day' ? filteredWallpapers : filteredZodiacWallpapers).map((wp) => (
                                    <motion.div
                                        key={wp.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -5 }}
                                        className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-500/50 transition-all duration-300 shadow-xl cursor-pointer"
                                        onClick={() => setSelectedWallpaper(wp)}
                                    >
                                        <Image
                                            src={wp.image}
                                            alt={`วอลเปเปอร์มงคล ${wp.name} สำหรับ${wp.tags.join(' ')}`}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                                        {/* Tags */}
                                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                            {wp.premium && (
                                                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                                                    <Lock size={8} /> PREMIUM
                                                </span>
                                            )}
                                            <span className="bg-black/50 backdrop-blur-md text-white/80 text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                                <Download size={8} /> {wp.downloads.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-3">
                                            <h3 className="text-white font-bold text-sm line-clamp-1 mb-1">{wp.name}</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {wp.tags.map(t => (
                                                    <span key={t} className="text-[9px] text-slate-300 bg-white/10 px-1.5 py-0.5 rounded-md">
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="custom"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StandaloneWallpaperGenerator />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal - Only show in collection tab */}
                {activeTab === 'collection' && selectedWallpaper && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedWallpaper(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-sm md:max-w-5xl h-[85vh] md:h-[80vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Image Section */}
                            <div className="relative w-full h-[55%] md:h-full md:w-1/2 bg-black flex items-center justify-center overflow-hidden group">
                                {/* Blur Background - decorative, same as main image */}
                                <div className="absolute inset-0 opacity-30 blur-xl scale-110" aria-hidden="true">
                                    <Image
                                        src={selectedWallpaper.image}
                                        alt=""
                                        role="presentation"
                                        aria-hidden="true"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Main Image */}
                                <div className="relative w-full h-full p-4 md:p-6 transition-transform duration-500 group-hover:scale-105">
                                    <Image
                                        src={selectedWallpaper.image}
                                        alt={`วอลเปเปอร์มงคล ${selectedWallpaper.name} สำหรับ${selectedWallpaper.tags.join(' ')}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain drop-shadow-2xl"
                                    />
                                </div>

                                <button
                                    onClick={() => setSelectedWallpaper(null)}
                                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-colors border border-white/10"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 flex flex-col justify-between p-6 md:p-10 bg-slate-900/95 md:border-l border-white/5 overflow-y-auto">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            {selectedWallpaper.premium ? (
                                                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                                    <Lock size={10} /> PREMIUM
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit border border-emerald-500/20">
                                                    <Sparkles size={10} /> FREE
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-white/5 rounded-full border border-white/5 uppercase">
                                                {selectedWallpaper.day === 'all' ? 'All Days' : selectedWallpaper.day}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-white/5 rounded-full border border-white/5 flex items-center gap-1">
                                                <Download size={10} /> {selectedWallpaper.downloads.toLocaleString()} ครั้ง
                                            </span>
                                        </div>
                                        <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                            {selectedWallpaper.name}
                                        </h2>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedWallpaper.tags.map(t => (
                                                <span key={t} className="text-xs md:text-sm text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                        <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                                            <Sparkles size={14} /> คุณสมบัติมงคล
                                        </h4>
                                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                                            {selectedWallpaper.description ? selectedWallpaper.description : `ภาพมงคลเสริมพลังด้าน ${selectedWallpaper.tags.join(' และ ')}
                                            ออกแบบตามหลักทักษาและเลขศาสตร์เพื่อดึงดูดพลังงานบวกสูงสุด`}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                                    {selectedWallpaper.premium && (
                                        <div className="flex justify-between items-center text-sm md:text-base">
                                            <span className="text-slate-400">ราคาดาวน์โหลด</span>
                                            <div className="text-right">
                                                <span className="font-bold text-amber-500 text-xl">{getWallpaperCost(selectedWallpaper)}</span>
                                                <span className="ml-1 text-xs text-slate-500">Credits</span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleDownload(selectedWallpaper)}
                                        data-track="wallpapers.detail.download"
                                        className={`w-full py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedWallpaper.premium
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 ring-4 ring-amber-500/10'
                                            : 'bg-white text-black hover:bg-slate-100 shadow-lg shadow-white/10'
                                            }`}
                                    >
                                        <Download size={20} />
                                        {selectedWallpaper.premium ? `แลกด้วย ${getWallpaperCost(selectedWallpaper)} เครดิต` : 'ดาวน์โหลดฟรี'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function WallpapersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div></div>}>
            <WallpapersContent />
        </Suspense>
    );
}
