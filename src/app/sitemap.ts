import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com'

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
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))
}
