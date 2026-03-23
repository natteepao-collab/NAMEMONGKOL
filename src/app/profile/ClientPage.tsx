'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { User as UserIcon, ArrowLeft, ShieldCheck, Mail, Smartphone, ExternalLink, Gift, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProfileClientPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [lineUserId, setLineUserId] = useState('');
    const [lineBonusGranted, setLineBonusGranted] = useState(false);
    const [lineVerifiedAt, setLineVerifiedAt] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [addFriendUrl, setAddFriendUrl] = useState<string | null>(null);
    const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
    const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [connectError, setConnectError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // Fetch current profile data including LINE verification fields
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('line_user_id, line_bonus_granted, line_verified_at')
                .eq('id', user.id)
                .maybeSingle();

            if (profile?.line_user_id) {
                setLineUserId(profile.line_user_id);
            }
            if (profile?.line_bonus_granted) {
                setLineBonusGranted(true);
            }
            if (profile?.line_verified_at) {
                setLineVerifiedAt(profile.line_verified_at as string);
            }
            setLoading(false);
        };

        getUser();

        // Restore verify URL from localStorage if still valid
        try {
            const savedVerify = localStorage.getItem('line_verify_url');
            const savedFriend = localStorage.getItem('line_add_friend_url');
            const savedExpires = localStorage.getItem('line_verify_expires');
            const savedMessage = localStorage.getItem('line_verify_message');
            if (savedVerify && savedFriend && savedExpires) {
                if (new Date(savedExpires).getTime() > Date.now()) {
                    setVerifyUrl(savedVerify);
                    setAddFriendUrl(savedFriend);
                    if (savedMessage) setVerifyMessage(savedMessage);
                } else {
                    localStorage.removeItem('line_verify_url');
                    localStorage.removeItem('line_add_friend_url');
                    localStorage.removeItem('line_verify_expires');
                    localStorage.removeItem('line_verify_message');
                }
            }
        } catch { /* ignore */ }
    }, [router]);

    // Poll for auto-verification success (follow event auto-grants)
    useEffect(() => {
        if (!verifyUrl || !user || lineBonusGranted) return;

        const interval = setInterval(async () => {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('line_bonus_granted, line_verified_at, line_user_id')
                .eq('id', user.id)
                .maybeSingle();

            if (profile?.line_bonus_granted) {
                setLineBonusGranted(true);
                if (profile.line_verified_at) setLineVerifiedAt(profile.line_verified_at as string);
                if (profile.line_user_id) setLineUserId(profile.line_user_id);
                try {
                    localStorage.removeItem('line_verify_url');
                    localStorage.removeItem('line_add_friend_url');
                    localStorage.removeItem('line_verify_expires');
                    localStorage.removeItem('line_verify_message');
                } catch { /* ignore */ }
                setVerifyUrl(null);
                setAddFriendUrl(null);
                setVerifyMessage(null);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [verifyUrl, user, lineBonusGranted]);

    const handleConnectLine = async () => {
        if (!user) return;
        setIsConnecting(true);
        setConnectError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;
            if (!accessToken) throw new Error('No session');

            const res = await fetch('/api/line/connect', {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const json = await res.json();

            if (json.status === 'already_claimed') {
                setLineBonusGranted(true);
            } else if (json.status === 'pending' && json.verifyUrl) {
                setAddFriendUrl(json.addFriendUrl);
                setVerifyUrl(json.verifyUrl);
                if (json.verifyMessage) setVerifyMessage(json.verifyMessage);
                // Persist to localStorage so it survives page reload
                try {
                    localStorage.setItem('line_verify_url', json.verifyUrl);
                    localStorage.setItem('line_add_friend_url', json.addFriendUrl);
                    localStorage.setItem('line_verify_expires', json.expiresAt);
                    if (json.verifyMessage) localStorage.setItem('line_verify_message', json.verifyMessage);
                } catch { /* ignore */ }
                // Step 1: open Add Friend page
                window.open(json.addFriendUrl, '_blank');
            } else {
                setConnectError(json.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            }
        } catch {
            setConnectError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setIsConnecting(false);
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
        <div className="min-h-screen bg-[#0f172a] pb-28">
            {/* Header */}
            <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/5">
                <div className="max-w-2xl px-4 h-16 flex items-center gap-4">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">ข้อมูลส่วนตัว</h1>
                </div>
            </header>

            <main className="w-full max-w-[1400px] px-4 py-8 pt-6 md:pt-32">
                <div className="max-w-2xl">
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

                        {lineBonusGranted ? (
                            /* Already verified */
                            <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <ShieldCheck size={20} className="text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-green-400 font-bold text-sm">LINE เชื่อมต่อแล้ว ✅</p>
                                        <p className="text-slate-400 text-xs">
                                            {lineVerifiedAt
                                                ? `ยืนยันเมื่อ ${new Date(lineVerifiedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                                : 'ยืนยันแล้ว'}
                                        </p>
                                    </div>
                                </div>
                                {lineUserId && (
                                    <div className="bg-black/20 rounded-xl p-3 border border-white/5 mb-3">
                                        <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">LINE User ID</label>
                                        <code className="text-xs text-slate-300 font-mono">
                                            {lineUserId.slice(0, 8)}{'\u2022'.repeat(Math.max(0, lineUserId.length - 8))}
                                        </code>
                                    </div>
                                )}
                                <p className="text-slate-500 text-xs">คุณได้รับโบนัส 80 เครดิตจากการยืนยัน LINE แล้วครับ</p>
                            </div>
                        ) : (
                            /* Not yet verified */
                            <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl p-6">
                                <div className="flex items-start gap-3 mb-6">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                                        <Gift size={18} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm mb-1">รับโบนัสเพิ่ม 80 เครดิต!</p>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            ยืนยันตัวตนผ่าน LINE OA เพื่อรับ 80 เครดิตฟรีทันที เครดิตจะหมดอายุภายใน 30 วันจากวันที่ยืนยัน
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-4">
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">วิธีรับโบนัส</p>
                                    <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
                                        <li>กดปุ่มด้านล่างเพื่อเพิ่มเพื่อน LINE OA</li>
                                        <li>ระบบจะยืนยันอัตโนมัติ หรือกด &quot;ส่งข้อความยืนยัน&quot; หากไม่อัตโนมัติ</li>
                                        <li>รอสักครู่ หน้านี้จะอัปเดตให้อัตโนมัติ</li>
                                    </ol>
                                </div>

                                {connectError && (
                                    <div className="px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
                                        {connectError}
                                    </div>
                                )}

                                {verifyUrl ? (
                                    <div className="space-y-3">
                                        <a
                                            href={verifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <ExternalLink size={18} />
                                            ส่งข้อความยืนยัน
                                        </a>
                                        {addFriendUrl && (
                                            <a
                                                href={addFriendUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-center text-green-400 hover:text-green-300 text-xs underline underline-offset-2"
                                            >
                                                เปิดหน้าเพิ่มเพื่อนอีกครั้ง
                                            </a>
                                        )}

                                        {/* Manual fallback: copy verify message */}
                                        {verifyMessage && (
                                            <div className="bg-black/30 rounded-xl p-4 border border-white/5 mt-2">
                                                <p className="text-slate-400 text-xs mb-2">หากปุ่มด้านบนไม่เปิด LINE ให้คัดลอกข้อความนี้ไปส่งใน LINE OA ด้วยตนเอง:</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="flex-1 bg-black/40 text-green-400 text-sm font-mono px-3 py-2 rounded-lg break-all border border-white/5">
                                                        {verifyMessage}
                                                    </code>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(verifyMessage);
                                                            setCopied(true);
                                                            setTimeout(() => setCopied(false), 2000);
                                                        }}
                                                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                                                        title="คัดลอก"
                                                    >
                                                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleConnectLine}
                                        disabled={isConnecting}
                                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {isConnecting ? (
                                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Smartphone size={18} />
                                                เพิ่มเพื่อน LINE รับ 80 เครดิต
                                            </>
                                        )}
                                    </button>
                                )}
                                <p className="text-slate-500 text-xs text-center mt-3">รหัสยืนยันมีอายุ 10 นาที</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
