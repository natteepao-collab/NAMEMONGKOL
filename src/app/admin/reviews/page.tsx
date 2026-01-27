'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Search, Check, X, Trash2, MessageCircle, AlertCircle, Filter, Star } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { Review } from '@/types';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

    const fetchReviews = async () => {
        // @ts-ignore
        const Swal = (await import('sweetalert2/dist/sweetalert2.js')).default;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const query = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search,
                status: statusFilter
            });

            const res = await fetch(`/api/admin/reviews?${query}`, {
                headers: {
                    Authorization: `Bearer ${session?.access_token || ''}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setReviews(data.reviews);
                setTotalPages(data.totalPages);
                // Note: Real stats count might need a separate API call or return from same API
                // For now we might just use total from API if status is all
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            Swal.fire('Error', 'Failed to load reviews', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchReviews();
        }, 300);
        return () => clearTimeout(timeout);
    }, [page, search, statusFilter]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        // @ts-ignore
        const Swal = (await import('sweetalert2/dist/sweetalert2.js')).default;
        try {
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch('/api/admin/reviews', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify({ id, status: newStatus })
            });

            const data = await res.json();
            if (data.success) {
                setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                toast.fire({
                    icon: 'success',
                    title: `Updated status to ${newStatus}`
                });
            } else {
                throw new Error(data.error);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleDelete = async (id: string) => {
        // @ts-ignore
        const Swal = (await import('sweetalert2/dist/sweetalert2.js')).default;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1e293b',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch(`/api/admin/reviews?id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session?.access_token || ''}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setReviews(reviews.filter(r => r.id !== id));
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Review has been deleted.',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff'
                    });
                } else {
                    throw new Error(data.error);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MessageCircle className="text-amber-500" />
                            จัดการบทวิจารณ์ (Reviews)
                        </h1>
                        <p className="text-slate-400 text-sm">อนุมัติและดูแลเนื้อหารีวิวจากผู้ใช้งาน</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหา (ชื่อ / เนื้อหา)..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500 transition-all"
                        />
                    </div>
                </header>

                {/* Filters */}
                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-700/50">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                                ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                } capitalize`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-800/50 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Content</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Loading reviews...
                                        </td>
                                    </tr>
                                ) : reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            No reviews found.
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{review.nickname}</span>
                                                    <span className="text-xs text-slate-500">{review.role || '-'}</span>
                                                    <span className="text-xs text-amber-500 mt-1">{review.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-slate-700'} />
                                                    ))}
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-1">
                                                    {new Date(review.date || review.created_at || new Date().toISOString()).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="line-clamp-2 text-slate-300">&quot;{review.content}&quot;</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${review.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    review.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                    {review.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {review.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(review.id, 'approved')}
                                                            className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                    )}
                                                    {review.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                                            className="p-1.5 rounded-lg hover:bg-orange-500/20 text-orange-400 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
