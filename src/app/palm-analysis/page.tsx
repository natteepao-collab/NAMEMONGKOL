import React from 'react';
import { Metadata } from 'next';
import PalmAnalysisClient from './PalmAnalysisClient';
import { PalmSeoContent } from '@/components/PalmSeoContent';
import PalmHeroBanner from '@/components/palm-analysis/PalmHeroBanner';

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

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีวิเคราะห์ลายมือออนไลน์ด้วย AI',
    description: 'ขั้นตอนใช้งานเครื่องมือวิเคราะห์ลายมือออนไลน์บน NameMongkol ให้ได้ผลลัพธ์ที่ชัดเจน',
    totalTime: 'PT2M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'กล้องมือถือหรือรูปภาพฝ่ามือที่ชัดเจน',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'เตรียมภาพฝ่ามือ',
        text: 'ถ่ายภาพฝ่ามือให้เห็นเต็มเฟรม ภาพไม่เบลอ และมีแสงเพียงพอ',
      },
      {
        '@type': 'HowToStep',
        name: 'อัปโหลดภาพหรือถ่ายภาพในระบบ',
        text: 'เลือกอัปโหลดรูปจากเครื่อง หรือเปิดกล้องแล้วถ่ายภาพใหม่ในหน้า Palm Scanner',
      },
      {
        '@type': 'HowToStep',
        name: 'ตรวจคุณภาพก่อนวิเคราะห์',
        text: 'ตรวจดูคะแนนความคม แสง และคอนทราสต์ให้เหมาะสมก่อนเริ่มวิเคราะห์',
      },
      {
        '@type': 'HowToStep',
        name: 'กดเริ่มวิเคราะห์และอ่านผลลัพธ์',
        text: 'ระบบจะแสดงคะแนน 4 ด้าน การวิเคราะห์เส้นหลัก จุดเด่น จุดที่ควรพัฒนา และคำแนะนำเสริมมงคล',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <main className="min-h-screen bg-[#020617] relative overflow-hidden pt-28 md:pt-20 lg:pt-24 pb-28 md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-12%] w-[40%] h-[40%] rounded-full bg-blue-700/15 blur-[130px]" />
          <div className="absolute bottom-[-10%] right-[-12%] w-[40%] h-[40%] rounded-full bg-violet-700/15 blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-3 sm:space-y-8">
          <PalmHeroBanner />
          <PalmAnalysisClient />
          <PalmSeoContent />
        </div>
      </main>
    </>
  );
}
