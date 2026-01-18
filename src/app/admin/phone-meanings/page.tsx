'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader2, Edit, Save, X, Search, RefreshCw, AlertCircle, Grid, List, CheckCircle, Tag, Zap, Heart, Sparkles, Brain, Stethoscope, Briefcase } from 'lucide-react';
import Swal from 'sweetalert2';
import { pairDefinitions as localPairs } from '@/data/pairDefinitions';
import { standardPhoneGrades, getGradeColorClass } from '@/data/standardPhoneGrades';

interface PhonePairMeaning {
    id?: string;
    pair: string; // '00' to '99'
    grade: 'good' | 'bad' | 'neutral';
    title: string;
    description: string;
    tags: string[];
}

// --- ANALYSIS LOGIC HELPERS ---
const STAT_CATEGORIES = [
    { id: 'finance', label: 'การเงิน/การงาน', icon: Briefcase, color: 'text-amber-400', keywords: ['เงิน', 'งาน', 'ธุรกิจ', 'รวย', 'อำนาจ', 'บารมี', 'ผู้นำ', 'ตำแหน่ง', 'บริวาร', 'หนี้สิน', 'ทรัพย์', 'ถูกโกง', 'ตกงาน', 'เปลี่ยนงาน', 'เอกสาร', 'เหนื่อยฟรี', 'เสียผลประโยชน์', 'เงินก้อนโต', 'ลงทุน', 'มั่นคง', 'เลื่อนขั้น', 'เจ้านายรัก', 'โอกาส', 'คุมบริวาร', 'ปกครอง', 'ขายดี', 'ปิดการขาย', 'วาจาเรียกทรัพย์', 'บริหารเงิน', 'บริหาร', 'ความสำเร็จสากล'] },
    { id: 'luck', label: 'โชคลาภ', icon: Sparkles, color: 'text-yellow-400', keywords: ['โชค', 'ลาภ', 'เสี่ยง', 'ดวง', 'โชคลาภก้อนใหญ่', 'ค้าขายร่ำรวย', 'ปาฏิหาริย์'] },
    { id: 'love', label: 'ความรัก/เสน่ห์', icon: Heart, color: 'text-pink-400', keywords: ['รัก', 'เสน่ห์', 'เมตตา', 'เนื้อคู่', 'ครอบครัว', 'เจ้าชู้', 'รักร้าว', 'พลัดพราก', 'โดดเดี่ยว', 'ไร้เสน่ห์', 'ไม่ชัดเจน', 'ทะเลาะ', 'อารมณ์ร้อน', 'ลุ่มหลง'] },
    { id: 'health', label: 'สุขภาพ/อุบัติเหตุ', icon: Stethoscope, color: 'text-green-400', keywords: ['สุขภาพ', 'อุบัติเหตุ', 'ป่วย', 'โรค', 'ช่องท้อง', 'ผ่าตัด', 'กระดูก', 'เส้นประสาท', 'ความดัน', 'ไมเกรน', 'สายตา', 'ก้อนเนื้อ', 'มะเร็ง', 'พักผ่อนน้อย', 'ตับไต', 'สารพิษ', 'ภูมิแพ้', 'นารีเวช', 'ภูมิคุ้มกันบกพร่อง'] },
    { id: 'intellect', label: 'สติปัญญา', icon: Brain, color: 'text-sky-400', keywords: ['ปัญญา', 'เรียน', 'ฉลาด', 'สติ', 'วิชา', 'ความรู้'] },
    { id: 'sense', label: 'สัมผัสพิเศษ', icon: Zap, color: 'text-purple-400', keywords: ['สัมผัสพิเศษ', 'ลางสังหรณ์', 'สัมผัส', 'สิ่งศักดิ์สิทธิ์', 'ปาฏิหาริย์', 'ลี้ลับ', 'เซนส์', 'คาดการณ์', 'สมาธิ', 'อ่านใจ'] },
];

const FRIEND_PAIRS = ['15', '51', '24', '42', '36', '63', '78', '87', '89', '98', '59', '95', '45', '54'];





export default function AdminPhoneMeaningsPage() {
    const [meanings, setMeanings] = useState<PhonePairMeaning[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMeaning, setCurrentMeaning] = useState<Partial<PhonePairMeaning>>({});
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const analyzeCurrentStats = () => {
        if (!currentMeaning.tags || !currentMeaning.grade || !currentMeaning.pair) return { activeStats: [], score: 0 };

        const tags = currentMeaning.tags || [];
        const pair = currentMeaning.pair;
        const isGood = currentMeaning.grade === 'good';
        const isFriendPair = FRIEND_PAIRS.includes(pair);

        // Score Calculation (Simplified logic from analyzePhone.ts)
        let scoreTrigger = 0;
        if (currentMeaning.grade === 'good') scoreTrigger = isFriendPair ? 40 : 20;
        else if (currentMeaning.grade === 'neutral') scoreTrigger = -10;
        else scoreTrigger = -40;

        const activeCategories = STAT_CATEGORIES.map(cat => {
            // Check 1: Tags
            let isActive = tags.some(t => cat.keywords.some(k => t.includes(k)));

            return {
                ...cat,
                isActive,
                triggerSource: isActive ? 'Tags' : null
            };
        });

        return { activeStats: activeCategories, score: scoreTrigger };
    };

    const { activeStats, score } = analyzeCurrentStats();

    useEffect(() => {
        fetchMeanings();
    }, []);

    const fetchMeanings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('phone_pair_meanings')
                .select('*')
                .order('pair', { ascending: true });

            if (error) throw error;
            setMeanings(data || []);
        } catch (error) {
            console.error('Error fetching meanings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredMeanings = meanings.filter(m =>
        m.pair.includes(searchTerm) ||
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEdit = (meaning: PhonePairMeaning) => {
        setCurrentMeaning({ ...meaning });
        setIsModalOpen(true);
    };



    const handleQuickAddTag = (keyword: string) => {
        const currentTags = currentMeaning.tags || [];
        if (!currentTags.includes(keyword)) {
            setCurrentMeaning({
                ...currentMeaning,
                tags: [...currentTags, keyword]
            });
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const currentTags = currentMeaning.tags || [];
        setCurrentMeaning({
            ...currentMeaning,
            tags: currentTags.filter(t => t !== tagToRemove)
        });
    };

    const handleApplyStandardGrades = async () => {
        const result = await Swal.fire({
            title: 'Apply Standard Grades?',
            text: "This will update the GRADE (Good/Bad/Neutral) of all pairs in the database to match the Standard Table (Red/Green/Orange). Titles and descriptions will NOT be changed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Apply!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setLoading(true);
            let updatedCount = 0;
            try {
                const updates = Object.entries(standardPhoneGrades).map(([pair, grade]) => ({ pair, grade }));
                for (const item of updates) {
                    const { error } = await supabase
                        .from('phone_pair_meanings')
                        .update({ grade: item.grade })
                        .eq('pair', item.pair);

                    if (!error) updatedCount++;
                }
                await fetchMeanings();
                Swal.fire('Success', `Updated grades for ${updatedCount} pairs.`, 'success');
            } catch (error: any) {
                console.error('Update Error:', error);
                Swal.fire('Error', 'Failed to apply standard grades', 'error');
            } finally {
                setLoading(false);
            }
        }
    };



    const handleSync = async () => {
        const result = await Swal.fire({
            title: 'Sync Local Data?',
            text: "This will populate the 'phone_pair_meanings' table from your local 'src/data/pairDefinitions.ts'. Existing pairs in DB will be updated.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Sync!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setLoading(true);
            let syncedCount = 0;
            let errorCount = 0;
            try {
                const pairsToSync = Object.entries(localPairs).map(([pair, def]) => ({ pair, ...def }));
                for (const item of pairsToSync) {
                    const { error } = await supabase
                        .from('phone_pair_meanings')
                        .upsert({
                            pair: item.pair,
                            grade: item.grade,
                            title: item.title,
                            description: item.description,
                            tags: item.tags
                        }, { onConflict: 'pair' });

                    if (error) { errorCount++; } else { syncedCount++; }
                }
                await fetchMeanings();
                Swal.fire('Sync Complete', `Synced: ${syncedCount}, Errors: ${errorCount}`, errorCount > 0 ? 'warning' : 'success');
            } catch (error: any) {
                Swal.fire('Sync Failed', error.message || 'Unknown error', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (!currentMeaning.pair || !currentMeaning.title) {
                Swal.fire('Error', 'Pair and Title are required', 'error');
                setSaving(false);
                return;
            }
            const payload = {
                pair: currentMeaning.pair,
                grade: currentMeaning.grade || 'neutral',
                title: currentMeaning.title,
                description: currentMeaning.description || '',
                tags: Array.isArray(currentMeaning.tags) ? currentMeaning.tags : []
            };
            const { error } = await supabase.from('phone_pair_meanings').upsert(payload, { onConflict: 'pair' });
            if (error) throw error;
            await fetchMeanings();
            setIsModalOpen(false);
            Swal.fire('Success', 'Meaning saved successfully', 'success');
        } catch (error: any) {
            console.error('Error saving:', error);
            Swal.fire('Error', 'Failed to save meaning', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleTagInputChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const val = changeEvent.target.value;
        const tags = val.split(',').map(t => t.trim()).filter(t => t);
        setCurrentMeaning({ ...currentMeaning, tags });
    };

    const getMeaningForPair = (pair: string) => meanings.find(m => m.pair === pair);



    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">จัดการความหมายคู่เลข (Detailed Mode)</h1>
                    <p className="text-slate-400">Manage Phone Pair Meanings & Analyze Graph Impact</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="bg-slate-800 p-1 rounded-lg flex items-center border border-slate-700">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Grid size={18} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}><List size={18} /></button>
                    </div>
                    <button onClick={handleApplyStandardGrades} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-amber-500/20"><CheckCircle size={20} /> Apply Standard Grades</button>
                    <button onClick={handleSync} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20"><RefreshCw size={20} /> Sync Local Data</button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search pair, title, or tags..." value={searchTerm} onChange={handleSearch} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>

            {/* Loading / Empty / Content */}
            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
            ) : meanings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800">
                    <AlertCircle size={48} className="mb-4 text-slate-600" />
                    <p className="text-lg">No meanings found in database.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 overflow-x-auto">
                    <div className="grid grid-cols-10 gap-2 min-w-[800px]">
                        {Array.from({ length: 100 }, (_, i) => {
                            const pair = i.toString().padStart(2, '0');
                            const meaning = getMeaningForPair(pair);
                            const grade = meaning?.grade || 'neutral';
                            const isDimmed = searchTerm && !filteredMeanings.find(m => m.pair === pair);
                            return (
                                <button
                                    key={pair}
                                    onClick={() => meaning && handleEdit(meaning)}
                                    className={`
                                        aspect-square rounded-lg flex flex-col items-center justify-center relative group
                                        transition-all duration-200 border border-transparent hover:border-white/50 hover:scale-110 z-0 hover:z-10 hover:shadow-xl
                                        ${getGradeColorClass(grade)}
                                        ${isDimmed ? 'opacity-20 grayscale' : 'opacity-100'}
                                    `}
                                >
                                    <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter drop-shadow-md">{pair}</span>
                                    {meaning && (
                                        <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-xl pointer-events-none transition-opacity z-20 border border-slate-600 z-[50]">
                                            <div className="font-bold text-emerald-400 mb-1">{meaning.title}</div>
                                            <div className="line-clamp-2 text-slate-300">{meaning.description}</div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMeanings.map((m) => (
                        <div key={m.pair} className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold font-mono ${m.grade === 'good' ? 'bg-emerald-500/10 text-emerald-400' : m.grade === 'bad' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        {m.pair}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{m.title}</h3>
                                        <div className={`text-xs uppercase font-bold tracking-wider ${m.grade === 'good' ? 'text-emerald-500' : m.grade === 'bad' ? 'text-red-500' : 'text-amber-500'}`}>{m.grade}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleEdit(m)} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"><Edit size={18} /></button>
                            </div>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{m.description}</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {m.tags.map(t => (<span key={t} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{t}</span>))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DETAILED EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl animate-fade-in-up flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                        {/* LEFT: FORM */}
                        <div className="flex-1 p-6 border-r border-slate-700 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Edit size={24} className="text-emerald-500" />
                                    Edit Pair: <span className="text-emerald-400 font-mono text-3xl">{currentMeaning.pair}</span>
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="md:hidden text-slate-400"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Grade</label>
                                        <select
                                            value={currentMeaning.grade}
                                            onChange={e => setCurrentMeaning({ ...currentMeaning, grade: e.target.value as any })}
                                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-emerald-500"
                                        >
                                            <option value="good">Good (มงคล)</option>
                                            <option value="neutral">Neutral (กลางๆ)</option>
                                            <option value="bad">Bad (เสีย)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={currentMeaning.title || ''}
                                            onChange={e => setCurrentMeaning({ ...currentMeaning, title: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        rows={4}
                                        value={currentMeaning.description || ''}
                                        onChange={e => setCurrentMeaning({ ...currentMeaning, description: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Tags (Manual)</label>
                                    <input
                                        type="text"
                                        value={currentMeaning.tags?.join(', ') || ''}
                                        onChange={handleTagInputChange}
                                        placeholder="#money, #love"
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-emerald-500"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {currentMeaning.tags?.map(t => (
                                            <span key={t} className="text-xs bg-slate-800 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                                                {t}
                                                <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-white"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT: LIVE PREVIEW & SMART TAGS */}
                        <div className="w-full md:w-[400px] bg-slate-800/50 p-6 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={20} className="text-amber-400" /> Analysis Preview</h3>
                                <button onClick={() => setIsModalOpen(false)} className="hidden md:block text-slate-400 hover:text-white"><X size={24} /></button>
                            </div>

                            {/* Score Impact */}
                            <div className={`p-4 rounded-xl mb-6 border ${score > 0 ? 'bg-emerald-500/10 border-emerald-500/50' : score < 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-700/50 border-slate-600'}`}>
                                <div className="text-sm text-slate-400 mb-1">Score Impact</div>
                                <div className={`text-3xl font-bold ${score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-slate-200'}`}>
                                    {score > 0 ? '+' : ''}{score} Points
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Based on Grade & Friend Pair Logic</div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Graph Triggers</h4>
                                {activeStats && activeStats.map(cat => (
                                    <div key={cat.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${cat.isActive ? `bg-slate-800 border-${cat.color.split('-')[1]}-500/50 shadow-lg shadow-${cat.color.split('-')[1]}-500/10` : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <cat.icon size={18} className={cat.color} />
                                            <div>
                                                <span className={`text-sm font-medium block ${cat.isActive ? 'text-white' : 'text-slate-400'}`}>{cat.label}</span>
                                                {cat.isActive && cat.triggerSource === 'Bad Pair Rule' && (
                                                    <span className="text-[10px] text-red-400 block">Rule: Bad Pair</span>
                                                )}
                                                {cat.isActive && cat.triggerSource === 'Tags' && (
                                                    <span className="text-[10px] text-emerald-400 block">Trigger: Tags</span>
                                                )}
                                            </div>
                                        </div>
                                        {cat.isActive && <CheckCircle size={16} className="text-emerald-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Quick Add Tags</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {STAT_CATEGORIES.map(cat => (
                                        <div key={cat.id} className="space-y-1">
                                            <div className={`text-[10px] font-bold ${cat.color} opacity-70`}>{cat.label}</div>
                                            <div className="flex flex-wrap gap-1">
                                                {cat.keywords.slice(0, 4).map(kw => ( // Increased slice to 4
                                                    <button
                                                        key={kw}
                                                        type="button"
                                                        onClick={() => handleQuickAddTag(kw)}
                                                        className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded border border-slate-600 transition-colors"
                                                    >
                                                        {kw}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 mt-auto border-t border-slate-700 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="button" onClick={handleSubmit} disabled={saving} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
