'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get('code');
            const next = searchParams.get('next') || '/';

            if (code) {
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;

                    router.push(next);
                    router.refresh();
                } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                    console.error('Auth callback error:', err);
                    setError(err.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
                }
            } else {
                // Logic for implicit flow or unexpected access
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    router.push(next);
                } else {
                    router.push('/login');
                }
            }
        };

        handleAuthCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Authentication Error</h2>
                    <p className="text-slate-300 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="py-2 px-6 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
                    >
                        กลับไปหน้าเข้าสู่ระบบ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-400">กำลังยืนยันตัวตน...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
