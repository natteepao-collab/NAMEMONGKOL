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

  if (!name) {
    return {
      title: 'NameMongkol - วิเคราะห์ชื่อมงคล อันดับ 1 แม่นยำที่สุด',
      description: 'บริการวิเคราะห์ชื่อมงคลฟรี โดย NameMongkol เช็คพลังเงา ผลรวมเลขศาสตร์ และความหมายของชื่อคุณ',
      openGraph: {
        title: 'NameMongkol - วิเคราะห์ชื่อมงคล อันดับ 1',
        description: 'บริการวิเคราะห์ชื่อมงคลฟรี โดย NameMongkol เช็คพลังเงา ผลรวมเลขศาสตร์ และความหมายของชื่อคุณ',
        images: ['/api/og'],
      }
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
      images: [`/api/og?name=${encodeURIComponent(cleanName)}&surname=${encodeURIComponent(cleanSurname)}&score=${totalScore}`],
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
        '@type': 'SoftwareApplication',
        'name': 'NameMongkol',
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
          'ratingCount': '1250'
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
