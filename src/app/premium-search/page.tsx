import { Metadata } from 'next';
import Script from 'next/script';
import ClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'ค้นหาชื่อมงคล Pro - ฐานข้อมูล 50,000+ ชื่อ ตัวกรองขั้นสูง | NameMongkol',
    description: 'ค้นหาชื่อมงคลจากฐานข้อมูลกว่า 50,000 ชื่อ พร้อมตัวกรองขั้นสูง กรองตามวันเกิด ผลรวมเลขศาสตร์ อักษรนำ (วรรคเดช/วรรคศรี) ความยาวชื่อ และความหมาย เพื่อให้ได้ชื่อที่ดีที่สุดสำหรับคุณ',
    keywords: 'ค้นหาชื่อมงคล Pro, ชื่อมงคลพรีเมี่ยม, ฐานข้อมูลชื่อ, ตั้งชื่อลูก, วรรคเดช, วรรคศรี, ผลรวมเลขศาสตร์, อักษรนำ, ชื่อมงคลขั้นสูง, ตัวกรองชื่อ',
    alternates: {
        canonical: `${siteUrl}/premium-search`,
    },
    openGraph: {
        title: 'ค้นหาชื่อมงคล Pro - ฐานข้อมูล 50,000+ ชื่อ ตัวกรองขั้นสูง',
        description: 'ค้นหาชื่อดี ความหมายมงคล กรองตามวันเกิด ผลรวมเลขศาสตร์ และอักษรนำ (วรรคเดช/วรรคศรี)',
        url: `${siteUrl}/premium-search`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=ค้นหาชื่อมงคล%20Pro&subtitle=ฐานข้อมูลกว่า%2050,000%20ชื่อ%20พร้อมตัวกรองขั้นสูง&tag=Premium%20Search`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ค้นหาชื่อมงคล Pro - ฐานข้อมูล 50,000+ ชื่อ | NameMongkol',
        description: 'ค้นหาชื่อดี ความหมายมงคล กรองตามวันเกิด ผลรวมเลขศาสตร์ และอักษรนำ',
        images: [`${siteUrl}/api/og?variant=default&title=ค้นหาชื่อมงคล%20Pro`],
    },
};

// JSON-LD Schema
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'NameMongkol Premium Search',
    'description': 'ระบบค้นหาชื่อมงคล Pro จากฐานข้อมูลกว่า 50,000 ชื่อ พร้อมตัวกรองขั้นสูง',
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'THB',
    },
    'featureList': [
        'ฐานข้อมูลชื่อมงคลกว่า 50,000 ชื่อ',
        'กรองตามวันเกิด',
        'กรองตามผลรวมเลขศาสตร์',
        'กรองตามอักษรนำ (วรรคเดช/วรรคศรี)',
        'กรองตามความยาวชื่อ',
    ],
};

export default function PremiumSearchPage() {
    return (
        <>
            <Script
                id="premium-search-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClientPage />
        </>
    );
}
