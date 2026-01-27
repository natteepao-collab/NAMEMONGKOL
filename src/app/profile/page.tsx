import { Metadata } from 'next';
import ProfileClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'โปรไฟล์ของฉัน | NameMongkol',
    description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณบน NameMongkol ดูเครดิตคงเหลือ เชื่อมต่อ LINE และจัดการข้อมูลส่วนตัว',
    keywords: ['โปรไฟล์', 'บัญชีผู้ใช้', 'ตั้งค่า', 'NameMongkol', 'สมาชิก'],
    alternates: {
        canonical: `${siteUrl}/profile`,
    },
    openGraph: {
        title: 'โปรไฟล์ของฉัน | NameMongkol',
        description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ',
        url: `${siteUrl}/profile`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'โปรไฟล์ของฉัน | NameMongkol',
        description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ',
    },
    robots: {
        index: false, // Profile pages should not be indexed
        follow: false,
    },
};

export default function ProfilePage() {
    return <ProfileClientPage />;
}
