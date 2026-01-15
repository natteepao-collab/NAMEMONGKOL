import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com'

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define static routes
    const routes = [
        '',
        '/about',
        '/articles', // Added articles landing page
        '/login',
        '/register',
        '/name-analysis',
        '/phone-analysis',
        '/premium-analysis',
        '/premium-search',
        '/privacy',
        '/search',
        '/slip-verification',
        '/terms',
        '/topup',
        '/wallpapers',
    ]

    const staticUrls = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

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

    // Fetch dynamic articles
    let articleUrls: MetadataRoute.Sitemap = [];
    try {
        const { data: articles } = await supabase
            .from('articles')
            .select('slug, date') // Assuming 'date' is created_at or published date
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

    return [...staticUrls, ...wallpaperUrls, ...articleUrls];
}
