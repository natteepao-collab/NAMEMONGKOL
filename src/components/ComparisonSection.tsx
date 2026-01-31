import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonSection = () => {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                ตารางเปรียบเทียบฟีเจอร์การวิเคราะห์
            </h2>

            <div className="overflow-hidden rounded-2xl border border-slate-700 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/80 border-b border-slate-700">
                            <th className="p-6 text-slate-300 font-medium w-1/2">ฟีเจอร์การวิเคราะห์</th>
                            <th className="p-6 text-slate-400 font-medium text-center w-1/4">เว็บไซต์ทั่วไป</th>
                            <th className="p-6 text-amber-400 font-bold text-center w-1/4 bg-amber-900/10">NameMongkol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        <tr className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5 text-slate-200">วิเคราะห์ผลรวมเลขศาสตร์</td>
                            <td className="p-5 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                            <td className="p-5 text-center bg-amber-900/5"><Check className="mx-auto text-green-500" size={24} /></td>
                        </tr>
                        <tr className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5 text-slate-200">เช็กตัวอักษรกาลกิณี (ทักษา)</td>
                            <td className="p-5 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                            <td className="p-5 text-center bg-amber-900/5"><Check className="mx-auto text-green-500" size={24} /></td>
                        </tr>
                        <tr className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5 text-slate-200">
                                เจาะลึกคู่เลขภายในชื่อ (00-99)
                                <span className="block text-xs text-slate-500 mt-1">วิเคราะห์ละเอียดทุกตำแหน่ง</span>
                            </td>
                            <td className="p-5 text-center"><X className="mx-auto text-slate-600" size={24} /></td>
                            <td className="p-5 text-center bg-amber-900/5"><Check className="mx-auto text-green-500" size={24} /></td>
                        </tr>
                        <tr className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5 text-slate-200">วิเคราะห์พลังอายตนะ 6</td>
                            <td className="p-5 text-center"><X className="mx-auto text-slate-600" size={24} /></td>
                            <td className="p-5 text-center bg-amber-900/5"><Check className="mx-auto text-green-500" size={24} /></td>
                        </tr>
                        <tr className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5 text-slate-200">ถอดรหัสพลังเงา (Shadow Energy)</td>
                            <td className="p-5 text-center"><X className="mx-auto text-slate-600" size={24} /></td>
                            <td className="p-5 text-center bg-amber-900/5"><Check className="mx-auto text-green-500" size={24} /></td>
                        </tr>
                        <tr className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5 text-slate-200 font-bold text-amber-200">เกรดสรุปความมงคล (A+ ถึง F)</td>
                            <td className="p-5 text-center"><X className="mx-auto text-slate-600" size={24} /></td>
                            <td className="p-5 text-center bg-amber-900/5"><Check className="mx-auto text-green-500" size={24} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};
