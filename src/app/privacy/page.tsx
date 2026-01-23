import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Shield, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'นโยบายความเป็นส่วนตัว | NameMongkol - การคุ้มครองข้อมูลส่วนบุคคล',
    description: 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของ NameMongkol อธิบายวิธีการเก็บรวบรวม ใช้ และปกป้องข้อมูลของผู้ใช้งานตามกฎหมาย PDPA',
    keywords: ['นโยบายความเป็นส่วนตัว', 'PDPA', 'การคุ้มครองข้อมูล', 'NameMongkol', 'ข้อมูลส่วนบุคคล'],
    alternates: {
        canonical: `${siteUrl}/privacy`,
    },
    openGraph: {
        title: 'นโยบายความเป็นส่วนตัว | NameMongkol',
        description: 'นโยบายการคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐาน PDPA',
        url: `${siteUrl}/privacy`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'นโยบายความเป็นส่วนตัว | NameMongkol',
        description: 'นโยบายการคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐาน PDPA',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="relative w-full max-w-[1400px] px-4 pt-24 md:pt-32 pb-12 md:pb-20">
                {/* Navigation */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">กลับสู่หน้าหลัก</span>
                </Link>

                {/* Header */}
                <div className="text-center space-y-6 mb-16 relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/20 mb-2 transform rotate-3 hover:rotate-6 transition-transform duration-500">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                            นโยบายความเป็นส่วนตัว
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm md:text-base">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p>มีผลบังคับใช้และการปรับปรุงล่าสุด: 9 มกราคม 2569</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 md:gap-8">
                    {/* Introduction Card */}
                    <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl">
                        <p className="text-slate-300 leading-relaxed text-lg">
                            เราให้ความสำคัญกับความเป็นส่วนตัวของคุณอย่างสูงสุด นโยบายนี้อธิบายอย่างโปร่งใสเกี่ยวกับการเก็บรวบรวม ใช้ และปกป้องข้อมูลของคุณเมื่อใช้งาน <span className="text-amber-400 font-semibold">NameMongkol.com</span>
                        </p>
                    </div>

                    {/* Section 1 */}
                    <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                        <div className="flex items-start gap-4 md:gap-6">
                            <div className="shrink-0 p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                <Eye size={24} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                                    1. ข้อมูลที่เราเก็บรวบรวม
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { title: 'ข้อมูลบัญชีผู้ใช้', desc: 'เมื่อท่านลงชื่อเข้าใช้ด้วย Google เราได้รับข้อมูลพื้นฐาน เช่น ชื่อ, อีเมล และรูปภาพโปรไฟล์' },
                                        { title: 'ข้อมูลการวิเคราะห์', desc: 'ชื่อ, นามสกุล, วันเกิด และเบอร์โทรศัพท์ที่ท่านระบุเพื่อทำการวิเคราะห์' },
                                        { title: 'ข้อมูลธุรกรรม', desc: 'ประวัติการเติมเครดิตและการใช้เครดิต (ไม่เก็บข้อมูลบัตรเครดิต)' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-slate-300">
                                            <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-blue-500/50" />
                                            <span><strong className="text-slate-200">{item.title}:</strong> {item.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                        <div className="flex items-start gap-4 md:gap-6">
                            <div className="shrink-0 p-3 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                                <FileText size={24} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                                    2. การใช้ข้อมูลของท่าน
                                </h2>
                                <p className="text-slate-300">เรานำข้อมูลไปใช้เพื่อพัฒนาประสบการณ์ที่ดีที่สุดสำหรับคุณ:</p>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    {[
                                        'ให้บริการวิเคราะห์ชื่อตามหลักโหราศาสตร์',
                                        'จัดการสิทธิ์ Premium และการดาวน์โหลด',
                                        'บันทึกประวัติการใช้งานเพื่อดูย้อนหลัง',
                                        'พัฒนาฟีเจอร์ใหม่ๆ ให้ตรงใจคุณ'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-slate-300 bg-black/20 px-4 py-2 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                        <div className="flex items-start gap-4 md:gap-6">
                            <div className="shrink-0 p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                <Lock size={24} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                                    3. ความปลอดภัยและการแชร์ข้อมูล
                                </h2>
                                <div className="space-y-4 text-slate-300">
                                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                        <h3 className="font-semibold text-emerald-400 mb-1">มาตรฐานความปลอดภัยระดับสากล</h3>
                                        <p className="text-sm">ข้อมูลของท่านถูกจัดเก็บและเข้ารหัสอย่างปลอดภัยบน Cloud Server ชั้นนำ (Supabase)</p>
                                    </div>
                                    <p>
                                        เราสัญญาว่าจะ <span className="text-red-400 font-semibold underline decoration-red-400/30">ไม่จำหน่ายหรือเผยแพร่</span> ข้อมูลส่วนตัวของท่านให้แก่บุคคลที่สาม ท่านอาจได้รับข่าวสารที่เกี่ยวข้องกับบริการของเราโดยตรงเท่านั้น
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 text-center space-y-4">
                        <h2 className="text-xl font-bold text-white">ต้องการลบบัญชีผู้ใช้?</h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                            หากท่านเปลี่ยนใจและต้องการลบข้อมูลทั้งหมด ท่านสามารถติดต่อทีมงานของเราได้ตลอดเวลา เราพร้อมดำเนินการให้ทันทีตามคำร้องขอ
                        </p>
                        <Link
                            href="https://lin.ee/8N4ab3b"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10 hover:border-white/20"
                        >
                            ติดต่อเราผ่าน LINE OA
                        </Link>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center border-t border-white/5 pt-8">
                    <p className="text-slate-500 text-sm">
                        © 2024 NameMongkol.com - ศาสตร์แห่งตัวเลขเพื่อชีวิตที่ดีกว่า
                    </p>
                </div>
            </div>
        </div>
    );
}
