import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ClientPage from '../../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

const ZODIAC_META: Record<string, { label: string; emoji: string; desc: string; keywords: string[] }> = {
    aries:       { label: 'ราศีเมษ',   emoji: '♈', desc: 'วอลเปเปอร์มงคลราศีเมษ เสริมความเป็นผู้นำ กล้าตัดสินใจ พลังขับเคลื่อนชีวิต', keywords: ['วอลเปเปอร์ราศีเมษ', 'เสริมดวงราศีเมษ'] },
    taurus:      { label: 'ราศีพฤษภ',  emoji: '♉', desc: 'วอลเปเปอร์มงคลราศีพฤษภ เสริมความมั่นคง ร่ำรวย อดทนสู่ความสำเร็จ', keywords: ['วอลเปเปอร์ราศีพฤษภ', 'เสริมดวงราศีพฤษภ'] },
    gemini:      { label: 'ราศีเมถุน',  emoji: '♊', desc: 'วอลเปเปอร์มงคลราศีเมถุน เสริมทักษะการสื่อสาร ความเฉลียวฉลาด', keywords: ['วอลเปเปอร์ราศีเมถุน', 'เสริมดวงราศีเมถุน'] },
    cancer:      { label: 'ราศีกรกฎ',  emoji: '♋', desc: 'วอลเปเปอร์มงคลราศีกรกฎ เสริมพลังรัก ครอบครัว และความอบอุ่น', keywords: ['วอลเปเปอร์ราศีกรกฎ', 'เสริมดวงราศีกรกฎ'] },
    leo:         { label: 'ราศีสิงห์',  emoji: '♌', desc: 'วอลเปเปอร์มงคลราศีสิงห์ เสริมบารมี เกียรติยศ ความโดดเด่น', keywords: ['วอลเปเปอร์ราศีสิงห์', 'เสริมดวงราศีสิงห์'] },
    virgo:       { label: 'ราศีกันย์',  emoji: '♍', desc: 'วอลเปเปอร์มงคลราศีกันย์ เสริมสติปัญญา ความรอบคอบ วิจารณญาณ', keywords: ['วอลเปเปอร์ราศีกันย์', 'เสริมดวงราศีกันย์'] },
    libra:       { label: 'ราศีตุลย์',  emoji: '♎', desc: 'วอลเปเปอร์มงคลราศีตุลย์ เสริมความรัก ความสมดุลในชีวิต และเสน่ห์', keywords: ['วอลเปเปอร์ราศีตุลย์', 'เสริมดวงราศีตุลย์'] },
    scorpio:     { label: 'ราศีพิจิก',  emoji: '♏', desc: 'วอลเปเปอร์มงคลราศีพิจิก เสริมพลังภายใน ความมุ่งมั่น', keywords: ['วอลเปเปอร์ราศีพิจิก', 'เสริมดวงราศีพิจิก'] },
    sagittarius: { label: 'ราศีธนู',    emoji: '♐', desc: 'วอลเปเปอร์มงคลราศีธนู เสริมโชคลาภ ความอิสระ การเดินทาง', keywords: ['วอลเปเปอร์ราศีธนู', 'เสริมดวงราศีธนู'] },
    capricorn:   { label: 'ราศีมังกร',  emoji: '♑', desc: 'วอลเปเปอร์มงคลราศีมังกร เสริมความสำเร็จ อำนาจ ความก้าวหน้า', keywords: ['วอลเปเปอร์ราศีมังกร', 'เสริมดวงราศีมังกร'] },
    aquarius:    { label: 'ราศีกุมภ์',  emoji: '♒', desc: 'วอลเปเปอร์มงคลราศีกุมภ์ เสริมความคิดสร้างสรรค์ นวัตกรรม', keywords: ['วอลเปเปอร์ราศีกุมภ์', 'เสริมดวงราศีกุมภ์'] },
    pisces:      { label: 'ราศีมีน',    emoji: '♓', desc: 'วอลเปเปอร์มงคลราศีมีน เสริมญาณทิพย์ พลังจิตวิญญาณ เมตตา', keywords: ['วอลเปเปอร์ราศีมีน', 'เสริมดวงราศีมีน'] },
};

const VALID_SIGNS = Object.keys(ZODIAC_META);

type Props = { params: Promise<{ sign: string }> };

export async function generateStaticParams() {
    return VALID_SIGNS.map((sign) => ({ sign }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sign } = await params;
    const meta = ZODIAC_META[sign];
    if (!meta) return {};

    const title = `วอลเปเปอร์มงคล${meta.label} ${meta.emoji} 2569 เสริมดวง | NameMongkol`;
    return {
        title,
        description: meta.desc,
        keywords: [...meta.keywords, 'วอลเปเปอร์มงคล', 'วอลเปเปอร์ราศี', 'NameMongkol'],
        openGraph: {
            title,
            description: meta.desc,
            url: `${siteUrl}/wallpapers/zodiac/${sign}`,
            siteName: 'NameMongkol',
            locale: 'th_TH',
            type: 'website',
            images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent(`วอลเปเปอร์${meta.label}`)}&subtitle=${encodeURIComponent(meta.desc.slice(0, 50))}&tag=Wallpapers`],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: meta.desc,
        },
        alternates: {
            canonical: `${siteUrl}/wallpapers/zodiac/${sign}`,
        },
    };
}

export default async function ZodiacWallpapersPage({ params }: Props) {
    const { sign } = await params;
    if (!VALID_SIGNS.includes(sign)) notFound();

    const meta = ZODIAC_META[sign];

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
            { '@type': 'ListItem', position: 3, name: `วอลเปเปอร์ตามราศี`, item: `${siteUrl}/wallpapers/zodiac` },
            { '@type': 'ListItem', position: 4, name: `${meta.label}`, item: `${siteUrl}/wallpapers/zodiac/${sign}` },
        ],
    };

    return (
        <>
            <Script
                id={`wallpapers-zodiac-${sign}-breadcrumb`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Suspense>
                <ClientPage initialCategory="zodiac" initialZodiac={sign} initialTab="collection" />
            </Suspense>
        </>
    );
}
