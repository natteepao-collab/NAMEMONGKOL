'use client';

import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const PhoneFAQSection = () => {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 max-w-5xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-sm mb-4">
                        <HelpCircle size={16} />
                        <span>คำถามที่พบบ่อย</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ไขข้อสงสัยเรื่อง <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">เบอร์มงคล</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        รวบรวมคำถามยอดฮิตเกี่ยวกับการวิเคราะห์เบอร์โทรศัพท์มงคล เพื่อช่วยให้คุณเข้าใจศาสตร์แห่งตัวเลขได้ดียิ่งขึ้น
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <FAQItem
                        question="วิเคราะห์เบอร์มงคลแม่นยำแค่ไหน?"
                        answer="ระบบวิเคราะห์ของเราใช้หลักเลขศาสตร์สากลและโหราศาสตร์ไทย โดยพิจารณาคู่เลข 7 ตัวท้าย (XX-XYZ-ABCD) และผลรวมเบอร์ เพื่อความแม่นยำสูงสุด ระบบจะวิเคราะห์ทั้งจุดเด่นและจุดอ่อนของเบอร์ พร้อมแสดงกราฟพลังงาน 6 ด้านของชีวิต"
                    />
                    <FAQItem
                        question="เบอร์มงคลช่วยเรื่องอะไรบ้าง?"
                        answer="เบอร์ที่ดีจะช่วยส่งเสริมพลังงานด้านบวก ทั้งการงาน การเงิน และความรัก โดยเฉพาะคู่เลขมงคลอย่าง 24 (มหาลาภ), 46 (เมตตามหานิยม), 65 (มหาเศรษฐี), 19 (ผู้นำมหาอำนาจ) จะช่วยดึงดูดโอกาสและความสำเร็จเข้ามาในชีวิต"
                    />
                    <FAQItem
                        question="คู่เลขอะไรควรหลีกเลี่ยง?"
                        answer="คู่เลขที่ควรระวัง ได้แก่ 43 (ขัดแย้ง ทะเลาะเบาะแว้ง), 89 (สูญเสีย อุบัติเหตุ), 56 (ล้มเหลว), 47 (อุปสรรค) หากเบอร์ของคุณมีคู่เลขเหล่านี้มาก ควรพิจารณาเปลี่ยนเบอร์ใหม่เพื่อชีวิตที่ราบรื่นขึ้น"
                    />
                    <FAQItem
                        question="ผลรวมเบอร์ที่ดีควรเป็นเท่าไหร่?"
                        answer="ผลรวมที่ดีขึ้นอยู่กับอาชีพและดวงชะตาของแต่ละบุคคล แต่โดยทั่วไป ผลรวมที่จัดว่าดีเยี่ยมในระดับสากล ได้แก่ 24, 32, 36, 41, 45, 46, 50, 51, 54, 59, 63, 65 ซึ่งส่งผลดีในด้านความสำเร็จและการเงิน"
                    />
                    <FAQItem
                        question="เปลี่ยนเบอร์แล้วจะเห็นผลเมื่อไหร่?"
                        answer="ตามหลักเลขศาสตร์ เมื่อเปลี่ยนเบอร์ใหม่แล้ว จะเริ่มเห็นผลการเปลี่ยนแปลงภายใน 1-3 เดือน โดยพลังงานของเบอร์ใหม่จะค่อยๆ ส่งผลต่อการสื่อสาร การติดต่อ และดึงดูดสิ่งดีๆ เข้ามา ยิ่งใช้เบอร์นานยิ่งเห็นผลชัดเจน"
                    />
                    <FAQItem
                        question="เบอร์มงคลกับวันเกิดมีความสัมพันธ์กันไหม?"
                        answer="มีความสัมพันธ์กันครับ! บางตัวเลขอาจเป็นมงคลสำหรับคนวันเกิดหนึ่ง แต่อาจไม่เหมาะกับอีกวันเกิดหนึ่ง เช่น เลข 6 และ 9 เหมาะกับคนเกิดวันอาทิตย์ แนะนำให้วิเคราะห์เบอร์ร่วมกับวันเกิดเพื่อผลลัพธ์ที่แม่นยำที่สุด"
                    />
                    <FAQItem
                        question="ใช้เบอร์มือสองได้ไหม?"
                        answer="ได้ครับ แต่ควรตรวจสอบก่อนว่าเบอร์นั้นมีพลังงานดีหรือไม่ เพราะเบอร์มือสองอาจมีพลังงานสะสมจากเจ้าของเดิม หากเป็นเบอร์ที่มีคู่เลขมงคลก็ถือว่าโชคดี แต่ถ้าเป็นเบอร์ที่มีคู่เลขอัปมงคลมาก ควรหลีกเลี่ยง"
                    />
                    <FAQItem
                        question="วิเคราะห์เบอร์ฟรีจริงไหม?"
                        answer="ใช่ครับ! การวิเคราะห์เบอร์มงคลขั้นพื้นฐานที่ NameMongkol ฟรี 100% ไม่มีค่าใช้จ่าย คุณสามารถดูเกรดเบอร์ คู่เลข และกราฟพลังงานได้ทันที สำหรับการวิเคราะห์เชิงลึกพร้อมคำแนะนำพิเศษ สามารถอัพเกรดเป็นแบบพรีเมี่ยมได้"
                    />
                    <FAQItem
                        question="นอกจากเบอร์โทรศัพท์ ยังวิเคราะห์อะไรได้อีก?"
                        answer="ที่ NameMongkol เรายังมีบริการวิเคราะห์ชื่อมงคลตามหลักทักษาและเลขศาสตร์ไทย เพื่อดูว่าชื่อของคุณส่งผลดีหรือไม่ และมีบริการค้นหาชื่อมงคลที่เหมาะกับวันเกิดของคุณอีกด้วย"
                    />
                </div>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </section>
    );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    return (
        <details className="group bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/30 open:bg-slate-800/60 open:border-slate-700">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-slate-200 font-medium md:text-lg select-none">
                {question}
                <ChevronDown className="w-5 h-5 text-slate-500 transition-transform duration-300 group-open:rotate-180 group-open:text-amber-400 shrink-0 ml-4" />
            </summary>
            <div className="px-5 pb-5 text-slate-400 leading-relaxed animate-fade-in text-sm md:text-base border-t border-dashed border-white/5 pt-3 mt-1">
                {answer}
            </div>
        </details>
    );
};
