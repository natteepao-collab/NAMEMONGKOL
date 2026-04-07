'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Save, RefreshCw, FileText, AlertTriangle, Copy, Plus, Replace } from 'lucide-react';

type SaveMode = 'append' | 'replace';

interface SaveStats {
    received: number;
    uniqueInPayload: number;
    inserted: number;
    skippedDuplicate: number;
    duplicatesInPayload: number;
    invalid: number;
}

export default function AdminNamesPage() {
    const [names, setNames] = useState<string[]>([]);
    const [rawInput, setRawInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMode, setSaveMode] = useState<SaveMode>('append');
    const [lastStats, setLastStats] = useState<SaveStats | null>(null);

    // Pre-validate: parse rawInput to show preview counts
    const preview = useMemo(() => {
        const raw = rawInput
            .split(/[\n,]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const unique = [...new Set(raw)];
        return {
            total: raw.length,
            unique: unique.length,
            duplicatesInPayload: raw.length - unique.length,
        };
    }, [rawInput]);

    // Fetch initial data
    const fetchNames = async () => {
        const Swal = (await import('sweetalert2')).default;
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/names');
            const data = await res.json();
            if (data.success) {
                setNames(data.names);
                if (saveMode === 'replace') {
                    setRawInput(data.names.join(', '));
                }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async () => {
        const Swal = (await import('sweetalert2')).default;

        // Replace mode: require confirmation
        if (saveMode === 'replace') {
            const confirm = await Swal.fire({
                title: '⚠️ ยืนยันเขียนทับ?',
                html: `<p class="text-red-300">โหมด <strong>Replace</strong> จะ<strong>ลบรายชื่อเดิมทั้งหมด</strong>แล้วแทนที่ด้วยรายชื่อใหม่ ${preview.unique.toLocaleString()} ชื่อ</p><p class="text-slate-400 mt-2">การกระทำนี้ย้อนกลับไม่ได้!</p>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน เขียนทับทั้งหมด',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#dc2626',
                background: '#1e293b',
                color: '#fff'
            });
            if (!confirm.isConfirmed) return;
        }

        setIsSaving(true);
        setLastStats(null);
        try {
            const newNames = rawInput
                .split(/[\n,]+/)
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const res = await fetch('/api/admin/names', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ names: newNames, mode: saveMode })
            });

            const data = await res.json();

            if (data.success) {
                const stats: SaveStats = data.stats;
                setLastStats(stats);

                // Refresh the name list from DB
                const refreshRes = await fetch('/api/admin/names');
                const refreshData = await refreshRes.json();
                if (refreshData.success) {
                    setNames(refreshData.names);
                }

                // Clear input in append mode after success
                if (saveMode === 'append') {
                    setRawInput('');
                }

                Swal.fire({
                    title: 'บันทึกสำเร็จ!',
                    html: `เพิ่มใหม่ <strong class="text-emerald-400">${stats.inserted.toLocaleString()}</strong> ชื่อ` +
                        (stats.skippedDuplicate > 0 ? `<br/>ข้ามซ้ำ <strong class="text-amber-400">${stats.skippedDuplicate.toLocaleString()}</strong> ชื่อ` : '') +
                        (stats.duplicatesInPayload > 0 ? `<br/>ซ้ำใน payload <strong class="text-slate-400">${stats.duplicatesInPayload.toLocaleString()}</strong>` : ''),
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff'
                });
            } else {
                throw new Error(data.error);
            }

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลได้';
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: message,
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

                {/* Mode Toggle */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400 font-medium">โหมดบันทึก:</span>
                    <button
                        onClick={() => { setSaveMode('append'); setLastStats(null); setRawInput(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${saveMode === 'append'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                    >
                        <Plus size={16} />
                        Append (เพิ่มต่อ)
                    </button>
                    <button
                        onClick={() => { setSaveMode('replace'); setLastStats(null); setRawInput(names.join(', ')); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${saveMode === 'replace'
                            ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                    >
                        <Replace size={16} />
                        Replace (เขียนทับ)
                    </button>
                </div>

                {/* Preview Stats */}
                {rawInput.trim().length > 0 && (
                    <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-3 rounded-xl border border-white/10 text-sm">
                        <span className="text-slate-400">Preview:</span>
                        <span className="text-white font-semibold">{preview.total.toLocaleString()} รายชื่อ</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-emerald-400 font-semibold">{preview.unique.toLocaleString()} ไม่ซ้ำ</span>
                        {preview.duplicatesInPayload > 0 && (
                            <span className="text-amber-400">(ซ้ำใน input {preview.duplicatesInPayload})</span>
                        )}
                        {saveMode === 'append' && (
                            <span className="text-slate-500 ml-auto">* ชื่อที่ซ้ำกับ DB จะถูกข้ามอัตโนมัติ</span>
                        )}
                    </div>
                )}

                {/* Last Save Result */}
                {lastStats && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm">
                        <h4 className="font-bold text-emerald-300 mb-2">ผลการบันทึกล่าสุด</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-black/20 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-white">{lastStats.received.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">รับเข้ามา</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-emerald-400">{lastStats.inserted.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">เพิ่มสำเร็จ</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-amber-400">{lastStats.skippedDuplicate.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">ข้ามซ้ำ (DB)</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-slate-400">{lastStats.duplicatesInPayload.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">ซ้ำใน payload</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Editor Section */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                            {saveMode === 'append' ? 'วางรายชื่อใหม่ที่ต้องการเพิ่ม' : 'รายชื่อทั้งหมด (แก้ไขได้เลย)'}
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
                            placeholder={saveMode === 'append'
                                ? 'วางรายชื่อใหม่ที่ต้องการเพิ่มที่นี่... (คั่นด้วย , หรือขึ้นบรรทัดใหม่)\nระบบจะข้ามชื่อที่มีอยู่แล้วโดยอัตโนมัติ'
                                : 'วางรายชื่อที่นี่... (คั่นด้วยเครื่องหมายจุลภาค , หรือขึ้นบรรทัดใหม่)'
                            }
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
                            <span>
                                {saveMode === 'append'
                                    ? 'ระบบจะเพิ่มเฉพาะชื่อใหม่ที่ยังไม่มีในฐานข้อมูล'
                                    : '⚠️ โหมด Replace จะลบรายชื่อเดิมทั้งหมดแล้วแทนที่!'
                                }
                            </span>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading || rawInput.trim().length === 0}
                            className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed ${saveMode === 'replace'
                                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-900/20'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/20'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    <span>กำลังบันทึก...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>{saveMode === 'append' ? 'เพิ่มรายชื่อ' : 'เขียนทับทั้งหมด'}</span>
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
                            <li><strong>Append (เพิ่มต่อ)</strong>: วางเฉพาะชื่อใหม่ ระบบจะข้ามชื่อที่มีอยู่แล้วอัตโนมัติ</li>
                            <li><strong>Replace (เขียนทับ)</strong>: แทนที่รายชื่อทั้งหมดในฐานข้อมูล — ใช้ด้วยความระวัง!</li>
                            <li>ใช้เครื่องหมาย <strong>จุลภาค (,)</strong> หรือ <strong>การขึ้นบรรทัดใหม่</strong> เพื่อแยกแต่ละชื่อออกจากกัน</li>
                            <li>ระบบจะ trim ช่องว่าง และลบชื่อซ้ำใน payload ให้โดยอัตโนมัติ</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    );
}
