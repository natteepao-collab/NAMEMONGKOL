import React from 'react';
import Link from 'next/link';
import { Sparkles, Sun, Heart, UserCheck, Star, Users, Target, LayoutDashboard, Search, Layers, ChevronLeft, Calendar, Infinity as InfinityIcon, Cpu, ShieldCheck, Zap, Lock, Quote } from 'lucide-react';

const AboutSection = () => {
    return (
        <section className="relative w-full max-w-[1400px] px-4 min-h-screen bg-slate-900 text-white overflow-hidden pt-24 md:pt-36 pb-20 font-sans">
            {/* Background Neon Accents */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl relative z-10 space-y-20 md:space-y-32">

                {/* 1. Header & Navigation */}
                <div className="space-y-8">
                    <div className="flex justify-start">
                        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>กลับหน้าหลัก</span>
                        </Link>
                    </div>

                    <div className="text-center space-y-6 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm text-sm text-emerald-400 mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>The Science of Naming</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                            เกี่ยวกับ NAMEMONGKOL <br className="hidden md:block" />
                            <span className="text-slate-300 text-2xl md:text-4xl lg:text-5xl font-medium block mt-4">ผสานภูมิปัญญาโบราณ เข้ากับเทคโนโลยีแห่งอนาคต</span>
                        </h1>

                        <div className="max-w-3xl mx-auto mt-8">
                            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                                แพลตฟอร์มวิเคราะห์ชื่อมงคลอัจฉริยะ ที่ช่วยให้คุณค้นพบ "ชื่อที่ใช่"
                                ผ่านการคำนวณที่แม่นยำ ละเอียด และเป็นกลางที่สุด
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Stats Bar (New Credibility Boost) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5 bg-white/[0.02]">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center text-emerald-400 mb-2">
                            <Layers size={28} />
                        </div>
                        <h4 className="text-3xl font-bold text-white">4</h4>
                        <p className="text-sm text-slate-400">ศาสตร์มงคลชั้นสูง</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="flex justify-center text-blue-400 mb-2">
                            <Cpu size={28} />
                        </div>
                        <h4 className="text-3xl font-bold text-white">100%</h4>
                        <p className="text-sm text-slate-400">ขับเคลื่อนด้วย AI</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="flex justify-center text-amber-400 mb-2">
                            <Zap size={28} />
                        </div>
                        <h4 className="text-3xl font-bold text-white">24/7</h4>
                        <p className="text-sm text-slate-400">ใช้งานได้ทันที</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="flex justify-center text-purple-400 mb-2">
                            <Lock size={28} />
                        </div>
                        <h4 className="text-3xl font-bold text-white">Private</h4>
                        <p className="text-sm text-slate-400">ข้อมูลส่วนตัวปลอดภัย</p>
                    </div>
                </div>

                {/* 3. Mission Section */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-emerald-500 rounded-3xl opacity-20 blur-2xl transform -rotate-3"></div>
                        <div className="glass-card relative rounded-3xl p-10 border border-white/10 overflow-hidden">
                            <Target className="text-emerald-500 mb-6" size={48} />
                            <h2 className="text-3xl font-bold mb-6 text-white">
                                ภารกิจของเรา (Our Mission)
                            </h2>
                            <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                                <p>
                                    NAMEMONGKOL เกิดขึ้นจากความตั้งใจที่จะทำให้ศาสตร์การ <strong>"ตั้งชื่อ"</strong> ที่ดูยุ่งยากและซับซ้อน
                                    กลายเป็นเรื่องที่ <strong>"เข้าถึงง่าย"</strong> สำหรับทุกคน
                                </p>
                                <p>
                                    เราเชื่อว่าทุกคนสมควรได้รับเริ่มต้นชีวิตที่ดี หรือจุดเปลี่ยนชีวิตที่ทรงพลัง
                                    ผ่านชื่อที่เป็นสิริมงคล โดยไม่ต้องพึ่งพาความเชื่อที่ตรวจสอบไม่ได้
                                    แต่พิสูจน์ได้ด้วยหลักการคำนวณที่ชัดเจน
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-8">
                        <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">ชื่อเปลี่ยน</span> <br />
                            <span className="text-emerald-400">ชีวิตเปลี่ยน</span>
                        </h3>
                        <p className="text-slate-400 text-lg border-l-4 border-emerald-500 pl-6 py-2 italic bg-slate-800/30 rounded-r-xl">
                            "ชื่อไม่ใช่แค่ป้ายชื่อ แต่คือบทสวดมนต์บทแรกที่เราได้ยินทุกวัน เมื่อชื่อดี พลังงานดี ชีวิตย่อมหมุนไปในทิศทางที่ดี"
                        </p>
                    </div>
                </div>

                {/* 4. Philosophy Section (New Depth) */}
                <div className="relative rounded-3xl overflow-hidden py-16 px-6 md:px-20 text-center border border-white/5 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950"></div>
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Quote size={200} />
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                        <h2 className="text-2xl md:text-3xl font-serif italic text-amber-200/90">
                            "ปรัชญาของเราคือความสมดุล"
                        </h2>
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-light">
                            เราไม่ได้มุ่งเน้นแค่เลขผลรวมที่สูงที่สุด แต่เรามุ่งหา <strong>"ความพอดี"</strong> ที่สุดสำหรับคุณ
                            เหมือนการตัดชุดสูทที่พอดีตัว ไม่คับไป ไม่หลวมไป
                            สอดคล้องกับวันเกิดและนามสกุลของคุณอย่างลงตัว นั่นคือความมงคลที่ยั่งยืน
                        </p>
                        <div className="pt-4">
                            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* 5. Analysis Principles (4 Cards) */}
                <section>
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-4 border border-blue-500/20">
                            CORE TECHNOLOGY
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">4 เสาหลักแห่งการวิเคราะห์</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            เราวิเคราะห์ลึกซึ้งถึง 4 ศาสตร์สำคัญ เพื่อให้ได้ชื่อที่เป็นมงคลและทรงพลังที่สุด
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {/* Feature 1: Thaksa */}
                        {/* Feature 1: Thaksa */}
                        <Link href="/?tab=thaksa#knowledge-section" className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-blue-500/30 group relative overflow-hidden block">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                                <Calendar size={100} />
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20">
                                <Calendar className="text-blue-400" size={28} />
                            </div>
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <h3 className="text-xl font-bold text-white">1. ทักษาปกรณ์</h3>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-700/50 border border-slate-600/50 text-xs font-medium text-slate-300">
                                    อ่านเพิ่มเติม
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                วิเคราะห์จาก &quot;วันเกิด&quot; เพื่อหาอักษรที่เป็นเดช ศรี มนตรี และหลีกเลี่ยงกาลกิณี
                                เปรียบเสมือนการวางเสาเข็มบ้านให้มั่นคง ปลอดภัยจากอุปสรรค
                            </p>
                        </Link>

                        {/* Feature 2: Numerology */}
                        {/* Feature 2: Numerology */}
                        <Link href="/?tab=numerology#knowledge-section" className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-violet-500/30 group relative overflow-hidden block">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform -rotate-12">
                                <Sparkles size={100} />
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-violet-900/20">
                                <Sparkles className="text-violet-400" size={28} />
                            </div>
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <h3 className="text-xl font-bold text-white">2. เลขศาสตร์</h3>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-700/50 border border-slate-600/50 text-xs font-medium text-slate-300">
                                    อ่านเพิ่มเติม
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                คำนวณพลังงานตัวเลขจากผลรวมของชื่อ เพื่อดึงดูดโชคลาภ ความสำเร็จ
                                และกำหนดเส้นทางชีวิตให้รุ่งโรจน์ตามดวงดาว
                            </p>
                        </Link>

                        {/* Feature 3: Ayatana 6 */}
                        {/* Feature 3: Ayatana 6 */}
                        <Link href="/?tab=ayatana#knowledge-section" className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-rose-500/30 group relative overflow-hidden block">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-6">
                                <Heart size={100} />
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-rose-900/20">
                                <Heart className="text-rose-400" size={28} />
                            </div>
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <h3 className="text-xl font-bold text-white">3. อายตนะ 6</h3>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-700/50 border border-slate-600/50 text-xs font-medium text-slate-300">
                                    อ่านเพิ่มเติม
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                ศาสตร์แห่งความรู้สึกและการยอมรับ เสริมดวงด้านเมตตามหานิยม
                                ให้เป็นที่รักของผู้คน เจ้านายเอ็นดู ลูกน้องเคารพ
                            </p>
                        </Link>

                        {/* Feature 4: Nirun Sastra (Eternity) */}
                        {/* Feature 4: Nirun Sastra (Eternity) */}
                        <Link href="/?tab=nirun#knowledge-section" className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-amber-500/30 group relative overflow-hidden block">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform -rotate-6">
                                <InfinityIcon size={100} />
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-900/20">
                                <InfinityIcon className="text-amber-400" size={28} />
                            </div>
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <h3 className="text-xl font-bold text-white">4. นิรันดร์ศาสตร์</h3>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-700/50 border border-slate-600/50 text-xs font-medium text-slate-300">
                                    อ่านเพิ่มเติม
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                ศาสตร์ชั้นสูงที่ช่วย &quot;ตรึง&quot; ความดีงามให้ยั่งยืน คำนวณความสมพงศ์ระหว่างชื่อและนามสกุล
                                เพื่อความสำเร็จที่มั่นคง ไม่ฉาบฉวย
                            </p>
                        </Link>
                    </div>

                    {/* Feature 5: Phone Analysis (New) */}
                    <div className="mt-8">
                        <Link href="/phone-analysis" className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-emerald-500/30 group relative overflow-hidden block">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-0">
                                <Cpu size={120} />
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="shrink-0 w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20">
                                    <Cpu className="text-emerald-400" size={40} />
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <h3 className="text-2xl font-bold text-white">5. วิเคราะห์เบอร์โทรศัพท์ (Phone Analysis)</h3>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 animate-pulse">
                                            NEW
                                        </span>
                                    </div>
                                    <p className="text-slate-400 max-w-2xl leading-relaxed">
                                        ขยายขอบเขตความมงคลสู่การสื่อสาร ระบบวิเคราะห์เบอร์โทรศัพท์เจาะลึกทุกคู่เลข
                                        ทำนายผลรวม และเกรดความมงคล เพื่อช่วยส่งเสริมโชคลาภและการติดต่อสื่อสารให้ราบรื่น
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all font-medium">
                                        วิเคราะห์เบอร์ฟรี <ChevronLeft className="rotate-180" size={18} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* 5.5 How It Works (GEO Optimized - Procedures) */}
                <section className="relative z-10 py-12 border-t border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">ขั้นตอนการใช้งาน</h2>
                        <p className="text-slate-400">ง่ายๆ ใน 3 ขั้นตอน เพื่อค้นหาคำตอบของชีวิต</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="relative group p-6 rounded-2xl bg-slate-800/20 border border-white/5 hover:border-emerald-500/20 transition-all text-center">
                            <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform">1</div>
                            <h3 className="text-lg font-bold text-white mb-2">กรอกข้อมูล</h3>
                            <p className="text-slate-400 text-sm">ระบุชื่อ นามสกุล และวันเกิด ของคุณในแบบฟอร์ม</p>
                        </div>
                        <div className="relative group p-6 rounded-2xl bg-slate-800/20 border border-white/5 hover:border-emerald-500/20 transition-all text-center">
                            <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform">2</div>
                            <h3 className="text-lg font-bold text-white mb-2">AI ประมวลผล</h3>
                            <p className="text-slate-400 text-sm">ระบบคำนวณด้วย 4 ศาสตร์มงคล (เลขศาสตร์, ทักษา, อายตนะ, นิรันดร์)</p>
                        </div>
                        <div className="relative group p-6 rounded-2xl bg-slate-800/20 border border-white/5 hover:border-emerald-500/20 transition-all text-center">
                            <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform">3</div>
                            <h3 className="text-lg font-bold text-white mb-2">รับคำทำนาย</h3>
                            <p className="text-slate-400 text-sm">อ่านผลวิเคราะห์ พร้อมคำแนะนำและเกรดมงคลทันที</p>
                        </div>
                    </div>
                </section>

                {/* 6. Why Choose Us (Enhanced Credibility) */}
                <section className="relative overflow-hidden rounded-3xl bg-slate-800/20 border border-white/5 p-8 md:p-12">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">ทำไมต้องเลือกเรา?</h2>
                    </div>

                    <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
                        {/* Point 1: Data & AI */}
                        <div className="space-y-4 group">
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-blue-500/5">
                                <Cpu className="text-blue-400" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-white mt-4">แม่นยำด้วย Data & AI</h3>
                            <p className="text-slate-400 text-sm leading-relaxed px-2">
                                เราไม่ได้ใช้แค่ตำราเล่มเดียว แต่ประมวลผลจากฐานข้อมูลชื่อนับแสน
                                ผสาน AI เพื่อผลลัพธ์ที่ถูกต้องสูงสุด
                            </p>
                        </div>

                        {/* Point 2: All in One */}
                        <div className="space-y-4 group">
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-amber-500/5">
                                <Layers className="text-amber-400" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-white mt-4">ครบจบในที่เดียว</h3>
                            <p className="text-slate-400 text-sm leading-relaxed px-2">
                                วิเคราะห์พร้อมกันทั้ง 4 ศาสตร์ ไม่ซับซ้อน เข้าใจง่าย
                                ประหยัดเวลาของคุณ
                            </p>
                        </div>

                        {/* Point 3: Neutral & Transparent */}
                        <div className="space-y-4 group">
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-emerald-500/5">
                                <ShieldCheck className="text-emerald-400" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-white mt-4">เป็นกลางและโปร่งใส</h3>
                            <p className="text-slate-400 text-sm leading-relaxed px-2">
                                ระบบวิเคราะห์ตามหลักการจริง ไม่มีอคติ หรือการตลาดแอบแฝง
                                เราให้ข้อมูลตรงไปตรงมา
                            </p>
                        </div>
                    </div>
                </section>

                {/* 7. Target Audience */}
                <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden bg-slate-900/50 border border-white/5">
                    <div className="relative z-10 space-y-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">NAMEMONGKOL เหมาะกับใคร?</h2>
                            <p className="text-slate-400">ตอบโจทย์ทุกความต้องการในทุกช่วงจังหวะชีวิต</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300 border-2 border-transparent hover:border-pink-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-pink-500/10 rounded-xl">
                                        <Users className="text-pink-400" size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg">คุณพ่อคุณแม่มือใหม่</h4>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    ที่กำลังมองหาไอเดีย <strong>ตั้งชื่อลูก</strong> ให้มีความหมายดี เป็นสิริมงคล เป็นของขวัญชิ้นแรกให้ลูกรัก
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300 border-2 border-transparent hover:border-blue-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <UserCheck className="text-blue-400" size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg">ผู้ที่ต้องการเปลี่ยนชื่อ</h4>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    เพื่อแก้เคล็ด เสริมดวงชะตา พลิกชีวิตจากร้ายกลายเป็นดี หรือเริ่มต้นชีวิตใหม่ที่มั่นใจกว่าเดิม
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300 border-2 border-transparent hover:border-amber-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-amber-500/10 rounded-xl">
                                        <Star className="text-amber-400" size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg">สายมูเตลูและนักธุรกิจ</h4>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    ที่เชื่อในพลังของตัวเลข ต้องการเสริมบารมี อำนาจ และโชคลาภในการทำธุรกิจ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8. Final CTA Section */}
                <section className="relative rounded-3xl overflow-hidden border border-amber-500/30">
                    <div className="absolute inset-0 bg-slate-900"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>

                    {/* Glow Effects */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 p-12 md:p-20 text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                            พร้อมเปลี่ยนชื่อ <span className="text-amber-400">เปลี่ยนชีวิต</span> หรือยัง?
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                            อย่าปล่อยให้โชคชะตาเป็นเรื่องบังเอิญ เริ่มต้นค้นหาชื่อมงคลของคุณด้วยระบบอัจฉริยะของเราได้ทันที
                        </p>

                        <div className="pt-8">
                            <Link href="/" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 text-xl font-bold rounded-full transition-all hover:scale-105 shadow-2xl shadow-amber-900/40 ring-4 ring-amber-500/20">
                                <Search size={26} />
                                วิเคราะห์ชื่อของคุณฟรี
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SEO Hidden Content */}
                <div className="sr-only">
                    <h2>คำถามที่พบบ่อยเกี่ยวกับ ชื่อมงคล</h2>
                    <p>
                        ต้องการ ดูดวงชื่อ หรือหา นามสกุลมงคล ใช่ไหม?
                        เรามีบริการ วิเคราะห์ชื่อ ฟรี ด้วยโปรแกรมอัจฉริยะ
                        ช่วย ตั้งชื่อลูก เปลี่ยนชื่อ ให้ถูกโฉลก
                        เสริมดวงด้วย เลขศาสตร์ และ ทักษาปกรณ์
                        ป้องกันอักษร กาลกิณี
                    </p>
                </div>

            </div >
        </section >
    );
};

export default AboutSection;
