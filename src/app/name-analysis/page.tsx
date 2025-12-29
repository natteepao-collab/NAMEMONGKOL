'use client';

import React, { useState, useMemo } from 'react';
import { Search, Trash2, ClipboardList, CheckCircle2, Download, XCircle, Info, Hash, History, Save } from 'lucide-react';
import { analyzeName } from '@/utils/nameAnalysis';
import { Sidebar } from '@/components/Sidebar';
import { supabase } from '@/utils/supabase';

export default function NameAnalysisPage() {
    const [inputText, setInputText] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const results = useMemo(() => {
        if (!inputText.trim()) return [];
        const names = inputText.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0)
            .slice(0, 1000);

        return names.map((name, index) => {
            const analysis = analyzeName(name);
            return {
                id: index + 1,
                name,
                ...analysis!
            };
        });
    }, [inputText]);

    const handleClear = () => {
        if (window.confirm("ต้องการล้างข้อมูลรายชื่อทั้งหมดใช่หรือไม่?")) setInputText("");
    };

    const handleSaveHistory = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('กรุณาเข้าสู่ระบบเพื่อบันทึกประวัติ');
            return;
        }

        if (results.length === 0) return;

        const confirm = window.confirm(`ต้องการบันทึกประวัติการวิเคราะห์ ${results.length} รายชื่อใช่หรือไม่?`);
        if (!confirm) return;

        try {
            const { error } = await supabase.from('analysis_history').insert({
                user_id: user.id,
                type: 'name_analysis',
                input_data: {
                    raw_text: inputText.substring(0, 1000), // Limit text length
                    count: results.length
                },
                result_data: results.map(r => ({
                    name: r.name,
                    sum: r.sum,
                    pairs: r.pairs.map(p => p.pair).join(',') // Store minimal data
                }))
            });

            if (error) throw error;
            alert('บันทึกประวัติเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Error saving history:', err);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        }
    };

    const exportCSV = () => {
        const header = "ลำดับ,รายชื่อ,ผลรวมชื่อ,วันที่ใช้ได้,วิเคราะห์คู่เลข\n";
        const rows = results.map(r => {
            const pairDisplay = r.pairs.map(p => `${p.pair}${p.type === 'GREEN' ? '🟢' : p.type === 'ORANGE' ? '🟠' : '🔴'}`).join(" - ");
            return `${r.id},${r.name},${r.sum},"${r.goodDays.join(", ")}",${pairDisplay}`;
        }).join("\n");
        const blob = new Blob(["\ufeff" + header + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `วิเคราะห์ชื่อมงคล_${new Date().getTime()}.csv`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900">
            <Sidebar />
            <main className="lg:ml-96 transition-all duration-300 min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-6 mb-8 relative overflow-hidden mt-16 lg:mt-0">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Hash className="w-48 h-48 text-indigo-900" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <ClipboardList className="w-9 h-9" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">ระบบวิเคราะห์เลขศาสตร์</h1>
                                    <p className="text-indigo-500 font-bold text-sm flex items-center gap-2 mt-1">
                                        <CheckCircle2 className="w-4 h-4" /> ปรับปรุงฐานข้อมูลตามตำราภาพ
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all font-bold text-slate-600 border border-transparent hover:border-rose-100"
                                >
                                    <Trash2 className="w-4 h-4" /> ล้างรายชื่อ
                                </button>
                                {results.length > 0 && (
                                    <>
                                        <button
                                            onClick={handleSaveHistory}
                                            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-all font-bold border border-emerald-100"
                                        >
                                            <Save className="w-4 h-4" /> บันทึก
                                        </button>
                                        <button
                                            onClick={exportCSV}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all font-bold shadow-xl shadow-indigo-200/50 active:scale-95"
                                        >
                                            <Download className="w-4 h-4" /> ส่งออกข้อมูล
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Input Panel */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/40 border border-white overflow-hidden sticky top-8">
                                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                    <h3 className="font-black text-slate-600 uppercase tracking-widest text-xs">รายชื่อที่ต้องการวิเคราะห์</h3>
                                    <span className={`text-[11px] px-3 py-1 rounded-full font-black ${results.length >= 1000 ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {results.length.toLocaleString()} / 1,000
                                    </span>
                                </div>
                                <div className="p-6">
                                    <textarea
                                        className="w-full h-[520px] p-6 text-2xl border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all resize-none bg-slate-50/20 leading-relaxed font-bold placeholder:font-normal placeholder:text-slate-300"
                                        placeholder="ตัวอย่าง:&#10;ณวิธ&#10;กลิ่นหอม"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="bg-indigo-50/80 p-5 rounded-3xl border border-indigo-100 flex gap-4 items-start text-indigo-900">
                                        <Info className="w-6 h-6 mt-0.5 flex-shrink-0 text-indigo-500" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-black uppercase tracking-wider">คำแนะนำการใช้งาน</p>
                                            <p className="text-[11px] font-medium leading-relaxed opacity-80">
                                                ระบบจะคำนวณตามลำดับอักขระจริง โดยรวมทั้งพยัญชนะ สระ และวรรณยุกต์ เพื่อให้ได้ผลรวมที่แม่นยำที่สุดตามตำราภาพ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Display */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[2.5rem] shadow-lg shadow-slate-200/40 border border-white overflow-hidden min-h-[720px] flex flex-col">
                                <div className="p-6 border-b border-slate-50 bg-slate-50/50 font-black text-slate-700 flex justify-between items-center">
                                    <span className="flex items-center gap-2">ตารางวิเคราะห์ผลลัพธ์</span>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    {results.length > 0 ? (
                                        <table className="w-full text-left border-collapse min-w-[780px]">
                                            <thead className="bg-white sticky top-0 z-10 border-b border-slate-100">
                                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    <th className="px-8 py-5 w-20 text-center">#</th>
                                                    <th className="px-6 py-5">ชื่อ</th>
                                                    <th className="px-6 py-5 text-center">ผลรวม</th>
                                                    <th className="px-6 py-5">วันที่มงคล</th>
                                                    <th className="px-6 py-5">วิเคราะห์คู่เลข</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {results.map((row) => (
                                                    <tr key={row.id} className="hover:bg-indigo-50/20 transition-all group">
                                                        <td className="px-8 py-7 text-slate-300 font-mono text-center text-sm group-hover:text-indigo-400">
                                                            {row.id.toString().padStart(3, '0')}
                                                        </td>
                                                        <td className="px-6 py-7">
                                                            <span className="text-2xl font-black text-slate-800 group-hover:text-indigo-700 transition-colors">{row.name}</span>
                                                        </td>
                                                        <td className="px-6 py-7 text-center">
                                                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-[1.25rem] font-black text-2xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                                                {row.sum}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-7">
                                                            <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                                                                {row.goodDays.length > 0 ? (
                                                                    row.goodDays.map(day => (
                                                                        <span key={day} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                                            {day}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-rose-500 text-[11px] font-black flex items-center gap-1 italic bg-rose-50 px-3 py-1 rounded-lg">
                                                                        <XCircle className="w-3.5 h-3.5" /> ไม่แนะนำ
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-7">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                {row.pairs.length > 0 ? row.pairs.map((p, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <div className={`flex flex-col items-center px-3 py-2 rounded-2xl border-2 transition-all hover:-translate-y-1 cursor-default shadow-sm min-w-[48px] ${p.type === 'GREEN' ? 'bg-emerald-50 border-emerald-100' :
                                                                            p.type === 'ORANGE' ? 'bg-orange-50 border-orange-100' :
                                                                                'bg-rose-50 border-rose-100'
                                                                            }`}>
                                                                            <span className={`text-base font-black leading-none mb-1 ${p.type === 'GREEN' ? 'text-emerald-700' :
                                                                                p.type === 'ORANGE' ? 'text-orange-700' :
                                                                                    'text-rose-700'
                                                                                }`}>
                                                                                {p.pair}
                                                                            </span>
                                                                            <span className="text-[10px]">
                                                                                {p.type === 'GREEN' ? '🟢' : p.type === 'ORANGE' ? '🟠' : '🔴'}
                                                                            </span>
                                                                        </div>
                                                                        {i < row.pairs.length - 1 && <span className="text-slate-200 font-black text-sm">›</span>}
                                                                    </React.Fragment>
                                                                )) : <span className="text-slate-400 text-xs italic">สั้นเกินไป</span>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-8 py-48">
                                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                                                <Search className="w-12 h-12 opacity-10" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-2xl font-black text-slate-400">ระบุรายชื่อเพื่อเริ่มต้น</p>
                                                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">คำนวณตามหลักเลขศาสตร์ภาพอ้างอิง</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend / Key Summary */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-white p-6 rounded-[2rem] flex items-center gap-6 shadow-lg shadow-slate-200/40">
                            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-100">🟢</div>
                            <div>
                                <p className="font-black text-slate-800 text-sm">คู่เลขมงคล (Green)</p>
                                <p className="text-slate-500 text-[11px] font-medium mt-0.5">ส่งเสริมด้านโชคลาภ บารมี และความสุข</p>
                            </div>
                        </div>
                        <div className="bg-white border border-white p-6 rounded-[2rem] flex items-center gap-6 shadow-lg shadow-slate-200/40">
                            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-100">🟠</div>
                            <div>
                                <p className="font-black text-slate-800 text-sm">คู่เลขปานกลาง (Orange)</p>
                                <p className="text-slate-500 text-[11px] font-medium mt-0.5">เลขเหนื่อยแต่สำเร็จ ต้องใช้ความอดทน</p>
                            </div>
                        </div>
                        <div className="bg-white border border-white p-6 rounded-[2rem] flex items-center gap-6 shadow-lg shadow-slate-200/40">
                            <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-100">🔴</div>
                            <div>
                                <p className="font-black text-slate-800 text-sm">คู่เลขเสีย (Red)</p>
                                <p className="text-slate-500 text-[11px] font-medium mt-0.5">ควรหลีกเลี่ยง อาจมีอุปสรรคหรือปัญหาสุขภาพ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
