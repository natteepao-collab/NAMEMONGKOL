import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'ค้นหาชื่อมงคลฟรี 2568: ตั้งชื่อลูก เปลี่ยนชื่อใหม่ เสริมดวงชะตา | NameMongkol',
    description: 'รวมสุดยอดชื่อมงคลกว่า 5,000 ชื่อ คัดเน้นๆ เกรด A+ เหมาะสำหรับตั้งชื่อลูกและเปลี่ยนชื่อใหม่ กรองตามวันเกิดและผลรวมเลขศาสตร์ ฟรี! ไม่มีค่าใช้จ่าย',
    alternates: {
        canonical: '/search',
    },
    openGraph: {
        title: 'ค้นหาชื่อมงคลฟรี 2568: ตั้งชื่อลูก เปลี่ยนชื่อใหม่',
        description: 'แจกชื่อมงคลเกรด A+ กว่า 5,000 ชื่อ สำหรับตั้งชื่อลูกและเปลี่ยนชื่อใหม่ คัดความหมายดี เป็นสิริมงคล',
        images: ['/api/og?variant=default&title=ค้นหาชื่อมงคลฟรี&subtitle=ตั้งชื่อลูก%20เปลี่ยนชื่อใหม่%20เสริมดวง&tag=Free%20Names'],
    },
};

export default function SearchPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': 'ค้นหาชื่อมงคลที่ NameMongkol เสียเงินไหม?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ฟรี! ไม่มีค่าใช้จ่าย คุณสามารถค้นหาและตรวจสอบความหมายของชื่อมงคลกว่า 5,000 ชื่อได้ฟรีทันที'
                }
            },
            {
                '@type': 'Question',
                'name': 'มีรายชื่อมงคลให้เลือกกี่ชื่อ?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'เรามีฐานข้อมูลชื่อมงคลที่คัดสรรมาแล้วกว่า 5,000 ชื่อ ครอบคลุมทุกวันเกิด และมีความหมายที่เป็นสิริมงคล'
                }
            },
            {
                '@type': 'Question',
                'name': 'ชื่อมงคลในระบบเชื่อถือได้แค่ไหน?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'รายชื่อทั้งหมดถูกคัดกรองตามหลักเลขศาสตร์และทักษาปกรณ์ โดยเน้นชื่อที่มีความหมายดีและไม่มีอักษรกาลกิณีพื้นฐาน'
                }
            }
        ]
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
