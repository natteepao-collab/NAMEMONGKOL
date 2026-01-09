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
        '/login',
        '/register',
        '/name-analysis',
        '/premium-analysis',
        '/premium-search',
        '/search',
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

    return [...staticUrls, ...wallpaperUrls];
}
