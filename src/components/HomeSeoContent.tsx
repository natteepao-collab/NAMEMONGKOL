'use client';

import React from 'react';
import { Book, Star, Shield, TrendingUp } from 'lucide-react';

export const HomeSeoContent = () => {
    return (
        <section className="w-full max-w-4xl mx-auto mt-16 mb-12 px-4">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        ทำไมต้องวิเคราะห์ชื่อมงคล?
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        <strong>"ชื่อ"</strong> ไม่ใช่แค่คำเรียกขาน แต่คือ <strong>"พลังงาน"</strong> ที่สั่นสะเทือนอยู่ตลอกเวลาตามหลักเลขศาสตร์ ดวงดาวบนฟากฟ้าอาจกำหนดชะตาเกิด (Karma) แต่ชื่อคือกุญแจที่เราเลือกเองได้เพื่อไขประตูสู่โอกาสใหม่ๆ
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        การวิเคราะห์ชื่อฟรีที่ <strong>NameMongkol</strong> ช่วยให้คุณ "รู้ทันดวงชะตา" จุดอ่อน-จุดแข็ง และโอกาสซ่อนเร้น เพื่อให้คุณพร้อมรับมือและดึงดูดความสำเร็จเข้ามาในชีวิต
                    </p>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        เปลี่ยนชื่อ = เปลี่ยนชีวิตจริงไหม?
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        โบราณว่า <i>"ชื่อดีเป็นศรีแก่ตัว"</i> การเปลี่ยนชื่อที่ถูกต้องตามหลักทักษาและเลขศาสตร์ เปรียบเสมือนการปรับจูนคลื่นความถี่ของชีวิตใหม่ ช่วยเสริมความมั่นใจ ดึงดูดมิตรดีๆ และโอกาสทางการงาน
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        แม้ชื่อไม่ใช่ทุกอย่าง แต่ชื่อที่ดีจะเป็น <strong>"แรงลมใต้ปีก"</strong> ที่ช่วยพยุงให้คุณบินได้สูงขึ้นและไกลกว่าเดิม เหนื่อยน้อยลง แต่สำเร็จมากขึ้น
                    </p>
                </div>
            </div>

            <div className="mb-16">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold border border-blue-500/20 mb-4 inline-block">
                        มาตรฐานโหราศาสตร์ไทย
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">เจาะลึก 4 ศาสตร์ศักดิ์สิทธิ์ที่ใช้คำนวณ</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        เราไม่ได้ใช้แค่โปรแกรมสุ่ม แต่ประมวลผลด้วย 4 ตำราเอกของไทย เพื่อความแม่นยำระดับเดียวกับให้เกจิอาจารย์ตั้งให้
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-amber-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">1</div>
                        <h3 className="font-bold text-lg text-white mb-2">เลขศาสตร์</h3>
                        <p className="text-sm text-slate-400">
                            แปลงค่าอักษรเป็นตัวเลข เพื่อดูอิทธิพลดาวเคราะห์ที่ส่งผลต่อเจ้าชะตา (ผลรวมที่ดี เช่น 14, 15, 24, 45, 59)
                        </p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">2</div>
                        <h3 className="font-bold text-lg text-white mb-2">ทักษาปกรณ์</h3>
                        <p className="text-sm text-slate-400">
                            ภูมิพยากรณ์ประจำวันเกิด หาอักษรที่เป็น "เดช" "ศรี" "มนตรี" และหลีกเลี่ยง "กาลกิณี" อย่างเด็ดขาด
                        </p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-rose-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform">3</div>
                        <h3 className="font-bold text-lg text-white mb-2">อายตนะ 6</h3>
                        <p className="text-sm text-slate-400">
                            ศาสตร์แห่งการยอมรับทางสังคม สะท้อนว่าคนรอบข้างมองเราอย่างไร (เปรียบเทียบกับคน 9 ประเภท เช่น ราชินี, เศรษฐี)
                        </p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">4</div>
                        <h3 className="font-bold text-lg text-white mb-2">นิรันดร์ศาสตร์</h3>
                        <p className="text-sm text-slate-400">
                            หัวใจสำคัญ! ตรวจสอบความสมพงศ์ระหว่าง "ชื่อต้น" และ "นามสกุล" ให้อยู่ร่วมกันแล้วส่งเสริมกัน ไม่ขัดแย้ง
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                    <Book className="w-6 h-6 text-amber-500" />
                    ศัพท์น่ารู้ก่อนตั้งชื่อมงคล (ทักษา)
                </h2>

                <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12 relative z-10">
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold h-fit shrink-0">ศรี</span>
                            <div>
                                <strong className="text-slate-200 block">หมายถึง โชคลาภ เงินทอง เสน่ห์</strong>
                                <p className="text-sm text-slate-400">อักษรที่ช่วยดึงดูดทรัพย์สิน ความสำเร็จ และความเมตตาจากผู้คน</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-bold h-fit shrink-0">เดช</span>
                            <div>
                                <strong className="text-slate-200 block">หมายถึง อำนาจ วาสนา บารมี</strong>
                                <p className="text-sm text-slate-400">อักษรที่ส่งเสริมความเป็นผู้นำ เกียรติยศ และทำให้คนเกรงใจ</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-bold h-fit shrink-0">มนตรี</span>
                            <div>
                                <strong className="text-slate-200 block">หมายถึง ผู้ใหญ่ช่วยเหลือ</strong>
                                <p className="text-sm text-slate-400">อักษรที่ทำให้ได้รับความเอ็นดูจากเจ้านาย มีคนอุปถัมภ์ค้ำชู</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs font-bold h-fit shrink-0">บริวาร</span>
                            <div>
                                <strong className="text-slate-200 block">หมายถึง ครอบครัว คนใต้ปกครอง</strong>
                                <p className="text-sm text-slate-400">อักษรที่ส่งผลต่อลูกน้อง คู่ครอง และบุตรหลานให้อยู่ในโอวาท</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-bold h-fit shrink-0">อายุ</span>
                            <div>
                                <strong className="text-slate-200 block">หมายถึง สุขภาพ ความเป็นอยู่</strong>
                                <p className="text-sm text-slate-400">อักษรที่ช่วยคุ้มครองดวงชะตาให้แคล้วคลาด สุขภาพแข็งแรง</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold h-fit shrink-0">กาลกิณี</span>
                            <div>
                                <strong className="text-red-400 block">หมายถึง อุปสรรค ความโชคร้าย!!</strong>
                                <p className="text-sm text-slate-400">อักษรต้องห้ามประจำวันเกิด ที่จะนำพาความติดขัดและศัตรูมาให้</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
