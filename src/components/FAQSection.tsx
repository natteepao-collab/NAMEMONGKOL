import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQSection = () => {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-sm mb-4">
                        <HelpCircle size={16} />
                        <span>คำถามที่พบบ่อย</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ไขข้อข้องใจเรื่อง <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">ชื่อมงคล</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        รวบรวมคำถามยอดฮิตเกี่ยวกับการตั้งชื่อ เปลี่ยนชื่อ และวิเคราะห์ชื่อมงคล เพื่อช่วยให้คุณเข้าใจศาสตร์แห่งตัวเลขและดวงดาวได้ดียิ่งขึ้น
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <FAQItem
                        question="วิเคราะห์ชื่อมงคลที่ NameMongkol แม่นยำแค่ไหน?"
                        answer="NameMongkol ใช้ระบบ AI ประมวลผลร่วมกับ 4 ศาสตร์หลัก ได้แก่ เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6 และนิรันดร์ศาสตร์ ซึ่งเป็นตำราโหราศาสตร์ไทยโบราณที่ได้รับการยอมรับ ทำให้ผลลัพธ์มีความละเอียดและแม่นยำกว่าโปรแกรมทั่วไป"
                    />
                    <FAQItem
                        question="ผลรวมตัวเลขที่ดีที่สุด ควรเป็นเลขอะไร?"
                        answer="ผลรวมที่ดีขึ้นอยู่กับอาชีพและดวงชะตาของแต่ละบุคคล แต่โดยทั่วไป ผลรวมที่จัดว่าดีเยี่ยมในระดับสากล ได้แก่ 14, 15, 24, 36, 41, 42, 45, 50, 51, 54, 56, 59, 63, 65 ซึ่งส่งผลดีในด้านความสำเร็จและการเงิน"
                    />
                    <FAQItem
                        question="เปลี่ยนชื่อแล้ว ชีวิตจะดีขึ้นภายในกี่วัน?"
                        answer="ตามหลักครูบาอาจารย์ เชื่อว่าเมื่อเปลี่ยนชื่อใหม่แล้ว จะเริ่มเห็นผลการเปลี่ยนแปลงภายใน 3-6 เดือน โดยพลังของชื่อใหม่จะค่อยๆ ส่งผลต่อความคิด การตัดสินใจ และดึงดูดสิ่งดีๆ เข้ามา ทั้งนี้ขึ้นอยู่กับการทำบุญและการปฏิบัติตนควบคู่กันไปด้วย"
                    />
                    <FAQItem
                        question="อักษรกาลกิณี คืออะไร? ทำไมต้องห้าม?"
                        answer="อักษรกาลกิณี คือพยัญชนะที่เป็นอริกับดวงวันเกิด หากมีในชื่อจะเปรียบเสมือนมีอุปสรรคขัดขวาง ทำให้ชีวิตเหนื่อยยาก มีศัตรู หรือเกิดอุบัติเหตุได้ง่าย การตั้งชื่อมงคลจึงควรหลีกเลี่ยงอักษรกาลกิณีอย่างเด็ดขาด"
                    />
                    <FAQItem
                        question="ใช้ NameMongkol ตั้งชื่อลูกได้หรือไม่?"
                        answer="ได้แน่นอน! ระบบของเราสามารถใช้วิเคราะห์เพื่อตั้งชื่อลูกแรกเกิดได้ โดยพิจารณาจากวันเกิด (ทักษา) เพื่อหาตัวอักษรที่เป็นมงคล (เดช, ศรี, มนตรี) และหลีกเลี่ยงกาลกิณี เพื่อวางรากฐานชีวิตที่ดีให้กับบุตรหลานของคุณ"
                    />
                </div>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </section>
    );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    return (
        <details className="group bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/30 open:bg-slate-800/60 open:border-slate-700">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-slate-200 font-medium md:text-lg select-none">
                {question}
                <ChevronDown className="w-5 h-5 text-slate-500 transition-transform duration-300 group-open:rotate-180 group-open:text-amber-400" />
            </summary>
            <div className="px-5 pb-5 text-slate-400 leading-relaxed animate-fade-in text-sm md:text-base border-t border-dashed border-white/5 pt-3 mt-1">
                {answer}
            </div>
        </details>
    );
};
