import AboutSection from '@/components/AboutSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'เกี่ยวกับเรา - NAMEMONGKOL',
    description: 'NAMEMONGKOL ผสานศาสตร์แห่งตัวเลขและทักษาปกรณ์ เพื่อชื่อมงคลของคุณ วิเคราะห์ลึกถึงเลขศาสตร์ ทักษาปกรณ์ และอายตนะ 6',
};

export default function AboutPage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <AboutSection />
        </main>
    );
}
