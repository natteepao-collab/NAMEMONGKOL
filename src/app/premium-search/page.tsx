import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'ค้นหาชื่อมงคล Pro - ฐานข้อมูลชื่อมงคลกว่า 50,000 ชื่อ | NameMongkol',
    description: 'ค้นหาชื่อมงคลจากฐานข้อมูลรายชื่อที่คัดสรรมาแล้วกว่า 50,000 ชื่อ กรองตามวันเกิด ผลรวมเลขศาสตร์ และอักษรนำ (วรรคเดช/วรรคศรี) เพื่อให้ได้ชื่อที่ดีที่สุดสำหรับคุณ',
    alternates: {
        canonical: '/premium-search',
    },
    openGraph: {
        title: 'ค้นหาชื่อมงคล Pro - ฐานข้อมูลชื่อมงคลครบวงจร',
        description: 'ค้นหาชื่อดี ความหมายมงคล กรองตามวันเกิดและผลรวมเลขศาสตร์',
        images: ['/api/og?variant=default&title=ค้นหาชื่อมงคล%20Pro&subtitle=ฐานข้อมูลกว่า%2050,000%20ชื่อ%20พร้อมตัวกรองขั้นสูง&tag=Premium%20Search'],
    },
};

export default function PremiumSearchPage() {
    return <ClientPage />;
}
