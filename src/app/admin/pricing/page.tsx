'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Edit2, Plus, Trash2, X, Save, DollarSign, Sparkles } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface PricingTier {
    id: string;
    name: string;
    price: number;
    credits: number;
    description: string;
    popular: boolean;
    color: string;
}

export default function AdminPricingPage() {
    const [tiers, setTiers] = useState<PricingTier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<PricingTier>>({
        id: '',
        name: '',
        price: 0,
        credits: 0,
        description: '',
        popular: false,
        color: 'from-blue-500 to-cyan-500'
    });

    const fetchTiers = async () => {
        const Swal = (await import('sweetalert2')).default;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/pricing', {
                headers: {
                    Authorization: `Bearer ${session?.access_token || ''}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setTiers(data.tiers);
            }
        } catch (error) {
            console.error('Error fetching tiers:', error);
            Swal.fire('Error', 'Failed to load pricing tiers', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiers();
    }, []);

    const handleOpenModal = (tier?: PricingTier) => {
        if (tier) {
            setEditingTier(tier);
            setFormData(tier);
        } else {
            setEditingTier(null);
            setFormData({
                id: '',
                name: '',
                price: 0,
                credits: 0,
                description: '',
                popular: false,
                color: 'from-blue-500 to-cyan-500'
            });
        }
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        const Swal = (await import('sweetalert2')).default;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch(`/api/admin/pricing?id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session?.access_token || ''}`
                    }
                });

                if (res.ok) {
                    setTiers(tiers.filter(t => t.id !== id));
                    Swal.fire('Deleted!', 'Tier has been deleted.', 'success');
                } else {
                    throw new Error('Failed to delete');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete tier', 'error');
            }
        }
    };

    const handleSave = async () => {
        const Swal = (await import('sweetalert2')).default;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const url = '/api/admin/pricing';
            const method = editingTier ? 'PUT' : 'POST';

            // Ensure ID is set for new tiers if not provided manually (simple auto-gen fallback)
            let payload = { ...formData };
            if (!editingTier && !payload.id) {
                payload.id = `tier_${new Date().getTime()}`;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                if (editingTier) {
                    setTiers(tiers.map(t => t.id === editingTier.id ? data.tier : t));
                } else {
                    setTiers([...tiers, data.tier]);
                }
                setShowModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Pricing tier saved successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <CreditCard className="text-emerald-500" />
                            จัดการแพ็กเกจราคา
                        </h1>
                        <p className="text-slate-400 text-sm">ตั้งค่าราคาและเครดิตสำหรับการเติมเงิน</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                    >
                        <Plus size={20} />
                        เพิ่มแพ็กเกจใหม่
                    </button>
                </header>

                {/* Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-800/50 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4 text-center">Price (THB)</th>
                                    <th className="px-6 py-4 text-center">Credits</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : tiers.map((tier) => (
                                    <tr key={tier.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium text-base">{tier.name}</span>
                                                <span className="text-xs text-slate-500">{tier.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-emerald-400 font-bold text-lg">
                                            {tier.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold">
                                            {tier.credits.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {tier.popular && (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 inline-flex items-center gap-1">
                                                    <Sparkles size={10} /> Popular
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(tier)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tier.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">
                            {editingTier ? 'แก้ไขแพ็กเกจ' : 'สร้างแพ็กเกจใหม่'}
                        </h3>

                        <div className="space-y-4">
                            {!editingTier && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">ID (Unique)</label>
                                    <input
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        placeholder="e.g., tier_ultra"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อแพ็กเกจ</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">ราคา (บาท)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">เครดิตที่ได้</label>
                                    <input
                                        type="number"
                                        value={formData.credits}
                                        onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">คำอธิบาย</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-24"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">สี (Gradient)</label>
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    placeholder="from-blue-500 to-cyan-500"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                />
                                <div className={`h-4 w-full mt-2 rounded-lg bg-gradient-to-r ${formData.color}`}></div>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <input
                                    type="checkbox"
                                    id="popular"
                                    checked={formData.popular}
                                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-700"
                                />
                                <label htmlFor="popular" className="text-white font-medium select-none cursor-pointer">
                                    ตั้งเป็นแพ็กเกจแนะนำ (Best Seller)
                                </label>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2 mt-6"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} /> บันทึกข้อมูล
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
