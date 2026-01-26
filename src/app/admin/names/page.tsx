'use client';

import React, { useState, useEffect } from 'react';
// import { Sidebar } from '@/components/Sidebar';
import { Save, RefreshCw, FileText, CheckCircle, AlertTriangle, Copy } from 'lucide-react';


export default function AdminNamesPage() {
    const [names, setNames] = useState<string[]>([]);
    const [rawInput, setRawInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch initial data
    const fetchNames = async () => {
        const Swal = (await import('sweetalert2')).default;
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/names');
            const data = await res.json();
            if (data.success) {
                setNames(data.names);
                // Convert array to comma-separated string for easier viewing? 
                // Or maybe just show list separately?
                // Let's populate the rawInput with current names for easy editing
                setRawInput(data.names.join(', '));
            } else {
                Swal.fire('Error', 'Failed to load names', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Connection failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNames();
    }, []);

    const handleSave = async () => {
        const Swal = (await import('sweetalert2')).default;
        setIsSaving(true);
        try {
            // Parse raw input: split by comma or newline, trim, remove empty
            const newNames = rawInput
                .split(/[\n,]+/)
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const res = await fetch('/api/admin/names', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ names: newNames })
            });

            const data = await res.json();

            if (data.success) {
                setNames(data.names);
                setRawInput(data.names.join(', '));
                Swal.fire({
                    title: 'บันทึกสำเร็จ!',
                    text: `อัปเดตรายชื่อทั้งหมด ${data.count} ชื่อ (จัดการชื่อซ้ำให้แล้ว)`,
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff'
                });
            } else {
                throw new Error(data.error);
            }

        } catch (error: any) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = async () => {
        const Swal = (await import('sweetalert2')).default;
        navigator.clipboard.writeText(rawInput);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#10b981',
            color: '#fff'
        });
        Toast.fire({
            icon: 'success',
            title: 'คัดลอกแล้ว'
        });
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <FileText className="text-amber-500" />
                            จัดการรายชื่อมงคล
                        </h1>
                        <p className="text-slate-400 mt-2">
                            เพิ่ม ลบ หรือแก้ไขรายชื่อในระบบ (ค้นหาทั่วไป)
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-sm text-slate-400">จำนวนทั้งหมด</span>
                        <span className="text-2xl font-bold text-emerald-400">{names.length.toLocaleString()}</span>
                        <span className="text-sm text-slate-400">ชื่อ</span>
                    </div>
                </header>

                {/* Editor Section */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                            รายชื่อทั้งหมด (แก้ไขได้เลย)
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Copy all"
                            >
                                <Copy size={18} />
                            </button>
                            <button
                                onClick={fetchNames}
                                disabled={isLoading}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <textarea
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                            className="w-full h-[60vh] bg-black/40 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm leading-relaxed focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none custom-scrollbar"
                            placeholder="วางรายชื่อที่นี่... (คั่นด้วยเครื่องหมายจุลภาค , หรือขึ้นบรรทัดใหม่)"
                        />
                        {isLoading && (
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin text-amber-500">
                                        <RefreshCw size={32} />
                                    </div>
                                    <span className="text-slate-300 font-medium">กำลังโหลดข้อมูล...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <AlertTriangle size={14} className="text-amber-500" />
                            <span>ระบบจะจัดการลบชื่อซ้ำ (Deduplicate) ให้โดยอัตโนมัติเมื่อกดบันทึก</span>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    <span>กำลังบันทึก...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>บันทึกการเปลี่ยนแปลง</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Instruction */}
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-4">
                    <div className="p-2 bg-amber-500/10 rounded-lg h-fit text-amber-500">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-200 mb-1">คำแนะนำการใช้งาน</h3>
                        <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                            <li>คุณสามารถ <strong>Copy รายชื่อจำนวนมาก</strong> จากแหล่งอื่นมาวางต่อท้ายได้เลย</li>
                            <li>ใช้เครื่องหมาย <strong>จุลภาค (,)</strong> หรือ <strong>การขึ้นบรรทัดใหม่</strong> เพื่อชื่่อแต่ละชื่อออกจากกัน</li>
                            <li>เมื่อกดบันทึก ระบบจะเขียนทับไฟล์ <code>src/data/auspiciousNames.ts</code> ทันที (อาจใช้เวลา 1-2 วินาทีเพื่อให้หน้ารีเฟรช)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    );
}
