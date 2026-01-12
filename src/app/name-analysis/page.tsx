import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อมงคล (Bulk Analysis) - ตรวจสอบรายชื่อจำนวนมาก | NameMongkol',
    description: 'ระบบวิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis) รองรับการตรวจสอบรายชื่อจำนวนมากพร้อมกัน เหมาะสำหรับคุณพ่อคุณแม่ที่กำลังตั้งชื่อลูก หรือผู้ที่ต้องการคัดกรองชื่อมงคลจากหลายๆ ตัวเลือก',
    alternates: {
        canonical: '/name-analysis',
    },
    openGraph: {
        title: 'วิเคราะห์ชื่อมงคล (Bulk Analysis) - ตรวจสอบรายชื่อจำนวนมาก',
        description: 'เช็คชื่อมงคลทีละหลายชื่อพร้อมกัน รู้ผลทันที พร้อมจัดลำดับเกรดความมงคล',
    },
};

export default function NameAnalysisPage() {
    return <ClientPage />;
}
