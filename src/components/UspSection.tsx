import React from 'react';
import { Search, Layers, Activity } from 'lucide-react';

export const UspSection = () => {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-16 relative z-10">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500 mb-6">
                    ทำไมต้องวิเคราะห์ชื่อกับ NameMongkol?
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    เพราะเราให้ผลลัพธ์ที่ "ลึกซึ้ง" และ "แม่นยำ" กว่า ด้วยการผสาน 3 ศาสตร์แห่งการตั้งชื่อไว้ในที่เดียว
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* USP 1 */}
                <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-2xl hover:border-amber-500/50 transition-all hover:-translate-y-2 group">
                    <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                        Micro-Analysis (คู่เลขมงคล)
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        ไม่ใช่แค่ดูผลรวม แต่เราถอดรหัส <strong>"ทุกคู่ตัวเลข"</strong> ในชื่อ (เช่น 22, 24, 65) เพื่อค้นหาจุดดีและจุดเสียที่ซ่อนอยู่อย่างละเอียด
                    </p>
                </div>

                {/* USP 2 */}
                <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-2xl hover:border-emerald-500/50 transition-all hover:-translate-y-2 group">
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                        <Layers size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                        Multi-Dimensional Logic
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        รวม 3 ศาสตร์ใหญ่ไว้ในหน้าเดียว: <strong>เลขศาสตร์ + ทักษาปกรณ์ + อายตนะ 6</strong> เพื่อความแม่นยำสูงสุดและครบทุกมิติ
                    </p>
                </div>

                {/* USP 3 */}
                <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-all hover:-translate-y-2 group">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                        Visual Data & Shadow Power
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        เจาะลึก <strong>"พลังเงา"</strong> และแสดงผลด้วยกราฟิกที่เข้าใจง่าย เปลี่ยนเรื่องมูเตลูให้เป็นวิทยาศาสตร์ที่พิสูจน์ได้จริง
                    </p>
                </div>
            </div>
        </section>
    );
};
