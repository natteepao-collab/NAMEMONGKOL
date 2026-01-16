
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

    // Load Fonts - Using standard Google Fonts endpoints
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
                    backgroundImage: 'linear-gradient(to bottom right, #000000, #1a0f00)',
                    backgroundColor: '#050b14',
                    fontFamily: '"Noto Sans Thai"',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Pattern/Glows */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-200px',
                        left: '-200px',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-200px',
                        right: '-200px',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />

                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    width: '120px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #fbbf24, transparent)',
                    borderRadius: '2px',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '40px',
                    width: '120px',
                    height: '4px',
                    background: 'linear-gradient(90deg, transparent, #fbbf24)',
                    borderRadius: '2px',
                }} />

                {/* Card Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                        borderRadius: '32px',
                        padding: '60px 80px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        boxShadow: '0 0 80px rgba(0,0,0,0.5)',
                        position: 'relative',
                    }}
                >
                    {/* Icon Circle */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
                        border: '2px solid rgba(245, 158, 11, 0.5)',
                        boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)',
                        marginBottom: '40px',
                        fontSize: '50px',
                    }}>
                        🔮
                    </div>

                    {/* Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '8px 20px',
                        borderRadius: '100px',
                        marginBottom: '24px',
                    }}>
                        <div style={{ width: '8px', height: '8px', background: '#fbbf24', borderRadius: '50%', boxShadow: '0 0 10px #fbbf24' }} />
                        <span style={{ fontSize: '18px', color: '#fbbf24', fontWeight: 600, letterSpacing: '1px' }}>AI ANALYSIS</span>
                    </div>

                    {/* Main Title */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0px' }}>
                        <span style={{
                            fontSize: '72px',
                            color: 'white',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            textShadow: '0 0 40px rgba(0,0,0,0.5)'
                        }}>
                            วิเคราะห์<span style={{ color: '#fbbf24', marginLeft: '16px' }}>เบอร์มงคล</span>
                        </span>
                        <span style={{
                            fontSize: '40px',
                            color: '#cbd5e1',
                            fontWeight: 600,
                            marginTop: '10px'
                        }}>
                            แม่นยำที่สุด ด้วยระบบ AI 100%
                        </span>
                    </div>
                </div>

                {/* Footer URL */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <span style={{ fontSize: '24px', color: '#94a3b8', fontWeight: 600 }}>namemongkol.com/phone-analysis</span>
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
