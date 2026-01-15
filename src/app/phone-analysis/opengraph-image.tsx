import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'วิเคราะห์เบอร์มงคล - NameMongkol';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Font fetching helper
async function loadGoogleFont(font: string, text: string) {
    const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

    if (resource) {
        const response = await fetch(resource[1]);
        if (response.status == 200) {
            return await response.arrayBuffer();
        }
    }

    throw new Error('failed to load font data');
}

export default async function Image() {
    // Determine the text we need in the image for subsetting (optional optimization, but here we might just fetch the font)
    // Actually, for Google Fonts, it's often better to fetch the font file directly if we know the URL,
    // or use a standard subset. Since we need general Thai support, we'll try to fetch a standard font file.
    // However, simplest reliable way in edge for specific Thai text is often hardcoding a font URL or using a service.
    // Let's try fetching Noto Sans Thai directly from a known CDN or Google Fonts specifically.

    // Using a reliable method for Next.js OG:
    const notoSansThaiSemiBold = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/notosansthai/NotoSansThai-SemiBold.ttf', import.meta.url)
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
                }}
            >
                {/* Background Gradient */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%)',
                }} />

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    gap: '20px',
                    width: '100%',
                }}>
                    {/* Icon */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        borderRadius: '24px',
                        background: 'rgba(30, 41, 59, 0.5)', // Slate 800 with opacity
                        border: '1px solid rgba(59, 130, 246, 0.2)', // Blue-ish border
                        boxShadow: '0 0 60px -10px rgba(59, 130, 246, 0.4)', // Blue glow
                        marginBottom: '20px'
                    }}>
                        {/* Mobile Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="None" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                        </svg>
                    </div>

                    {/* Title */}
                    <div style={{ display: 'flex', fontSize: '80px', fontWeight: 600, lineHeight: 1.1, color: 'white' }}>
                        วิเคราะห์<span style={{ color: '#fbbf24', marginLeft: '10px' }}>เบอร์มงคล</span>
                    </div>

                    {/* Subtitle */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '26px', color: '#94a3b8', marginTop: '10px', textAlign: 'center', lineHeight: 1.5, fontWeight: 400 }}>
                        <span>เจาะลึกความหมายเบอร์โทรศัพท์ของคุณ ด้วยหลักเลขศาสตร์ทศนิยม</span>
                        <span>รู้ลึกถึงนิสัย การเงิน ความรัก และโชคลาภ แม่นยำที่สุด</span>
                    </div>

                    {/* Input Mock */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '850px',
                        height: '120px',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '30px',
                        marginTop: '60px',
                        padding: '10px 15px 10px 40px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
                    }}>
                        <span style={{ fontSize: '32px', color: 'rgba(255, 255, 255, 0.3)', fontFamily: '"Noto Sans Thai"' }}>
                            ใส่เบอร์ทั้ง 10 หลัก (เช่น 0812345678)
                        </span>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#334155', // slate-700
                            color: 'white',
                            height: '90px',
                            padding: '0 40px',
                            borderRadius: '20px',
                            fontSize: '28px',
                            fontWeight: 600,
                            gap: '12px',
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            ทำนายเบอร์
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
                    data: notoSansThaiRegular,
                    style: 'normal',
                    weight: 400,
                },
            ],
        }
    );
}

