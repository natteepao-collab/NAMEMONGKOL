import React from 'react';
import Link from 'next/link';
import { Sparkles, Sun, Heart, UserCheck, Star, Users, Target, LayoutDashboard, Search, Layers, ChevronLeft } from 'lucide-react';

const AboutSection = () => {
    return (
        <section className="relative w-full min-h-screen bg-slate-900 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Background Neon Accents */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-24">

                {/* Back Button */}
                <div className="flex justify-start">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>กลับหน้าหลัก</span>
                    </Link>
                </div>

                {/* Header & Intro */}
                <div className="text-center space-y-6 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm text-sm text-emerald-400 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>The Science of Naming</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                        เกี่ยวกับ NAMEMONGKOL <br className="hidden md:block" />
                        <span className="text-slate-300">ผสานศาสตร์แห่งตัวเลขและทักษาปกรณ์</span> <br className="hidden md:block" />
                        เพื่อ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-violet-500 font-bold">"ชื่อมงคล"</span> ของคุณ
                    </h1>

                    <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-4xl mx-auto border border-white/5 mt-10 shadow-2xl">
                        <p className="text-slate-300 leading-relaxed text-lg text-left indent-8">
                            ยินดีต้อนรับสู่ <strong>NAMEMONGKOL</strong> แพลตฟอร์มวิเคราะห์ชื่อและนามสกุลอัจฉริยะ
                            เราเชื่อว่า "ชื่อ" คือพรข้อแรกของชีวิตและเป็นจุดเริ่มต้นของความสำเร็จ
                            เราจึงพัฒนาระบบที่รวบรวมหลักการทางโหราศาสตร์ไทยโบราณ ผสมผสานกับเทคโนโลยีการคำนวณที่แม่นยำ
                            เพื่อช่วยให้คุณค้นหา <strong>ชื่อมงคล</strong> ที่สมพงศ์กับดวงชะตาที่สุด
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-emerald-500 rounded-2xl opacity-20 blur-xl transform -rotate-3"></div>
                        <div className="glass-card relative rounded-2xl p-8 md:p-10 border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Target size={120} />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <Target className="text-emerald-400" /> ภารกิจของเรา (Our Mission)
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                เป้าหมายของ NAMEMONGKOL คือการทำให้ศาสตร์การ <strong>ตั้งชื่อลูก</strong> และการ <strong>เปลี่ยนชื่อ</strong>
                                เป็นเรื่องที่เข้าถึงง่าย เข้าใจง่าย ไม่ซับซ้อน แต่ยังคงความละเอียดแม่นยำตามตำราอาจารย์
                                เรามุ่งมั่นที่จะเป็นตัวช่วยอันดับหนึ่งสำหรับคุณพ่อคุณแม่มือใหม่ และผู้ที่ต้องการเสริมสิริมงคลให้ชีวิตผ่านพลังของตัวเลขและอักขระ
                            </p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Your Name, <br /> Your Destiny
                        </h3>
                        <p className="text-slate-400 text-lg">
                            ชื่อเปลี่ยน ชีวิตเปลี่ยน เริ่มต้นก้าวแรกสู่ความสำเร็จด้วยชื่อที่ใช่
                            ออกแบบมาเพื่อคุณโดยเฉพาะ
                        </p>
                    </div>
                </div>

                {/* Features (Analysis Principles) */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">หลักการวิเคราะห์ของเรา</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            ระบบของเราไม่ได้เพียงแค่ดูผลรวมตัวเลข แต่เราวิเคราะห์ลึกซึ้งถึง 3 องค์ประกอบหลัก
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Feature 1: Numerology */}
                        <div className="glass-card p-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-emerald-500/30 group">
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">เลขศาสตร์มงคล</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                (Numerology) วิเคราะห์พลังของตัวเลขในชื่อและนามสกุล ทั้งผลรวมชื่อ ผลรวมนามสกุล และผลรวมรวม
                                เพื่อทำนายพื้นฐานดวงชะตา ความรัก การงาน และการเงิน
                            </p>
                        </div>

                        {/* Feature 2: Thaksa */}
                        <div className="glass-card p-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-violet-500/30 group">
                            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sun className="text-violet-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">หลักทักษาปกรณ์</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                ตรวจสอบอักษรที่เป็นบริวาร อายุ เดช ศรี มูละ อุตสาหะ และมนตรี ตามวันเกิด
                                เพื่อหลีกเลี่ยงอักษร <strong>กาลกิณี</strong> ที่อาจเป็นอุปสรรคต่อดวงชะตา
                            </p>
                        </div>

                        {/* Feature 3: Ayatana 6 */}
                        <div className="glass-card p-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-rose-500/30 group">
                            <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Heart className="text-rose-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">อายตนะ 6</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                ศาสตร์การตั้งชื่อที่เน้นเรื่องความรู้สึกของผู้คนที่มีต่อเจ้าของชื่อ
                                เสริมเสน่ห์ เมตตามหานิยม และบารมี
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="relative overflow-hidden rounded-3xl bg-slate-800/20 border border-white/5 p-8 md:p-12">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">ทำไมต้องเลือกเรา?</h2>
                    </div>

                    <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-4">
                            <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
                                <LayoutDashboard className="text-blue-400" size={28} />
                            </div>
                            <h3 className="text-xl font-semibold">ใช้งานง่าย & ทันสมัย</h3>
                            <p className="text-slate-400 text-sm">
                                หน้าจอแสดงผลแบบ Dashboard ดูง่าย สรุปผลวิเคราะห์เป็นคะแนนและกราฟิกที่สวยงาม
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Search className="text-purple-400" size={28} />
                            </div>
                            <h3 className="text-xl font-semibold">เจาะลึกทุกมิติ</h3>
                            <p className="text-slate-400 text-sm">
                                ไม่ใช่แค่บอกว่าดีหรือไม่ดี แต่บอกรายละเอียดถึงความหมาย อักษรนำโชค และคู่เลขมงคล
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Layers className="text-emerald-400" size={28} />
                            </div>
                            <h3 className="text-xl font-semibold">ครอบคลุม</h3>
                            <p className="text-slate-400 text-sm">
                                รองรับการ <strong>วิเคราะห์ชื่อ</strong> ทั้งชื่อจริงและ <strong>นามสกุลมงคล</strong> อย่างครบถ้วน
                            </p>
                        </div>
                    </div>
                </section>

                {/* Target Audience */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-10">
                        <h2 className="text-3xl font-bold text-center mb-8">NAMEMONGKOL เหมาะกับใคร?</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="glass-card p-6 rounded-xl flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-pink-500/20 rounded-lg">
                                        <Users className="text-pink-400" size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg">คุณพ่อคุณแม่มือใหม่</h4>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    ที่กำลังมองหาไอเดีย <strong>ตั้งชื่อลูก</strong> ให้มีความหมายดี เป็นสิริมงคล และถูกต้องตามหลักทักษาประจำวันเกิด
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="glass-card p-6 rounded-xl flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <UserCheck className="text-blue-400" size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg">ผู้ที่ต้องการเปลี่ยนชื่อ</h4>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    เพื่อแก้เคล็ด เสริมดวงชะตา พลิกชีวิตจากร้ายกลายเป็นดี
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="glass-card p-6 rounded-xl flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-amber-500/20 rounded-lg">
                                        <Star className="text-amber-400" size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg">สายมูเตลูและนักลงทุน</h4>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    ที่เชื่อในพลังของตัวเลขและการวิเคราะห์ดวงชะตาเพื่อความมั่นใจในการดำเนินชีวิต
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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

            </div>
        </section>
    );
};

export default AboutSection;
