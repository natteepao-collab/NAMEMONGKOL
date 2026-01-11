import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import { Calendar, User, ArrowLeft, Search, BookOpen } from 'lucide-react';

// Revalidate every hour
export const revalidate = 3600;

async function getArticles() {
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching articles', error);
        return [];
    }

    return articles || [];
}

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'บทความชื่อมงคล - ความรู้ศาสตร์การตั้งชื่อ | NameMongkol',
    description: 'รวบรวมบทความเกี่ยวกับชื่อมงคล หลักการตั้งชื่อ เคล็ดลับเสริมดวง และความหมายของตัวเลขตามหลักเลขศาสตร์',
    openGraph: {
        title: 'บทความชื่อมงคล - ความรู้ศาสตร์การตั้งชื่อ | NameMongkol',
        description: 'รวบรวมบทความเกี่ยวกับชื่อมงคล หลักการตั้งชื่อ เคล็ดลับเสริมดวง และความหมายของตัวเลขตามหลักเลขศาสตร์',
    }
};

export default async function ArticlesPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden pb-20">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 pt-24 md:pt-32">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={16} />
                        กลับหน้าหลัก
                    </Link>

                    <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        บทความและสาระน่ารู้
                    </h1>
                    <p className="text-slate-400 text-lg">
                        รวมบทความศาสตร์มงคล เคล็ดลับการตั้งชื่อ และเกร็ดความรู้เพื่อชีวิตที่ดีกว่า
                    </p>

                    {/* Search Bar (Placeholder - Functional search logic can be added later if needed) */}
                    <div className="mt-8 relative max-w-lg">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="ค้นหาบทความ..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            className="group flex flex-col bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
                        >
                            <div className="h-56 w-full bg-slate-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                {article.cover_image || article.coverImage ? (
                                    <Image
                                        src={article.cover_image || article.coverImage}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <BookOpen size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60" />
                                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white font-medium border border-white/10 z-10">
                                    {article.category}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow relative bg-[#0f172a] group-hover:bg-[#131c33] transition-colors">
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        <span>{new Date(article.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User size={14} />
                                        <span>{article.author}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-100 mb-3 leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 text-justify">
                                    {article.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                                    <span className="text-purple-400 font-medium group-hover:underline decoration-purple-500/30 underline-offset-4">อ่านเพิ่มเติม</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {articles.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p>ยังไม่มีบทความในขณะนี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
