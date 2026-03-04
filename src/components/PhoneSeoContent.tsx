import React from 'react';
import { Zap, Heart, Shield, Star, Sparkles, Target, Award, Banknote, Users, AlertTriangle } from 'lucide-react';

export const PhoneSeoContent = () => {
    return (
        <section className="w-full max-w-5xl mx-auto mt-16 mb-12 px-4">
            {/* Hero Content Section */}
            <div className="text-center mb-16">
                <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20 mb-6 inline-block">
                    🔢 ศาสตร์แห่งตัวเลข
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    ปลดล็อกพลังซ่อนเร้นใน<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">เบอร์โทรศัพท์</span>ของคุณ
                </h2>
                <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
                    คุณทราบหรือไม่? ตัวเลขที่คุณใช้โทรทุกวัน กำลังส่งพลังงานสั่นสะเทือนมาถึงคุณตลอดเวลา
                    เบอร์โทรศัพท์ไม่ใช่แค่ตัวเลขสุ่ม แต่คือ <strong>&quot;คลื่นพลังงาน&quot;</strong> ที่มีผลต่อ
                    <strong className="text-amber-400"> ความสำเร็จ การเงิน ความรัก และสุขภาพ</strong> ของคุณโดยตรง!
                </p>
            </div>

            {/* Why Phone Number Matters */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-amber-500/30 transition-colors">
                    <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6" />
                        ทำไมต้องเช็คเบอร์มงคล?
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        ตามหลัก <strong>เลขศาสตร์</strong> และ <strong>โหราศาสตร์ไทย</strong> ตัวเลขแต่ละตัวมีความถี่พลังงานเฉพาะตัว
                        เบอร์โทรศัพท์ที่คุณใช้ทุกวัน จะส่งคลื่นพลังงานมากระทบชีวิตคุณตลอดเวลา ไม่ว่าจะรู้ตัวหรือไม่ก็ตาม
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        <strong>เบอร์มงคล</strong> จะช่วยดึงดูดโอกาสดีๆ ความเจริญก้าวหน้า และความราบรื่นเข้ามา
                        ในขณะที่ <strong className="text-rose-400">เบอร์อัปมงคล</strong> อาจเป็นอุปสรรคขัดขวางที่มองไม่เห็น
                        ทำให้ต้องเหนื่อยมากกว่าปกติ หรือพลาดโอกาสดีๆ ไปอย่างน่าเสียดาย
                    </p>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
                    <h3 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        วิเคราะห์เบอร์ลึกถึงแก่นแท้
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        ระบบของ <strong>NameMongkol</strong> ไม่ได้แค่ดูผลรวม แต่วิเคราะห์ลึกถึง <strong>คู่เลข 7 ตัวหลัง</strong>
                        (XX-XYZ-ABCD) ซึ่งเป็นหัวใจสำคัญของเบอร์โทรศัพท์ไทย
                    </p>
                    <ul className="space-y-2 text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>วิเคราะห์ <strong>คู่เลข</strong> ทั้งหมดและความหมาย</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>ประเมิน <strong>ผลรวม</strong> ตามหลักเลขศาสตร์</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>แสดง <strong>กราฟพลังงาน</strong> 6 ด้านของชีวิต</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>ให้ <strong>เกรดเบอร์</strong> ตั้งแต่ A (ดีเยี่ยม) ถึง F (อัปมงคล)</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Number Pair Meanings */}
            <div className="mb-16">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold border border-blue-500/20 mb-4 inline-block">
                        📚 ความรู้เรื่องคู่เลข
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">คู่เลขมงคล vs คู่เลขอัปมงคล</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        เรียนรู้ความหมายของคู่เลขสำคัญ เพื่อเข้าใจพลังงานที่ซ่อนอยู่ในเบอร์โทรศัพท์ของคุณ
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Good Number Pairs */}
                    <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-emerald-500/20 flex flex-col items-center justify-center">
                                <span className="text-emerald-400 text-xl font-bold">91</span>
                                <span className="text-emerald-400/70 text-[10px]">มงคล</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-400">ผู้นำสมัยใหม่ โดดเด่น</h3>
                                <p className="text-xs text-slate-500">ชื่อเสียง, การเป็นที่ยอมรับ</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">มีรสนิยม ทันสมัย ชอบของแบรนด์เนม มีความเป็นผู้นำสูง เด่นดังในสังคม มักเกี่ยวข้องกับต่างชาติหรือเทคโนโลยี</p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400/80">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">ชื่อเสียง</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">ความก้าวหน้า</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-emerald-500/20 flex flex-col items-center justify-center">
                                <span className="text-emerald-400 text-xl font-bold">24</span>
                                <span className="text-emerald-400/70 text-[10px]">มงคล</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-400">เมตตามหานิยม ขุมทรัพย์</h3>
                                <p className="text-xs text-slate-500">การค้าขาย, วาทศิลป์</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">เลขแห่งความรักและความรวย พูดจาเป็นเงินเป็นทอง ผู้คนรักใคร่ เมตตา ค้าขายดีกำไรงาม ชีวิตสมบูรณ์พูนสุข</p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400/80">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">ความรัก</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">การเงินดีเยี่ยม</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-emerald-500/20 flex flex-col items-center justify-center">
                                <span className="text-emerald-400 text-xl font-bold">65</span>
                                <span className="text-emerald-400/70 text-[10px]">มงคล</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-400">คู่ทรัพย์คู่โชค</h3>
                                <p className="text-xs text-slate-500">รวยและฉลาด</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">สุดยอดเลขมงคล หาเงินเก่งด้วยปัญญา บริหารเงินดี ชีวิตสุขสบาย ความรักสมหวัง มีผู้อุปถัมภ์ไม่ขาด</p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400/80">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">รวย</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">โอกาสดีๆ</span>
                        </div>
                    </div>

                    {/* Bad Number Pairs */}
                    <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-rose-500/20 flex flex-col items-center justify-center">
                                <span className="text-rose-400 text-xl font-bold">13</span>
                                <span className="text-rose-400/70 text-[10px]">ระวัง</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-400">อุบัติเหตุ ผ่าตัด</h3>
                                <p className="text-xs text-slate-500">⚠️ เลขแห่งเคราะห์กรรม</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">ชีวิตมักมีเหตุให้เจ็บตัวหรือสูญเสีย ใจร้อน พูดจาโผงผาง คิดมึนทำปั๊บ ชีวิตพลิกผันรวดเร็วทั้งดีและร้าย</p>
                        <div className="flex items-center gap-1.5 text-xs text-rose-400/80">
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">อุบัติเหตุ</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">การผ่าตัด</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-rose-500/20 flex flex-col items-center justify-center">
                                <span className="text-rose-400 text-xl font-bold">67</span>
                                <span className="text-rose-400/70 text-[10px]">ระวัง</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-400">รักร้าว หนี้สิน ทุกข์ระทม</h3>
                                <p className="text-xs text-slate-500">⚠️ ศัตรูการเงิน</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">ผิดหวังความรัก ครอบครัวแตกแยก การเงินติดขัด เป็นหนี้สินง่าย ภายนอกดูดีแต่ภายในสัตกหุ่ม</p>
                        <div className="flex items-center gap-1.5 text-xs text-rose-400/80">
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">บ้านแตก</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">เงินล้มเหลว</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-rose-500/20 flex flex-col items-center justify-center">
                                <span className="text-rose-400 text-xl font-bold">18</span>
                                <span className="text-rose-400/70 text-[10px]">ระวัง</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-400">ถูกหักหลัง คดีความ</h3>
                                <p className="text-xs text-slate-500">⚠️ คนใกล้ตัวทรยศ</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">ใจปักเลง เผด็จการ ยอมหักไม่ยอมงอ มักคิดการใหญ่แต่ถูกคนใกล้ตัวทรยศ ชีวิตวุ่นวาย มีคดีความ หรือถูกโกง</p>
                        <div className="flex items-center gap-1.5 text-xs text-rose-400/80">
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">ถูกโกง</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">เพื่อนทรยศ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        เบอร์มงคลช่วยเสริมดวงด้านไหนบ้าง?
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        เบอร์โทรศัพท์ที่ดีจะส่งพลังงานบวกให้กับชีวิตคุณใน 6 ด้านสำคัญ
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                            <Banknote className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">💰 การเงิน/การงาน</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            ดึงดูดโอกาสทางการเงิน เลื่อนตำแหน่ง ธุรกิจเจริญรุ่งเรือง การค้าขายราบรื่น มีรายได้เข้ามาสม่ำเสมอ
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                            <Star className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">🍀 โชคลาภ</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            เพิ่มโอกาสในการได้รับโชค ลาภลอย สิ่งดีๆ เข้ามาโดยไม่คาดคิด มีคนอุปถัมภ์ช่วยเหลือ
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-rose-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/20 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">💕 เสน่ห์/ความรัก</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            เพิ่มเสน่ห์ดึงดูด เนื้อคู่เข้ามาหา ความรักราบรื่น ครอบครัวอบอุ่น มนุษยสัมพันธ์ดี
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">🏥 สุขภาพ</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            เสริมพลังด้านสุขภาพ ลดความเสี่ยงจากอุบัติเหตุ ความเจ็บป่วย ร่างกายแข็งแรง
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">🧠 สติปัญญา</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            เพิ่มความคิดสร้างสรรค์ การตัดสินใจแม่นยำ เรียนรู้เร็ว ความจำดี
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">👁️ เซนส์/สัมผัสที่ 6</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            เสริมสัญชาตญาณ หลีกเลี่ยงอันตราย มองคนออก ตัดสินใจได้ถูกต้อง
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-white/10 relative overflow-hidden mb-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />

                <h2 className="text-2xl font-bold text-white mb-8 text-center relative z-10">
                    ระบบวิเคราะห์เบอร์มงคลของเราทำงานอย่างไร?
                </h2>

                <div className="grid md:grid-cols-4 gap-6 relative z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-amber-500/20">1</div>
                        <h3 className="font-bold text-white mb-2">กรอกเบอร์</h3>
                        <p className="text-sm text-slate-400">ใส่เบอร์โทรศัพท์ 10 หลักที่ต้องการวิเคราะห์</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/20">2</div>
                        <h3 className="font-bold text-white mb-2">AI ประมวลผล</h3>
                        <p className="text-sm text-slate-400">ระบบวิเคราะห์คู่เลข ผลรวม และพลังงานทุกด้าน</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-emerald-500/20">3</div>
                        <h3 className="font-bold text-white mb-2">ดูผลลัพธ์</h3>
                        <p className="text-sm text-slate-400">รับเกรดเบอร์ กราฟพลังงาน และความหมายคู่เลข</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-purple-500/20">4</div>
                        <h3 className="font-bold text-white mb-2">ตัดสินใจ</h3>
                        <p className="text-sm text-slate-400">เก็บเบอร์ดี หรือเปลี่ยนเบอร์ใหม่ที่มงคลกว่า</p>
                    </div>
                </div>
            </div>

            {/* Warning Section */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 mb-16">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-rose-400 mb-2">⚠️ อย่าปล่อยให้เลขร้ายทำลายโอกาสของคุณ!</h3>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            หลายคนใช้เบอร์โทรศัพท์ที่มีพลังงานลบมานานหลายปีโดยไม่รู้ตัว ทำให้เหนื่อยเปล่า พลาดโอกาส
                            หรือมีอุปสรรคติดขัดตลอด การเปลี่ยนเบอร์เป็นเบอร์มงคลอาจเป็นจุดเปลี่ยนชีวิตที่คุณรอคอย!
                        </p>
                        <p className="text-amber-400 font-semibold">
                            💡 ลองวิเคราะห์เบอร์ของคุณวันนี้ เพื่อค้นพบว่าเบอร์ที่ใช้อยู่ส่งผลดีหรือร้ายต่อชีวิต
                        </p>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center">
                <div className="inline-flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span>วิเคราะห์แล้วกว่า <strong className="text-white">150,000+</strong> เบอร์</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        <span>คะแนนความพึงพอใจ <strong className="text-white">4.9/5</strong></span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <span>ใช้หลักเลขศาสตร์ <strong className="text-white">มาตรฐานสากล</strong></span>
                    </div>
                </div>
            </div>
        </section>
    );
};
