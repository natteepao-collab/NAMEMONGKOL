import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com';
const siteUrl = rawSiteUrl.includes('namemongkol.com') && !rawSiteUrl.includes('www.')
    ? rawSiteUrl.replace('://namemongkol.com', '://www.namemongkol.com')
    : rawSiteUrl;

export const metadata: Metadata = {
    title: 'วิเคราะห์ออร่าและตัวตนผ่านชื่อ ด้วย AI | NameMongkol',
    description: 'ค้นพบบุคลิกภาพ ออร่า และพลังงานที่ซ่อนอยู่ในชื่อของคุณ AI วิเคราะห์ Archetype ตัวตน สีมงคล อาชีพที่เหมาะ และสัตว์สัญลักษณ์ประจำตัว ฟรี!',
    keywords: 'วิเคราะห์ออร่าชื่อ, AI วิเคราะห์ตัวตน, ชื่อมงคล, บุคลิกภาพจากชื่อ, Archetype ชื่อ, สีมงคลจากชื่อ, อาชีพเหมาะกับชื่อ, Name Personality, Name Aura',
    openGraph: {
        title: 'วิเคราะห์ออร่าและตัวตนผ่านชื่อ ด้วย AI | NameMongkol',
        description: 'ค้นพบบุคลิกภาพ ออร่า และพลังงานที่ซ่อนอยู่ในชื่อของคุณ AI วิเคราะห์ Archetype ตัวตน สีมงคล อาชีพที่เหมาะ และสัตว์สัญลักษณ์ประจำตัว',
        url: `${siteUrl}/aura-analysis`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=aura`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ออร่าและตัวตนผ่านชื่อ ด้วย AI | NameMongkol',
        description: 'ค้นพบบุคลิกภาพ ออร่า และพลังงานที่ซ่อนอยู่ในชื่อของคุณ AI วิเคราะห์ Archetype สีมงคล อาชีพที่เหมาะ',
        images: [`${siteUrl}/api/og?variant=aura`],
    },
    alternates: {
        canonical: `${siteUrl}/aura-analysis`,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function AuraAnalysisPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${siteUrl}/aura-analysis`,
                url: `${siteUrl}/aura-analysis`,
                name: 'วิเคราะห์ออร่าและตัวตนผ่านชื่อ ด้วย AI | NameMongkol',
                description: 'ค้นพบบุคลิกภาพ ออร่า และพลังงานที่ซ่อนอยู่ในชื่อของคุณ ด้วยระบบ AI วิเคราะห์ Archetype ตัวตน สีมงคล อาชีพที่เหมาะ',
                inLanguage: 'th-TH',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': `${siteUrl}/#website`,
                    name: 'NameMongkol',
                    url: siteUrl,
                },
            },
            {
                '@type': 'SoftwareApplication',
                name: 'AI Personality & Name Mirroring',
                description: 'วิเคราะห์ออร่าและตัวตนผ่านชื่อ ด้วยระบบ AI ค้นพบ Archetype บุคลิกภาพ สีมงคล อาชีพที่เหมาะ และสัตว์สัญลักษณ์ประจำตัว',
                applicationCategory: 'LifestyleApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'THB',
                },
                featureList: [
                    'วิเคราะห์ Archetype ตัวตนจากชื่อ',
                    'แสดงสีมงคลประจำตัว (Moodboard)',
                    'แนะนำอาชีพที่เหมาะสม',
                    'วิเคราะห์ Voice & Tone การสื่อสาร',
                    'สัตว์สัญลักษณ์ประจำตัว (Spirit Identity)',
                    'รองรับชื่อตัวเอง ชื่อลูก และชื่อแบรนด์',
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                </div>
            }>
                <ClientPage />
            </Suspense>
        </>
    );
}
