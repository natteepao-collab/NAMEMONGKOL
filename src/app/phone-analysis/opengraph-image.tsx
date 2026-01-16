import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'วิเคราะห์เบอร์มงคล - NameMongkol';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // Fonts
    const notoSansThaiSemiBold = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/notosansthai/NotoSansThai-SemiBold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    const notoSansThaiBold = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/notosansthai/NotoSansThai-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    const notoSansThaiRegular = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/notosansthai/NotoSansThai-Regular.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());


    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0f172a', // Slate 900
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Noto Sans Thai"',
                    position: 'relative',
                }}
            >
                {/* Background Gradient */}
                {/* Radial gradient simulation */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%)',
                }} />

                {/* Top Glow Orb */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    width: '600px',
                    height: '400px',
                    background: 'rgba(99, 102, 241, 0.15)', // Indigo glow
                    filter: 'blur(100px)',
                    borderRadius: '50%',
                }} />

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    width: '100%',
                }}>
                    {/* Icon */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'rgba(30, 41, 59, 0.5)', // Slate 800 with opacity
                        border: '1px solid rgba(99, 102, 241, 0.3)', // Indigo border
                        boxShadow: '0 0 50px -5px rgba(99, 102, 241, 0.3)', // Indigo glow
                        marginBottom: '30px'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                        </svg>
                    </div>

                    {/* Title */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '64px', fontWeight: 700, color: 'white' }}>
                            วิเคราะห์เบอร์มงคล<span style={{ color: '#fbbf24', marginLeft: '15px' }}>แม่นยำที่สุด!</span>
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div style={{ display: 'flex', fontSize: '42px', color: '#e2e8f0', marginTop: '10px', textAlign: 'center', fontWeight: 600 }}>
                        เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน
                    </div>

                    {/* Description */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '24px', color: '#94a3b8', marginTop: '20px', textAlign: 'center', lineHeight: 1.6, fontWeight: 400 }}>
                        <span>เช็คเบอร์มงคลฟรี ด้วยระบบ AI อัจฉริยะ วิเคราะห์ลึกถึงคู่เลข ผลรวม และกราฟ</span>
                        <span>ชีวิต รู้ทันทีว่าเบอร์ดีหรือร้าย พร้อมวิธีแก้เคล็ดที่ Namemongkol</span>
                    </div>

                    {/* Input Mock */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '800px',
                        height: '100px',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        marginTop: '50px',
                        padding: '10px 10px 10px 40px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
                    }}>
                        <span style={{ fontSize: '28px', color: 'rgba(255, 255, 255, 0.3)', fontFamily: '"Noto Sans Thai"' }}>
                            ใส่เบอร์ทั้ง 10 หลัก (เช่น 0812345678)
                        </span>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#334155', // slate-700
                            color: 'white',
                            height: '80px',
                            minWidth: '220px',
                            borderRadius: '18px',
                            fontSize: '24px',
                            fontWeight: 600,
                            gap: '12px',
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            ทำนายเบอร์
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div style={{
                        display: 'flex',
                        marginTop: '60px',
                        alignItems: 'center',
                        gap: '60px',
                        color: '#64748b',
                        fontSize: '20px',
                        fontWeight: 500
                    }}>
                        {/* Grades */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>A</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>B</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>+</div>
                        </div>

                        {/* Total Analysis */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#94a3b8' }}>วิเคราะห์แล้วกว่า 150,000+ เบอร์</span>
                        </div>

                        {/* Divider */}
                        <div style={{ width: '4px', height: '4px', background: '#475569', borderRadius: '50%' }}></div>


                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>4.9/5</span>
                            <span style={{ color: '#94a3b8' }}>จากผู้ใช้จริง</span>
                        </div>
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
                {
                    name: 'Noto Sans Thai',
                    data: notoSansThaiRegular,
                    style: 'normal',
                    weight: 400,
                },
            ],
        }
    );
}
