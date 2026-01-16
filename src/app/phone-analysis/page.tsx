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
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'วิเคราะห์เบอร์มงคล Namemongkol',
            },
        ],
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์เบอร์มงคล แม่นยำที่สุด!',
        description: 'เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน',
        images: ['/images/og-image.png'],
    },
};

export default function PhoneAnalysisPage() {
    return <ClientPage />;
}
