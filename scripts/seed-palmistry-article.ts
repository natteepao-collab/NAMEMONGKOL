/**
 * Seed script: Insert the full palmistry article into Supabase.
 * Run with:  npx tsx scripts/seed-palmistry-article.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * in .env or .env.local
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, key);

// ─── Article metadata ────────────────────────────────────────────────────────
const SLUG = 'palmistry-history-science-culture';

const article = {
  slug: SLUG,
  title:
    'หลักการดูลายมือ (หัตถศาสตร์) ในมุมมองประวัติศาสตร์ วัฒนธรรม และหลักฐานเชิงวิทยาศาสตร์',
  excerpt:
    'เจาะลึกหลักการดูลายมือ (หัตถศาสตร์/Palmistry) ตั้งแต่รากฐานประวัติศาสตร์ เปรียบเทียบสายตะวันตก-อินเดีย-จีน ความหมายเส้นหลักทุกเส้น ข้อจำกัดเชิงวิทยาศาสตร์ Barnum Effect และแนวปฏิบัติที่ปลอดภัย',
  cover_image: '/images/articles/palmistry-history-science-culture.webp',
  date: '2026-03-02',
  author: 'NameMongkol Team',
  category: 'โหราศาสตร์',
  keywords: [
    'ดูลายมือ',
    'หัตถศาสตร์',
    'palmistry',
    'chiromancy',
    'เส้นชีวิต',
    'เส้นสมอง',
    'เส้นหัวใจ',
    'เส้นวาสนา',
    'วิเคราะห์ลายมือ',
    'ดูลายมือออนไลน์',
    'ดูดวงลายมือ',
    'หัตถศาสตร์ไทย',
    'palm reading',
    'Barnum effect',
    'cold reading',
    'ประวัติศาสตร์การดูลายมือ',
  ],
  meta_title:
    'หลักการดูลายมือ (หัตถศาสตร์) ประวัติศาสตร์ วัฒนธรรม และวิทยาศาสตร์ | NameMongkol',
  meta_description:
    'เจาะลึกหัตถศาสตร์ ประวัติการดูลายมือจากอินเดีย กรีก จีน ความหมายเส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา ข้อจำกัดทางวิทยาศาสตร์ Barnum Effect และแนวปฏิบัติจริยธรรม',
  is_published: true,

  // ─── Full HTML content ───────────────────────────────────────────────────
  content: /* html */ `
<!-- ═══════════════════════════════════════════════════════════════════════════
     สารบัญ (TOC) — embedded in content for DB-sourced articles
     ═══════════════════════════════════════════════════════════════════════ -->
<nav class="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700/50" aria-label="สารบัญบทความ">
  <h2 class="text-lg font-bold text-white mb-4">สารบัญ</h2>
  <ul class="space-y-2 text-sm">
    <li><a href="#executive-summary" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>Executive Summary</a></li>
    <li><a href="#history" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>รากประวัติศาสตร์และแหล่งหลัก</a></li>
    <li><a href="#components" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>องค์ประกอบและคำจำกัดความในตำราหัตถศาสตร์</a></li>
    <li style="padding-left:16px"><a href="#illustrations" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>ภาพประกอบตัวอย่าง</a></li>
    <li><a href="#line-meanings" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>ความหมายของเส้นและเนินที่พบบ่อย</a></li>
    <li style="padding-left:16px"><a href="#comparison-table" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>ตารางเปรียบเทียบลักษณะเส้นกับความหมาย</a></li>
    <li><a href="#interpretation" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>หลักการตีความและกรณีศึกษาเชิงตำรา</a></li>
    <li style="padding-left:16px"><a href="#mermaid-diagram" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>แผนผังความสัมพันธ์ของเส้นและความหมาย</a></li>
    <li><a href="#cultural-differences" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>ความแตกต่างเชิงวัฒนธรรมของการดูลายมือ</a></li>
    <li><a href="#scientific-limitations" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>ข้อจำกัดทางวิทยาศาสตร์และการวิจารณ์เชิงวิชาการ</a></li>
    <li><a href="#ethics-and-practice" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>แนวปฏิบัติ จริยธรรม และแหล่งอ่านเพิ่มเติม</a></li>
    <li style="padding-left:16px"><a href="#safe-practice" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>แนวปฏิบัติที่ปลอดภัยกว่า</a></li>
    <li style="padding-left:16px"><a href="#ethics-warning" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>คำเตือนและจริยธรรม</a></li>
    <li style="padding-left:16px"><a href="#further-reading" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>หนังสือและแหล่งอ่านเพิ่มเติม</a></li>
    <li style="padding-left:16px"><a href="#beginner-tips" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>ข้อเสนอแนะสำหรับผู้เริ่มฝึกจริง</a></li>
    <li style="padding-left:16px"><a href="#source-credibility" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>ลำดับความน่าเชื่อถือของแหล่งข้อมูล</a></li>
    <li><a href="#faq-section" class="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2"><span class="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0"></span>คำถามที่พบบ่อย (FAQ)</a></li>
  </ul>
</nav>

<!-- ═══════════════════════════════════════════════════════════════════════════
     Executive Summary
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="executive-summary" class="scroll-mt-24">Executive Summary</h2>

<p>หัตถศาสตร์/การดูลายมือ (palmistry/chiromancy) คือการ &quot;อ่าน&quot; รูปทรงมือ เส้น และเนิน (mounts) เพื่ออธิบายบุคลิกและทำนายแนวโน้มชีวิต โดยมีรากความคิดกระจายบนยูเรเชียและพัฒนาหลายสาย—ตะวันตกมักอ้างระบบดาวเคราะห์และเส้นหลัก, สายอินเดียเชื่อมกับ &quot;สมุทรศาสตร์&quot; (Samudrika) ที่อ่านเครื่องหมายร่างกาย, สายจีนอยู่ในกลุ่มศาสตร์ &quot;เซี่ยง/เซียง&quot; (相) ที่ดูรูปลักษณ์เชื่อมชะตาและอิงกรอบ &quot;ห้าธาตุ/ห้าขันธ์–ห้าระยะ&quot; ตามวัฒนธรรมจีน.</p>

<p>ในเชิงวิทยาศาสตร์ หลักฐานสนับสนุนว่า &quot;เส้นลายมือมีความหมายทำนายอนาคต&quot; ยังไม่ปรากฏอย่างน่าเชื่อถือ (ไม่มีหลักฐานเชิงประจักษ์ระดับสูง) และคำอธิบายความ &quot;แม่น&quot; มักเชื่อมกับกลไกจิตวิทยาที่รู้จักดี เช่น Barnum/Forer effect (ยอมรับคำทำนายกว้าง ๆ ว่า &quot;ตรงกับตัวเอง&quot;) และเทคนิค cold reading (เดาจากเบาะแสแล้วขยายความ)</p>

<p>อย่างไรก็ดี &quot;เส้นฝ่ามือ&quot; ในชีววิทยาคือรอยพับ/รอยงอ (flexion creases) ที่ก่อตัวช่วงตัวอ่อนราว 8–13 สัปดาห์ของอายุครรภ์ และบางแบบมีนัยทางเวชพันธุศาสตร์ (เช่น single transverse palmar crease) แต่ไม่ได้ &quot;ทำนายชะตา&quot; ตามความหมายหัตถศาสตร์ (ไม่ควรปะปนศาสตร์แพทย์กับการทำนาย)</p>

<p>รายงานนี้สรุป &quot;กรอบตำรา&quot; ที่ใช้กันจริง + เปรียบเทียบเชิงวัฒนธรรม + วิจารณ์หลักฐาน พร้อมแนวทางปฏิบัติและจริยธรรมที่ลดอันตรายจากการให้คำปรึกษาเชิงทำนาย.</p>

<div class="my-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
  💡 <strong>ลองวิเคราะห์ลายมือของคุณด้วย AI ได้ฟรี!</strong> — ระบบ AI ของ NameMongkol วิเคราะห์ครบ 4 เส้นหลัก: เส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา พร้อมคำแนะนำเชิงสร้างสรรค์
  <a href="/palm-analysis" class="inline-block mt-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-amber-100 font-medium transition-colors">➜ วิเคราะห์ลายมือฟรีที่นี่</a>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     รากประวัติศาสตร์และแหล่งหลัก
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="history" class="scroll-mt-24">รากประวัติศาสตร์และแหล่งหลัก</h2>

<p>หลักฐานประวัติศาสตร์ชี้ว่า &quot;กำเนิดที่แท้&quot; ของการดูลายมือไม่ชัดเจน แต่แหล่งอ้างอิงสมัยใหม่ที่คัดกรองแล้วอย่าง Encyclopaedia Britannica ระบุว่าอาจเริ่มใน <strong>อินเดีย</strong> แล้วแพร่ไปในหลายภูมิภาค (รวมทั้ง <strong>จีน, ทิเบต, เปอร์เซีย, เมโสโปเตเมีย และอียิปต์</strong>) และได้รับการพัฒนาเด่นใน <strong>กรีซ</strong>; ต่อมาในยุโรปมีช่วงถูกตีตราในบริบทล่าแม่มด แล้วกลับมารุ่งในยุค Renaissance/ศตวรรษที่ 17 ที่พยายาม &quot;ทำให้เป็นเหตุเป็นผล/เชิงประจักษ์&quot; ก่อนจะ &quot;ฟื้นตัวแบบนิยมมวลชน&quot; อีกครั้งในศตวรรษที่ 19.</p>

<p>ในฝั่งยุโรปยุคต้นสมัยใหม่ แหล่งหอสมุด/คอลเลกชันพิเศษอย่างบล็อกของ Leiden University Library ชี้ว่ามีงานรวมตำราดูลายมือในยุโรป และมีการอ้างถึงในเอกสารโบราณหลายชิ้น; นอกจากนี้บล็อกจาก National Library of Medicine สรุปภาพกว้างว่าเมื่อเข้าปลายศตวรรษที่ 17 &quot;ไคโรมานซี&quot; (chiromancy) ในฐานะ &quot;ระบบความรู้&quot; ถูกลดความน่าเชื่อถือในหมู่นักปราชญ์ แม้การทำนายแบบมืออาชีพยังคงอยู่ในสังคม.</p>

<p>ในเชิงประวัติศาสตร์ความคิด ช่วงศตวรรษที่ 19 มีบุคคลที่มักถูกอ้างว่าเป็น &quot;ตัวเร่งการฟื้น&quot; ในโลกตะวันตก ได้แก่ <strong>Casimir d'Arpentigny</strong>, <strong>William Benham</strong> และ <strong>Louis Hamon</strong>; ศตวรรษที่ 20 แนวตีความบางสายเชื่อมโยงกับจิตวิทยาเชิงสัญลักษณ์ (เช่นการอ้างถึง Carl Jung ในฐานะบริบทการตีความ) แต่ไม่ได้ทำให้หัตถศาสตร์ &quot;ผ่านเกณฑ์วิทยาศาสตร์&quot; ในความหมายสมัยใหม่.</p>

<p>สำหรับจีน–ไต้หวัน งานชาติพันธุ์วรรณนา/มานุษยวิทยาว่าด้วยการ &quot;คำนวณชะตา&quot; ระบุว่าในกลุ่ม &quot;การวิเคราะห์รูปลักษณ์ (xiang)&quot; มีทั้งการดูหน้าและการดูลายมือ (shouxiang 手相) อยู่ร่วมกับศาสตร์ทำนายแบบอื่น (เช่นฮวงจุ้ย).</p>

<p>ส่วนฝั่ง &quot;จีนคลาสสิก&quot; งานวิชาการว่าด้วยตำราดูรูปลักษณ์ (physiognomy) ชี้ว่าแนวคิดการอ่าน &quot;ชะตาจากร่างกาย&quot; ถูกจัดระบบเข้มขึ้นตั้งแต่ยุคถังเป็นต้นมา และผูกกับกรอบห้าระยะ/ห้าธาตุในการจำแนกกายภาพและความหมาย.</p>

<p><em>หมายเหตุเรื่องคำ:</em> &quot;chiromancy&quot; มีรากคำจากกรีก/ละตินกลางในความหมาย &quot;การทำนายด้วยมือ&quot; และเริ่มใช้ในภาษาอังกฤษราวคริสต์ศตวรรษที่ 16 (เป็นข้อมูลเชิงภาษาศาสตร์ ไม่ใช่หลักฐานความจริงของคำทำนาย).</p>

<!-- ═══════════════════════════════════════════════════════════════════════════
     องค์ประกอบและคำจำกัดความในตำราหัตถศาสตร์
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="components" class="scroll-mt-24">องค์ประกอบและคำจำกัดความในตำราหัตถศาสตร์</h2>

<p>โดยทั่วไปตำราหัตถศาสตร์ &quot;กระแสหลัก&quot; มักแบ่งการสังเกตออกเป็น 3 ชั้น: (ก) <strong>เส้นหลัก (major lines)</strong> (ข) <strong>เนิน/ปุ่มนูน (mounts)</strong> และ (ค) <strong>&quot;สัญลักษณ์ย่อย&quot;</strong> เช่น กากบาท ดาว เกาะ สี่เหลี่ยม รวมถึงเนื้อผิวและความแข็ง–อ่อนของมือ.</p>

<h3 id="illustrations" class="scroll-mt-24">ภาพประกอบตัวอย่าง</h3>

<p><strong>ภาพ 1</strong> แผนผัง &quot;เส้นหลัก&quot; ตามการดูลายมือแบบตะวันตก (แสดงแนววาดเส้นชีวิต–เส้นสมอง–เส้นหัวใจ ฯลฯ เพื่อสอนการชี้ตำแหน่ง).</p>

<p><strong>ภาพ 2</strong> แผนผังเส้นหลักพร้อมป้ายกำกับหลายเส้น (ตัวอย่างสื่อการสอนสมัยใหม่ในฐานข้อมูลเสรี).</p>

<p><strong>ภาพ 3</strong> แผนที่ฝ่ามือแบบภาพพิมพ์เก่า (มีสัญลักษณ์ดาวเคราะห์/เส้นต่าง ๆ สะท้อนโลกทัศน์เชิงสัญลักษณ์ของหัตถศาสตร์ตะวันตก).</p>

<p><strong>ภาพ 4</strong> ตัวอย่าง &quot;การคำนวณอายุบนเส้นชีวิต/เส้นวาสนา&quot; ที่พบในสื่อเก่า (เป็นตัวอย่างว่าตำรา/สื่อบางยุครวม &quot;มาตราวัดเวลา&quot; ลงบนฝ่ามือ แม้จะไม่มีหลักฐานเชิงประจักษ์รองรับว่าเทียบอายุจริงได้).</p>

<p><strong>ภาพ 5</strong> ภาพบริบทการดูลายมือในชีวิตจริง (แสดงการปฏิบัติการอ่านมือเป็นกิจกรรมทางสังคม/พิธีกรรมร่วมสมัย).</p>

<p><strong>ภาพ 6</strong> ตัวอย่าง single transverse palmar crease (&quot;เส้นฝ่ามือเดียว/ซิเมียนครีส&quot;) เพื่อชี้ว่าบาง &quot;ลายมือ&quot; เป็นปรากฏการณ์กายวิภาคที่แพทยศาสตร์สนใจ ไม่ใช่หลักฐานของคำทำนาย.</p>

<!-- ═══════════════════════════════════════════════════════════════════════════
     ความหมายของเส้นและเนินที่พบบ่อย
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="line-meanings" class="scroll-mt-24">ความหมายของเส้นและเนินที่พบบ่อย</h2>

<div class="my-4 p-3 bg-slate-800/60 border-l-4 border-amber-500 rounded-r-lg text-slate-300 text-sm">
  ⚠️ คำอธิบายต่อไปนี้เป็น &quot;ความหมายตามตำรา/ธรรมเนียมการอ่านมือ&quot; (ไม่ใช่ข้อเท็จจริงที่พิสูจน์แล้ว) และบางตำราให้ความหมายรุนแรงมาก (เช่นโยงไปถึงความตาย/การฆ่าตัวตาย) จึงต้องใช้อย่างระมัดระวังสูง.
</div>

<p><strong>เส้นชีวิต:</strong> ตำราคลาสสิกบรรยายว่าเป็นเส้นโค้งล้อมโคนนิ้วหัวแม่มือ และ &quot;ตีความ&quot; เรื่องพลังชีวิต สุขภาพ ความแข็งแรง หรือความยืนยาว; ความชัด–ลึก–ขาดถูกผูกกับความหมายต่างกัน.</p>

<p><strong>เส้นหัวใจ:</strong> มักอธิบายว่าเริ่มใต้ก้อยพาดขวางฝ่ามือ ใช้อ่านเรื่องความรัก อารมณ์ ความผูกพัน เสถียรภาพทางความรู้สึก.</p>

<p><strong>เส้นสมอง/เส้นหัว (head line):</strong> ตำราอธิบายว่าเกี่ยวกับรูปแบบความคิด การตัดสินใจ ความกล้า–ความระวัง และการใช้เหตุผล/จินตนาการ โดยดูทิศทาง ความยาว และรอยแตก.</p>

<p><strong>เส้นวาสนา/เส้นชะตา (มักพ้องกับ fate line/เส้นดาวเสาร์):</strong> อธิบายว่าเป็นเส้นตั้งจากข้อมือขึ้นไปยังโคนนิ้วกลาง ใช้อ่านเรื่องทิศทางชีวิต งาน ความ &quot;บังคับของชะตา&quot; และจุดเปลี่ยนสำคัญ.</p>

<p><strong>เส้นอาทิตย์/เส้นอพอลโล (sun/apollo line):</strong> มักตีความเรื่องชื่อเสียง ความสำเร็จ ความสามารถเฉพาะด้าน.</p>

<p><strong>เส้นสุขภาพ/พุธ (hepatica/health line ในตำราเก่า):</strong> บางเล่มโยงกับสุขภาพ ระบบย่อย และความเครียด; แต่การโยงเส้นมือกับการวินิจฉัยโรค &quot;แบบทำนาย&quot; ไม่มีหลักฐานเชิงประจักษ์ และเสี่ยงอันตรายต่อผู้รับคำปรึกษา.</p>

<p><strong>เส้นความรัก/ความสัมพันธ์ (marriage/relationship lines):</strong> ตำราเก่ามักวางไว้ &quot;ขอบมือใต้ก้อย&quot; และอธิบายความสัมพันธ์/การแต่งงาน โดยตีความรอยขาดเป็นการเลิกรา ฯลฯ (เป็นคำอธิบายเชิงสัญลักษณ์).</p>

<p><strong>เนิน (mounts):</strong> มักตั้งชื่อตามดาวเคราะห์เพื่อจำง่าย เช่น &quot;เนินพฤหัส&quot; ใต้นิ้วชี้, &quot;เนินศุกร์&quot; ตรงโคนนิ้วหัวแม่มือ ฯลฯ และตีความเป็นแรงขับ/คุณลักษณะ (อำนาจ ความรัก จินตนาการ) โดยดูความนูน–แบนและรอยเส้นบนเนิน.</p>

<!-- ─── ตารางเปรียบเทียบ ───────────────────────────────────────────────── -->
<h3 id="comparison-table" class="scroll-mt-24">ตารางเปรียบเทียบลักษณะเส้นกับความหมายตามตำรา</h3>

<div class="my-4 p-3 bg-slate-800/60 border-l-4 border-blue-500 rounded-r-lg text-slate-300 text-sm">
  ℹ️ ตารางนี้สรุป &quot;แนวตีความที่พบในตำราเก่า&quot; เพื่อการเรียนรู้เชิงประวัติศาสตร์/วัฒนธรรม ไม่ใช่เกณฑ์วินิจฉัยหรือทำนายที่พิสูจน์แล้ว (หลายแถว &quot;ไม่มีหลักฐานเชิงประจักษ์&quot;).
</div>

<div class="overflow-x-auto my-6">
<table class="min-w-full text-sm border-collapse">
  <thead>
    <tr class="bg-slate-800/70">
      <th class="border border-slate-700 px-4 py-2 text-left text-white font-semibold">องค์ประกอบ</th>
      <th class="border border-slate-700 px-4 py-2 text-left text-white font-semibold">ลักษณะในตำรา</th>
      <th class="border border-slate-700 px-4 py-2 text-left text-white font-semibold">ความหมายที่ &quot;มัก&quot; อธิบาย</th>
      <th class="border border-slate-700 px-4 py-2 text-left text-white font-semibold">ระดับหลักฐาน</th>
    </tr>
  </thead>
  <tbody class="text-slate-300">
    <tr class="bg-slate-900/40">
      <td class="border border-slate-700 px-4 py-2">เส้นชีวิต</td>
      <td class="border border-slate-700 px-4 py-2">ชัด/ลึก/ไม่ขาด</td>
      <td class="border border-slate-700 px-4 py-2">สุขภาพแข็งแรง พลังชีวิตดี</td>
      <td class="border border-slate-700 px-4 py-2 text-amber-400">ไม่มีหลักฐานเชิงประจักษ์ว่าทำนายอายุได้</td>
    </tr>
    <tr class="bg-slate-800/40">
      <td class="border border-slate-700 px-4 py-2">เส้นชีวิต</td>
      <td class="border border-slate-700 px-4 py-2">ขาด/ถูกรบกวนด้วยเส้นตัด</td>
      <td class="border border-slate-700 px-4 py-2">ตำราเก่าบางเล่มตีความเป็นเหตุร้ายแรง (ถึงขั้น &quot;ชีวิตดับ&quot;)</td>
      <td class="border border-slate-700 px-4 py-2 text-red-400">ไม่มีหลักฐานเชิงประจักษ์; มีความเสี่ยงทำร้ายจิตใจ</td>
    </tr>
    <tr class="bg-slate-900/40">
      <td class="border border-slate-700 px-4 py-2">เส้นหัวใจ</td>
      <td class="border border-slate-700 px-4 py-2">ลึก/ชัด</td>
      <td class="border border-slate-700 px-4 py-2">ความรักมั่นคง อารมณ์ชัดเจน</td>
      <td class="border border-slate-700 px-4 py-2 text-amber-400">ไม่มีหลักฐานเชิงประจักษ์</td>
    </tr>
    <tr class="bg-slate-800/40">
      <td class="border border-slate-700 px-4 py-2">เส้นหัวใจ</td>
      <td class="border border-slate-700 px-4 py-2">แตก/ขาด/มีเส้นตัดมาก</td>
      <td class="border border-slate-700 px-4 py-2">ความผิดหวัง/ความสัมพันธ์สะดุด</td>
      <td class="border border-slate-700 px-4 py-2 text-amber-400">ไม่มีหลักฐานเชิงประจักษ์</td>
    </tr>
    <tr class="bg-slate-900/40">
      <td class="border border-slate-700 px-4 py-2">เส้นสมอง</td>
      <td class="border border-slate-700 px-4 py-2">ยาว–พอดี/โค้งพอประมาณ</td>
      <td class="border border-slate-700 px-4 py-2">วิจารณญาณดี เข้าใจสิ่งต่าง ๆ</td>
      <td class="border border-slate-700 px-4 py-2 text-amber-400">ไม่มีหลักฐานเชิงประจักษ์</td>
    </tr>
    <tr class="bg-slate-800/40">
      <td class="border border-slate-700 px-4 py-2">เส้นสมอง</td>
      <td class="border border-slate-700 px-4 py-2">สั้น/แตก</td>
      <td class="border border-slate-700 px-4 py-2">ตำราโยงกับการคิดจำกัด/ความกดดันทางใจ</td>
      <td class="border border-slate-700 px-4 py-2 text-red-400">ไม่มีหลักฐานเชิงประจักษ์ (และควรหลีกเลี่ยงการตีตรา)</td>
    </tr>
    <tr class="bg-slate-900/40">
      <td class="border border-slate-700 px-4 py-2">เส้นวาสนา</td>
      <td class="border border-slate-700 px-4 py-2">มีเส้นตั้งชัด</td>
      <td class="border border-slate-700 px-4 py-2">แนวทางอาชีพ/ชีวิต &quot;เด่น&quot; ถูกแรงผลักดันจาก &quot;ชะตา&quot;</td>
      <td class="border border-slate-700 px-4 py-2 text-amber-400">ไม่มีหลักฐานเชิงประจักษ์</td>
    </tr>
    <tr class="bg-slate-800/40">
      <td class="border border-slate-700 px-4 py-2">เส้นอาทิตย์</td>
      <td class="border border-slate-700 px-4 py-2">ปรากฏชัด</td>
      <td class="border border-slate-700 px-4 py-2">ความสำเร็จ/ชื่อเสียง</td>
      <td class="border border-slate-700 px-4 py-2 text-amber-400">ไม่มีหลักฐานเชิงประจักษ์</td>
    </tr>
    <tr class="bg-slate-900/40">
      <td class="border border-slate-700 px-4 py-2">เส้นความสัมพันธ์</td>
      <td class="border border-slate-700 px-4 py-2">เส้นขาด</td>
      <td class="border border-slate-700 px-4 py-2">ตำราเก่าโยง &quot;การเลิกรา/หย่า&quot;</td>
      <td class="border border-slate-700 px-4 py-2 text-amber-400">ไม่มีหลักฐานเชิงประจักษ์</td>
    </tr>
  </tbody>
</table>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     หลักการตีความและกรณีศึกษาเชิงตำรา
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="interpretation" class="scroll-mt-24">หลักการตีความและตัวอย่างกรณีศึกษาเชิงตำรา</h2>

<p>ตำราหัตถศาสตร์มักเสนอขั้นตอนอ่านมือคล้าย &quot;การตรวจแบบหลายมิติ&quot;: เริ่มจาก <strong>มือข้างเด่น–ข้างไม่เด่น</strong> (บางเล่มใช้กรอบ &quot;ซ้าย=พื้นเดิม/ธรรมชาติ ขวา=สิ่งที่พัฒนา/ความปรารถนา&quot;) แล้วจึงอ่านเส้นหลัก–เส้นรอง–สัญลักษณ์–เนิน โดยให้ความสำคัญกับ (1) ตำแหน่ง (2) ความยาว/ช่วงครอบคลุม (3) ความลึก/สี/ความคม (4) การตัดกันและรูปทรงพิเศษ (เกาะ ดาว สี่เหลี่ยม กากบาท) และ (5) ความสอดคล้องระหว่าง &quot;หลายสัญญาณ&quot; (testimony) ก่อนสรุป.</p>

<p>ตัวอย่างกรณีศึกษา &quot;ตามหนังสือสอนอ่านมือ&quot; (ไม่ใช่งานทดลองควบคุม และไม่ควรสรุปว่าเป็นจริงเสมอ):</p>

<p><strong>กรณีแรก</strong> เส้นสมองเริ่มแยกจากเส้นชีวิต &quot;ค่อนข้างกว้าง&quot; ตำราบางเล่มตีความเป็นความกล้า/ความมั่นใจ เชื่อมั่นในไอเดียใหม่; ถ้าเส้น &quot;รุ่ย/ฟุ้ง&quot; อาจโยงกับความหุนหันหรือใจร้อน. กรณีนี้ชี้ว่า &quot;ตำราอ่านจากรูปแบบ&quot; แต่ความหมายเป็นเชิงสัญลักษณ์และขึ้นกับผู้ตีความ.</p>

<p><strong>กรณีที่สอง</strong> เส้นความสัมพันธ์บริเวณขอบมือ &quot;มีรอยขาด&quot; ตำราเก่าบางเล่มโยงกับการเลิกรา/หย่า และหากมีสัญลักษณ์ประกอบอาจขยายเป็นเหตุการณ์เฉพาะ (เช่นบุคคลอื่นเข้ามาเกี่ยว). ในการใช้จริงแบบมีจริยธรรม ควรเปลี่ยนจาก &quot;ฟันธงอนาคต&quot; เป็น &quot;คำถามชวนสะท้อน&quot; (เช่น ปัจจัยความสัมพันธ์ที่กำลังกดดันคืออะไร) เพราะการฟันธงมีโอกาสสร้างความเสี่ยงทางใจ/ความสัมพันธ์.</p>

<!-- ─── แผนผัง Mermaid ───────────────────────────────────────────────── -->
<h3 id="mermaid-diagram" class="scroll-mt-24">แผนผังความสัมพันธ์ของเส้นและความหมาย (เชิงตำรา)</h3>

<pre class="bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-x-auto text-sm text-slate-300 my-6"><code>graph TD
  A[เส้นหลักบนฝ่ามือ] --&gt; B[เส้นชีวิต]
  A --&gt; C[เส้นสมอง/ปัญญา]
  A --&gt; D[เส้นหัวใจ]
  A --&gt; E[เส้นวาสนา/ชะตา]
  A --&gt; F[เส้นอาทิตย์/ชื่อเสียง]
  A --&gt; G[เส้นความสัมพันธ์]

  B --&gt; B1[พลังชีวิต/สุขภาพ (ตามตำรา)]
  C --&gt; C1[รูปแบบการคิด/การตัดสินใจ (ตามตำรา)]
  D --&gt; D1[อารมณ์/ความรัก (ตามตำรา)]
  E --&gt; E1[ทิศทางงาน/เหตุการณ์สำคัญ (ตามตำรา)]
  F --&gt; F1[ความสำเร็จ/การยอมรับ (ตามตำรา)]
  G --&gt; G1[ความสัมพันธ์ระยะยาว (ตามตำรา)]

  H[เนิน/ปุ่มนูน (mounts)] --&gt; H1[แรงขับ/คุณลักษณะเชิงสัญลักษณ์]
  A --&gt; H</code></pre>

<!-- ═══════════════════════════════════════════════════════════════════════════
     ความแตกต่างเชิงวัฒนธรรมของการดูลายมือ
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="cultural-differences" class="scroll-mt-24">ความแตกต่างเชิงวัฒนธรรมของการดูลายมือ</h2>

<p><strong>&quot;ตะวันตก&quot;</strong> (โดยเฉพาะสายที่ถูกเรียกว่ามีรากกรีก–ยุโรป) มักเน้น เส้นหลัก + เนินดาวเคราะห์ และการวางแผนที่ฝ่ามือแบบค่อนข้างมาตรฐาน พร้อมแนวคิดการทำนายอนาคต/บุคลิก; แหล่งอ้างอิงสมัยใหม่ระบุว่า &quot;รูปแบบคุ้นตา&quot; ของหัตถศาสตร์ตะวันตกเป็นระบบกรีกที่น่าจะรับอิทธิพลจากสายอินเดียมาก่อน และกลับมานิยมอีกในศตวรรษที่ 19.</p>

<p><strong>&quot;อินเดีย&quot;</strong> มักถูกอธิบายว่าอยู่ในกรอบ &quot;สมุทรศาสตร์&quot; ซึ่งเป็นการอ่าน &quot;ลักษณะร่างกาย&quot; (รวมถึงมือ) เชื่อมกรรม–ชะตา และมีวรรณกรรมศาสนา/วัฒนธรรมที่กล่าวถึงเครื่องหมาย auspicious/unlucky บนร่างกายเป็นส่วนหนึ่งของโลกทัศน์ (แต่ระดับข้อความ–การตีความแตกต่างตามสำนักและยุค).</p>

<p><strong>&quot;จีน&quot;</strong> มักวางการดูมือไว้ในเครือข่ายศาสตร์ &quot;ดูรูปลักษณ์ (xiang)&quot; ร่วมกับการดูหน้าและการคำนวณดวง โดยงานวิชาการชี้ว่า &quot;ตำราดูรูปลักษณ์&quot; มีการจัดระบบและอธิบายผ่านกรอบห้าระยะ/ห้าธาตุ และตีความความสัมพันธ์ร่างกาย–จิต–ชะตาเป็นชุดความคิดเดียวกัน (ต่างจากการเน้น &quot;เส้น&quot; แบบตะวันตกเพียว ๆ แม้จะมีการอ่านเส้นเช่นกันในทางปฏิบัติ).</p>

<!-- ═══════════════════════════════════════════════════════════════════════════
     ข้อจำกัดทางวิทยาศาสตร์
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="scientific-limitations" class="scroll-mt-24">ข้อจำกัดทางวิทยาศาสตร์และการวิจารณ์เชิงวิชาการ</h2>

<p>แหล่งอ้างอิงเชิงสารานุกรมสรุปตรงกันว่า &quot;ยังไม่มีหลักฐานวิทยาศาสตร์&quot; รองรับข้ออ้างว่าเส้น/ลักษณะมือมีความหมายเชิงพยากรณ์หรือพลังเหนือธรรมชาติ และยังชี้ปัญหา &quot;ความไม่เป็นเอกภาพ&quot; ของระบบ: นักดูลายมือคนละสำนักอาจให้ผลต่างกันแม้ดูมือเดียวกัน.</p>

<p>เมื่อมองเชิงชีววิทยา &quot;เส้นบนฝ่ามือ&quot; คือรอยพับงอที่เกิดจากการพัฒนาก่อนคลอดและสัมพันธ์กับการเคลื่อนไหว/โครงสร้างผิวหนัง—งานวิจัยด้านกายวิภาคระบุว่ารอยพับฝ่ามือและนิ้วก่อตัวช่วงทารกในครรภ์ประมาณ <strong>8–13 สัปดาห์</strong>.</p>

<p>นอกจากนี้ หน่วยแพทยศาสตร์อย่าง MedlinePlus อธิบายว่ารอยพับฝ่ามือพัฒนาขณะอยู่ในครรภ์ (มักเสร็จราวสัปดาห์ที่ 12) และ &quot;single palmar crease&quot; พบได้ในคนทั่วไปด้วย จึงไม่ใช่ตัวทำนายโรคโดยตัวมันเอง แม้จะพบถี่ขึ้นในบางภาวะ.</p>

<p>ในเชิงจิตวิทยาความเชื่อ งานคลาสสิกของ <strong>Bertram R. Forer</strong> แสดงให้เห็นว่าคนจำนวนมากให้คะแนนว่า &quot;คำบรรยายบุคลิกที่กว้างและคลุมเครือ&quot; ตรงกับตนเองสูง แม้ทุกคนได้รับข้อความเดียวกัน (กลไกที่ต่อมาถูกเรียก <strong>Barnum/Forer effect</strong>).</p>

<p>การทบทวนวรรณกรรมโดย <strong>D. H. Dickson</strong> และ <strong>I. W. Kelly</strong> สรุปว่าปรากฏการณ์นี้เกี่ยวข้องกับการยอมรับข้อความกว้าง ๆ ว่า &quot;เฉพาะตัว&quot; และชี้ตัวแปรที่ทำให้คนเชื่อมากขึ้น.</p>

<p>ยิ่งไปกว่านั้น งานทบทวนในวารสารของ Springer Nature อธิบาย &quot;<strong>cold reading</strong>&quot; ว่าเป็นกระบวนการเดาเชิงยุทธวิธีแล้วปรับตามปฏิกิริยาลูกค้า โดยอาศัย Barnum effect เป็นฐาน ทำให้ผู้รับคำทำนายรู้สึกว่า &quot;แม่น&quot; แม้ไม่มีความสามารถเหนือธรรมชาติ.</p>

<p>สำหรับความเชื่อเฉพาะ เช่น &quot;เส้นชีวิตยาว=อายุยืน&quot; มีงานเชิงประจักษ์บางชิ้นที่พยายามตรวจสอบและรายงานผลไม่สอดคล้องกับความเชื่อ (เช่นงานชันสูตร/หลังเสียชีวิตที่ตรวจความสัมพันธ์ &quot;ความยาวเส้นชีวิต&quot; กับการอยู่รอด). แม้งานประเภทนี้ยังมีข้อจำกัดด้านคุณภาพงานวิจัยและการออกแบบ แต่โดยภาพรวมไม่สนับสนุนการใช้เส้นชีวิตเป็นตัวทำนายอายุ.</p>

<!-- ═══════════════════════════════════════════════════════════════════════════
     แนวปฏิบัติ จริยธรรม แหล่งอ่านเพิ่มเติม
     ═══════════════════════════════════════════════════════════════════════ -->
<h2 id="ethics-and-practice" class="scroll-mt-24">แนวปฏิบัติ จริยธรรม แหล่งอ่านเพิ่มเติม และข้อเสนอแนะการฝึกจริง</h2>

<h3 id="safe-practice" class="scroll-mt-24">แนวปฏิบัติที่ &quot;ปลอดภัยกว่า&quot; หากต้องการเรียนรู้เชิงวัฒนธรรม</h3>

<p>การเรียนหัตถศาสตร์ในฐานะ &quot;วัฒนธรรมการทำนาย&quot; ทำได้โดยเน้น 3 ทักษะ:</p>

<p><strong>หนึ่ง</strong> แยก &quot;คำอธิบายเชิงสัญลักษณ์&quot; ออกจาก &quot;ข้อเท็จจริงทางชีววิทยา&quot; (เช่น เส้นมือเป็นรอยพับที่เกิดช่วงตัวอ่อน ไม่ใช่ตัวเลขชะตา).</p>

<p><strong>สอง</strong> ฝึกอ่านแบบตั้งคำถาม–สะท้อน (ทำเป็นเครื่องมือสนทนา) แทนการฟันธงเหตุร้าย โดยเฉพาะเรื่องความตาย โรคหนัก การหย่า หรือการฆ่าตัวตาย ซึ่งตำราเก่าบางเล่มกล่าวแบบรุนแรงแต่ไม่มีหลักฐานเชิงประจักษ์.</p>

<p><strong>สาม</strong> ทำ &quot;บันทึกการอ่าน&quot; และทบทวนความเอนเอียง (confirmation bias) อย่างจริงจัง เพราะความรู้สึกว่า &quot;แม่น&quot; มักถูกเสริมด้วย Barnum effect และ cold reading.</p>

<h3 id="ethics-warning" class="scroll-mt-24">คำเตือนและจริยธรรมในการให้คำปรึกษา</h3>

<p>หลักจริยธรรมสำคัญที่ประยุกต์จากวิชาชีพให้คำปรึกษา ได้แก่ &quot;<strong>หลีกเลี่ยงการทำอันตราย</strong>&quot; (avoid harm), ใช้ <strong>ความยินยอมโดยรู้ข้อมูล</strong> (informed consent), <strong>เคารพความเป็นส่วนตัว/ความลับ</strong> และ <strong>สื่อสารความไม่แน่นอนอย่างโปร่งใส</strong>.</p>

<p>ดังนั้น หากมีการ &quot;ดูมือให้ผู้อื่น&quot; ควรบอกให้ชัดว่าเป็นการตีความเชิงวัฒนธรรม/ความเชื่อ ไม่ใช่การแพทย์ ไม่ใช่กฎหมาย/การเงิน และไม่ควรใช้แทนการตัดสินใจสำคัญในชีวิต.</p>

<h3 id="further-reading" class="scroll-mt-24">หนังสือและแหล่งอ่านเพิ่มเติม (ไทย–อังกฤษ)</h3>

<h4>ภาษาไทย <span class="text-slate-400 font-normal text-sm">(ส่วนมากเป็นตำรานิยม/พาณิชย์ จัดเป็นแหล่งระดับ Popular แต่มีประโยชน์เชิงฝึกอ่านตามสำนักไทย)</span></h4>

<ul>
  <li>ตัวอย่างหนังสือไทยจากสำนักพิมพ์: ตัวอย่าง e-book/สารบัญหนังสือ &quot;มือ…บอกชีวิต&quot; ของ สำนักพิมพ์มติชน (ใช้ดูโครงสร้างการสอนเส้น/เนินในบริบทไทย).</li>
  <li>ตำราไทยคลาสสิกที่มีข้อมูลบรรณานุกรม/ISBN ปรากฏในแหล่งจำหน่าย: &quot;หัตถเรขานิเทศ ตำราดูลายมือ ฉบับสมบูรณ์&quot; (เหมาะอ่านเป็นประวัติการร้อยเรียงเนื้อหาแบบไทย แต่ควรอ่านอย่างมีวิจารณญาณ).</li>
  <li>หนังสือแนวเปรียบเทียบสายจีน/สำนักเอเชียในตลาดไทย: &quot;หัตถลักษณ์ศาสตร์ ฉบับ วิธีดูลายมือแบบกูรู&quot;.</li>
</ul>

<h4>ภาษาอังกฤษ <span class="text-slate-400 font-normal text-sm">(มีทั้ง Primary sources และงานวิชาการ/กึ่งวิชาการ)</span></h4>

<ul>
  <li>บทความภาพรวม: บทความ &quot;palmistry&quot; ใน Britannica (ให้โครงประวัติศาสตร์และข้อสรุปเรื่องหลักฐาน).</li>
  <li>ตำราเก่าเพื่อศึกษาความหมาย &quot;ตามสำนัก&quot;: คู่มือ/ตำราดูลายมือสแกนสาธารณะในคลังออนไลน์ (เช่นคู่มือที่นิยาม life line/heart line/head line และสัญลักษณ์บนฝ่ามือ).</li>
  <li>งานจีน/เอเชีย: บทนำหนังสือชาติพันธุ์วรรณนาเรื่องการทำนายในไต้หวัน–จีนที่กล่าวถึง shouxiang (ให้กรอบว่าการดูลายมืออยู่ใน ecosystem ของการ &quot;คำนวณชะตา&quot;).</li>
  <li>งานจีนคลาสสิกเชิงวิชาการ: บทความวิชาการว่าด้วยประเพณีตำราดูรูปลักษณ์จีน (解释ผ่านกรอบห้าระยะ).</li>
  <li>งานจิตวิทยา/วิจารณ์: งานของ Forer (ต้นทาง Forer effect), บททบทวน Barnum effect, และบทความเชิงจิตวิทยาเรื่อง cold reading.</li>
</ul>

<h3 id="beginner-tips" class="scroll-mt-24">ข้อเสนอแนะสำหรับผู้เริ่มฝึกจริง</h3>

<p>หากจุดประสงค์คือ &quot;เรียนรู้เพื่อความเข้าใจวัฒนธรรมและการสื่อสาร&quot; มากกว่าการทำนาย ควรเริ่มจาก (1) ทำแผนที่เส้นและเนินให้แม่นด้วยภาพประกอบมาตรฐาน (2) ฝึกอ่านจากหลายมือโดยไม่ทราบข้อมูลเจ้าของมือก่อน (ลดอคติ) (3) ใช้ภาษาแบบ &quot;สมมติฐาน&quot; และให้ผู้รับการอ่านยืนยัน/ปฏิเสธได้ (4) ฝึกทักษะจริยธรรมการให้คำปรึกษา: ไม่ข่มขู่ ไม่ฟันธง ไม่ชี้นำให้ตัดสินใจเสี่ยง.</p>

<p>สำหรับ &quot;หลักสูตร&quot; ในไทย ส่วนใหญ่เป็นการอบรมโดยสถาบัน/ชมรมสายโหราศาสตร์มากกว่าสถาบันอุดมศึกษา ตัวอย่างเช่นหลักสูตรหัตถศาสตร์ของ มูลนิธิสมาคมโหรแห่งประเทศไทยในพระสังฆราชูปถัมภ์ (เป็นการเรียนสายวิชาชีพ/ความเชื่อ ควรประเมินเนื้อหาและจรรยาบรรณก่อนเรียน).</p>

<h3 id="source-credibility" class="scroll-mt-24">ลำดับความน่าเชื่อถือของแหล่งข้อมูลที่ใช้ในรายงานนี้</h3>

<p><strong>ระดับสูงสุด</strong>คือแหล่งที่ผ่านการกลั่นกรองทางวิชาการ/วิชาชีพ เช่นงานวิจัยด้านจิตวิทยา (Forer effect, Barnum effect review, cold reading) และงานกายวิภาค/เวชศาสตร์เรื่องรอยพับฝ่ามือ.</p>

<p><strong>ระดับกลาง</strong>คือสารานุกรมและงานวิชาการด้านประวัติศาสตร์–วัฒนธรรมที่อธิบายการดูลายมือในฐานะปรากฏการณ์สังคม (เช่น Britannica; งานจีนศึกษา/ชาติพันธุ์วรรณนา).</p>

<p><strong>ระดับเพื่อ &quot;เข้าใจวาทกรรมของศาสตร์&quot;</strong> คือ Primary sources/ตำราเก่าของนักดูลายมือ ซึ่งมีคุณค่าในฐานะหลักฐานว่าผู้คน &quot;เชื่อและอธิบายอย่างไร&quot; แต่ความแม่นยำเชิงทำนาย &quot;ไม่มีหลักฐานเชิงประจักษ์&quot; และต้องอ่านด้วยการรู้เท่าทันอคติ.</p>

<!-- ═══════════════════════════════════════════════════════════════════════════
     CTA ท้ายบทความ (ตาม SEO Checklist)
     ═══════════════════════════════════════════════════════════════════════ -->
<div class="my-8 p-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl text-center">
  <h3 class="text-xl font-bold text-white mb-2">อยากลองวิเคราะห์ลายมือของคุณด้วย AI?</h3>
  <p class="text-slate-300 text-sm mb-4">ระบบ AI ของ NameMongkol อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา ให้คำแนะนำเชิงสร้างสรรค์ ฟรี 100%</p>
  <a href="/palm-analysis" class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-600/30">➜ วิเคราะห์ลายมือฟรีที่นี่</a>
</div>

<div class="my-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-center">
  <p class="text-slate-400 text-sm mb-2">อยากรู้ว่าชื่อของคุณดีแค่ไหน?</p>
  <a href="/name-analysis" class="inline-block px-5 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-200 font-medium rounded-lg transition-colors text-sm">คลิกวิเคราะห์ชื่อฟรีที่นี่</a>
</div>
`,
};

// ─── Upsert logic ────────────────────────────────────────────────────────────
async function main() {
  console.log(`⏳ Upserting article "${SLUG}" …`);

  // Check if exists
  const { data: existing } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', SLUG)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', existing.id);
    if (error) {
      console.error('❌ Update failed:', error.message);
      process.exit(1);
    }
    console.log(`✅ Article updated (id=${existing.id})`);
  } else {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select('id')
      .single();
    if (error) {
      console.error('❌ Insert failed:', error.message);
      process.exit(1);
    }
    console.log(`✅ Article inserted (id=${data.id})`);
  }
}

main();
