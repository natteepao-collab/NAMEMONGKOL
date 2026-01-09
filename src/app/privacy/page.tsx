import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">นโยบายความเป็นส่วนตัว</h1>
                    <p className="text-slate-400">อัปเดตล่าสุด: 9 มกราคม 2569</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Eye className="text-amber-400" size={20} />
                            1. ข้อมูลที่เราเก็บรวบรวม
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>ข้อมูลบัญชีผู้ใช้:</strong> เมื่อท่านลงชื่อเข้าใช้ด้วย Google เราได้รับข้อมูลพื้นฐาน เช่น ชื่อ, อีเมล และรูปภาพโปรไฟล์ เพื่อสร้างบัญชีผู้ใช้งานในระบบของเรา</li>
                            <li><strong>ข้อมูลการใช้งาน:</strong> ประวัติการวิเคราะห์ชื่อ, การค้นหาชื่อมงคล และการดาวน์โหลดวอลเปเปอร์ เพื่ออำนวยความสะดวกในการใช้งานครั้งถัดไป</li>
                            <li><strong>ข้อมูลธุรกรรม:</strong> ประวัติการเติมเครดิตและการใช้เครดิตภายในเว็บไซต์ (เราไม่มีการจัดเก็บข้อมูลบัตรเครดิตหรือข้อมูลทางการเงินโดยตรง การชำระเงินอาจผ่านบุคคลที่สาม)</li>
                        </ul>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText className="text-amber-400" size={20} />
                            2. การใช้ข้อมูลของท่าน
                        </h2>
                        <p>เราใช้ข้อมูลของท่านเพื่อ:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>ให้บริการวิเคราะห์ชื่อและแนะนำชื่อมงคลตามหลักโหราศาสตร์</li>
                            <li>จัดการสิทธิ์การเข้าถึงฟีเจอร์ Premium และการดาวน์โหลดวอลเปเปอร์</li>
                            <li>บันทึกประวัติการใช้งานเพื่อให้ท่านกลับมาดูย้อนหลังได้</li>
                            <li>ปรับปรุงประสบการณ์การใช้งานและพัฒนาฟีเจอร์ใหม่ๆ</li>
                        </ul>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Lock className="text-amber-400" size={20} />
                            3. การรักษาความปลอดภัยและการแชร์ข้อมูล
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>ความปลอดภัย:</strong> ข้อมูลของท่านถูกจัดเก็บอย่างปลอดภัยบน Cloud Server ที่มีมาตรฐาน (Supabase)</li>
                            <li><strong>การแชร์ข้อมูล:</strong> เรา <u>ไม่จำหน่าย</u> ข้อมูลส่วนตัวของท่านให้แก่บุคคลที่สาม ท่านอาจได้รับอีเมลแจ้งเตือนที่เกี่ยวข้องกับบริการของเราเท่านั้น</li>
                        </ul>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-4">4. การลบบัญชีผู้ใช้</h2>
                        <p>
                            หากท่านต้องการลบบัญชีผู้ใช้และข้อมูลทั้งหมดออกจากระบบของเรา ท่านสามารถติดต่อเราได้ผ่านช่องทาง Line Official Account หรือเมนู "ติดต่อเรา" เพื่อดำเนินการลบข้อมูล
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
