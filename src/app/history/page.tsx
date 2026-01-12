import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'ประวัติการใช้งาน - NameMongkol',
    description: 'ดูประวัติการวิเคราะห์ชื่อมงคลและรายการอื่นๆ ของคุณ ย้อนดูผลลัพธ์การทำนายที่เคยบันทึกไว้',
    alternates: {
        canonical: '/history',
    },
    openGraph: {
        title: 'ประวัติการใช้งาน - NameMongkol',
        description: 'ประวัติการวิเคราะห์ชื่อและรายการของคุณ',
    },
};

export default function HistoryPage() {
    return <ClientPage />;
}
