import { Metadata } from 'next';
import Script from 'next/script';
import ClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis) - ตรวจสอบหลายชื่อพร้อมกัน ฟรี! | NameMongkol',
    description: 'ระบบวิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis) ฟรี! ตรวจสอบรายชื่อหลายชื่อพร้อมกัน เหมาะสำหรับตั้งชื่อลูก เลือกชื่อใหม่ คัดกรองชื่อมงคลจากหลายตัวเลือก ด้วยระบบ AI วิเคราะห์เลขศาสตร์และทักษาปกรณ์',
    keywords: 'วิเคราะห์ชื่อหลายชื่อ, Bulk Analysis, ตรวจสอบชื่อมงคล, ตั้งชื่อลูก, เปรียบเทียบชื่อ, คัดกรองชื่อ, เลขศาสตร์, ทักษาปกรณ์, ชื่อมงคล, วิเคราะห์ชื่อฟรี',
    alternates: {
        canonical: `${siteUrl}/name-analysis`,
    },
    openGraph: {
        title: 'วิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis) - ตรวจสอบหลายชื่อพร้อมกัน',
        description: 'เช็คชื่อมงคลทีละหลายชื่อพร้อมกัน รู้ผลทันที พร้อมจัดลำดับเกรดความมงคล ฟรี!',
        url: `${siteUrl}/name-analysis`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=Bulk%20Name%20Analysis&subtitle=วิเคราะห์ชื่อหลายรายการพร้อมกัน%20จัดเกรดอัตโนมัติ&tag=Bulk%20Analysis`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis) | NameMongkol',
        description: 'เช็คชื่อมงคลทีละหลายชื่อพร้อมกัน รู้ผลทันที พร้อมจัดลำดับเกรด',
        images: [`${siteUrl}/api/og?variant=default&title=Bulk%20Name%20Analysis`],
    },
};

// JSON-LD Schema
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'NameMongkol Bulk Name Analysis',
    'description': 'ระบบวิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis) ตรวจสอบหลายชื่อพร้อมกัน',
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'THB',
    },
    'featureList': [
        'วิเคราะห์ชื่อหลายรายการพร้อมกัน',
        'จัดเกรดความมงคลอัตโนมัติ',
        'คำนวณผลรวมเลขศาสตร์',
        'ตรวจสอบอักษรกาลกิณี',
    ],
};

export default function NameAnalysisPage() {
    return (
        <>
            <Script
                id="name-analysis-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClientPage />
        </>
    );
}
