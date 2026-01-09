'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Wallpaper } from '@/types';
import { Loader2, Plus, Edit, Trash2, Save, X, Search, Image as ImageIcon, Upload } from 'lucide-react';
import Swal from 'sweetalert2';
import Image from 'next/image';

export default function AdminWallpapersPage() {
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWallpaper, setCurrentWallpaper] = useState<Partial<Wallpaper>>({});
    const [isEditing, setIsEditing] = useState(false);

    // Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchWallpapers();
    }, []);

    const fetchWallpapers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('wallpapers')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setWallpapers(data || []);
        } catch (error) {
            console.error('Error fetching wallpapers:', error);
            Swal.fire('Error', 'Failed to fetch wallpapers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredWallpapers = wallpapers.filter(wp =>
        wp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAdd = () => {
        setCurrentWallpaper({
            name: '',
            image: '',
            day: 'all',
            tags: [],
            premium: false,
            downloads: 0,
            description: ''
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (wallpaper: Wallpaper) => {
        setCurrentWallpaper({ ...wallpaper });
        setSelectedFile(null);
        setPreviewUrl(wallpaper.image);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
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
                const { error } = await supabase
                    .from('wallpapers')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                setWallpapers(prev => prev.filter(wp => wp.id !== id));
                Swal.fire('Deleted!', 'Wallpaper has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting wallpaper:', error);
                Swal.fire('Error', 'Failed to delete wallpaper', 'error');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(null);
            return;
        }

        const file = e.target.files[0];
        setSelectedFile(file);

        // Show local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('wallpapers')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('wallpapers')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalImageUrl = currentWallpaper.image;

            // 1. Upload new image if selected
            if (selectedFile) {
                try {
                    finalImageUrl = await uploadImage(selectedFile);
                } catch (uploadError: any) {
                    console.error('Upload Error', uploadError);
                    Swal.fire('Upload Failed', uploadError.message || 'Could not upload image', 'error');
                    setUploading(false);
                    return;
                }
            }

            // Validate
            if (!currentWallpaper.name || !finalImageUrl) {
                Swal.fire('Error', 'Please fill in name and provide an image', 'error');
                setUploading(false);
                return;
            }

            const payload = {
                name: currentWallpaper.name,
                image: finalImageUrl,
                day: currentWallpaper.day || 'all',
                tags: currentWallpaper.tags || [],
                premium: currentWallpaper.premium || false,
                downloads: currentWallpaper.downloads || 0,
                description: currentWallpaper.description || null
            };

            if (isEditing && currentWallpaper.id) {
                const { error } = await supabase
                    .from('wallpapers')
                    .update(payload)
                    .eq('id', currentWallpaper.id);

                if (error) throw error;

                // Update local state
                setWallpapers(prev => prev.map(wp => wp.id === currentWallpaper.id ? { ...wp, ...payload, id: currentWallpaper.id as number } : wp));
                Swal.fire('Success', 'Wallpaper updated successfully', 'success');
            } else {
                const { data, error } = await supabase
                    .from('wallpapers')
                    .insert([payload])
                    .select()
                    .single();

                if (error) throw error;
                if (data) setWallpapers(prev => [...prev, data]);
                Swal.fire('Success', 'Wallpaper added successfully', 'success');
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving wallpaper:', error);
            Swal.fire('Error', 'Failed to save wallpaper', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">จัดการวอลเปเปอร์</h1>
                    <p className="text-slate-400">Manage lucky wallpapers and their properties</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={20} />
                    เพิ่มวอลเปเปอร์
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="ค้นหาจากชื่อ หรือ Tags..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>

            {/* Table / List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">ID</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Preview</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Name</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Day</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Type</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredWallpapers.map((wp) => (
                                <tr key={wp.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 text-slate-400">#{wp.id}</td>
                                    <td className="p-4">
                                        <div className="relative w-12 h-20 rounded-lg overflow-hidden border border-slate-600 bg-slate-800">
                                            <Image
                                                src={wp.image}
                                                alt={wp.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white font-medium">{wp.name}</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {wp.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="capitalize text-slate-300 bg-slate-800 px-2 py-1 rounded text-sm border border-slate-700">
                                            {wp.day}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {wp.premium ? (
                                            <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-bold border border-amber-500/20">
                                                PREMIUM
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">
                                                FREE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(wp)}
                                                className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(wp.id)}
                                                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? 'Edit Wallpaper' : 'Add New Wallpaper'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Wallpaper Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentWallpaper.name || ''}
                                        onChange={e => setCurrentWallpaper({ ...currentWallpaper, name: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                                        placeholder="e.g. มหาเทพประทานทรัพย์"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Wallpaper Image *</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="relative w-20 h-28 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                                            {previewUrl ? (
                                                <Image
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500 transition-all">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                                    <p className="text-xs text-slate-400">Click to upload image</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">PNG, JPG (MAX. 5MB)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    {currentWallpaper.image && !selectedFile && (
                                        <p className="text-xs text-slate-500 truncate">Current URL: {currentWallpaper.image}</p>
                                    )}
                                </div>

                                {/* Day */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Suitable Day</label>
                                    <select
                                        value={currentWallpaper.day || 'all'}
                                        onChange={e => setCurrentWallpaper({ ...currentWallpaper, day: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 appearance-none"
                                    >
                                        <option value="all">All Days</option>
                                        <option value="sunday">Sunday</option>
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                        <option value="saturday">Saturday</option>
                                    </select>
                                </div>

                                {/* Premium Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Pricing Type</label>
                                    <div className="flex gap-4 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="premium"
                                                checked={currentWallpaper.premium === false}
                                                onChange={() => setCurrentWallpaper({ ...currentWallpaper, premium: false })}
                                                className="text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-600"
                                            />
                                            <span className="text-slate-300">Free</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="premium"
                                                checked={currentWallpaper.premium === true}
                                                onChange={() => setCurrentWallpaper({ ...currentWallpaper, premium: true })}
                                                className="text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-600"
                                            />
                                            <span className="text-amber-400 font-medium">Premium</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={currentWallpaper.tags?.join(', ') || ''}
                                    onChange={e => setCurrentWallpaper({ ...currentWallpaper, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                                    placeholder="การเงิน, ความรัก, โชคลาภ"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
                                <textarea
                                    value={currentWallpaper.description || ''}
                                    onChange={e => setCurrentWallpaper({ ...currentWallpaper, description: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 min-h-[100px]"
                                    placeholder="Enter detailed description here..."
                                />
                            </div>

                            {/* Downloads Manual Override */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Initial Downloads (Count)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={currentWallpaper.downloads || 0}
                                    onChange={e => setCurrentWallpaper({ ...currentWallpaper, downloads: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {uploading ? 'Uploading...' : (isEditing ? 'Save Changes' : 'Create Wallpaper')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
