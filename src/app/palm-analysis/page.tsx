import React from 'react';
import { Metadata } from 'next';
import PalmAnalysisClient from './PalmAnalysisClient';
import { PalmSeoContent } from '@/components/PalmSeoContent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';
const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/palm-analysis`;

export const metadata: Metadata = {
  title: 'วิเคราะห์ลายมือออนไลน์ด้วย AI ฟรี | ดูดวงลายมือ 4 เส้นหลัก | NameMongkol',
  description:
    'วิเคราะห์ลายมือออนไลน์ฟรีด้วย AI อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา พร้อมคำทำนายเชิงแนวโน้มและคำแนะนำพัฒนาตัวเอง',
  keywords: [
    'วิเคราะห์ลายมือ',
    'วิเคราะห์ลายมือออนไลน์',
    'ดูลายมือออนไลน์',
    'ดูดวงลายมือ',
    'วิเคราะห์ลายมือ AI',
    'เส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา',
    'Palmistry AI',
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'วิเคราะห์ลายมือออนไลน์ด้วย AI ฟรี | NameMongkol',
    description: 'อ่านลายมือ 4 เส้นหลักด้วย AI พร้อมคำทำนายเชิงแนวโน้มและคำแนะนำที่เข้าใจง่าย',
    url: canonicalUrl,
    siteName: 'NameMongkol',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'วิเคราะห์ลายมือออนไลน์ด้วย AI ฟรี | NameMongkol',
    description: 'ดูดวงลายมือจากเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา แบบออนไลน์',
  },
};

export default function PalmAnalysisPage() {
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Palm Analysis AI - NameMongkol',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: canonicalUrl,
    description:
      'เครื่องมือวิเคราะห์ลายมือออนไลน์ด้วย AI อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา พร้อมสรุปผลเชิงแนวโน้ม',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'THB',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'วิเคราะห์ลายมือ AI แม่นยำแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ความแม่นยำขึ้นกับคุณภาพภาพมือ มุมกล้อง และความชัดของเส้นลายมือ ผลลัพธ์จึงควรใช้เป็นแนวโน้มเบื้องต้น ไม่ใช่ข้อสรุปตายตัว 100 เปอร์เซ็นต์',
        },
      },
      {
        '@type': 'Question',
        name: 'เส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา บอกอนาคตได้แน่นอนหรือไม่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ลายมือมักใช้สะท้อนแนวโน้มและบุคลิกในมุมหนึ่ง มากกว่าการฟันธงอนาคตแบบแน่นอน โดยผลลัพธ์ควรใช้ร่วมกับวิจารณญาณของผู้ใช้งาน',
        },
      },
      {
        '@type': 'Question',
        name: 'ต้องเตรียมรูปมืออย่างไรให้วิเคราะห์ได้ละเอียดขึ้น?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ควรถ่ายภาพในแสงเพียงพอ เห็นฝ่ามือเต็มเฟรม ภาพไม่เบลอ และกล้องตั้งตรง เพื่อให้ระบบตรวจจับเส้นลายมือได้ชัดเจนขึ้น',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-[#020617] relative overflow-hidden pt-24 md:pt-12 pb-28 md:pb-12 px-4 sm:px-6 lg:px-8">
        {/* Galaxy Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4 tracking-tight leading-tight">
              AI Palmistry Analysis
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
              อัปโหลดรูปภาพลายมือของคุณ เพื่อให้ AI ผู้เชี่ยวชาญด้านหัตถศาสตร์วิเคราะห์ตัวตน จุดเด่น และศักยภาพที่ซ่อนอยู่
            </p>
          </div>

          <PalmAnalysisClient />
          <PalmSeoContent />
        </div>
      </main>
    </>
  );
}
