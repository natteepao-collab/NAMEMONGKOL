import AboutSection from '@/components/AboutSection';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'เกี่ยวกับเรา - NAMEMONGKOL',
    description: 'NAMEMONGKOL ผสานศาสตร์แห่งตัวเลขและทักษาปกรณ์ เพื่อชื่อมงคลของคุณ วิเคราะห์ลึกถึงเลขศาสตร์ ทักษาปกรณ์ และอายตนะ 6',
};

export default function AboutPage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Script
                id="howto-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": "วิธีวิเคราะห์ชื่อมงคลกับ NameMongkol",
                        "description": "ขั้นตอนการตรวจสอบชื่อและนามสกุลของคุณว่าถูกโฉลกตามหลักเลขศาสตร์และทักษาปกรณ์หรือไม่",
                        "totalTime": "PT1M",
                        "step": [
                            {
                                "@type": "HowToStep",
                                "name": "กรอกข้อมูล",
                                "text": "ระบุชื่อ นามสกุล และวันเกิด ของคุณในแบบฟอร์มหน้าแรก",
                                "position": 1
                            },
                            {
                                "@type": "HowToStep",
                                "name": "AI ประมวลผล",
                                "text": "ระบบจะวิเคราะห์ข้อมูลของคุณด้วย 4 ศาสตร์มงคล (เลขศาสตร์, ทักษา, อายตนะ, นิรันดร์)",
                                "position": 2
                            },
                            {
                                "@type": "HowToStep",
                                "name": "รับคำทำนาย",
                                "text": "ดูผลคะแนน เกรดมงคล และคำแนะนำในการปรับเปลี่ยนชื่อ (ถ้ามี)",
                                "position": 3
                            }
                        ]
                    })
                }}
            />
            <AboutSection />
        </main>
    );
}
