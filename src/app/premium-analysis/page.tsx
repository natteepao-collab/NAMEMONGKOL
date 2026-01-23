import { Metadata } from 'next';
import Script from 'next/script';
import ClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อมงคลขั้นสูง (Premium) - เจาะลึกดวงชะตาเฉพาะบุคคล | NameMongkol',
    description: 'บริการวิเคราะห์ชื่อมงคลขั้นสูงโดยใช้หลักทักษาปกรณ์และเลขศาสตร์ชั้นสูง คำนวณตามวันเดือนปีเกิดและเวลาตกฟาก เพื่อผลลัพธ์ที่แม่นยำและส่งเสริมดวงชะตาของคุณอย่างแท้จริง',
    keywords: ['วิเคราะห์ชื่อมงคล', 'ชื่อมงคล Premium', 'ทักษาปกรณ์', 'เลขศาสตร์ชั้นสูง', 'ดูดวงชื่อ', 'ตั้งชื่อตามวันเกิด', 'เปลี่ยนชื่อ', 'NameMongkol'],
    alternates: {
        canonical: `${siteUrl}/premium-analysis`,
    },
    openGraph: {
        title: 'วิเคราะห์ชื่อมงคลขั้นสูง (Premium) - แม่นยำที่สุด',
        description: 'วิเคราะห์เจาะลึกด้วยวันเดือนปีและเวลาเกิด หาชื่อที่ใช่ที่สุดสำหรับคุณ',
        url: `${siteUrl}/premium-analysis`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=วิเคราะห์ชื่อมงคล%20Premium&subtitle=เจาะลึกตามวันเดือนปี%20และเวลาเกิด%20แม่นยำที่สุด&tag=Premium%20Analysis`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อมงคลขั้นสูง (Premium) | NameMongkol',
        description: 'วิเคราะห์เจาะลึกด้วยวันเดือนปีและเวลาเกิด',
        images: [`${siteUrl}/api/og?variant=default&title=วิเคราะห์ชื่อมงคล%20Premium`],
    },
};

// JSON-LD Schema
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'NameMongkol Premium Analysis',
    'description': 'บริการวิเคราะห์ชื่อมงคลขั้นสูงโดยใช้หลักทักษาปกรณ์และเลขศาสตร์ชั้นสูง',
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'THB',
    },
};

export default function PremiumAnalysisPage() {
    return (
        <>
            <Script
                id="premium-analysis-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClientPage />
        </>
    );
}
