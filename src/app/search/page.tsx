import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'ค้นหาชื่อมงคล - รวมรายชื่อความหมายดี | NameMongkol',
    description: 'ค้นหาชื่อมงคลและตรวจสอบความหมายของชื่อ รวบรวมรายชื่อมงคลพร้อมความหมายดีๆ ไว้ให้เลือกสรร พร้อมระบบกรองตามวันเกิดและผลรวมเลขศาสตร์',
    alternates: {
        canonical: '/search',
    },
    openGraph: {
        title: 'ค้นหาชื่อมงคล - รวมรายชื่อความหมายดี',
        description: 'ค้นหาและตรวจสอบความหมายชื่อมงคล ฟรี!',
    },
};

export default function SearchPage() {
    return <ClientPage />;
}
