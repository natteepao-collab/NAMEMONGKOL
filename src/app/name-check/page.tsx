import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientHome from '@/app/ClientHome';
import { HomeFallback } from '@/components/HomeFallback';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อ นามสกุล ฟรี ทันที ด้วย AI 4 ศาสตร์ | NameMongkol',
    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/name-check` },
    description:
        'วิเคราะห์ชื่อ นามสกุล ฟรี ไม่ต้องสมัครสมาชิก กรอกชื่อ-นามสกุล เลือกวันเกิด รู้ผลทันที คำนวณผลรวมเลขศาสตร์, ทักษาปกรณ์, อายตนะ 6, นิรันดร์ศาสตร์ ครบทุกศาสตร์โบราณ',
    keywords:
        'วิเคราะห์ชื่อนามสกุลฟรี, วิเคราะห์ชื่อ นามสกุล ฟรี, ตรวจชื่อนามสกุล, โปรแกรมวิเคราะห์ชื่อ, วิเคราะห์ชื่อฟรี, วิเคราะห์ชื่อและนามสกุล, เช็คชื่อนามสกุล, ดูดวงชื่อนามสกุล',
    openGraph: {
        title: 'วิเคราะห์ชื่อ นามสกุล ฟรี ทันที | NameMongkol',
        description:
            'วิเคราะห์ชื่อ นามสกุล ฟรี ไม่ต้องสมัคร ครบ 4 ศาสตร์ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์',
        url: `${siteUrl}/name-check`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [
            `${siteUrl}/api/og?variant=default&title=วิเคราะห์ชื่อ+นามสกุล+ฟรี&subtitle=ไม่ต้องสมัคร+ครบ+4+ศาสตร์+รู้ผลทันที&tag=ฟรี`,
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อ นามสกุล ฟรี ทันที | NameMongkol',
        description: 'วิเคราะห์ชื่อ นามสกุล ฟรี ไม่ต้องสมัคร ครบ 4 ศาสตร์ รู้ผลทันที',
        images: [`${siteUrl}/api/og?variant=default&title=วิเคราะห์ชื่อ+นามสกุล+ฟรี`],
    },
};

// ── JSON-LD Schemas ──────────────────────────────────────────────────────────

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/name-check#webpage`,
    url: `${siteUrl}/name-check`,
    name: 'วิเคราะห์ชื่อ นามสกุล ฟรี ทันที ด้วย AI 4 ศาสตร์ | NameMongkol',
    description:
        'วิเคราะห์ชื่อ นามสกุล ฟรี ไม่ต้องสมัครสมาชิก ครบทั้ง 4 ศาสตร์ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์',
    isPartOf: { '@id': `${siteUrl}/#website` },
    inLanguage: 'th-TH',
    breadcrumb: { '@id': `${siteUrl}/name-check#breadcrumb` },
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}/name-check#breadcrumb`,
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'หน้าแรก',
            item: siteUrl,
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'วิเคราะห์ชื่อ นามสกุล ฟรี',
            item: `${siteUrl}/name-check`,
        },
    ],
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'วิเคราะห์ชื่อ นามสกุล ฟรี ต้องสมัครสมาชิกไหม?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ไม่ต้องสมัครสมาชิก! เพียงกรอกชื่อและนามสกุล เลือกวันเกิด แล้วกดวิเคราะห์ NameMongkol จะให้ผลลัพธ์ทันที โดยไม่มีค่าใช้จ่าย',
            },
        },
        {
            '@type': 'Question',
            name: 'วิเคราะห์ชื่อ นามสกุล แล้วได้ข้อมูลอะไรบ้าง?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ได้รับผลวิเคราะห์ครบ 4 ศาสตร์: (1) เลขศาสตร์ — ผลรวมตัวเลขชื่อ+นามสกุล บอกระดับมงคล, (2) ทักษาปกรณ์ — เช็คอักษรกาลกิณีตามวันเกิด, (3) อายตนะ 6 — พลังพื้นดวงชะตา, (4) นิรันดร์ศาสตร์ — ความสัมพันธ์ระหว่างชื่อและนามสกุล',
            },
        },
        {
            '@type': 'Question',
            name: 'ทำไมต้องวิเคราะห์นามสกุลด้วย ไม่ใช่แค่ชื่อ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'นามสกุลส่งผลต่อดวงชะตาไม่แพ้ชื่อ ทั้งสองต้องส่งเสริมกัน ผลรวมเลขศาสตร์ที่แท้จริงคำนวณจากชื่อ+นามสกุลรวมกัน ตามหลักนิรันดร์ศาสตร์ที่ตรวจความสัมพันธ์ระหว่างชื่อต้นและนามสกุล',
            },
        },
        {
            '@type': 'Question',
            name: 'วิเคราะห์ชื่อ นามสกุล ฟรี แม่นยำแค่ไหน?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'NameMongkol ใช้ระบบ AI ผสาน 4 ศาสตร์โบราณของไทย ได้แก่ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์ ซึ่งเป็นตำราที่ได้รับการยอมรับ ให้ผลลัพธ์ละเอียดและแม่นยำกว่าโปรแกรมทั่วไป',
            },
        },
        {
            '@type': 'Question',
            name: 'ชื่อมงคลกับนามสกุลต้องใช้ผลรวมเลขเท่าไหร่ถึงจะดี?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ผลรวมเลขศาสตร์ที่ถือว่ามงคลมี 27 ค่า เช่น 9, 14, 15, 19, 24, 36, 41, 42, 45, 50, 51, 54, 56, 59, 63, 65, 90, 99 ชื่อ+นามสกุลที่รวมกันแล้วได้ค่าเหล่านี้จะได้เกรด A ขึ้นไป',
            },
        },
    ],
};

const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีวิเคราะห์ชื่อ นามสกุล ฟรี ที่ NameMongkol',
    description: 'ขั้นตอนการวิเคราะห์ชื่อและนามสกุลฟรีด้วยระบบ AI 4 ศาสตร์',
    totalTime: 'PT1M',
    step: [
        {
            '@type': 'HowToStep',
            position: 1,
            name: 'กรอกชื่อและนามสกุล',
            text: 'พิมพ์ชื่อในช่อง "ชื่อ" และนามสกุลในช่อง "นามสกุล" ด้านบน',
        },
        {
            '@type': 'HowToStep',
            position: 2,
            name: 'เลือกวันเกิด',
            text: 'เลือกวันเกิด (จันทร์-อาทิตย์) เพื่อวิเคราะห์ทักษาปกรณ์และตรวจอักษรกาลกิณี',
        },
        {
            '@type': 'HowToStep',
            position: 3,
            name: 'กดวิเคราะห์ รู้ผลทันที',
            text: 'กดปุ่มวิเคราะห์ ระบบจะประมวลผลทันที แสดงเกรด ผลรวมเลขศาสตร์ คู่ตัวเลขมงคล ทักษา และพลังเงา',
        },
    ],
};

export default function NameCheckPage() {
    return (
        <>
            <Script
                id="name-check-webpage-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            <Script
                id="name-check-breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Script
                id="name-check-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script
                id="name-check-howto-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />

            {/* SEO intro — visible text targeting the keyword, placed above the fold area */}
            <div className="sr-only">
                <h1>วิเคราะห์ชื่อ นามสกุล ฟรี ด้วย AI 4 ศาสตร์ | NameMongkol</h1>
                <p>
                    วิเคราะห์ชื่อและนามสกุล ฟรี ทันที ไม่ต้องสมัครสมาชิก
                    ด้วยระบบ AI ที่ผสาน 4 ศาสตร์โบราณ: เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์
                    คำนวณผลรวมเลขศาสตร์ของทั้งชื่อ-นามสกุล ตรวจอักษรกาลกิณี และวิเคราะห์พลังเงา
                </p>
            </div>

            {/* Reuse the main Home tool — same experience, different URL targeting new keyword */}
            <Suspense fallback={<HomeFallback />}>
                <ClientHome />
            </Suspense>
        </>
    );
}
