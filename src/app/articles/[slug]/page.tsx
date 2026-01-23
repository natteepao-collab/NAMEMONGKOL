
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { ArticleImage } from '@/components/ArticleImage';
import dynamic from 'next/dynamic';

const ArticleShareButtons = dynamic(() => import('@/components/ArticleShareButtons').then(mod => mod.ArticleShareButtons), {
    loading: () => <div className="h-10 w-24 bg-slate-800/50 rounded-full animate-pulse" />
});

const ArticleCTA = dynamic(() => import('@/components/ArticleCTA').then(mod => mod.ArticleCTA), {
    loading: () => <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
});
import { articles as localArticles } from '@/data/articles';
import { shimmer, toBase64 } from '@/utils/imageUtils';

type Props = {
    params: Promise<{ slug: string }>;
};

import { supabase } from '@/utils/supabase';

// Helper to fetch article (cached if possible, but for simplicity direct call here)
async function getArticle(slug: string) {
    const localMatch = localArticles.find(a => a.slug === slug);
    const forceLocalSlugs = ['naming-tips-2026-year-of-horse', 'forbidden-letters-kalakini', 'most-accurate-phone-number-analysis-2026', 'what-is-shadow-power'];

    if (localMatch && forceLocalSlugs.includes(slug)) {
        return localMatch;
    }

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        // Fallback to local articles
        return localMatch || null;
    }
    return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return {
            title: 'บทความไม่พบ - NAMEMONGKOL',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.namemongkol.com';
    const rawImageUrl = article.cover_image || article.coverImage;
    const ogFallback = `${baseUrl}/api/og?variant=article&title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || '')}&meta=${encodeURIComponent(article.meta_description || article.excerpt || '')}`;
    const imageUrl = rawImageUrl
        ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${baseUrl}${rawImageUrl}`)
        : ogFallback;

    return {
        title: article.meta_title || article.title,
        description: article.meta_description || article.excerpt,
        keywords: article.keywords,
        alternates: {
            canonical: `${baseUrl}/articles/${slug}`,
        },
        openGraph: {
            title: article.meta_title || article.title,
            description: article.meta_description || article.excerpt,
            url: `${baseUrl}/articles/${slug}`,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ],
            type: 'article',
            siteName: 'NameMongkol',
            locale: 'th_TH',
        },
        twitter: {
            card: 'summary_large_image',
            title: article.meta_title || article.title,
            description: article.meta_description || article.excerpt,
            images: [imageUrl],
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden pb-20">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": article.title,
                        "description": article.excerpt,
                        "image": article.cover_image || article.coverImage,
                        "datePublished": article.date,
                        "dateModified": article.date,
                        "author": [{
                            "@type": "Person",
                            "name": article.author,
                            "url": "https://www.namemongkol.com"
                        }],
                        "publisher": {
                            "@type": "Organization",
                            "name": "NameMongkol",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.namemongkol.com/icon.png"
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://www.namemongkol.com/articles/${article.slug}`
                        }
                    })
                }}
            />

            <main className="w-full max-w-[1400px] px-4 py-8 relative z-10 pt-24 md:pt-32">
                <div className="max-w-3xl">
                    {/* Back Link */}
                    <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        ย้อนกลับไปหน้าบทความ
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 font-medium">
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 inline-flex items-center gap-1.5">
                            <Tag size={12} />
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{article.author}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
                        {article.title}
                    </h1>

                    {/* Cover Image */}
                    <div className="w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mb-10 overflow-hidden relative border border-white/5 shadow-2xl shadow-purple-900/10">
                        {/* 
                           Note: Since we might not have real images yet, 
                           we'll use a placeholder logic if exact file doesn't exist, 
                           but for now assume standard next/image usage.
                           In a real scenario, make sure these images exist in public/ folder.
                        */}
                        <ArticleImage
                            src={article.cover_image || article.coverImage}
                            alt={article.title}
                            priority
                            className="group-hover:scale-100" // Disable zoom effect if not needed, or keep standard
                        />
                    </div>

                    {/* Content */}
                    <article className="prose prose-invert prose-lg max-w-none text-slate-300">
                        <p className="lead text-xl text-slate-200 font-light border-l-4 border-purple-500 pl-4 italic">
                            {article.excerpt}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </article>

                    {/* Tags */}
                    {article.keywords && article.keywords.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-white/10">
                            <div className="flex flex-wrap gap-2">
                                {article.keywords && article.keywords.map((keyword: string) => (
                                    <span key={keyword} className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded hover:bg-slate-700 transition-colors cursor-default">
                                        #{keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">บริการอื่นๆ ของเรา</h3>
                        <ArticleCTA />
                    </div>

                    {/* Share */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-slate-400 font-medium">แชร์บทความนี้</span>
                        <ArticleShareButtons title={article.title} slug={article.slug} />
                    </div>
                </div>
            </main>
        </div>
    );
}

