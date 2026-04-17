const fs = require('fs');

try {
  let content = fs.readFileSync('src/data/articles.ts', 'utf8');

  // 1. Array of search & replace pairs for metaTitles
  const titlesToFix = [
    [
      "metaTitle: 'เปลี่ยนชื่อเปลี่ยนชีวิต: คู่มือปรับจูนชะตา (Destiny Tuning) ฉบับสมบูรณ์ 2569 | NameMongkol',",
      "metaTitle: 'เปลี่ยนชื่อเปลี่ยนชีวิต: คู่มืออัปเดตชะตา 2569 | NameMongkol',"
    ],
    [
      "metaTitle: 'ตั้งชื่อมงคลตามวันเกิด 2569 คู่มือทักษาปกรณ์ ปีม้าไฟ | NameMongkol',",
      "metaTitle: 'ตั้งชื่อมงคลตามวันเกิด 2569 คู่มือทักษา ปีม้าไฟ | NameMongkol',"
    ],
    [
      "metaTitle: '100 ชื่อมงคลผู้หญิง 2569 ทันสมัย ความหมายดี เสริมดวง | NameMongkol',",
      "metaTitle: '100 ชื่อมงคลผู้หญิง 2569 ทันสมัย เสริมดวง | NameMongkol',"
    ],
    [
      "metaTitle: 'ถอดรหัสชื่อมงคล ศุภจี สุธรรมพันธุ์ CEO ดุสิตธานี | เลขศาสตร์เกรด A+ | NameMongkol',",
      "metaTitle: 'ถอดรหัสชื่อคุณศุภจี CEO ดุสิตธานี เลขเกรด A+ | NameMongkol',"
    ],
    [
      "metaTitle: 'ประวัติศาสตร์การตั้งชื่อมงคลของคนไทย 700 ปี: ทักษาปกรณ์สู่เลขศาสตร์ | NameMongkol',",
      "metaTitle: 'ประวัติศาสตร์ตั้งชื่อมงคล 700 ปี ทักษาถึงเลขศาสตร์ | NameMongkol',"
    ],
    [
      "metaTitle: 'พลังเงาและอายตนะ 6 คืออะไร? ศาสตร์ลับเปลี่ยนชื่อให้ปัง | NameMongkol',",
      "metaTitle: 'พลังเงาและอายตนะ 6 คืออะไร? ศาสตร์ลับเปลี่ยนชื่อ | NameMongkol',"
    ],
    [
      "metaTitle: 'คู่เลขมงคล (Micro-Analysis) คืออะไร? สำคัญกว่าผลรวมอย่างไร | NameMongkol',",
      "metaTitle: 'คู่เลขมงคลคืออะไร? สำคัญกว่าผลรวมเลขศาสตร์อย่างไร | NameMongkol',"
    ],
    [
      "metaTitle: 'สไตล์การตั้งชื่อเปลี่ยนไปอย่างไร? เจาะลึก 5 Generation กับชื่อมงคล',",
      "metaTitle: 'วิวัฒนาการตั้งชื่อ 5 Generation ของคนไทย | NameMongkol',"
    ],
    [
      "metaTitle: 'ตั้งชื่อมงคลสไตล์จีน 2569: หลักปาจื้อ ธาตุทั้ง 5 สำหรับคนไทยเชื้อสายจีน',",
      "metaTitle: 'ตั้งชื่อมงคลจีน 2569 หลักปาจื้อ ธาตุทั้ง 5 | NameMongkol',"
    ],
    [
      "metaTitle: '100 ชื่อจริงลูกชาย ชื่อมงคล 2569 ความหมายดี เสริมบารมี งานรุ่ง เงินพุ่ง',",
      "metaTitle: '100 ชื่อจริงลูกชายมงคล 2569 ความหมายดี เสริมบารมี | NameMongkol',"
    ],
    [
      "metaTitle: 'ผ่าดวง 20 ชื่อยอดฮิตของไทย! สมชาย สมจิต ประเสริฐ ชื่อเฮงหรือชื่อโหล? | NameMongkol',",
      "metaTitle: 'ผ่าดวง 20 ชื่อยอดฮิต สมชาย สมจิต ดีหรือโหล? | NameMongkol',"
    ],
    [
      "metaTitle: 'แจกฟรี! 999 ชื่อมงคลประจำปี 2568 ความหมายดี พลิกชีวิต | NameMongkol',",
      "metaTitle: 'แจกฟรี 999 ชื่อมงคลปี 2568 ความหมายดี พลิกชีวิต | NameMongkol',"
    ],
    [
      "metaTitle: 'วิธีเลือกเบอร์มงคล 2569 ด้วยตัวเอง: คู่มือฉบับสมบูรณ์ | NameMongkol',",
      "metaTitle: 'วิธีเลือกเบอร์มงคล 2569 ด้วยตัวเอง คู่มือสมบูรณ์ | NameMongkol',"
    ],
    [
      "metaTitle: 'สถิติชื่อไทยปี 2568 และเทรนด์ปี 2569: อักษรไหนปังสุด? | NameMongkol',",
      "metaTitle: 'สถิติชื่อไทย 2568 และเทรนด์ 2569 อักษรไหนปัง? | NameMongkol',"
    ],
    [
      "metaTitle: 'เช็กด่วน! คู่เลข \"อุปสรรค\" ด้านความรักและเสน่ห์ รู้ก่อนแก้...เปลี่ยนดวงรักให้พุ่ง | NameMongkol',",
      "metaTitle: 'คู่เลขลดเสน่ห์ อุปสรรคความรัก รู้แล้วแก้ด่วน | NameMongkol',"
    ],
    [
      "metaTitle: 'พลังแห่งการตั้งชื่อ: ชื่อมงคลเปลี่ยนชีวิตได้จริงหรือ? - NAMEMONGKOL',",
      "metaTitle: 'พลังแห่งการตั้งชื่อ ชื่อมงคลเปลี่ยนชีวิตได้จริงหรือ? | NameMongkol',"
    ],
    [
      "metaTitle: 'รวม 100 ชื่อมงคลลูกชายปีมะเมีย 2569 ตั้งแล้วรวย เสริมบารมี (อัปเดตล่าสุด) - NAMEMONGKOL',",
      "metaTitle: '100 ชื่อมงคลลูกชายปีมะเมีย 2569 ตั้งแล้วรวย | NameMongkol',"
    ],
    [
      "metaTitle: 'คู่มือเลือกเลขมงคลตามวันเกิดปี 2569 เสริมดวงชะตา พลิกชีวิตให้ปัง! | NameMongkol',",
      "metaTitle: 'เลขมงคลตามวันเกิด 2569 เสริมดวงชะตา พลิกชีวิต | NameMongkol',"
    ],
    [
      "metaTitle: 'ตารางสีมงคลตามวันเกิดปี 2569 เสริมดวงเฮง การเงินพุ่ง รักรุ่งตลอดปี! | NameMongkol',",
      "metaTitle: 'ตารางสีมงคลตามวันเกิด 2569 เสริมดวงการเงิน | NameMongkol',"
    ],
    [
      "metaTitle: '4 ศาสตร์การตั้งชื่อมงคลที่คุณต้องรู้: เปลี่ยนชื่อทั้งที ต้องดีให้ครบทุกมิติ! | NameMongkol',",
      "metaTitle: '4 ศาสตร์ตั้งชื่อมงคลที่คุณต้องรู้ เปลี่ยนให้ปัง | NameMongkol',"
    ],
    [
      "metaTitle: 'ทำไม \"เลขศาสตร์\" ถึงมีผลกับชีวิต? เจาะลึกพลังตัวเลข 0-9 - NameMongkol',",
      "metaTitle: 'เลขศาสตร์มีผลกับชีวิตอย่างไร? เจาะพลังตัวเลข 0-9 | NameMongkol',"
    ],
    [
      "metaTitle: 'เช็คด่วน! อักษรกาลกิณีตามวันเกิดของคุณคืออะไร? (ครบทั้ง 7 วัน) | NameMongkol',",
      "metaTitle: 'เช็กอักษรกาลกิณีตามวันเกิด อักษรต้องห้าม 7 วัน | NameMongkol',"
    ],
    [
      "metaTitle: 'วิเคราะห์เบอร์มงคล แม่นยำที่สุด 2026: เจาะลึกอัลกอริทึมเลขศาสตร์ดิจิทัล - NameMongkol',",
      "metaTitle: 'วิเคราะห์เบอร์มงคล 2026 เจาะลึกเลขศาสตร์ดิจิทัล | NameMongkol',"
    ],
    [
      "metaTitle: 'พลังเงา (Shadow Power) คืออะไร? ศาสตร์ลับวิเคราะห์ชื่อชั้นสูง - NameMongkol',",
      "metaTitle: 'พลังเงา (Shadow Power) คืออะไร? ศาสตร์ลับตั้งชื่อ | NameMongkol',"
    ],
    [
      "metaTitle: 'แจกฟรี! วอลเปเปอร์เทพเจ้าไฉ่ซิงเอี๊ย (Cai Shen) เสริมดวงการเงิน 4 สีมงคล | NameMongkol',",
      "metaTitle: 'แจกฟรี! วอลเปเปอร์เทพเจ้าไฉ่ซิงเอี๊ย เสริมดวง | NameMongkol',"
    ],
    [
      "metaTitle: 'แจกฟรี! 131 ชื่อเล่นมงคลเกรด A ยุคดิจิทัล ผลรวมปัง คู่เลขสวย | NameMongkol',",
      "metaTitle: 'ฟรี 131 ชื่อเล่นมงคลเกรด A ยุคดิจิทัล ผลรวมปัง | NameMongkol',"
    ],
    [
      "metaTitle: 'ตั้งชื่อลูกปีมะเมีย 2569 รวมชื่อมงคล ลูกชาย-ลูกสาว เสริมดวงทุกวันเกิด | NameMongkol',",
      "metaTitle: 'ตั้งชื่อลูกปีมะเมีย 2569 รวมชื่อมงคล ลูกชาย-สาว | NameMongkol',"
    ]
  ];

  titlesToFix.forEach(([target, replace]) => {
    if (content.includes(target)) {
      content = content.replace(target, replace);
      console.log('✅ Replaced:', target.substring(0, 30) + '...');
    } else {
      console.log('❌ NOT FOUND:', target.substring(0, 30) + '...');
    }
  });

  // 2. Fix metaDescriptions
  const descToFix = [
    [
      "metaDescription: 'รู้จักศาสตร์อายตนะ 6 เคล็ดลับการตั้งชื่อให้เป็นที่รัก มีบารมี และมีความสุขสมบูรณ์',",
      "metaDescription: 'รู้จักศาสตร์อายตนะ 6 เคล็ดลับสำคัญในการตั้งชื่อให้เป็นที่รัก มีผู้ใหญ่อุปถัมภ์ เสริมบารมี และมีชีวิตที่เต็มไปด้วยความสุขสมบูรณ์ตามหลักโหราศาสตร์ไทย',"
    ],
    [
      "metaDescription: 'เช็กตารางสีมงคลประจำวันเกิดปี 2569 เสริมอำนาจ โชคลาภ และเมตตา พร้อมสีที่ควรหลีกเลี่ยง',",
      "metaDescription: 'เช็กตารางสีมงคลประจำวันเกิดปี 2569 เสริมอำนาจ โชคลาภ และเมตตามหานิยมแบบจัดเต็ม พร้อมแนะนำสีที่ควรหลีกเลี่ยง (สีกาลกิณี) สำหรับทุกวันเกิด',"
    ],
    [
      "metaDescription: 'กำลังหาชื่อเล่นให้ลูกหรือเปลี่ยนชื่อเล่นใหม่? แจกฟรี 131 ไอเดียชื่อเล่นมงคลยุคใหม่ (เกรด A) ที่วิเคราะห์แล้วว่าผลรวมดีตั้งแต่อักษรจนถึงตัวเลข เสริมดวงความรัก การเรียน และหน้าที่การงานได้จริง',",
      "metaDescription: 'แจกฟรี 131 ไอเดียชื่อเล่นมงคลยุคใหม่เกรด A วิเคราะห์ผลรวมดีตั้งแต่อักษรจนถึงตัวเลข เสริมดวงความรัก การเรียน และหน้าที่การงาน โหลดไปใช้ตั้งชื่อลูกได้ทันที',"
    ]
  ];

  descToFix.forEach(([target, replace]) => {
    if (content.includes(target)) {
      content = content.replace(target, replace);
      console.log('✅ Replaced Description:', target.substring(0, 30) + '...');
    } else {
      console.log('❌ NOT FOUND Description:', target.substring(0, 30) + '...');
    }
  });

  // 3. Add missing meta Title & Description to lucky-cat-names
  const catKeywords = `        keywords: [
            'ชื่อแมว', 'ตั้งชื่อแมว', 'ชื่อมงคลงแมว', 'ชื่อแมงมงคล 2569',
            'ชื่อแมวตามวันเกิด', 'ทักษาปกรณ์', 'ชื่อสัตว์เลี้ยง',
            'ชื่อแมวเศรษฐี', 'ชื่อแมวความหมายดี', 'วิธีตั้งชื่อแมว'
        ],`;

  const catMeta = `        keywords: [
            'ชื่อแมว', 'ตั้งชื่อแมว', 'ชื่อมงคลงแมว', 'ชื่อแมงมงคล 2569',
            'ชื่อแมวตามวันเกิด', 'ทักษาปกรณ์', 'ชื่อสัตว์เลี้ยง',
            'ชื่อแมวเศรษฐี', 'ชื่อแมวความหมายดี', 'วิธีตั้งชื่อแมว'
        ],
        metaTitle: 'ชื่อแมวมงคลตามวันเกิดเจ้าของ 2569: 80+ ชื่อเสริมดวง | NameMongkol',
        metaDescription: 'เปิดคัมภีร์ทักษาปกรณ์ ตั้งชื่อแมวมงคลตามวันเกิดเจ้าของ 2569 ครบทั้ง 7 วัน พร้อมอักษรมงคลและความหมายทุกชื่อ',`;

  if (content.includes(catKeywords)) {
    content = content.replace(catKeywords, catMeta);
    console.log('✅ Injected Cat Metadata!');
  } else {
    console.log('❌ NOT FOUND Cat Keywords block!');
  }

  // Write changes
  fs.writeFileSync('src/data/articles.ts', content, 'utf8');
  console.log('Successfully updated src/data/articles.ts');

} catch (e) {
  console.error('Error:', e);
}
