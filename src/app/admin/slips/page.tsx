'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface Slip {
    id: string;
    trans_id: string;
    amount: number;
    sender_name: string;
    created_at: string;
    user_id?: string;
}

export default function AdminSlipsPage() {
    const [slips, setSlips] = useState<Slip[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchSlips = async () => {
        const Swal = (await import('sweetalert2')).default;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const query = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });
            const res = await fetch(`/api/admin/slips?${query}`, {
                headers: {
                    Authorization: `Bearer ${session?.access_token || ''}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setSlips(data.slips);
                setTotalPages(Math.ceil((data.total || 0) / 20));
            }
        } catch (error) {
            console.error('Error fetching slips:', error);
            Swal.fire('Error', 'Failed to load slips', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlips();
    }, [page]);

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <header>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Receipt className="text-purple-500" />
                        รายการแจ้งโอน (Verified Slips)
                    </h1>
                    <p className="text-slate-400 text-sm">ประวัติการตรวจสอบสลิปโอนเงินทั้งหมด</p>
                </header>

                {/* Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-800/50 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Sender</th>
                                    <th className="px-6 py-4 text-center">Amount</th>
                                    <th className="px-6 py-4 text-center">Date</th>
                                    <th className="px-6 py-4 text-center">User</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex justify-center mb-2">
                                                <div className="animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                                            </div>
                                            Loading slips...
                                        </td>
                                    </tr>
                                ) : slips.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            ยังไม่มีรายการแจ้งโอน
                                        </td>
                                    </tr>
                                ) : (
                                    slips.map((slip) => (
                                        <tr key={slip.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-300">
                                                {slip.trans_id}
                                            </td>
                                            <td className="px-6 py-4 text-white">
                                                {slip.sender_name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-emerald-400 font-bold">฿{Number(slip.amount).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-xs">
                                                {new Date(slip.created_at).toLocaleString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {slip.user_id ? (
                                                    <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-400 truncate max-w-[100px] inline-block" title={slip.user_id}>
                                                        {slip.user_id.substring(0, 8)}...
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-600">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center px-6 py-4 bg-slate-800/20 border-t border-slate-700/50 text-sm">
                        <span className="text-slate-500">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
