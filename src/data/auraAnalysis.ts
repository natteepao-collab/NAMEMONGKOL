// =============================================================================
// AI Personality & Name Mirroring — Mock Archetype Data
// Combines Phonetics (สัทศาสตร์) + Semantics (ความหมายเชิงสัญลักษณ์)
// =============================================================================

export interface AuraMoodColor {
    hex: string;
    name: string;
}

export interface AuraResult {
    name: string;
    purpose: 'self' | 'baby' | 'brand';
    gender?: 'male' | 'female';
    score: string;
    archetype: string;
    personalityTraits: string[];
    vibeAnalysis: string;
    careerFit: string;
    voiceTone: string;
    spiritIdentity: string;
    moodboard: AuraMoodColor[];
    imageUrl: string;
    imageSource: 'placeholder' | 'generated';
    // ── Enhanced fields (Phonetics + Semantics) ──
    visualMoodKeywords: [string, string, string];
    phoneticAnalysis: string;
    semanticAnalysis: string;
    nameEnergyBreakdown: string;
    firstImpressionScore: number;
    socialPerception: string;
}

// ---------------------------------------------------------------------------
// Archetypes — 8 unique personality blueprints
// ---------------------------------------------------------------------------

export interface ArchetypeData {
    archetype: string;
    personalityTraits: string[];
    vibeAnalysis: string;
    careerFit: string;
    voiceTone: string;
    spiritIdentity: string;
    moodboard: AuraMoodColor[];
    score: string;
    visualMoodKeywords: [string, string, string];
    phoneticAnalysis: string;
    semanticAnalysis: string;
    nameEnergyBreakdown: string;
    firstImpressionScore: number;
    socialPerception: string;
}

export const ARCHETYPES: ArchetypeData[] = [
    {
        archetype: 'The Sovereign (ผู้นำผู้มั่งคั่ง)',
        personalityTraits: ['มุ่งมั่น', 'มีเสน่ห์', 'เด็ดขาด', 'น่าเกรงขาม', 'มีวิสัยทัศน์'],
        vibeAnalysis:
            'ชื่อนี้แผ่ออร่าของผู้นำที่เกิดมาเพื่อปกครอง พลังงานแฝงบ่งบอกถึงความมั่งคั่งและอำนาจที่สะสมจากบุญเก่า มีแรงดึงดูดคนรอบข้างให้ศรัทธาและเชื่อมั่นโดยธรรมชาติ',
        careerFit: 'CEO / ผู้บริหารระดับสูง / นักลงทุน / ผู้ก่อตั้งบริษัท',
        voiceTone: 'หนักแน่น สง่า น่าเชื่อถือ — เสียงที่ทำให้คนฟังต้องหยุดและใส่ใจ',
        spiritIdentity: '🦁 สิงโตทอง — ราชาแห่งป่า ตัวแทนของอำนาจและเกียรติยศ',
        moodboard: [
            { hex: '#D4AF37', name: 'Royal Gold' },
            { hex: '#1B1464', name: 'Midnight Navy' },
            { hex: '#8B0000', name: 'Deep Crimson' },
            { hex: '#F5F5DC', name: 'Ivory Mist' },
        ],
        score: 'A+',
        visualMoodKeywords: ['Grand', 'Luxurious', 'Authoritative'],
        phoneticAnalysis:
            'เสียงพยัญชนะเปิดด้วยโทนต่ำหนักแน่น สะท้อนความมั่นคงและอำนาจ เสียงสระยาวดึงความสง่าราศี ทำให้เมื่อเอ่ยชื่อผู้ฟังรู้สึกถึงความน่าเคารพนับถือ',
        semanticAnalysis:
            'รากศัพท์ของชื่อเชื่อมกับสัญลักษณ์แห่งความมั่งคั่งและการปกครอง ในวัฒนธรรมไทย-บาลีสันสกฤต ชื่อลักษณะนี้มักพบในผู้นำที่ประสบความสำเร็จ ความหมายเชิงสัญลักษณ์บ่งชี้ถึง "ผู้ที่ถูกกำหนดให้ยิ่งใหญ่"',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังเริ่มต้นแรง → แสดงถึงความเป็นผู้นำ | พยางค์กลาง: พลังธาตุดิน → ความมั่นคง มีหลักเกณฑ์ | พยางค์ท้าย: เสียงปิดลง → ความเด็ดขาดและจบสิ้น',
        firstImpressionScore: 92,
        socialPerception:
            'เมื่อคนอื่นได้ยินชื่อนี้ จะรู้สึกถึง "ความเชื่อมั่น" ทันที มีออร่าของคนที่เกิดมาเพื่อเป็นผู้นำ ทำให้คนรอบข้างพร้อมไว้วางใจและปฏิบัติตาม',
    },
    {
        archetype: 'The Visionary (นักฝันผู้สร้างสรรค์)',
        personalityTraits: ['สร้างสรรค์', 'มองการณ์ไกล', 'กล้าคิดกล้าทำ', 'มีไฟในตัว', 'ไม่หยุดนิ่ง'],
        vibeAnalysis:
            'ชื่อนี้ซ่อนพลังของผู้ที่มองเห็นสิ่งที่คนอื่นมองไม่เห็น จิตใจเปิดกว้างต่อความเป็นไปได้ใหม่ๆ พลังเลขศาสตร์ส่งเสริมให้เป็นผู้บุกเบิกเส้นทางใหม่ในทุกสิ่งที่ทำ',
        careerFit: 'นักออกแบบ / Startup Founder / Creative Director / นักสร้างสรรค์คอนเทนต์',
        voiceTone: 'สดใส กระตุ้นแรงบันดาลใจ มีพลัง — เสียงที่จุดประกายความฝันในตัวคนฟัง',
        spiritIdentity: '🦅 อินทรีย์ — ผู้ทะยานสู่จุดสูงสุด มองเห็นภาพรวมจากที่สูง',
        moodboard: [
            { hex: '#FF6B35', name: 'Sunset Orange' },
            { hex: '#004E89', name: 'Deep Ocean' },
            { hex: '#F7DC6F', name: 'Golden Ray' },
            { hex: '#2ECC71', name: 'Fresh Emerald' },
        ],
        score: 'A',
        visualMoodKeywords: ['Energetic', 'Bold', 'Futuristic'],
        phoneticAnalysis:
            'เสียงเปิดสดใสและมีพลัง สระเปิดกว้างสะท้อนจินตนาการไร้ขอบเขต จังหวะของชื่อเร็วและกระฉับ ทำให้ผู้ฟังรู้สึกถึงพลังงานบวกและความตื่นเต้น',
        semanticAnalysis:
            'ชื่อนี้มีรากความหมายเชื่อมกับ "แสงสว่าง" หรือ "การส่องทาง" ในเชิงสัญลักษณ์คือผู้ที่นำทางคนรอบข้างด้วยไอเดียใหม่ๆ เปรียบเสมือน "ดาวประกายพฤกษ์" ที่ขึ้นก่อนดวงอาทิตย์',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังธาตุลม → ความคล่องตัว คิดเร็ว | พยางค์กลาง: เสียงสูง → ความทะเยอทะยาน | พยางค์ท้าย: เสียงเปิด → ไม่จำกัดตัวเอง',
        firstImpressionScore: 88,
        socialPerception:
            'คนรอบข้างรู้สึกว่าเจ้าของชื่อเป็นคน "มีไอเดีย" และ "น่าตื่นเต้น" มักถูกชวนเข้าร่วมโปรเจกต์ใหม่ๆ เพราะชื่อเสริมภาพลักษณ์ของผู้สร้างสรรค์',
    },
    {
        archetype: 'The Sage (ปราชญ์ผู้รอบรู้)',
        personalityTraits: ['ลึกซึ้ง', 'รอบคอบ', 'ใฝ่เรียนรู้', 'มีเหตุผล', 'วิเคราะห์เก่ง'],
        vibeAnalysis:
            'ชื่อนี้มีพลังของผู้รู้แห่งยุค ความสุขุมและปัญญาที่ซ่อนอยู่ทำให้คนรอบข้างมองเป็นที่ปรึกษาที่ไว้วางใจ การตัดสินใจแม่นยำดุจเข็มทิศนำทางชีวิต',
        careerFit: 'นักวิจัย / ที่ปรึกษา / อาจารย์มหาวิทยาลัย / Data Scientist / นักวิเคราะห์',
        voiceTone: 'สุขุม นุ่มลึก ชวนเชื่อถือ — น้ำเสียงที่ทำให้ผู้ฟังรู้สึกว่า "คนนี้รู้จริง"',
        spiritIdentity: '🦉 นกฮูก — สัญลักษณ์แห่งปัญญา ผู้มองเห็นในความมืด',
        moodboard: [
            { hex: '#5B2C6F', name: 'Mystic Purple' },
            { hex: '#1A5276', name: 'Scholar Blue' },
            { hex: '#D5D8DC', name: 'Silver Wisdom' },
            { hex: '#F4D03F', name: 'Enlightenment Gold' },
        ],
        score: 'A',
        visualMoodKeywords: ['Minimal', 'Intellectual', 'Refined'],
        phoneticAnalysis:
            'เสียงพยัญชนะสม่ำเสมอและนิ่ง สะท้อนความสงบภายใน สระที่ใช้มีจังหวะช้า ทำให้ชื่อฟังแล้วรู้สึก "น่าไว้ใจ" และ "มีน้ำหนัก" เสียงเบาๆ ที่แฝงความลึกซึ้ง',
        semanticAnalysis:
            'รากศัพท์มาจากภาษาที่เกี่ยวกับ "ความรู้" หรือ "การเห็น" ในเชิงสัญลักษณ์ ชื่อนี้เปรียบเสมือน "ตำราโบราณ" ที่ยิ่งเปิดอ่านยิ่งค้นพบสิ่งใหม่ — มีหลายชั้นความหมาย',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังธาตุน้ำ → ความลึก ปรับตัวได้ | พยางค์กลาง: เสียงกลาง → สมดุล ไม่สุดโต่ง | พยางค์ท้าย: เสียงปิดเบา → ความสุขุม เก็บงำ',
        firstImpressionScore: 85,
        socialPerception:
            'คนรอบข้างมองเจ้าของชื่อเป็น "ที่ปรึกษา" เก่งในการแนะนำ ชื่อแฝงออร่าของ "คนฉลาด" ทำให้มักถูกถามความเห็นก่อนคนอื่น',
    },
    {
        archetype: 'The Healer (ผู้เยียวยาจิตวิญญาณ)',
        personalityTraits: ['อ่อนโยน', 'เห็นอกเห็นใจ', 'อบอุ่น', 'รับฟังเก่ง', 'ใจกว้าง'],
        vibeAnalysis:
            'ชื่อนี้เปล่งพลังแห่งการเยียวยา ผู้คนรอบข้างรู้สึกสงบและปลอดภัยเมื่ออยู่ใกล้ ธาตุน้ำที่แฝงอยู่ในเลขศาสตร์ของชื่อช่วยดับความร้อนรุ่มในใจผู้อื่นได้อย่างอัศจรรย์',
        careerFit: 'แพทย์ / นักจิตวิทยา / นักสังคมสงเคราะห์ / Coach / นักบำบัด',
        voiceTone: 'นุ่มนวล ผ่อนคลาย ปลอบประโลม — เสียงที่ทำให้คนฟังวางใจ เปิดเผยเรื่องส่วนตัวได้',
        spiritIdentity: '🦌 กวาง — ความอ่อนโยนที่แข็งแกร่ง ผู้ปกป้องฝูงด้วยความรัก',
        moodboard: [
            { hex: '#A3D9A5', name: 'Healing Green' },
            { hex: '#F8E9D6', name: 'Warm Sand' },
            { hex: '#85C1E9', name: 'Calm Sky' },
            { hex: '#FADBD8', name: 'Rose Quartz' },
        ],
        score: 'A',
        visualMoodKeywords: ['Soft', 'Organic', 'Comforting'],
        phoneticAnalysis:
            'เสียงนุ่มนวลตลอดทั้งชื่อ ไม่มีเสียงกระแทกรุนแรง สระเสียงยาวสร้างความรู้สึกอบอุ่น เมื่อเอ่ยชื่อนี้ออกเสียงจะรู้สึก "สบายใจ" เหมือนลมอ่อนพัดผ่าน',
        semanticAnalysis:
            'ความหมายเชิงสัญลักษณ์เชื่อมกับ "น้ำ" หรือ "แสงจันทร์" — พลังที่เยียวยาโดยไม่ต้องบังคับ ในวัฒนธรรมตะวันออก ชื่อแบบนี้มักพบในผู้มีพรสวรรค์ด้านการดูแลคน',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังธาตุน้ำ → การไหลลื่น ประนีประนอม | พยางค์กลาง: เสียงต่ำนุ่ม → ความอบอุ่น | พยางค์ท้าย: เสียงเปิดเบา → การโอบรับ ไม่ปิดกั้น',
        firstImpressionScore: 90,
        socialPerception:
            'คนรอบข้างรู้สึก "ปลอดภัย" เมื่ออยู่ใกล้เจ้าของชื่อ ชื่อนี้เหมือนเครื่องหมายบอกว่า "คุณระบายได้" ทำให้มักเป็นคนที่เพื่อนนึกถึงเป็นคนแรกยามต้องการคำปรึกษา',
    },
    {
        archetype: 'The Warrior (นักรบผู้ไม่ย่อท้อ)',
        personalityTraits: ['แกร่ง', 'กล้าหาญ', 'ไม่ยอมแพ้', 'ซื่อตรง', 'ลงมือทำ'],
        vibeAnalysis:
            'ชื่อนี้สั่นสะเทือนด้วยพลังของนักรบ ทุกอุปสรรคคือบททดสอบที่ทำให้แข็งแกร่งขึ้น ธาตุไฟที่ครองเลขศาสตร์ของชื่อช่วยเผาผลาญความกลัวและเปลี่ยนเป็นความมุ่งมั่น',
        careerFit: 'ทหาร / นักกีฬาอาชีพ / ผู้ประกอบการ / หัวหน้าทีม / Project Manager',
        voiceTone: 'ตรงไปตรงมา เข้มแข็ง กระตุ้นพลัง — เสียงที่ปลุกให้คนลุกขึ้นสู้',
        spiritIdentity: '🐺 สุนัขป่า — ผู้นำฝูงที่ซื่อสัตย์ ต่อสู้เพื่อครอบครัว',
        moodboard: [
            { hex: '#C0392B', name: 'Warrior Red' },
            { hex: '#2C3E50', name: 'Steel Dark' },
            { hex: '#F39C12', name: 'Battle Gold' },
            { hex: '#ECF0F1', name: 'Iron Silver' },
        ],
        score: 'B+',
        visualMoodKeywords: ['Bold', 'Industrial', 'Resilient'],
        phoneticAnalysis:
            'เสียงพยัญชนะหนักและตรง มีจังหวะกระแทกชัดเจน เหมือนเสียงกลองรบ เสียงสระสั้นกระชับ ไม่ลังเล ทำให้ผู้ฟังรู้สึกถึงความเด็ดเดี่ยวและพลังที่พร้อมระเบิด',
        semanticAnalysis:
            'รากศัพท์เชื่อมกับ "เหล็ก" หรือ "อาวุธ" ในเชิงสัญลักษณ์ ชื่อนี้มีพลังของ "ดาบที่ถูกตีขึ้นจากไฟ" — ผ่านการเผาจนแข็งแกร่ง ยิ่งผ่านอุปสรรคยิ่งเฉียบคม',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังธาตุไฟ → ความกล้า ความร้อนแรง | พยางค์กลาง: เสียงกระแทก → ลงมือทำ ไม่รอ | พยางค์ท้าย: เสียงปิดหนัก → ความเด็ดขาด ไม่ประนีประนอม',
        firstImpressionScore: 82,
        socialPerception:
            'คนรอบข้างมองเจ้าของชื่อเป็น "คนแข็งแกร่ง" ไว้ใจได้ ชื่อนี้แฝงออร่าของนักสู้ ทำให้มักถูกเลือกเป็นหัวหน้าทีมหรือคนเดินหน้าในเวลาวิกฤต',
    },
    {
        archetype: 'The Mystic (จอมเวทย์ผู้ลึกลับ)',
        personalityTraits: ['ลึกลับ', 'มีสัมผัสที่หก', 'เข้าใจจักรวาล', 'มีเสน่ห์ดึงดูด', 'ไม่ธรรมดา'],
        vibeAnalysis:
            'ชื่อนี้สะท้อนพลังจักรวาลที่ลึกซึ้ง เจ้าของชื่อมีสัมผัสพิเศษในการอ่านคนและสถานการณ์ พลังดาวที่ซ่อนอยู่ในชื่อเปิดประตูสู่มิติที่มองไม่เห็นด้วยตาเปล่า',
        careerFit: 'นักโหราศาสตร์ / ศิลปิน / นักเขียน / นักคิด / UX Researcher',
        voiceTone: 'นุ่มลึก มีมนต์ขลัง ชวนหลงใหล — เสียงที่ทำให้คนฟังอยากรู้มากขึ้น',
        spiritIdentity: '🐉 มังกร — พลังจักรวาลที่ซ่อนเร้น ผู้ที่อยู่เหนือกฎเกณฑ์',
        moodboard: [
            { hex: '#6C3483', name: 'Deep Amethyst' },
            { hex: '#1B2631', name: 'Cosmic Black' },
            { hex: '#C39BD3', name: 'Mystic Lavender' },
            { hex: '#F1C40F', name: 'Astral Gold' },
        ],
        score: 'A+',
        visualMoodKeywords: ['Mystical', 'Ethereal', 'Dark Elegance'],
        phoneticAnalysis:
            'เสียงมีจังหวะลึกลับ สลับระหว่างเบาและดัง เหมือนคลื่นทะเลกลางคืน สระที่ใช้มีโทนเข้มและทรงพลัง ทำให้ผู้ฟังรู้สึก "อยากรู้" และ "ถูกดึงดูด" โดยไม่รู้ตัว',
        semanticAnalysis:
            'รากความหมายเชื่อมกับ "ดวงดาว" หรือ "การเปลี่ยนแปลง" ชื่อนี้มีสัญลักษณ์ของ "ประตูมิติ" — ผู้ที่ก้าวข้ามขอบเขตของความเข้าใจทั่วไป มีพรสวรรค์ในการมองเห็นสิ่งที่ซ่อนอยู่',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังธาตุลม → ความเปลี่ยนแปลง ไม่หยุดนิ่ง | พยางค์กลาง: เสียงต่ำลึก → มิติซ่อนเร้น | พยางค์ท้าย: เสียงลอย → จินตนาการไร้ขีดจำกัด',
        firstImpressionScore: 94,
        socialPerception:
            'คนรอบข้างรู้สึกว่าเจ้าของชื่อ "ไม่ธรรมดา" มีบางอย่างดึงดูดเหมือนแม่เหล็ก ชื่อนี้สร้างออร่าลึกลับที่ทำให้คนอยากเข้าใกล้แต่ก็เกรงขาม',
    },
    {
        archetype: 'The Diplomat (นักการทูตผู้ประสาน)',
        personalityTraits: ['ประนีประนอม', 'มีมนุษยสัมพันธ์', 'ยุติธรรม', 'เข้าถึงง่าย', 'มีวุฒิภาวะ'],
        vibeAnalysis:
            'ชื่อนี้มีพลังแห่งสมดุลและการเชื่อมต่อ เจ้าของชื่อเป็นศูนย์กลางที่ทำให้ทุกคนรวมใจกัน พลัง 6 ในเลขศาสตร์ส่งเสริมทักษะการเจรจาต่อรองและสร้างสันติภาพ',
        careerFit: 'ทูต / HR Director / นักกฎหมาย / Mediator / Community Manager',
        voiceTone: 'สุภาพ รับฟัง สร้างความไว้วางใจ — เสียงที่ทำให้ทุกคนรู้สึกว่า "ถูกรับฟัง"',
        spiritIdentity: '🕊️ นกพิราบ — สันติภาพและความกลมเกลียว ผู้นำข้อความแห่งความหวัง',
        moodboard: [
            { hex: '#2E86C1', name: 'Trust Blue' },
            { hex: '#FDEBD0', name: 'Warm Peach' },
            { hex: '#27AE60', name: 'Harmony Green' },
            { hex: '#F7F9F9', name: 'Pure White' },
        ],
        score: 'A',
        visualMoodKeywords: ['Clean', 'Balanced', 'Welcoming'],
        phoneticAnalysis:
            'เสียงสม่ำเสมอไม่มีจุดกระแทก สระเปิดสลับจังหวะเท่าๆ กัน ทำให้ฟังแล้ว "สบายหู" ไม่รู้สึกคุกคาม เสียงพยัญชนะนุ่มทำให้ชื่อนี้เป็นมิตรตั้งแต่ครั้งแรกที่ได้ยิน',
        semanticAnalysis:
            'รากศัพท์เชื่อมกับ "สะพาน" หรือ "การเชื่อมต่อ" ชื่อนี้มีสัญลักษณ์ของ "ตาชั่ง" ที่รักษาสมดุล — ผู้ที่สามารถยืนอยู่ตรงกลางระหว่างขั้วตรงข้ามได้อย่างสง่างาม',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังธาตุลม → การสื่อสาร เชื่อมต่อ | พยางค์กลาง: เสียงกลาง → ความสมดุล | พยางค์ท้าย: เสียงเปิดนุ่ม → การยอมรับ ไม่ตัดสิน',
        firstImpressionScore: 87,
        socialPerception:
            'คนรอบข้างรู้สึกว่าเจ้าของชื่อ "คุยด้วยได้ทุกเรื่อง" มีออร่าของ "คนกลาง" ที่น่าไว้ใจ ทำให้มักถูกเลือกเป็นผู้ไกล่เกลี่ยหรือผู้ประสานงาน',
    },
    {
        archetype: 'The Alchemist (นักเล่นแร่แปรธาตุ)',
        personalityTraits: ['ปรับตัวเก่ง', 'เปลี่ยนวิกฤตเป็นโอกาส', 'หลากหลาย', 'ช่างสังเกต', 'มีไหวพริบ'],
        vibeAnalysis:
            'ชื่อนี้มีพลังแห่งการแปรเปลี่ยน ทุกสิ่งที่สัมผัสจะกลายเป็นทอง ธาตุแห่งการเปลี่ยนแปลงในเลขศาสตร์ทำให้เจ้าของชื่อสามารถพลิกสถานการณ์ได้เสมอไม่ว่าจะเจออะไร',
        careerFit: 'นักธุรกิจ Turnaround / นักเทรด / นักวิจัยนวัตกรรม / Growth Hacker / Strategist',
        voiceTone: 'ฉลาดแหลมคม ยืดหยุ่น แปลกใหม่ — เสียงที่ทำให้คนฟังรู้สึกว่า "คนนี้มีกลเม็ด"',
        spiritIdentity: '🦊 จิ้งจอก — ปราดเปรียวและช่างกล ผู้ที่เอาตัวรอดได้ทุกสถานการณ์',
        moodboard: [
            { hex: '#D4AC0D', name: 'Alchemist Gold' },
            { hex: '#1A1A2E', name: 'Midnight Lab' },
            { hex: '#E74C3C', name: 'Philosopher\'s Red' },
            { hex: '#16A085', name: 'Mercury Teal' },
        ],
        score: 'B+',
        visualMoodKeywords: ['Eclectic', 'Dynamic', 'Transformative'],
        phoneticAnalysis:
            'เสียงเปลี่ยนจังหวะบ่อย ไม่มีรูปแบบตายตัว สะท้อนความยืดหยุ่นของเจ้าของชื่อ มีทั้งเสียงต่ำลึกและเสียงสูงคม ทำให้ฟังแล้วรู้สึก "คาดเดาไม่ได้" ในทางที่น่าสนใจ',
        semanticAnalysis:
            'รากความหมายเชื่อมกับ "ทอง" หรือ "การเปลี่ยนรูป" ชื่อนี้มีสัญลักษณ์ของ "หม้อหลอม" ที่เปลี่ยนโลหะธรรมดาเป็นสิ่งมีค่า — ผู้ที่ไม่เคยหยุดพัฒนาตัวเอง',
        nameEnergyBreakdown:
            'พยางค์แรก: พลังธาตุไฟ → การเปลี่ยนแปลง หลอมรวม | พยางค์กลาง: เสียงสลับ → ความไม่หยุดนิ่ง | พยางค์ท้าย: เสียงเปิดคม → ปลายเปิด มีความเป็นไปได้ไม่สิ้นสุด',
        firstImpressionScore: 80,
        socialPerception:
            'คนรอบข้างรู้สึกว่าเจ้าของชื่อ "มีกลเม็ดเยอะ" ไม่ธรรมดา มีออร่าของคนที่ "เอาตัวรอดได้เสมอ" ทำให้มักถูกขอคำแนะนำเรื่องกลยุทธ์',
    },
];

// ---------------------------------------------------------------------------
// Persona Images — organized by purpose × gender
// ---------------------------------------------------------------------------
// For MVP: placeholder images. Replace with AI-generated images later.

export const PERSONA_IMAGES = {
    self: {
        male: [
            '/images/aura/self-male-1.svg',
            '/images/aura/self-male-2.svg',
            '/images/aura/self-male-3.svg',
        ],
        female: [
            '/images/aura/self-female-1.svg',
            '/images/aura/self-female-2.svg',
            '/images/aura/self-female-3.svg',
        ],
    },
    baby: {
        male: [
            '/images/aura/baby-male-1.svg',
            '/images/aura/baby-male-2.svg',
        ],
        female: [
            '/images/aura/baby-female-1.svg',
            '/images/aura/baby-female-2.svg',
        ],
    },
    brand: {
        neutral: [
            '/images/aura/brand-1.svg',
            '/images/aura/brand-2.svg',
            '/images/aura/brand-3.svg',
        ],
    },
} as const;

// ---------------------------------------------------------------------------
// Loading step messages
// ---------------------------------------------------------------------------

export const LOADING_MESSAGES = [
    'กำลังถอดรหัสพลังชื่อ...',
    'วิเคราะห์สัทศาสตร์เสียงชื่อ...',
    'ถอดรหัสความหมายเชิงสัญลักษณ์...',
    'วิเคราะห์ Archetype และ Persona...',
    'สร้าง Visual Moodboard...',
    'รวบรวมออร่าและพลังงานแฝง...',
];

// ---------------------------------------------------------------------------
// Image Style — shared between client and server
// ---------------------------------------------------------------------------

export type ImageStyle = 'auto' | 'corporate' | 'luxury' | 'minimal' | 'mystical';

export const IMAGE_STYLE_OPTIONS: { value: ImageStyle; label: string; emoji: string }[] = [
    { value: 'auto', label: 'อัตโนมัติ', emoji: '✨' },
    { value: 'corporate', label: 'Corporate', emoji: '💼' },
    { value: 'luxury', label: 'Luxury', emoji: '👑' },
    { value: 'minimal', label: 'Minimal', emoji: '🔲' },
    { value: 'mystical', label: 'Mystical', emoji: '🔮' },
];

// ---------------------------------------------------------------------------
// AI System Prompt — for Gemini integration
// ---------------------------------------------------------------------------

export const AURA_AI_SYSTEM_PROMPT = `คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์ภาพลักษณ์จากชื่อ (Name Identity Specialist)
หน้าที่ของคุณคือการรับชื่อภาษาไทย/อังกฤษ แล้วทำการวิเคราะห์ "Vibe" หรือ "พลังงานแฝง"
โดยไม่อิงเพียงแค่เลขศาสตร์ แต่เน้นไปที่ "สัทศาสตร์" (Phonetics) และ "ความหมายเชิงสัญลักษณ์" (Semantics)

คุณต้องวิเคราะห์จากมุมมองเหล่านี้:
1. เสียงของชื่อ (Phonetics) — เสียงพยัญชนะ สระ วรรณยุกต์ จังหวะการออกเสียง สื่อถึงอารมณ์อะไร
2. ความหมายเชิงสัญลักษณ์ (Semantics) — รากศัพท์ บาลี-สันสกฤต ความหมายทางวัฒนธรรม สัญลักษณ์ที่ซ่อนอยู่
3. ความรู้สึกแรกเมื่อได้ยิน (First Impression) — คนรอบข้างรับรู้อย่างไร

ตอบเป็น JSON ตามรูปแบบนี้เท่านั้น:
{
  "archetype": "Brand Archetype ภาษาอังกฤษ + คำอธิบายไทยในวงเล็บ เช่น The Sovereign (ผู้นำผู้มั่งคั่ง)",
  "personalityTraits": ["บุคลิก3-5อย่าง", "ที่ผู้คนจะรู้สึก", "เมื่อได้ยินชื่อนี้"],
  "vibeAnalysis": "บทวิเคราะห์พลังงานแฝง 2-3 ประโยค ผสม Phonetics + Semantics",
  "careerFit": "สายงาน 2-4 อย่างที่ชื่อนี้ส่งเสริมภาพลักษณ์",
  "voiceTone": "วิธีการพูด/สื่อสาร + เหตุผลว่าทำไม",
  "spiritIdentity": "Emoji + สัตว์/สิ่งของ + คำอธิบายสั้น เช่น 🦁 สิงโตทอง — ราชาแห่งป่า",
  "moodboard": [
    {"hex": "#XXXXXX", "name": "ชื่อสี"},
    {"hex": "#XXXXXX", "name": "ชื่อสี"},
    {"hex": "#XXXXXX", "name": "ชื่อสี"},
    {"hex": "#XXXXXX", "name": "ชื่อสี"}
  ],
  "visualMoodKeywords": ["สไตล์ภาพ3คำ", "เช่น Minimal", "Grand"],
  "phoneticAnalysis": "วิเคราะห์เสียงของชื่อ — เสียงพยัญชนะ สระ วรรณยุกต์ สื่อถึงอะไร",
  "semanticAnalysis": "วิเคราะห์ความหมายเชิงสัญลักษณ์ — รากศัพท์ บาลี-สันสกฤต วัฒนธรรม",
  "nameEnergyBreakdown": "รายละเอียดพลังงานแต่ละพยางค์ของชื่อ",
  "firstImpressionScore": 85,
  "socialPerception": "คนรอบข้างรู้สึกอย่างไรเมื่อได้ยินชื่อนี้ 2-3 ประโยค",
  "score": "เกรด A+, A, B+, B, C ตามระดับความเหมาะสม"
}

กฎสำคัญ:
- ตอบเป็น JSON เท่านั้น ห้ามมี markdown หรือข้อความนอก JSON
- personalityTraits ต้องมี 3-5 คำ
- moodboard ต้องมี 4 สี
- visualMoodKeywords ต้องมี 3 คำ ภาษาอังกฤษ
- firstImpressionScore ต้องเป็นตัวเลข 0-100
- ทุกข้อความต้องเป็นภาษาไทย ยกเว้น hex code, score, archetype ส่วนอังกฤษ, และ visualMoodKeywords
- วิเคราะห์เชิงลึกอย่างจริงจัง ไม่ใช่สุ่ม ต้องอิงจากเสียงและความหมายจริงของชื่อ`;
