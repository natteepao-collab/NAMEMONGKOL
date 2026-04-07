import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientPage from '../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'วอลเปเปอร์มงคลตามราศี 2569 เสริมดวงชะตา | NameMongkol',
    description: 'รวมวอลเปเปอร์มงคลเสริมดวงตาม 12 ราศี เมษ พฤษภ เมถุน กรกฎ สิงห์ กันย์ ตุลย์ พิจิก ธนู มังกร กุมภ์ มีน ดาวน์โหลดฟรี',
    keywords: ['วอลเปเปอร์ราศี', 'วอลเปเปอร์มงคลราศี', 'เสริมดวงตามราศี', 'NameMongkol'],
    openGraph: {
        title: 'วอลเปเปอร์มงคลตามราศี 2569 | NameMongkol',
        description: 'รวมวอลเปเปอร์มงคลเสริมดวงครบทั้ง 12 ราศี',
        url: `${siteUrl}/wallpapers/zodiac`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: `${siteUrl}/wallpapers/zodiac`,
    },
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
        { '@type': 'ListItem', position: 3, name: 'วอลเปเปอร์ตามราศี', item: `${siteUrl}/wallpapers/zodiac` },
    ],
};

export default function ZodiacIndexPage() {
    return (
        <>
            <Script
                id="wallpapers-zodiac-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Suspense>
                <ClientPage initialCategory="zodiac" initialTab="collection" />
            </Suspense>
        </>
    );
}
