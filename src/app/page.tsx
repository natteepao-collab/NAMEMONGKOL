import type { Metadata } from 'next';
import Script from 'next/script';
import ClientHome from './ClientHome';
import { calculateScore } from '@/utils/calculateScore';
import { getPrediction } from '@/utils/getPrediction';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const name = searchParams.name as string | undefined;
  const surname = searchParams.surname as string | undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

  if (!name) {
    return {
      title: 'วิเคราะห์ชื่อมงคล ฟรี! ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง 2568 | NameMongkol',
      description: 'วิเคราะห์ชื่อมงคลฟรี ตั้งชื่อลูก เปลี่ยนชื่อใหม่ ด้วยระบบ AI อัจฉริยะ ผสาน 4 ศาสตร์ ได้แก่ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์ เช็คพลังเงา ผลรวมชื่อ อักษรกาลกิณี แม่นยำ น่าเชื่อถือ',
      keywords: 'วิเคราะห์ชื่อมงคล, วิเคราะห์ชื่อ 2568, ตั้งชื่อลูก 2568, เปลี่ยนชื่อ, ชื่อมงคล, ดูดวงชื่อ, เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6, ผลรวมชื่อ, อักษรกาลกิณี, ชื่อเสริมดวง, ตั้งชื่อตามวันเกิด, พลังเงา, NameMongkol, ดูดวงฟรี',
      openGraph: {
        title: 'วิเคราะห์ชื่อมงคล ฟรี! ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง | NameMongkol',
        description: 'วิเคราะห์ชื่อมงคลฟรี ด้วยระบบ AI ผสาน 4 ศาสตร์ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์ เช็คพลังเงา ผลรวมชื่อ อักษรกาลกิณี',
        images: [`${siteUrl}/api/og?variant=default&title=NameMongkol%20-%20วิเคราะห์ชื่อมงคล&subtitle=เช็คพลังเงา%20ผลรวมเลขศาสตร์%20และความหมายชื่อของคุณ`],
        url: 'https://www.namemongkol.com',
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อมงคล ฟรี! ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง | NameMongkol',
        description: 'วิเคราะห์ชื่อมงคลฟรี ด้วยระบบ AI ผสาน 4 ศาสตร์ เช็คพลังเงา ผลรวมชื่อ อักษรกาลกิณี',
        images: [`${siteUrl}/api/og?variant=default`],
      },

    }
  }

  const cleanName = name.trim();
  const cleanSurname = (surname || '').trim();
  const totalScore = calculateScore(cleanName) + calculateScore(cleanSurname);
  const prediction = getPrediction(totalScore);

  const title = `วิเคราะห์ชื่อ: ${cleanName} ${cleanSurname} (ผลรวม ${totalScore})`;
  const description = `ความหมาย: ${prediction.desc} - ระดับ: ${prediction.level}`;

  return {
    title: `${title} - NameMongkol`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [`${siteUrl}/api/og?variant=analysis&name=${encodeURIComponent(cleanName)}&surname=${encodeURIComponent(cleanSurname)}&score=${totalScore}&subtitle=${encodeURIComponent(description)}`],
      url: `/?name=${encodeURIComponent(cleanName)}&surname=${encodeURIComponent(cleanSurname)}&day=${searchParams.day || 'sunday'}`,
      type: 'website',
    }
  }
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.namemongkol.com/#website',
        'url': 'https://www.namemongkol.com',
        'name': 'NameMongkol',
        'description': 'วิเคราะห์ชื่อมงคล ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง ด้วยระบบ AI ผสาน 4 ศาสตร์',
        'inLanguage': 'th-TH',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://www.namemongkol.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.namemongkol.com/#webpage',
        'url': 'https://www.namemongkol.com',
        'name': 'วิเคราะห์ชื่อมงคล ฟรี! ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง | NameMongkol',
        'isPartOf': { '@id': 'https://www.namemongkol.com/#website' },
        'description': 'วิเคราะห์ชื่อมงคลฟรี ตั้งชื่อลูก เปลี่ยนชื่อใหม่ ด้วยระบบ AI อัจฉริยะ ผสาน 4 ศาสตร์',
        'inLanguage': 'th-TH'
      },
      {
        '@type': 'SoftwareApplication',
        'name': 'NameMongkol - วิเคราะห์ชื่อมงคล',
        'description': 'แอปพลิเคชันวิเคราะห์ชื่อมงคลด้วย AI ผสาน 4 ศาสตร์ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์',
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'THB'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'ratingCount': '150000',
          'bestRating': '5',
          'worstRating': '1'
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'วิเคราะห์ชื่อมงคลที่ NameMongkol แม่นยำแค่ไหน?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'NameMongkol ใช้ระบบ AI ประมวลผลร่วมกับ 4 ศาสตร์หลัก ได้แก่ เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6 และนิรันดร์ศาสตร์ ซึ่งเป็นตำราโหราศาสตร์ไทยโบราณที่ได้รับการยอมรับ ทำให้ผลลัพธ์มีความละเอียดและแม่นยำกว่าโปรแกรมทั่วไป'
            }
          },
          {
            '@type': 'Question',
            'name': 'ผลรวมตัวเลขที่ดีที่สุด ควรเป็นเลขอะไร?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'ผลรวมที่ดีขึ้นอยู่กับอาชีพและดวงชะตาของแต่ละบุคคล แต่โดยทั่วไป ผลรวมที่จัดว่าดีเยี่ยมในระดับสากล ได้แก่ 14, 15, 24, 36, 41, 42, 45, 50, 51, 54, 56, 59, 63, 65 ซึ่งส่งผลดีในด้านความสำเร็จและการเงิน'
            }
          },
          {
            '@type': 'Question',
            'name': 'เปลี่ยนชื่อแล้ว ชีวิตจะดีขึ้นภายในกี่วัน?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'ตามหลักครูบาอาจารย์ เชื่อว่าเมื่อเปลี่ยนชื่อใหม่แล้ว จะเริ่มเห็นผลการเปลี่ยนแปลงภายใน 3-6 เดือน โดยพลังของชื่อใหม่จะค่อยๆ ส่งผลต่อความคิด การตัดสินใจ และดึงดูดสิ่งดีๆ เข้ามา ทั้งนี้ขึ้นอยู่กับการทำบุญและการปฏิบัติตนควบคู่กันไปด้วย'
            }
          },
          {
            '@type': 'Question',
            'name': 'อักษรกาลกิณี คืออะไร? ทำไมต้องห้าม?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'อักษรกาลกิณี คือพยัญชนะที่เป็นอริกับดวงวันเกิด หากมีในชื่อจะเปรียบเสมือนมีอุปสรรคขัดขวาง ทำให้ชีวิตเหนื่อยยาก มีศัตรู หรือเกิดอุบัติเหตุได้ง่าย การตั้งชื่อมงคลจึงควรหลีกเลี่ยงอักษรกาลกิณีอย่างเด็ดขาด'
            }
          },
          {
            '@type': 'Question',
            'name': 'ใช้ NameMongkol ตั้งชื่อลูกได้หรือไม่?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'ได้แน่นอน! ระบบของเราสามารถใช้วิเคราะห์เพื่อตั้งชื่อลูกแรกเกิดได้ โดยพิจารณาจากวันเกิด (ทักษา) เพื่อหาตัวอักษรที่เป็นมงคล (เดช, ศรี, มนตรี) และหลีกเลี่ยงกาลกิณี เพื่อวางรากฐานชีวิตที่ดีให้กับบุตรหลานของคุณ'
            }
          },
          {
            '@type': 'Question',
            'name': 'พลังเงาในชื่อคืออะไร?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'พลังเงาคือพลังงานซ่อนเร้นในชื่อที่ส่งผลต่อบุคลิกภาพและโชคชะตา วิเคราะห์จากตัวอักษรและผลรวมเลขศาสตร์ ช่วยให้เข้าใจจุดแข็งจุดอ่อนของชื่อ'
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="home-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientHome />
    </>
  );
}
