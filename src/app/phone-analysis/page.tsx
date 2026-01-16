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
        images: ['/api/og?variant=default&title=วิเคราะห์เบอร์มงคล&subtitle=เช็คเกรดเบอร์โทร%20พร้อมกราฟวิเคราะห์เชิงลึก&tag=Phone%20Analysis'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์เบอร์มงคล แม่นยำที่สุด!',
        description: 'เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน',
        images: ['/api/og?variant=default&title=วิเคราะห์เบอร์มงคล&subtitle=กราฟวิเคราะห์ลึก%20พร้อมคะแนนเกรดเบอร์&tag=Phone%20Analysis'],
    },
};

export default function PhoneAnalysisPage() {
    return <ClientPage />;
}
