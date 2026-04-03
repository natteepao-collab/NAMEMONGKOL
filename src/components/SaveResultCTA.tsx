'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, Gift, ArrowRight } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export const SaveResultCTA = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Default hidden

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user);
        });
    }, []);

    if (isLoggedIn) return null;

    return (
        <div className="mt-6 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-500/5 to-purple-500/5 border border-amber-500/20 rounded-2xl p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2.5 bg-amber-500/15 rounded-xl shrink-0">
                            <Save className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm sm:text-base">บันทึกผลวิเคราะห์นี้ไว้</h4>
                            <p className="text-slate-400 text-xs mt-0.5">
                                สมัครฟรี → บันทึกผลได้ไม่จำกัด + ปลดล็อกเชิงลึก
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/login?redirect=/"
                        data-track="result.save_cta_click"
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap"
                    >
                        <Gift className="w-4 h-4" />
                        สมัครรับ 30 เครดิตฟรี
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
