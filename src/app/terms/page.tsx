import React from 'react';
import { Book, Scale, AlertCircle, Copyright } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 mb-4">
                        <Book className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">ข้อตกลงและเงื่อนไขการใช้งาน</h1>
                    <p className="text-slate-400">มีผลบังคับใช้: 9 มกราคม 2569</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-slate-300 leading-relaxed">

                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Scale className="text-amber-400" size={20} />
                            1. ลักษณะของบริการ
                        </h2>
                        <p>
                            NameMongkol.com ให้บริการวิเคราะห์ชื่อ, แนะนำชื่อมงคล และวอลเปเปอร์เสริมดวง โดยอ้างอิงจากตำราทักษาปกรณ์, เลขศาสตร์ และหลักโหราศาสตร์ไทย
                        </p>
                        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-200 flex gap-3">
                            <AlertCircle className="shrink-0" size={20} />
                            <p>
                                <strong>คำสงวนสิทธิ์ (Disclaimer):</strong> ผลลัพธ์จากการวิเคราะห์และการใช้วอลเปเปอร์เป็น <ins>ความเชื่อส่วนบุคคล</ins> เว็บไซต์ไม่ได้การันตีผลลัพธ์ที่จะเกิดขึ้นในชีวิตจริง ความสำเร็จขึ้นอยู่กับการกระทำและความพากเพียรของผู้ใช้งานเป็นสำคัญ
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4">2. ระบบเครดิตและการชำระเงิน</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>เครดิต (Credits) ใช้สำหรับการเข้าถึงบริการพิเศษ เช่น การค้นหาชื่อระดับสูง (Premium Search) หรือ การดาวน์โหลดวอลเปเปอร์ Premium</li>
                            <li>เครดิตที่ซื้อแล้ว <u>ไม่สามารถขอเงินคืนได้</u> (Non-refundable) ไม่ว่ากรณีใดๆ เว้นแต่เกิดข้อผิดพลาดทางเทคนิคจากระบบของเรา</li>
                            <li>เครดิตไม่มีวันหมดอายุ ตราบใดที่เว็บไซต์ยังเปิดให้บริการ</li>
                        </ul>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Copyright className="text-amber-400" size={20} />
                            3. ทรัพย์สินทางปัญญา
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>วอลเปเปอร์มงคล:</strong> อนุญาตให้ผู้ที่ดาวน์โหลดใช้งานเพื่อ <u>ส่วนตัว</u> (Personal Use) เท่านั้น เช่น ตั้งเป็นภาพหน้าจอมือถือ</li>
                            <li><strong>ข้อห้าม:</strong> ห้ามนำไฟล์ภาพวอลเปเปอร์, บทวิเคราะห์ หรือข้อมูลบนเว็บไซต์ไปจำหน่าย, แจกจ่ายต่อ, ดัดแปลง หรือใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต</li>
                        </ul>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4">4. การระงับการให้บริการ</h2>
                        <p>
                            เราขอสงวนสิทธิ์ในการระงับบัญชีผู้ใช้งาน หากตรวจสอบพบการใช้งานที่ผิดปกติ, การพยายามเจาะระบบ, หรือการละเมิดข้อตกลงข้างต้น โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
