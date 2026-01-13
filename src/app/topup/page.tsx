import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { createClient } from '@/utils/supabaseServer';

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

export default async function TopUpPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'payment_gateway')
        .single();

    // Default to 'stripe' if not set
    const gateway = data?.value || 'stripe';

    return <ClientPage gateway={gateway} />;
}
