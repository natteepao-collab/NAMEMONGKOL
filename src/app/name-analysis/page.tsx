'use client';

import React, { useState, useMemo, useRef } from 'react'; // Added useRef
import { Search, Trash2, ClipboardList, CheckCircle2, Download, XCircle, Info, Hash, History, Save, ArrowDownWideNarrow, Printer } from 'lucide-react'; // Added icons
import { analyzeName } from '@/utils/nameAnalysis';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

import { supabase } from '@/utils/supabase';

export default function NameAnalysisPage() {
    const [inputText, setInputText] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSorted, setIsSorted] = useState(false); // New State

    // Ref for PDF Capture
    const printRef = useRef<HTMLDivElement>(null);

    const results = useMemo(() => {
        if (!inputText.trim()) return [];
        const names = inputText.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0)
            .slice(0, 1000);

        const mapped = names.map((name, index) => {
            const analysis = analyzeName(name);
            return {
                id: index + 1,
                name,
                ...analysis!
            };
        });

        if (isSorted) {
            const gradeWeight: Record<string, number> = { 'A+': 4, 'A': 3, 'B': 2, 'C': 1 };
            mapped.sort((a, b) => {
                const scoreA = gradeWeight[a.grade] || 0;
                const scoreB = gradeWeight[b.grade] || 0;
                if (scoreA !== scoreB) return scoreB - scoreA; // Best grade first
                return b.sum - a.sum; // High sum second
            });
        }

        return mapped;
    }, [inputText, isSorted]);

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
        const header = "ลำดับ,รายชื่อ,เกรด,ผลรวมชื่อ,วันที่ใช้ได้,วิเคราะห์คู่เลข\n";
        const rows = results.map(r => {
            const pairDisplay = r.pairs.map(p => `${p.pair}${p.type === 'GREEN' ? '🟢' : p.type === 'ORANGE' ? '🟠' : '🔴'}`).join(" - ");
            return `${r.id},${r.name},${r.grade},${r.sum},"${r.goodDays.join(", ")}",${pairDisplay}`;
        }).join("\n");
        const blob = new Blob(["\ufeff" + header + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `วิเคราะห์ชื่อมงคล_${new Date().getTime()}.csv`;
        link.click();
    };

    const handleExportPDF = async () => {
        if (!printRef.current) return;

        // Find the scrollable container inside printRef
        const scrollContainer = printRef.current.querySelector('.custom-scrollbar');
        const printHeader = printRef.current.querySelector('.print-header') as HTMLElement;

        // Temporarily modify styles to capture full content
        const originalOverflow = scrollContainer ? (scrollContainer as HTMLElement).style.overflow : '';
        const originalHeight = scrollContainer ? (scrollContainer as HTMLElement).style.height : '';
        const originalHeaderDisplay = printHeader ? printHeader.style.display : '';

        if (scrollContainer) {
            (scrollContainer as HTMLElement).style.overflow = 'visible';
            (scrollContainer as HTMLElement).style.height = 'auto';
        }

        if (printHeader) {
            printHeader.style.display = 'block';
            printHeader.classList.remove('hidden');
        }

        try {
            // Wait for a moment to let the style changes render
            await new Promise(resolve => setTimeout(resolve, 100));

            const dataUrl = await toPng(printRef.current, {
                cacheBust: true,
                backgroundColor: '#0f172a', // Background color match
            });

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Multi-page logic
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`namemongkol-analysis-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("เกิดข้อผิดพลาดในการสร้าง PDF");
        } finally {
            // Restore styles
            if (scrollContainer) {
                (scrollContainer as HTMLElement).style.overflow = originalOverflow;
                (scrollContainer as HTMLElement).style.height = originalHeight;
            }
            if (printHeader) {
                printHeader.style.display = originalHeaderDisplay;
                printHeader.classList.add('hidden');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
            <main className="transition-all duration-300 min-h-screen p-4 md:p-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8 pt-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                <ClipboardList className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200">
                                    ระบบวิเคราะห์เลขศาสตร์
                                </h1>
                                <p className="text-indigo-300/80 font-medium text-sm flex items-center gap-2 mt-2">
                                    <CheckCircle2 className="w-4 h-4" /> ปรับปรุงฐานข้อมูลตามตำราภาพ
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setIsSorted(!isSorted)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium border ${isSorted
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <ArrowDownWideNarrow className="w-4 h-4" />
                                <span className="hidden sm:inline">{isSorted ? 'เรียงตามมงคล' : 'เรียงตามชื่อ'}</span>
                            </button>
                            <button
                                onClick={handleClear}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-rose-400 rounded-xl transition-all font-medium border border-white/10 hover:border-rose-500/30"
                            >
                                <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">ล้างรายชื่อ</span>
                            </button>
                            {results.length > 0 && (
                                <>
                                    <button
                                        onClick={handleSaveHistory}
                                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all font-bold border border-emerald-500/20 hover:border-emerald-500/40"
                                    >
                                        <Save className="w-4 h-4" /> บันทึก
                                    </button>
                                    <button
                                        onClick={exportCSV}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-95"
                                    >
                                        <Download className="w-4 h-4" /> CSV
                                    </button>
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 active:scale-95"
                                    >
                                        <Printer className="w-4 h-4" /> PDF
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Input Panel */}
                        <div className="lg:col-span-4 space-y-4 sticky top-8">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                    <h3 className="font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-indigo-400" />
                                        รายชื่อที่ต้องการวิเคราะห์
                                    </h3>
                                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold border ${results.length >= 1000
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                                        }`}>
                                        {results.length.toLocaleString()} / 1,000
                                    </span>
                                </div>
                                <div className="p-4">
                                    <textarea
                                        className="w-full h-[520px] p-6 text-lg border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all resize-none bg-black/20 text-slate-200 placeholder:text-slate-600 font-medium custom-scrollbar leading-loose"
                                        placeholder="วางรายชื่อที่นี่...&#10;เช่น:&#10;ณวิธ&#10;กลิ่นหอม"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10 flex gap-3 items-start">
                                        <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-400" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-indigo-300 uppercase">คำแนะนำ</p>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                ระบบคำนวณตามอักขระจริง (พยัญชนะ สระ วรรณยุกต์) เพื่อความแม่นยำสูงสุดตามตำรา
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Display */}
                        <div className="lg:col-span-8">
                            <div ref={printRef} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[720px] flex flex-col pt-0">
                                {/* Print Header (Hidden normally, shown in print/canvas) */}
                                <div className="bg-indigo-900/20 p-6 border-b border-indigo-500/30 mb-2 hidden print:block print-header">
                                    {/* Note: inline style display:none might prevent html2canvas capturing it unless we force show it. 
                                    html2canvas captures COMPUTED styles. Hidden elements are skipped. 
                                    Better approach: Use a class that is normally hidden but we force show during capture 
                                    OR rely on the fact that I force overflow visible on printRef? No. 
                                    Let's just make it visible but use absolute positioning or just standard hidden class 
                                    and rely on manual display block in handleExportPDF? 
                                    Actually I didn't add logic to force show it in handleExportPDF.
                                    Let's keep it simple: visible but maybe just part of the design? 
                                    User asked for "Header with Logo".
                                    I will make it visible ALWAYS at top of table? No, only for export.
                                    Let's try: `mb-2 hidden` and in handleExportPDF I change its style to block.
                                 */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <ClipboardList className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-white">NAMEMONGKOL</h1>
                                            <p className="text-indigo-200 text-sm">รายงานวิเคราะห์ชื่อมงคล</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-b border-white/5 bg-white/[0.02] font-bold text-slate-200 flex justify-between items-center">
                                    <span className="flex items-center gap-2 text-lg">ตารางวิเคราะห์ผลลัพธ์</span>
                                    {isSorted && <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">เรียงตามความมงคล</span>}
                                </div>
                                <div className="flex-1 overflow-auto custom-scrollbar">
                                    {results.length > 0 ? (
                                        <table className="w-full text-left border-collapse min-w-[700px]">
                                            <thead className="bg-black/20 sticky top-0 z-10 backdrop-blur-md">
                                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5">
                                                    <th className="px-6 py-4 w-16 text-center">#</th>
                                                    <th className="px-6 py-4 w-20 text-center">เกรด</th>
                                                    <th className="px-6 py-4">ชื่อ</th>
                                                    <th className="px-6 py-4 text-center">ผลรวม</th>
                                                    <th className="px-6 py-4">วันที่มงคล</th>
                                                    <th className="px-6 py-4">คู่เลข</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {results.map((row) => (
                                                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-6 py-6 text-slate-500 font-mono text-center text-sm group-hover:text-indigo-400 transition-colors">
                                                            {row.id.toString().padStart(3, '0')}
                                                        </td>
                                                        <td className="px-6 py-6 text-center">
                                                            <div className={`
                                                                w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border
                                                                ${row.grade === 'A+' ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30' :
                                                                    row.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                                        row.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                                            'bg-rose-500/20 text-rose-400 border-rose-500/30'}
                                                            `}>
                                                                {row.grade}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">{row.name}</span>
                                                        </td>
                                                        <td className="px-6 py-6 text-center">
                                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-indigo-900/50 group-hover:scale-110 transition-transform border border-white/10">
                                                                {row.sum}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                                                                {row.goodDays.length > 0 ? (
                                                                    row.goodDays.map(day => (
                                                                        <span key={day} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase">
                                                                            {day}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-rose-400 text-[11px] font-medium flex items-center gap-1 opacity-70">
                                                                        <XCircle className="w-3 h-3" /> ไม่แนะนำ
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                {row.pairs.length > 0 ? row.pairs.map((p, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <div className={`flex flex-col items-center px-2 py-1.5 rounded-lg border transition-all min-w-[40px] ${p.type === 'GREEN' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                                                            p.type === 'ORANGE' ? 'bg-orange-500/10 border-orange-500/20' :
                                                                                'bg-rose-500/10 border-rose-500/20'
                                                                            }`}>
                                                                            <span className={`text-sm font-bold leading-none mb-1 ${p.type === 'GREEN' ? 'text-emerald-400' :
                                                                                p.type === 'ORANGE' ? 'text-orange-400' :
                                                                                    'text-rose-400'
                                                                                }`}>
                                                                                {p.pair}
                                                                            </span>
                                                                            <span className="text-[10px] opacity-80">
                                                                                {p.type === 'GREEN' ? '🟢' : p.type === 'ORANGE' ? '🟠' : '🔴'}
                                                                            </span>
                                                                        </div>
                                                                        {i < row.pairs.length - 1 && <span className="text-slate-600 text-xs">›</span>}
                                                                    </React.Fragment>
                                                                )) : <span className="text-slate-600 text-xs italic">สั้นเกินไป</span>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-6 py-32">
                                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                                                <Search className="w-8 h-8 opacity-30 text-white" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-xl font-bold text-slate-400">ระบุรายชื่อเพื่อเริ่มต้น</p>
                                                <p className="text-xs font-medium text-slate-600 uppercase tracking-widest">รองรับการวิเคราะห์ทีละหลายรายชื่อ</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend / Key Summary */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl border border-emerald-500/20">🟢</div>
                            <div>
                                <p className="font-bold text-emerald-400 text-sm">คู่เลขมงคล (Good)</p>
                                <p className="text-slate-500 text-xs mt-0.5">ส่งเสริมด้านโชคลาภ/บารมี</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl border border-orange-500/20">🟠</div>
                            <div>
                                <p className="font-bold text-orange-400 text-sm">ปานกลาง (Average)</p>
                                <p className="text-slate-500 text-xs mt-0.5">เหนื่อยแต่สำเร็จ/ต้องอดทน</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center text-xl border border-rose-500/20">🔴</div>
                            <div>
                                <p className="font-bold text-rose-400 text-sm">ควรระวัง (Caution)</p>
                                <p className="text-slate-500 text-xs mt-0.5">อาจมีอุปสรรค/ปัญหาสุขภาพ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
