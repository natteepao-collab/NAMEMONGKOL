/**
 * SEO-specific configuration for the palmistry-history-science-culture article.
 * This file centralises all slug-specific SEO enhancements so the generic
 * [slug]/page.tsx stays clean and the blast radius of per-article tweaks is minimal.
 */

import type { FaqItem } from './articles';

export const PALMISTRY_SLUG = 'palmistry-history-science-culture';

// ─── Table of Contents (structured for TOC component & jump links) ──────────
export const palmistryToc: { title: string; id: string; level: number }[] = [
    { title: 'Executive Summary', id: 'executive-summary', level: 2 },
    { title: 'รากประวัติศาสตร์และแหล่งหลัก', id: 'history', level: 2 },
    { title: 'องค์ประกอบและคำจำกัดความในตำราหัตถศาสตร์', id: 'components', level: 2 },
    { title: 'ภาพประกอบตัวอย่าง', id: 'illustrations', level: 3 },
    { title: 'ความหมายของเส้นและเนินที่พบบ่อย', id: 'line-meanings', level: 2 },
    { title: 'ตารางเปรียบเทียบลักษณะเส้นกับความหมาย', id: 'comparison-table', level: 3 },
    { title: 'หลักการตีความและกรณีศึกษาเชิงตำรา', id: 'interpretation', level: 2 },
    { title: 'แผนผังความสัมพันธ์ของเส้นและความหมาย', id: 'mermaid-diagram', level: 3 },
    { title: 'ความแตกต่างเชิงวัฒนธรรมของการดูลายมือ', id: 'cultural-differences', level: 2 },
    { title: 'ข้อจำกัดทางวิทยาศาสตร์และการวิจารณ์เชิงวิชาการ', id: 'scientific-limitations', level: 2 },
    { title: 'แนวปฏิบัติ จริยธรรม และแหล่งอ่านเพิ่มเติม', id: 'ethics-and-practice', level: 2 },
    { title: 'แนวปฏิบัติที่ปลอดภัยกว่า', id: 'safe-practice', level: 3 },
    { title: 'คำเตือนและจริยธรรม', id: 'ethics-warning', level: 3 },
    { title: 'หนังสือและแหล่งอ่านเพิ่มเติม', id: 'further-reading', level: 3 },
    { title: 'ข้อเสนอแนะสำหรับผู้เริ่มฝึกจริง', id: 'beginner-tips', level: 3 },
    { title: 'ลำดับความน่าเชื่อถือของแหล่งข้อมูล', id: 'source-credibility', level: 3 },
    { title: 'คำถามที่พบบ่อย (FAQ)', id: 'faq-section', level: 2 },
];

// ─── FAQ Items (powers FAQPage JSON-LD + rendered FAQ section) ───────────────
export const palmistryFaqItems: FaqItem[] = [
    {
        question: 'การดูลายมือ (หัตถศาสตร์) คืออะไร?',
        answer: 'หัตถศาสตร์ (Palmistry/Chiromancy) คือศาสตร์การอ่านรูปทรงมือ เส้น และเนิน (Mounts) บนฝ่ามือ เพื่ออธิบายบุคลิกและทำนายแนวโน้มชีวิต โดยมีรากฐานจากอินเดีย กรีก และจีนโบราณ เป็นศาสตร์เชิงวัฒนธรรมที่ยังไม่มีหลักฐานทางวิทยาศาสตร์เชิงประจักษ์ยืนยันความแม่นยำ',
    },
    {
        question: 'เส้นหลักบนฝ่ามือมีกี่เส้น อะไรบ้าง?',
        answer: 'ตำราหัตถศาสตร์กระแสหลักแบ่งเส้นหลักเป็น 4 เส้น ได้แก่ (1) เส้นชีวิต (Life Line) เกี่ยวกับพลังชีวิตและสุขภาพ (2) เส้นสมอง (Head Line) เกี่ยวกับรูปแบบการคิด (3) เส้นหัวใจ (Heart Line) เกี่ยวกับอารมณ์และความรัก และ (4) เส้นวาสนา/ชะตา (Fate Line) เกี่ยวกับทิศทางอาชีพและชีวิต นอกจากนี้ยังมีเส้นรอง เช่น เส้นอาทิตย์ เส้นสุขภาพ และเส้นความสัมพันธ์',
    },
    {
        question: 'การดูลายมือมีหลักฐานทางวิทยาศาสตร์รองรับหรือไม่?',
        answer: 'ยังไม่มีหลักฐานทางวิทยาศาสตร์เชิงประจักษ์ระดับสูงที่ยืนยันว่าเส้นลายมือสามารถทำนายอนาคตได้จริง ความรู้สึกว่า "แม่น" มักอธิบายได้ด้วยกลไกจิตวิทยา เช่น Barnum/Forer Effect (การยอมรับคำทำนายกว้างๆ ว่าตรงกับตนเอง) และเทคนิค Cold Reading เส้นบนฝ่ามือเป็นรอยพับงอที่เกิดขึ้นช่วงตัวอ่อน 8-13 สัปดาห์ในครรภ์',
    },
    {
        question: 'การดูลายมือแบบตะวันตก อินเดีย และจีน ต่างกันอย่างไร?',
        answer: 'สายตะวันตก (กรีก-ยุโรป) เน้นเส้นหลัก + เนินดาวเคราะห์ สายอินเดียอยู่ในกรอบ "สมุทรศาสตร์" (Samudrika) ที่อ่านลักษณะร่างกายเชื่อมกับกรรม-ชะตา และสายจีนอยู่ในกลุ่มศาสตร์ "เซี่ยง/เซียง" (相) ดูรูปลักษณ์เชื่อมชะตาผ่านกรอบห้าธาตุ/ห้าระยะ แต่ละสายมีรายละเอียดการตีความที่แตกต่างกันตามวัฒนธรรมและยุคสมัย',
    },
    {
        question: 'Barnum Effect และ Cold Reading คืออะไร เกี่ยวข้องกับการดูลายมืออย่างไร?',
        answer: 'Barnum/Forer Effect คือปรากฏการณ์ทางจิตวิทยาที่คนมักยอมรับคำอธิบายบุคลิกที่กว้างและคลุมเครือว่า "ตรงกับตัวเอง" แม้ทุกคนจะได้รับข้อความเดียวกัน ส่วน Cold Reading คือเทคนิคการเดาเชิงยุทธวิธีแล้วปรับตามปฏิกิริยาผู้รับ ทั้งสองกลไกนี้ช่วยอธิบายว่าทำไมคนจำนวนมากรู้สึกว่าการดูลายมือ "แม่น" แม้ไม่มีความสามารถเหนือธรรมชาติ',
    },
    {
        question: 'เส้นชีวิตสั้นหมายถึงอายุสั้นจริงหรือไม่?',
        answer: 'ไม่จริง งานวิจัยเชิงประจักษ์ที่ตรวจสอบความสัมพันธ์ระหว่าง "ความยาวเส้นชีวิต" กับอายุขัยจริง ไม่สนับสนุนความเชื่อนี้ เส้นชีวิตเป็นรอยพับงอ (Flexion Crease) ที่เกิดจากการพัฒนาก่อนคลอด ไม่ได้มีกลไกทางชีววิทยาที่เชื่อมโยงกับอายุขัย การฟันธงเรื่องอายุจากเส้นมือ อาจสร้างความวิตกกังวลโดยไม่จำเป็น',
    },
    {
        question: 'ควรระวังอะไรเมื่อไปดูลายมือกับหมอดู?',
        answer: 'ควรตระหนักว่าการดูลายมือเป็นการตีความเชิงวัฒนธรรม ไม่ใช่การแพทย์หรือวิทยาศาสตร์ ไม่ควรใช้แทนการตัดสินใจสำคัญในชีวิต ระวังการฟันธงเหตุร้ายที่อาจทำร้ายจิตใจ และประเมินด้วยวิจารณญาณว่าคำทำนายกว้างๆ อาจเป็นผลจาก Barnum Effect หรือ Cold Reading หลักจริยธรรมสำคัญคือ "หลีกเลี่ยงการทำอันตราย" และ "สื่อสารความไม่แน่นอนอย่างโปร่งใส"',
    },
    {
        question: 'NameMongkol วิเคราะห์ลายมือด้วย AI ได้อย่างไร?',
        answer: 'ระบบ AI ของ NameMongkol วิเคราะห์ลายมือโดยการอ่านรูปแบบเส้นหลัก 4 เส้น (เส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา) จากภาพถ่ายฝ่ามือ แล้วให้คำแนะนำเชิงสร้างสรรค์ โดยเน้นความเป็นกลางและไม่ฟันธงเหตุร้าย สามารถใช้งานฟรีได้ที่หน้า วิเคราะห์ลายมือ (/palm-analysis) ของเว็บไซต์',
    },
];

// ─── Related article slugs (topical internal linking) ───────────────────────
export const palmistryRelatedSlugs: string[] = [
    // These should match actual article slugs in the DB / localArticles
    'what-is-shadow-power',
    'history-of-thai-naming-tradition',
    'naming-tips-2026-year-of-horse',
];

// ─── Enhanced metadata overrides ────────────────────────────────────────────
export const palmistryMetaOverrides = {
    metaTitle: 'หลักการดูลายมือ (หัตถศาสตร์) ประวัติศาสตร์ วัฒนธรรม วิทยาศาสตร์ | NameMongkol',
    metaDescription: 'เจาะลึกหัตถศาสตร์ (Palmistry) ประวัติจากอินเดีย กรีก จีน ความหมายเส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา ข้อจำกัดทางวิทยาศาสตร์ Barnum Effect และแนวปฏิบัติจริยธรรม พร้อมวิเคราะห์ลายมือด้วย AI ฟรี',
    dateModified: '2026-03-03', // Update when content changes
};
