export interface Review {
    id: string;
    nickname: string;
    avatar?: string;
    content: string;
    tags: string[];
    role?: string;
    date: string;
    rating: number;
    image?: string;
}

export const reviews: Review[] = [
    {
        id: '1',
        nickname: "คุณส้ม",
        role: "เจ้าของกิจการ",
        content: "พอลองเปลี่ยนเบอร์ตามที่เว็บแนะนำ ยอดขายเดือนนี้ทะลุเป้าเลยค่ะ! ไม่เชื่อก็ต้องเชื่อ",
        tags: ["การเงิน", "การงาน", "ธุรกิจ"],
        date: "2024-01-15",
        rating: 5,
        image: "/reviews/slip1.jpg" // Placeholder
    },
    {
        id: '2',
        nickname: "คุณนนท์",
        role: "พนักงานออฟฟิศ",
        content: "สอบราชการติดหลังจากเปลี่ยนชื่อได้ 2 เดือนครับ ขอบคุณ NameMongkol มากๆ ครับ",
        tags: ["การงาน", "สอบราชการ"],
        date: "2024-01-10",
        rating: 5
    },
    {
        id: '3',
        nickname: "น้องพลอย",
        role: "นักศึกษา",
        content: "ชอบความหมายชื่อที่ได้มากค่ะ เพราะและตรงกับดวงเราจริงๆ",
        tags: ["ความโชคดี", "ความรัก"],
        date: "2024-01-20",
        rating: 5
    },
    {
        id: '4',
        nickname: "คุณกานต์",
        role: "ฟรีแลนซ์",
        content: "งานเข้าไม่ขาดสายเลยครับตั้งแต่เปลี่ยนชื่อ แนะนำเพื่อนมาใช้หลายคนแล้ว",
        tags: ["การงาน", "การเงิน"],
        date: "2023-12-25",
        rating: 5
    },
    {
        id: '5',
        nickname: "คุณเมย์",
        role: "ค้าขายออนไลน์",
        content: "ชีวิตดีขึ้นมากค่ะ ปัญหาหนี้สินเริ่มคลี่คลาย รู้สึกสบายใจขึ้นเยอะเลย",
        tags: ["การเงิน", "ปลดหนี้"],
        date: "2023-12-15",
        rating: 5
    }
];
