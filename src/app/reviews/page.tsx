import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { reviews } from '@/data/reviews';

export const metadata: Metadata = {
    title: 'รีวิวจากทางบ้าน - ประสบการณ์จริงผู้ใช้ NameMongkol | เปลี่ยนชื่อมงคล',
    description: 'รวมรีวิวและความประทับใจจากผู้ใช้งานจริงกว่า 10,000 ท่าน ที่เปลี่ยนชื่อและเบอร์มงคลกับ NameMongkol แล้วชีวิตดีขึ้นจริง การันตีความแม่นยำ',
    openGraph: {
        title: 'รีวิวจากทางบ้าน - Hall of Fame | NameMongkol',
        description: 'รวมเรื่องราวความสำเร็จของผู้ใช้ NameMongkol เปลี่ยนชื่อแล้วรวย ความรักปัง เช็คเลย!',
        images: ['/og-reviews.png'], // Placeholder
    }
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
