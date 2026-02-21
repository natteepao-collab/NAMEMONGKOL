
import { cache } from 'react';
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
import { articles as localArticles, Article } from '@/data/articles';
import { shimmer, toBase64 } from '@/utils/imageUtils';

// ISR: cache 1 hour, invalidate via revalidateTag('articles') when admin updates
export const revalidate = 3600;

type Props = {
    params: Promise<{ slug: string }>;
};

import { supabase } from '@/utils/supabase';

// Dedupe fetches between generateMetadata and page component
const getArticle = cache(async (slug: string): Promise<Article | null> => {
    const localMatch = localArticles.find(a => a.slug === slug);
    const forceLocalSlugs = ['naming-tips-2026-year-of-horse', 'forbidden-letters-kalakini', 'most-accurate-phone-number-analysis-2026', 'what-is-shadow-power', 'history-of-thai-naming-tradition', '100-auspicious-women-names-2026'];

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

    // Map Supabase snake_case to Article camelCase
    return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.cover_image, // Map here
        date: data.date,
        author: data.author,
        category: data.category,
        keywords: data.keywords,
        metaTitle: data.meta_title, // Map here
        metaDescription: data.meta_description, // Map here
        // DB columns might not exist for these yet
        relatedSlugs: [],
        toc: []
    } as Article;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return {
            title: 'บทความไม่พบ - NAMEMONGKOL',
        };
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com').replace(/\/$/, '');
    const rawImageUrl = article.coverImage;

    // Construct the OG image URL
    let imageUrl = `${baseUrl}/api/og?variant=article&title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || '')}&meta=${encodeURIComponent(article.metaDescription || article.excerpt || '')}`;

    if (rawImageUrl) {
        try {
            // Check if it's already an absolute URL
            if (rawImageUrl.startsWith('http')) {
                imageUrl = rawImageUrl;
            } else {
                // Combine baseUrl and relative path, using URL object to handle encoding of Thai characters automatically
                // We ensure rawImageUrl starts with / to be safe, but URL constructor handles it relative to base
                const cleanPath = rawImageUrl.startsWith('/') ? rawImageUrl : `/${rawImageUrl}`;
                imageUrl = new URL(cleanPath, baseUrl).toString();
            }
        } catch (e) {
            console.error('Error constructing OG image URL:', e);
            // Fallback to OG generator if URL construction fails
        }
    }

    return {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt,
        keywords: article.keywords,
        alternates: { canonical: `${baseUrl}/articles/${slug}` },
        openGraph: {
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.excerpt,
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
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.excerpt,
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

    // Get related articles (prioritize manual relatedSlugs, then fall back to category)
    let relatedArticles: Article[] = [];

    if (article.relatedSlugs && article.relatedSlugs.length > 0) {
        relatedArticles = localArticles.filter(a => article.relatedSlugs?.includes(a.slug));
    }

    // Fill up with category matches if needed
    if (relatedArticles.length < 3) {
        const categoryMatches = localArticles.filter(a =>
            a.category === article.category &&
            a.slug !== slug &&
            !relatedArticles.some(r => r.slug === a.slug)
        );
        relatedArticles = [...relatedArticles, ...categoryMatches].slice(0, 3);
    }

    // Breadcrumb Schema
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'หน้าหลัก',
                'item': 'https://www.namemongkol.com'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'บทความชื่อมงคล',
                'item': 'https://www.namemongkol.com/articles'
            },
            {
                '@type': 'ListItem',
                'position': 3,
                'name': article.title,
                'item': `https://www.namemongkol.com/articles/${slug}`
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden pb-28">
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
                        "image": article.coverImage,
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
                        },
                        "keywords": article.keywords?.join(', ') || ''
                    })
                }}
            />
            <Script
                id="article-breadcrumb-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <main className="w-full max-w-[1400px] px-4 py-8 relative z-10 pt-6 md:pt-32">
                <div className="max-w-3xl">
                    {/* Breadcrumb Navigation */}
                    <nav className="mb-6 text-sm text-slate-400" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 flex-wrap">
                            <li><Link href="/" className="hover:text-white transition-colors">หน้าหลัก</Link></li>
                            <li className="text-slate-600">/</li>
                            <li><Link href="/articles" className="hover:text-white transition-colors">บทความ</Link></li>
                            <li className="text-slate-600">/</li>
                            <li className="text-purple-400 font-medium truncate max-w-[200px] md:max-w-none">{article.title}</li>
                        </ol>
                    </nav>

                    {/* Back Link */}
                    <Link href="/articles" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-sm w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>บทความทั้งหมด</span>
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
                            src={article.coverImage}
                            alt={`ภาพหน้าปอบทความ ${article.title} - บทความชื่อมงคล NameMongkol`}
                            priority
                            className="group-hover:scale-100" // Disable zoom effect if not needed, or keep standard
                        />
                    </div>

                    {/* Table of Contents */}
                    {article.toc && article.toc.length > 0 && (
                        <nav className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700/50">
                            <h2 className="text-lg font-bold text-white mb-4">สารบัญ</h2>
                            <ul className="space-y-2">
                                {article.toc.map((item) => (
                                    <li key={item.id} style={{ paddingLeft: (item.level - 2) * 16 }}>
                                        <a href={`#${item.id}`} className="text-slate-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0" />
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

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

                    {/* Related Articles Section */}
                    {relatedArticles.length > 0 && (
                        <section className="mt-12 pt-8 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                บทความที่เกี่ยวข้อง
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/articles/${related.slug}`}
                                        className="group bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:-translate-y-1"
                                    >
                                        <div className="h-32 w-full bg-slate-700 relative overflow-hidden">
                                            <ArticleImage
                                                src={related.coverImage}
                                                alt={`ภาพหน้าปอบทความ ${related.title} - บทความชื่อมงคล NameMongkol`}
                                                priority={false}
                                                className="group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs text-purple-400 mb-2">{related.category}</div>
                                            <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                                                {related.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SEO Bottom Content */}
                    <section className="mt-12 pt-8 border-t border-white/10 bg-slate-800/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-amber-400 mb-4">เกี่ยวกับ NameMongkol</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            <strong className="text-slate-300">NameMongkol</strong> คือเว็บไซต์วิเคราะห์ชื่อมงคลอันดับ 1 ของไทย
                            ใช้ระบบ AI ผสานศาสตร์โบราณ ครอบคลุม <strong className="text-slate-300">เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6</strong>
                            และ <strong className="text-slate-300">อักษรกาลกิณี</strong>
                            ให้บริการทั้งวิเคราะห์ชื่อฟรีและค้นหาชื่อมงคล Premium พร้อมวอลเปเปอร์มงคลเสริมดวง
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วิเคราะห์ชื่อฟรี
                            </Link>
                            <Link href="/premium-search" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                ค้นหาชื่อมงคล Premium
                            </Link>
                            <Link href="/phone-analysis" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วิเคราะห์เบอร์มงคล
                            </Link>
                            <Link href="/wallpapers" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วอลเปเปอร์มงคล
                            </Link>
                            <Link href="/articles" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                บทความทั้งหมด
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

