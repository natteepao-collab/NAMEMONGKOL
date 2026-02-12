import { Metadata } from 'next';
import Script from 'next/script';
import ClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'วอลเปเปอร์มงคล - เสริมดวง เรียกทรัพย์ เมตตามหานิยม | NameMongkol',
    description: 'ดาวน์โหลดวอลเปเปอร์มงคลเสริมดวงชะตา ออกแบบตามหลักฮวงจุ้ยและโหราศาสตร์ไทย เสริมด้านการเงิน การงาน ความรัก และสุขภาพ ฟรี!',
    keywords: ['วอลเปเปอร์มงคล', 'วอลเปเปอร์เสริมดวง', 'วอลเปเปอร์สายมู', 'พื้นหลังมงคล', 'ฮวงจุ้ย', 'เสริมดวงการเงิน', 'NameMongkol'],

    openGraph: {
        title: 'วอลเปเปอร์มงคล - เสริมดวง เรียกทรัพย์',
        description: 'แจกฟรี! วอลเปเปอร์สายมู เสริมดวงรอบด้าน การเงิน ความรัก การงาน',
        url: `${siteUrl}/wallpapers`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=วอลเปเปอร์มงคล&subtitle=แจกฟรี%20ดีไซน์เสริมดวง%20การเงิน%20การงาน%20ความรัก&tag=Wallpapers`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วอลเปเปอร์มงคล | NameMongkol',
        description: 'แจกฟรี! วอลเปเปอร์สายมู เสริมดวงรอบด้าน',
        images: [`${siteUrl}/api/og?variant=default&title=วอลเปเปอร์มงคล`],
    },
};

// JSON-LD Schema
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'วอลเปเปอร์มงคล',
    'description': 'คอลเลกชันวอลเปเปอร์มงคลเสริมดวงชะตาตามหลักฮวงจุ้ยและโหราศาสตร์ไทย',
    'url': `${siteUrl}/wallpapers`,
    'isPartOf': {
        '@type': 'WebSite',
        'name': 'NameMongkol',
        'url': siteUrl,
    },
};

export default function WallpapersPage() {
    return (
        <>
            <Script
                id="wallpapers-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClientPage />
        </>
    );
}
