import React from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'วิเคราะห์เบอร์มงคล AI อัจฉริยะ | NameMongkol',
    description: 'ใหม่! ตรวจเช็คเกรดเบอร์โทรศัพท์ของคุณด้วยระบบ AI วิเคราะห์เจาะลึก 4 ศาสตร์ แม่นยำที่สุด รู้ทันทีว่าเบอร์นี้ดีหรือร้าย พร้อมคำแนะนำ',
    keywords: [
        'วิเคราะห์เบอร์มงคล',
        'ทำนายเบอร์โทรศัพท์',
        'เช็คเบอร์มงคล',
        'ดูดวงเบอร์มือถือ',
        'เบอร์แก้ชง',
        'เบอร์ปลดหนี้',
        'เลขศาสตร์เบอร์โทร',
        'เกรดเบอร์มงคล',
        'วิเคราะห์เบอร์ AI'
    ],
};

export default function PhoneAnalysisPage() {
    return <ClientPage />;
}
