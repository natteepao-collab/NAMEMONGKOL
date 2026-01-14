'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader2, Plus, Edit, Trash2, Save, X, Search, Image as ImageIcon, Upload, Eye, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Link from 'next/link';
import { articles as localArticles } from '@/data/articles';

// Define Article Type locally or import from types if verified
interface Article {
    id: string; // UUID from DB
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string;
    date: string;
    author: string;
    category: string;
    keywords: string[];
    meta_title?: string;
    meta_description?: string;
    is_published?: boolean;
}

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
    const [isEditing, setIsEditing] = useState(false);

    // Upload & Form State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            Swal.fire('Error', 'Failed to fetch articles', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentArticle({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            cover_image: '',
            date: new Date().toISOString().split('T')[0],
            author: 'Admin',
            category: 'ทั่วไป',
            keywords: [],
            is_published: true
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (article: Article) => {
        setCurrentArticle({ ...article });
        setSelectedFile(null);
        setPreviewUrl(article.cover_image);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the article.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase
                    .from('articles')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                setArticles(prev => prev.filter(a => a.id !== id));
                Swal.fire('Deleted!', 'Article has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting article:', error);
                Swal.fire('Error', 'Failed to delete article', 'error');
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
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const uploadImage = async (file: File, baseName: string): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        // Create an SEO-friendly filename: slug-timestamp.ext
        // Ensure the baseName is safe (alphanumeric + dashes only)
        const safeName = baseName
            .toLowerCase()
            .replace(/[^a-z0-9\u0E00-\u0E7F-]/g, '-') // Allow Thai + English + Dashes
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const fileName = `${safeName}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('articles')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('articles')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    // Auto-generate slug from title if empty
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w\u0E00-\u0E7F-]+/g, '') // Keep Thai and English chars
            .replace(/--+/g, '-');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalImageUrl = currentArticle.cover_image;

            if (selectedFile) {
                try {
                    // Use slug if available, otherwise title (sanitized by uploadImage)
                    const baseName = currentArticle.slug || currentArticle.title || 'untitled';
                    finalImageUrl = await uploadImage(selectedFile, baseName);
                } catch (uploadError: any) {
                    console.error('Upload Error', uploadError);
                    Swal.fire('Upload Failed', uploadError.message || 'Could not upload image', 'error');
                    setUploading(false);
                    return;
                }
            }

            if (!currentArticle.title) {
                Swal.fire('Error', 'Title is required', 'error');
                setUploading(false);
                return;
            }

            const payload = {
                title: currentArticle.title,
                slug: currentArticle.slug || generateSlug(currentArticle.title),
                excerpt: currentArticle.excerpt || '',
                content: currentArticle.content || '',
                cover_image: finalImageUrl || '',
                date: currentArticle.date || new Date().toISOString().split('T')[0],
                author: currentArticle.author || '',
                category: currentArticle.category || '',
                keywords: Array.isArray(currentArticle.keywords) ? currentArticle.keywords : [],
                meta_title: currentArticle.meta_title || currentArticle.title || '',
                meta_description: currentArticle.meta_description || currentArticle.excerpt || '',
                is_published: currentArticle.is_published ?? true
            };

            if (isEditing && currentArticle.id) {
                const { error } = await supabase
                    .from('articles')
                    .update(payload)
                    .eq('id', currentArticle.id);

                if (error) throw error;

                // Refresh list or update local state
                setArticles(prev => prev.map(a => a.id === currentArticle.id ? { ...a, ...payload, id: currentArticle.id as string } : a));
                Swal.fire('Success', 'Article updated successfully', 'success');
            } else {
                const { data, error } = await supabase
                    .from('articles')
                    .insert([payload])
                    .select()
                    .single();

                if (error) throw error;
                if (data) setArticles(prev => [data as Article, ...prev]);
                Swal.fire('Success', 'Article created successfully', 'success');
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving article:', error);
            Swal.fire('Error', 'Failed to save article', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSync = async () => {
        const result = await Swal.fire({
            title: 'Sync Local Articles?',
            text: "This will import hardcoded articles from 'src/data/articles.ts' into the database. Existing articles with the same slug will be skipped.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Sync!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setLoading(true);
            let addedCount = 0;
            let skippedCount = 0;

            try {
                // Fetch existing slugs to avoid duplicates (safeguard)
                const { data: existingArticles, error: fetchError } = await supabase
                    .from('articles')
                    .select('slug');

                if (fetchError) throw fetchError;

                const existingSlugs = new Set(existingArticles?.map(a => a.slug) || []);

                for (const article of localArticles) {
                    if (existingSlugs.has(article.slug)) {
                        skippedCount++;
                        continue;
                    }

                    // Map local article to DB schema
                    const payload = {
                        title: article.title,
                        slug: article.slug,
                        excerpt: article.excerpt || '',
                        content: article.content || '',
                        cover_image: article.coverImage || '', // Note: camelCase in local to snake_case in DB
                        date: article.date,
                        author: article.author,
                        category: article.category,
                        keywords: article.keywords,
                        meta_title: article.metaTitle || article.title,
                        meta_description: article.metaDescription || article.excerpt,
                        is_published: true
                    };

                    const { error: insertError } = await supabase
                        .from('articles')
                        .insert([payload]);

                    if (insertError) {
                        console.error(`Failed to import ${article.slug}:`, insertError);
                    } else {
                        addedCount++;
                    }
                }

                await fetchArticles(); // Refresh list
                Swal.fire('Sync Complete', `Imported: ${addedCount}, Skipped: ${skippedCount}`, 'success');

            } catch (error: any) {
                console.error('Sync Error:', error);
                Swal.fire('Sync Failed', error.message || 'Unknown error occurred', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">จัดการบทความ</h1>
                    <p className="text-slate-400">Manage articles, SEO, and content</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSync}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <RefreshCw size={20} />
                        Sync Articles
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={20} />
                        เพิ่มบทความใหม่
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Image</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Title / Slug</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Category</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Date</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredArticles.map((article) => (
                                <tr key={article.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="relative w-16 h-10 rounded overflow-hidden bg-slate-800">
                                            {article.cover_image ? (
                                                <Image
                                                    src={article.cover_image}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white font-medium line-clamp-1">{article.title}</div>
                                        <div className="text-xs text-emerald-400 font-mono mt-1">{article.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">
                                            {article.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {article.date}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
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

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? 'Edit Article' : 'Create Article'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentArticle.title || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Slug (Auto-generated if empty)</label>
                                        <input
                                            type="text"
                                            value={currentArticle.slug || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Category</label>
                                        <input
                                            type="text"
                                            value={currentArticle.category || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Author</label>
                                        <input
                                            type="text"
                                            value={currentArticle.author || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, author: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Date</label>
                                        <input
                                            type="date"
                                            value={currentArticle.date || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, date: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Excerpt (Meta Description)</label>
                                    <textarea
                                        rows={2}
                                        value={currentArticle.excerpt || ''}
                                        onChange={e => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Content Editor - Simple Textarea for HTML */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Content (HTML Supported)</label>
                                    <div className="text-xs text-slate-500 mb-1">Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; tags for formatting.</div>
                                    <textarea
                                        rows={10}
                                        value={currentArticle.content || ''}
                                        onChange={e => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Cover Image</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="relative w-40 h-24 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0">
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
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-slate-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-emerald-500/10 file:text-emerald-400
                                                    hover:file:bg-emerald-500/20"
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Recommended size: 1200x675px (16:9)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-700 pt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        {uploading ? 'Saving...' : 'Save Article'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
