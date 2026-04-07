import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ClientPage from '../../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

const DAY_META: Record<string, { label: string; desc: string; keywords: string[] }> = {
    sunday: {
        label: 'วันอาทิตย์',
        desc: 'วอลเปเปอร์มงคลสำหรับคนเกิดวันอาทิตย์ เสริมอำนาจบารมี โชคลาภก้อนใหญ่ สีมงคลแดง-ส้ม ออกแบบตามหลักฮวงจุ้ยและโหราศาสตร์ไทย',
        keywords: ['วอลเปเปอร์วันอาทิตย์', 'สีมงคลวันอาทิตย์', 'เสริมดวงวันอาทิตย์'],
    },
    monday: {
        label: 'วันจันทร์',
        desc: 'วอลเปเปอร์มงคลสำหรับคนเกิดวันจันทร์ เสริมเสน่ห์ เมตตามหานิยม สีมงคลเหลือง ออกแบบตามหลักฮวงจุ้ยและโหราศาสตร์ไทย',
        keywords: ['วอลเปเปอร์วันจันทร์', 'สีมงคลวันจันทร์', 'เสริมดวงวันจันทร์'],
    },
    tuesday: {
        label: 'วันอังคาร',
        desc: 'วอลเปเปอร์มงคลสำหรับคนเกิดวันอังคาร เสริมพลังกล้าหาญ ก้าวหน้าในหน้าที่การงาน สีมงคลชมพู ออกแบบตามหลักฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันอังคาร', 'สีมงคลวันอังคาร', 'เสริมดวงวันอังคาร'],
    },
    wednesday: {
        label: 'วันพุธ',
        desc: 'วอลเปเปอร์มงคลสำหรับคนเกิดวันพุธ เสริมวาจาเรียกทรัพย์ ค้าขายร่ำรวย สีมงคลเขียว ออกแบบตามหลักฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันพุธ', 'สีมงคลวันพุธ', 'เสริมดวงวันพุธ'],
    },
    thursday: {
        label: 'วันพฤหัสบดี',
        desc: 'วอลเปเปอร์มงคลสำหรับคนเกิดวันพฤหัสบดี เสริมสติปัญญา ผู้ใหญ่อุปถัมภ์ สีมงคลส้ม ออกแบบตามหลักฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันพฤหัสบดี', 'สีมงคลวันพฤหัสบดี', 'เสริมดวงวันพฤหัสบดี'],
    },
    friday: {
        label: 'วันศุกร์',
        desc: 'วอลเปเปอร์มงคลสำหรับคนเกิดวันศุกร์ เสริมโชคลาภ ความรัก ทรัพย์สินพูนทวี สีมงคลฟ้า ออกแบบตามหลักฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันศุกร์', 'สีมงคลวันศุกร์', 'เสริมดวงวันศุกร์'],
    },
    saturday: {
        label: 'วันเสาร์',
        desc: 'วอลเปเปอร์มงคลสำหรับคนเกิดวันเสาร์ เสริมอำนาจ ปกป้องคุ้มครอง ความสำเร็จยั่งยืน สีมงคลม่วง ออกแบบตามหลักฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันเสาร์', 'สีมงคลวันเสาร์', 'เสริมดวงวันเสาร์'],
    },
};

const VALID_DAYS = Object.keys(DAY_META);

type Props = { params: Promise<{ day: string }> };

export async function generateStaticParams() {
    return VALID_DAYS.map((day) => ({ day }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { day } = await params;
    const meta = DAY_META[day];
    if (!meta) return {};

    const title = `วอลเปเปอร์มงคล${meta.label} 2569 เสริมดวง | NameMongkol`;
    return {
        title,
        description: meta.desc,
        keywords: [...meta.keywords, 'วอลเปเปอร์มงคล', 'NameMongkol'],
        openGraph: {
            title,
            description: meta.desc,
            url: `${siteUrl}/wallpapers/day/${day}`,
            siteName: 'NameMongkol',
            locale: 'th_TH',
            type: 'website',
            images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent(`วอลเปเปอร์มงคล${meta.label}`)}&subtitle=${encodeURIComponent('เสริมดวง 2569')}&tag=Wallpapers`],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: meta.desc,
        },
        alternates: {
            canonical: `${siteUrl}/wallpapers/day/${day}`,
        },
    };
}

export default async function DayWallpapersPage({ params }: Props) {
    const { day } = await params;
    if (!VALID_DAYS.includes(day)) notFound();

    const meta = DAY_META[day];

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
            { '@type': 'ListItem', position: 3, name: `${meta.label}`, item: `${siteUrl}/wallpapers/day/${day}` },
        ],
    };

    return (
        <>
            <Script
                id={`wallpapers-day-${day}-breadcrumb`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Suspense>
                <ClientPage initialCategory="day" initialDay={day} initialTab="collection" />
            </Suspense>
        </>
    );
}
