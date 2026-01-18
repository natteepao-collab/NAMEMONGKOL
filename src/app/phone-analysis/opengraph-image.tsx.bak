import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'วิเคราะห์เบอร์มงคล - NameMongkol';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    // Helper to load fonts
    const loadFont = async (url: string) => {
        const res = await fetch(url);
        return res.arrayBuffer();
    };

    // Load Fonts
    const notoSansThaiSemiBold = await loadFont('https://github.com/google/fonts/raw/main/ofl/notosansthai/NotoSansThai-SemiBold.ttf');
    const notoSansThaiBold = await loadFont('https://github.com/google/fonts/raw/main/ofl/notosansthai/NotoSansThai-Bold.ttf');

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: '#0f172a', // Slate 900
                    backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%)',
                    fontFamily: '"Noto Sans Thai"',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Top Icon */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 0 40px rgba(37, 99, 235, 0.2)',
                    marginBottom: '40px',
                    position: 'relative',
                }}>
                    {/* Glow effect */}
                    <div style={{
                        position: 'absolute',
                        top: '-1px', left: '-1px', right: '-1px', bottom: '-1px',
                        borderRadius: '20px',
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                    }} />

                    {/* Phone Icon Shape */}
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                </div>

                {/* Main Title */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '64px', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                        วิเคราะห์เบอร์มงคล
                    </span>
                    <span style={{ fontSize: '64px', fontWeight: 700, color: '#fbbf24', lineHeight: 1 }}>
                        แม่นยำที่สุด!
                    </span>
                </div>

                {/* Subtitle */}
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#e2e8f0', marginBottom: '32px' }}>
                    เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน
                </div>

                {/* Description */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontSize: '24px',
                    color: '#94a3b8',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    marginBottom: '60px'
                }}>
                    <span>เช็คเบอร์มงคลฟรี ด้วยระบบ AI อัจฉริยะ วิเคราะห์ลึกถึงคู่เลข ผลรวม และกราฟ</span>
                    <span>ชีวิต รู้ทันทีว่าเบอร์ดีหรือร้าย พร้อมวิธีแก้เคล็ดที่ NameMongkol</span>
                </div>

                {/* Mock Search Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '800px',
                    height: '100px',
                    backgroundColor: 'rgba(30, 41, 59, 0.4)', // Slate 800 with opacity
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '24px',
                    padding: '0 24px',
                    marginBottom: '40px',
                }}>
                    <span style={{ fontSize: '28px', color: '#475569', marginLeft: '20px' }}>
                        ใส่เบอร์ทั้ง 10 หลัก (เช่น 0812345678)
                    </span>

                    {/* Button */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#334155', // Slate 700
                        padding: '16px 32px',
                        borderRadius: '16px',
                        gap: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {/* Search Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>ทำนายเบอร์</span>
                    </div>
                </div>

                {/* Stats Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', opacity: 0.8 }}>
                    {/* Stat Pill 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b' }}></div>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b', opacity: 0.6 }}></div>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b', opacity: 0.3 }}></div>
                        </div>
                        <span style={{ fontSize: '20px', color: '#94a3b8' }}>วิเคราะห์แล้วกว่า 150,000+ เบอร์</span>
                    </div>

                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#475569' }} />

                    {/* Stat Pill 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#10b981" stroke="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                        <span style={{ fontSize: '20px', color: '#10b981', fontWeight: 700 }}>4.9/5</span>
                        <span style={{ fontSize: '20px', color: '#94a3b8' }}>จากผู้ใช้จริง</span>
                    </div>
                </div>

            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Noto Sans Thai',
                    data: notoSansThaiSemiBold,
                    style: 'normal',
                    weight: 600,
                },
                {
                    name: 'Noto Sans Thai',
                    data: notoSansThaiBold,
                    style: 'normal',
                    weight: 700,
                },
            ],
        }
    );
}
