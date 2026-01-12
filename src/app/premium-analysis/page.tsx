import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อมงคลขั้นสูง (Premium) - เจาะลึกดวงชะตาเฉพาะบุคคล | NameMongkol',
    description: 'บริการวิเคราะห์ชื่อมงคลขั้นสูงโดยใช้หลักทักษาปกรณ์และเลขศาสตร์ชั้นสูง คำนวณตามวันเดือนปีเกิดและเวลาตกฟาก เพื่อผลลัพธ์ที่แม่นยำและส่งเสริมดวงชะตาของคุณอย่างแท้จริง',
    alternates: {
        canonical: '/premium-analysis',
    },
    openGraph: {
        title: 'วิเคราะห์ชื่อมงคลขั้นสูง (Premium) - แม่นยำที่สุด',
        description: 'วิเคราะห์เจาะลึกด้วยวันดือนปีและเวลาเกิด หาชื่อที่ใช่ที่สุดสำหรับคุณ',
    },
};

export default function PremiumAnalysisPage() {
    return <ClientPage />;
}
