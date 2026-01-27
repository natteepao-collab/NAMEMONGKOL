import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { createClient } from '@/utils/supabaseServer';
import { Review } from '@/types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'รวมรีวิว NameMongkol: เปลี่ยนชื่อ-เบอร์โทรศัพท์มงคล ชีวิตเปลี่ยนจริงไหม?',
    description: 'รวมประสบการณ์จริงจากผู้ใช้งาน NameMongkol ที่เปลี่ยนชื่อมงคลและเบอร์โทรศัพท์แล้วชีวิตดีขึ้น ทั้งเรื่องการเงิน การงาน และความรัก พิสูจน์ความแม่นยำด้วยตัวคุณเองได้ที่นี่',
    keywords: ['รีวิวเปลี่ยนชื่อมงคล', 'ประสบการณ์เปลี่ยนชื่อ', 'ตั้งชื่อมงคลที่ไหนดี', 'วิเคราะห์เบอร์โทรแม่นๆ', 'รีวิวเบอร์มงคล', 'แก้กรรมด้วยชื่อ', 'รีวิว NameMongkol'],
    alternates: {
        canonical: `${siteUrl}/reviews`,
    },
    openGraph: {
        title: 'รวมรีวิว NameMongkol: เปลี่ยนชื่อ-เบอร์โทรศัพท์มงคล ชีวิตเปลี่ยนจริงไหม?',
        description: 'รวมประสบการณ์จริงจากผู้ใช้งาน NameMongkol ที่เปลี่ยนชื่อมงคลและเบอร์โทรศัพท์แล้วชีวิตดีขึ้น ทั้งเรื่องการเงิน การงาน และความรัก',
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

async function getReviews() {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('reviews')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        return (data || []) as Review[];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

export default async function ReviewsPage() {
    const reviews = await getReviews();

    // Serialize dates for Client Component if passing data directly, 
    // but here we only use it for JSON-LD. ClientPage fetches its own data.

    // Schema Markup for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "รีวิวจากผู้ใช้งานจริง NameMongkol",
        "description": "รวมประสบการณ์เปลี่ยนชื่อมงคลและเบอร์มงคล ผู้ใช้งานจริงยืนยันผลลัพธ์ที่ดีขึ้น",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": reviews.slice(0, 20).map((review, index) => ({
                "@type": "Review",
                "position": index + 1,
                "itemReviewed": {
                    "@type": "Service",
                    "name": "บริการวิเคราะห์ชื่อและเบอร์มงคล NameMongkol",
                    "image": `${siteUrl}/logo.png`
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.rating.toString(),
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": review.nickname
                },
                "datePublished": review.created_at,
                "reviewBody": review.content
            }))
        }
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
