import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { reviews } from '@/data/reviews';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'รีวิวจากทางบ้าน - ประสบการณ์จริงผู้ใช้ NameMongkol | เปลี่ยนชื่อมงคล',
    description: 'รวมรีวิวและความประทับใจจากผู้ใช้งานจริงกว่า 10,000 ท่าน ที่เปลี่ยนชื่อและเบอร์มงคลกับ NameMongkol แล้วชีวิตดีขึ้นจริง การันตีความแม่นยำ',
    keywords: ['รีวิว NameMongkol', 'ประสบการณ์เปลี่ยนชื่อ', 'เปลี่ยนชื่อแล้วรวย', 'ชื่อมงคล', 'วิเคราะห์ชื่อ'],
    alternates: {
        canonical: `${siteUrl}/reviews`,
    },
    openGraph: {
        title: 'รีวิวจากทางบ้าน - Hall of Fame | NameMongkol',
        description: 'รวมเรื่องราวความสำเร็จของผู้ใช้ NameMongkol เปลี่ยนชื่อแล้วรวย ความรักปัง เช็คเลย!',
        url: `${siteUrl}/reviews`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=รีวิวจากทางบ้าน&subtitle=ประสบการณ์จริงจากผู้ใช้%20NameMongkol&tag=Reviews`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'รีวิวจากทางบ้าน | NameMongkol',
        description: 'ประสบการณ์จริงจากผู้ใช้ NameMongkol',
        images: [`${siteUrl}/api/og?variant=default&title=รีวิวจากทางบ้าน`],
    },
};

export default function ReviewsPage() {
    // Schema Markup for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "NameMongkol Naming Service",
        "image": "https://www.namemongkol.com/logo.png",
        "description": "บริการวิเคราะห์และตั้งชื่อมงคลโดยผู้เชี่ยวชาญและ AI อัจฉริยะ",
        "brand": {
            "@type": "Brand",
            "name": "NameMongkol"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": reviews.length.toString(),
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": reviews.map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.nickname
            },
            "datePublished": review.date,
            "reviewBody": review.content,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating.toString(),
                "bestRating": "5"
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClientPage />
        </>
    );
}
