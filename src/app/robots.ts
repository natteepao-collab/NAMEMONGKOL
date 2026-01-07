import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/profile/', '/history/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
