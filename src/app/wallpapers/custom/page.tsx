import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientPage from '../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'สร้างวอลเปเปอร์มงคลส่วนตัว AI 2569 | NameMongkol',
    description: 'ออกแบบวอลเปเปอร์มงคลของคุณเองด้วย AI จากชื่อ วันเกิด และดวงชะตา เหมาะสำหรับเสริมดวงเฉพาะบุคคล',
    keywords: ['สร้างวอลเปเปอร์มงคล', 'วอลเปเปอร์ AI', 'ออกแบบพื้นหลังมงคล', 'NameMongkol'],
    openGraph: {
        title: 'สร้างวอลเปเปอร์มงคลส่วนตัว AI 2569 | NameMongkol',
        description: 'ออกแบบวอลเปเปอร์เสริมดวงเฉพาะบุคคลด้วย AI',
        url: `${siteUrl}/wallpapers/custom`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: `${siteUrl}/wallpapers/custom`,
    },
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
        { '@type': 'ListItem', position: 3, name: 'สร้างวอลเปเปอร์ส่วนตัว', item: `${siteUrl}/wallpapers/custom` },
    ],
};

export default function CustomWallpaperPage() {
    return (
        <>
            <Script
                id="wallpapers-custom-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Suspense>
                <ClientPage initialTab="custom" />
            </Suspense>
        </>
    );
}
