import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'วอลเปเปอร์มงคล - เสริมดวง เรียกทรัพย์ เมตตามหานิยม | NameMongkol',
    description: 'ดาวน์โหลดวอลเปเปอร์มงคลเสริมดวงชะตา ออกแบบตามหลักฮวงจุ้ยและโหราศาสตร์ไทย เสริมด้านการเงิน การงาน ความรัก และสุขภาพ ฟรี!',
    alternates: {
        canonical: '/wallpapers',
    },
    openGraph: {
        title: 'วอลเปเปอร์มงคล - เสริมดวง เรียกทรัพย์',
        description: 'แจกฟรี! วอลเปเปอร์สายมู เสริมดวงรอบด้าน การเงิน ความรัก การงาน',
    },
};

export default function WallpapersPage() {
    return <ClientPage />;
}
