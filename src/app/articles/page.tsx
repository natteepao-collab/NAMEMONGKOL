import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { supabase } from '@/utils/supabase';
import { Calendar, User, ArrowLeft, Search, BookOpen } from 'lucide-react';
import { articles as localArticles } from '@/data/articles';
import { shimmer, toBase64 } from '@/utils/imageUtils';
import { ArticleImage } from '@/components/ArticleImage';

type ArticleRow = {
    slug: string;
    date: string;
} & Record<string, unknown>;

// Revalidate every hour
export const revalidate = 3600;

// Helper to parse Thai date string "DD Month YYYY" to timestamp
const parseThaiDate = (dateStr: string) => {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    // Check if already ISO or standard format, or doesn't contain Thai characters
    if (!dateStr || !dateStr.match(/[ก-๙]/)) return new Date(dateStr).getTime();

    const parts = dateStr.split(' ');
    // Handle "20 มกราคม 2569"
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthIndex = months.indexOf(parts[1]);
        const year = parseInt(parts[2]) - 543; // Convert Thai year to AD
        if (monthIndex !== -1) {
            return new Date(year, monthIndex, day).getTime();
        }
    }
    return 0; // Fallback
};

async function getArticles() {
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true); // Removed .order from DB to do consistent custom sort in JS for mixed data types

    const dbArticles: ArticleRow[] = (articles as ArticleRow[]) || [];

    // Fallback to local articles if DB fails or just mix them
    // Filter out local articles that are already present in DB (by slug)
    const existingSlugs = new Set(dbArticles.map(a => a.slug));
    const uniqueLocalArticles = localArticles.filter(a => !existingSlugs.has(a.slug));

    // Combine
    const allArticles = [...dbArticles, ...uniqueLocalArticles];

    // Sort by date descending
    return allArticles.sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date));
}

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'บทความชื่อมงคล - ความรู้ตั้งชื่อ เลขศาสตร์ ทักษาปกรณ์ 2568 | NameMongkol',
    description: 'รวบรวมบทความเกี่ยวกับชื่อมงคล หลักการตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง เคล็ดลับเลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 ความหมายตัวเลข ผลรวมมงคล และอักษรกาลกิณี โดยผู้เชี่ยวชาญ',
    keywords: 'บทความชื่อมงคล, หลักการตั้งชื่อ, เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6, ผลรวมมงคล, อักษรกาลกิณี, เปลี่ยนชื่อเสริมดวง, ตั้งชื่อลูก, ความหมายชื่อ, ชื่อมงคล 2568',
    alternates: {
        canonical: 'https://www.namemongkol.com/articles',
    },
    openGraph: {
        title: 'บทความชื่อมงคล - ความรู้ตั้งชื่อ เลขศาสตร์ ทักษาปกรณ์ | NameMongkol',
        description: 'รวบรวมบทความเกี่ยวกับชื่อมงคล หลักการตั้งชื่อ เคล็ดลับเสริมดวง และความหมายของตัวเลขตามหลักเลขศาสตร์',
        url: 'https://www.namemongkol.com/articles',
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: ['/api/og?variant=default&title=บทความชื่อมงคล%20โดย%20NameMongkol&subtitle=รวมความรู้ศาสตร์การตั้งชื่อ%20และเคล็ดลับเสริมดวง&tag=Articles'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'บทความชื่อมงคล - ความรู้ตั้งชื่อ เลขศาสตร์ | NameMongkol',
        description: 'รวบรวมบทความเกี่ยวกับชื่อมงคล หลักการตั้งชื่อ เคล็ดลับเสริมดวง',
        images: ['/api/og?variant=default&title=บทความชื่อมงคล'],
    },
};

export default async function ArticlesPage() {
    const articles = await getArticles();

    // JSON-LD Schema for Article List
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'บทความชื่อมงคล',
        'description': 'รวบรวมบทความเกี่ยวกับชื่อมงคล หลักการตั้งชื่อ เคล็ดลับเสริมดวง',
        'url': 'https://www.namemongkol.com/articles',
        'isPartOf': {
            '@type': 'WebSite',
            'name': 'NameMongkol',
            'url': 'https://www.namemongkol.com',
        },
        'mainEntity': {
            '@type': 'ItemList',
            'itemListElement': articles.slice(0, 10).map((article, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                    '@type': 'Article',
                    'headline': article.title,
                    'description': article.excerpt,
                    'url': `https://www.namemongkol.com/articles/${article.slug}`,
                    'datePublished': article.date,
                    'author': {
                        '@type': 'Person',
                        'name': article.author,
                    },
                },
            })),
        },
    };

    return (
        <>
            <Script
                id="articles-list-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden pb-28">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                </div>

                <main className="w-full max-w-[1400px] px-4 py-8 relative z-10 pt-24 md:pt-32">
                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={16} />
                            กลับหน้าหลัก
                        </Link>

                        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                            บทความและสาระน่ารู้
                        </h1>
                        <p className="text-slate-300 text-lg">
                            รวมบทความศาสตร์มงคล เคล็ดลับการตั้งชื่อ และเกร็ดความรู้เพื่อชีวิตที่ดีกว่า
                        </p>

                        {/* Search Bar (Placeholder - Functional search logic can be added later if needed) */}
                        <div className="mt-8 relative max-w-lg">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="ค้นหาบทความ..."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {articles.map((article, index) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="group flex flex-col bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
                            >
                                <div className="h-56 w-full bg-slate-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <ArticleImage
                                        src={article.cover_image || article.coverImage}
                                        alt={article.title}
                                        priority={index < 6}
                                        className="group-hover:scale-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60" />
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white font-medium border border-white/10 z-10">
                                        {article.category}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow relative bg-[#0f172a] group-hover:bg-[#131c33] transition-colors">
                                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <span>{new Date(parseThaiDate(article.date)).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} />
                                            <span>{article.author}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-100 mb-3 leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                                        {article.title}
                                    </h2>

                                    <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3 text-justify">
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
                </main>
            </div>
        </>
    );
}
