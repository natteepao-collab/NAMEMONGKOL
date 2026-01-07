'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { User as UserIcon, Save, ArrowLeft, ShieldCheck, Mail, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [lineUserId, setLineUserId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // Fetch current profile data including line_user_id
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('line_user_id')
                .eq('id', user.id)
                .maybeSingle();

            if (profile?.line_user_id) {
                setLineUserId(profile.line_user_id);
            }
            setLoading(false);
        };

        getUser();
    }, [router]);

    const handleSaveLineId = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('user_profiles') // Ensuring we update the public users table which should be synced or linked
                .update({ line_user_id: lineUserId.trim() })
                .eq('id', user.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึก: ' + error.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-amber-500">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <UserIcon size={48} />
                    <span className="text-lg font-medium">Loading Profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/5">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">ข้อมูลส่วนตัว</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* User Info Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-6 mb-8 relative z-10">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
                            <UserIcon size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {user?.user_metadata?.name || 'สมาชิก'}
                            </h2>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                <Mail size={14} />
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                            <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Account ID</label>
                            <code className="text-xs text-slate-300 font-mono break-all">{user?.id}</code>
                        </div>
                    </div>
                </div>

                {/* LINE Integration Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Smartphone className="text-green-500" />
                        เชื่อมต่อบัญชี LINE
                    </h3>

                    <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl p-6">
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            กรุณากรอก <strong>LINE User ID</strong> ของคุณ เพื่อให้ระบบสามารถตรวจสอบสลิปโอนเงินและเติมเครดิตให้อัตโนมัติ
                            <br />
                            <span className="text-xs text-slate-500 mt-2 block">
                                * คุณสามารถดู LINE ID ได้จากข้อความที่บอทตอบกลับมาเมื่อส่งรูปสลิป
                            </span>
                        </p>

                        <form onSubmit={handleSaveLineId} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="lineId" className="text-sm font-medium text-white ml-1">
                                    LINE User ID
                                </label>
                                <input
                                    id="lineId"
                                    type="text"
                                    value={lineUserId}
                                    onChange={(e) => setLineUserId(e.target.value)}
                                    placeholder="เช่น U1234567890abcdef..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all font-mono text-sm"
                                />
                            </div>

                            {message && (
                                <div className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'success'
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {message.type === 'success' && <ShieldCheck size={16} />}
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isSaving ? (
                                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={18} />
                                        บันทึกข้อมูล
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
