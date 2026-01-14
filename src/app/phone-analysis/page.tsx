import React from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'วิเคราะห์เบอร์โทรศัพท์ | NameMongkol',
    description: 'ตรวจเช็คเบอร์โทรศัพท์มงคล วิเคราะห์ความหมายเบอร์มือถือตามหลักเลขศาสตร์ ทำนายดวงชะตาจากเบอร์โทร',
    keywords: ['วิเคราะห์เบอร์โทร', 'เบอร์มงคล', 'ทำนายเบอร์', 'เลขศาสตร์เบอร์โทร', 'ดูดวงเบอร์โทรศัพท์'],
};

export default function PhoneAnalysisPage() {
    return <ClientPage />;
}
