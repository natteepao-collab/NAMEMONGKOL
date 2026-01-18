import React from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'วิเคราะห์เบอร์มงคล แม่นยำที่สุด! | Namemongkol',
    description: 'เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน ฟรีด้วยระบบ AI อัจฉริยะ วิเคราะห์ลึกถึงคู่เลข ผลรวม และกราฟชีวิต',
    openGraph: {
        title: 'วิเคราะห์เบอร์มงคล แม่นยำที่สุด! | Namemongkol',
        description: 'เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน ฟรีด้วยระบบ AI อัจฉริยะ',
        url: 'https://www.namemongkol.com/phone-analysis',
        siteName: 'Namemongkol',
        locale: 'th_TH',
        type: 'website',
        images: ['/api/og?variant=phone'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์เบอร์มงคล แม่นยำที่สุด!',
        description: 'เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน',
        images: ['/api/og?variant=phone'],
    },
};

export default function PhoneAnalysisPage() {

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                'name': 'NameMongkol Phone Analysis',
                'applicationCategory': 'Utility',
                'operatingSystem': 'Web',
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'THB'
                }
            },
            {
                '@type': 'FAQPage',
                'mainEntity': [
                    {
                        '@type': 'Question',
                        'name': 'วิเคราะห์เบอร์มงคลแม่นแค่ไหน?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ระบบวิเคราะห์ของเราใช้หลักเลขศาสตร์สากลและโหราศาสตร์ไทย โดยพิจารณาคู่เลข 7 ตัวท้าย (XX-XYZ-ABCD) และผลรวมเบอร์ เพื่อความแม่นยำสูงสุด'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'เบอร์มงคลช่วยเรื่องอะไรบ้าง?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'เบอร์ที่ดีจะช่วยส่งเสริมพลังงานด้านบวก ทั้งการงาน การเงิน และความรัก โดยเฉพาะคู่เลขมงคลอย่าง 4289 (เมตตามหานิยม) หรือ 6395 (มหาเสน่ห์)'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'เลขกาลกิณีในเบอร์โทรศัพท์มีผลไหม?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'มีผลแน่นอน หากเบอร์โทรศัพท์มีเลขกาลกิณีตามวันเกิด อาจทำให้การติดต่อสื่อสารติดขัด หรือมีอุปสรรคในการเจรจา ควรเลือกเบอร์ที่ไม่มีเลขกาลกิณีเพื่อความราบรื่น'
                        }
                    }
                ]
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
