import React from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'วิเคราะห์เบอร์มงคล แม่นยำที่สุด! เช็คเกรดเบอร์โทรศัพท์ | NameMongkol',
    description: 'เช็คเบอร์มงคลฟรี ด้วยระบบ AI อัจฉริยะ วิเคราะห์ลึกถึงคู่เลข ผลรวม และกราฟชีวิต รู้ทันทีว่าเบอร์ดีหรือร้าย พร้อมวิธีแก้เคล็ดที่ Namemongkol',
    keywords: [
        'วิเคราะห์เบอร์มงคล',
        'ทำนายเบอร์โทรศัพท์',
        'เช็คเบอร์มงคล',
        'ดูดวงเบอร์มือถือ',
        'เบอร์แก้ชง',
        'เบอร์ปลดหนี้',
        'เลขศาสตร์เบอร์โทร',
        'เกรดเบอร์มงคล'
    ],
};

export default function PhoneAnalysisPage() {
    return <ClientPage />;
}
