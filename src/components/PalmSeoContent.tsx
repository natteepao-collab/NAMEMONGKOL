import React from 'react';
import Link from 'next/link';
import { Brain, Heart, Sparkles, Compass, Camera, ShieldCheck } from 'lucide-react';

export const PalmSeoContent = () => {
  const faqItems = [
    {
      question: 'วิเคราะห์ลายมือ AI แม่นยำแค่ไหน?',
      answer:
        'ความแม่นยำขึ้นกับคุณภาพภาพมือ มุมกล้อง และความชัดของเส้นลายมือ ผลลัพธ์จึงควรใช้เป็นแนวโน้มเบื้องต้นเพื่อสะท้อนตัวเอง ไม่ใช่ข้อสรุปตายตัว 100%.',
    },
    {
      question: 'ดูลายมือออนไลน์แทนการปรึกษาผู้เชี่ยวชาญได้ไหม?',
      answer:
        'เหมาะสำหรับเริ่มต้นทำความเข้าใจภาพรวมอย่างรวดเร็ว แต่ไม่ควรใช้แทนคำปรึกษาเชิงวิชาชีพด้านสุขภาพ การเงิน หรือกฎหมายเมื่อเป็นเรื่องสำคัญ.',
    },
    {
      question: 'เส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา บอกอนาคตได้แน่นอนหรือไม่?',
      answer:
        'ลายมือมักใช้สะท้อนบุคลิกและแนวโน้มชีวิตมากกว่าการฟันธงอนาคตแบบแน่นอน ปัจจัยสำคัญยังคงเป็นการตัดสินใจ การลงมือทำ และสภาพแวดล้อมของแต่ละคน.',
    },
    {
      question: 'ถ้าผลวิเคราะห์ออกมาไม่ดีควรทำอย่างไร?',
      answer:
        'ใช้ผลวิเคราะห์เป็นข้อมูลเพื่อปรับพฤติกรรมเชิงบวก เช่น การวางแผน การดูแลสุขภาพ และการพัฒนาทักษะ ไม่จำเป็นต้องกังวลเกินไป เพราะแนวโน้มชีวิตเปลี่ยนได้เสมอ.',
    },
    {
      question: 'ต้องเตรียมรูปมืออย่างไรให้วิเคราะห์ได้ละเอียดขึ้น?',
      answer:
        'ควรถ่ายภาพในแสงสว่างเพียงพอ ฝ่ามือเต็มเฟรม กล้องตั้งตรง และภาพไม่เบลอ เพื่อให้ระบบมองเห็นเส้นหลักได้ครบและสรุปผลได้ชัดเจนขึ้น.',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto mt-16 mb-10 px-1 sm:px-4">
      <div className="text-center mb-10 sm:mb-12">
        <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-sm font-semibold border border-blue-500/20 inline-block mb-5">
          ดูลายมือออนไลน์ • วิเคราะห์ลายมือ AI
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          วิเคราะห์ลายมือออนไลน์ด้วย AI: ดูดวงลายมือเบื้องต้นแบบเข้าใจง่าย
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          หากคุณกำลังค้นหา <strong>วิเคราะห์ลายมือ</strong> หรือ <strong>ดูดวงลายมือ</strong> หน้านี้ช่วยให้เริ่มต้นได้ทันที
          ด้วยการอ่านเส้นหลักจากภาพมือ พร้อมคำอธิบายที่ชัดเจนและนำไปใช้วางแผนชีวิตได้จริง
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-bold text-emerald-300 mb-3">วิเคราะห์ลายมือ คืออะไร?</h3>
          <p className="text-slate-300 leading-relaxed">
            การอ่านลายมือเป็นศาสตร์เชิงสัญลักษณ์ที่ใช้สะท้อนแนวโน้มบุคลิก ความคิด และการใช้ชีวิต ผลลัพธ์จากระบบ
            AI เหมาะกับการสำรวจตัวเองเบื้องต้น เพื่อช่วยตั้งคำถามและวางแผนได้มีสติมากขึ้น
          </p>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-bold text-blue-300 mb-3">ดูลายมือออนไลน์ ทำงานอย่างไร?</h3>
          <p className="text-slate-300 leading-relaxed">
            ระบบจะวิเคราะห์ตำแหน่งเส้นหลักจากรูปฝ่ามือ สรุปคะแนนแต่ละด้าน และอธิบายจุดเด่น-จุดที่ควรพัฒนาในรูปแบบอ่านง่าย
            เพื่อให้คุณนำผลไปใช้ต่อยอดได้ทันที
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/60 border border-white/10 rounded-3xl p-6 sm:p-8 mb-10 sm:mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">เส้นหลักที่ระบบใช้ในการดูดวงลายมือ</h3>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-300 font-semibold">
              <Heart className="w-4 h-4" /> เส้นชีวิต (Life Line)
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">ใช้ดูภาพรวมพลังชีวิต สุขภาวะ และจังหวะการเปลี่ยนแปลงสำคัญ</p>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-blue-300 font-semibold">
              <Brain className="w-4 h-4" /> เส้นสมอง (Head Line)
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">สะท้อนวิธีคิด การตัดสินใจ ความถนัด และแนวโน้มด้านการงาน</p>
          </div>
          <div className="rounded-xl border border-pink-500/20 bg-pink-950/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-pink-300 font-semibold">
              <Sparkles className="w-4 h-4" /> เส้นหัวใจ (Heart Line)
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">บอกแนวโน้มด้านอารมณ์ ความสัมพันธ์ และรูปแบบการแสดงความรัก</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-amber-300 font-semibold">
              <Compass className="w-4 h-4" /> เส้นวาสนา (Fate Line)
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">ใช้ดูทิศทางชีวิต โอกาส ความสำเร็จ และความมั่นคงในระยะยาว</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-10 sm:mb-12">
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-300" /> วิธีถ่ายรูปมือให้วิเคราะห์แม่นขึ้น
          </h3>
          <ul className="space-y-2.5 text-slate-300 text-sm leading-relaxed">
            <li>• ใช้แสงธรรมชาติหรือแสงสว่างเพียงพอ</li>
            <li>• วางฝ่ามือให้เต็มเฟรม ไม่เอียง</li>
            <li>• ถือกล้องนิ่ง ภาพไม่เบลอ</li>
            <li>• หลีกเลี่ยงเงาทับหรือแสงสะท้อนแรง</li>
          </ul>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" /> ใช้ผลวิเคราะห์อย่างสมดุล
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            ผลจาก AI Palmistry ควรใช้เพื่อการสะท้อนตนเองและวางแผนเชิงบวก ไม่ใช่ใช้ตัดสินทุกเรื่องแบบเด็ดขาด
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            หากเป็นเรื่องสำคัญด้านสุขภาพ การเงิน หรือกฎหมาย ควรปรึกษาผู้เชี่ยวชาญเฉพาะทางเพิ่มเติม
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-5">คำถามที่พบบ่อยเกี่ยวกับการดูลายมือออนไลน์</h3>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-xl border border-white/10 bg-slate-900/40 p-4 sm:p-5">
              <h4 className="text-white font-semibold mb-2">{item.question}</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-slate-400 leading-relaxed border-t border-white/10 pt-6">
        ดูเพิ่มเติม: <Link href="/articles" className="text-blue-300 hover:text-blue-200">บทความความรู้เสริมดวง</Link> •{' '}
        <Link href="/name-analysis" className="text-blue-300 hover:text-blue-200">วิเคราะห์ชื่อ</Link> •{' '}
        <Link href="/phone-analysis" className="text-blue-300 hover:text-blue-200">วิเคราะห์เบอร์</Link>
      </div>
    </section>
  );
};
