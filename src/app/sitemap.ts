import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { articles as localArticles } from '@/data/articles'

export const dynamic = 'force-dynamic'

// Popular names for meaning pages (SEO-important pages)
const popularNames = [
    'ภูมิพัฒน์', 'ธนกร', 'ปภาวรินทร์', 'ณัฐชา', 'พิชญา', 'กันต์พงษ์', 'สิรภพ', 
    'อภิชญา', 'พิมพ์ชนก', 'ชนิดาภา', 'กิตติภัทร', 'วรินทร', 'ภัคพล', 'ธนัช',
    'นภัสสร', 'ปุณยวีร์', 'ณิชา', 'ชนมน', 'กฤษณ์', 'ศุภกร', 'ธีรภัทร', 'ปัณณวิชญ์'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com'

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define static routes with proper priorities
    const routes = [
        { path: '', priority: 1.0, changeFreq: 'daily' as const },
        { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
        { path: '/articles', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/login', priority: 0.3, changeFreq: 'monthly' as const },
        { path: '/register', priority: 0.3, changeFreq: 'monthly' as const },
        { path: '/name-analysis', priority: 0.9, changeFreq: 'weekly' as const },
        { path: '/phone-analysis', priority: 0.9, changeFreq: 'weekly' as const },
        { path: '/premium-analysis', priority: 0.8, changeFreq: 'weekly' as const },
        { path: '/premium-search', priority: 0.8, changeFreq: 'weekly' as const },
        { path: '/privacy', priority: 0.2, changeFreq: 'yearly' as const },
        { path: '/reviews', priority: 0.7, changeFreq: 'weekly' as const },
        { path: '/search', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/terms', priority: 0.2, changeFreq: 'yearly' as const },
        { path: '/topup', priority: 0.5, changeFreq: 'monthly' as const },
        { path: '/wallpapers', priority: 0.7, changeFreq: 'weekly' as const },
    ]

    const staticUrls = routes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFreq,
        priority: route.priority,
    }))

    // Add popular name meaning pages for SEO
    const meaningUrls: MetadataRoute.Sitemap = popularNames.map((name) => ({
        url: `${baseUrl}/meaning/${encodeURIComponent(name)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Fetch dynamic wallpapers
    let wallpaperUrls: MetadataRoute.Sitemap = [];
    try {
        const { data: wallpapers } = await supabase
            .from('wallpapers')
            .select('id, created_at');

        if (wallpapers) {
            wallpaperUrls = wallpapers.map((wp) => ({
                url: `${baseUrl}/wallpapers?id=${wp.id}`,
                lastModified: wp.created_at ? new Date(wp.created_at) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch (error) {
        console.error('Sitemap generation error (wallpapers):', error);
    }

    // Fetch dynamic articles from database
    let articleUrls: MetadataRoute.Sitemap = [];
    try {
        const { data: articles } = await supabase
            .from('articles')
            .select('slug, date')
            .eq('is_published', true);

        if (articles) {
            articleUrls = articles.map((article) => ({
                url: `${baseUrl}/articles/${article.slug}`,
                lastModified: article.date ? new Date(article.date) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        }
    } catch (error) {
        console.error('Sitemap generation error (articles):', error);
    }

    // Add local articles from articles.ts (these are hardcoded articles)
    const localArticleUrls: MetadataRoute.Sitemap = localArticles.map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: article.date ? new Date(article.date) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Merge and deduplicate articles (local articles take priority)
    const allArticleSlugs = new Set(localArticleUrls.map(a => a.url));
    const dbOnlyArticles = articleUrls.filter(a => !allArticleSlugs.has(a.url));

    return [...staticUrls, ...meaningUrls, ...wallpaperUrls, ...localArticleUrls, ...dbOnlyArticles];
}
