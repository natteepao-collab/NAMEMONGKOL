import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'เติมเครดิต (Top Up) - แพ็กเกจสุดคุ้ม | NameMongkol',
    description: 'เติมเครดิตเพื่อใช้งานบริการวิเคราะห์ชื่อมงคลขั้นสูงและดาวน์โหลดวอลเปเปอร์พรีเมียม สะดวกรวดเร็วผ่าน QR Code พร้อมเพย์ เริ่มต้นเพียง 29 บาท',
    alternates: {
        canonical: '/topup',
    },
    openGraph: {
        title: 'เติมเครดิต - NameMongkol',
        description: 'เติมเครดิตง่ายๆ ผ่าน QR Code พร้อมเพย์ ใช้งานได้ทันที',
    },
};

export default function TopUpPage() {
    return <ClientPage />;
}
