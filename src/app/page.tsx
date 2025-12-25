import type { Metadata } from 'next';
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
      title: 'NameMongkol - วิเคราะห์ชื่อมงคล',
      description: 'วิเคราะห์ชื่อ-นามสกุล ดูผลรวม พลังเงา และความหมายมงคล ฟรี',
      openGraph: {
        title: 'NameMongkol - วิเคราะห์ชื่อมงคล',
        description: 'วิเคราะห์ชื่อ-นามสกุล ดูผลรวม พลังเงา และความหมายมงคล ฟรี',
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
  return <ClientHome />;
}
