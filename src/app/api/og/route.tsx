import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        const surname = searchParams.get('surname');
        const totalScore = searchParams.get('score');

        const hasData = name && surname;

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0f172a',
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '90%',
                            height: '60%',
                            backgroundColor: 'rgba(30, 41, 59, 0.6)', // slate-800/60
                            borderRadius: '32px',
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            padding: '40px 60px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Decorative Gradient Line Left */}
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px', background: 'linear-gradient(to bottom, #fbbf24, #d97706)' }} />

                        {/* Blur Orb */}
                        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', filter: 'blur(40px)' }} />

                        {hasData ? (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                                    <div style={{
                                        fontSize: 18,
                                        color: '#94a3b8',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        marginBottom: 10,
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginRight: 8 }} />
                                        Analysis Result
                                    </div>
                                    <div style={{
                                        fontSize: 72,
                                        fontWeight: 'bold',
                                        lineHeight: 1.1,
                                        marginBottom: 20,
                                        color: 'white',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <span style={{ background: 'linear-gradient(to right, #fde68a, #fca5a5)', backgroundClip: 'text', color: 'transparent' }}>{name}</span>
                                        <span>{surname}</span>
                                    </div>
                                    {totalScore && (
                                        <div style={{ fontSize: 36, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{ fontSize: 24, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Total Score</span>
                                            <div style={{ padding: '8px 24px', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)', fontWeight: 'bold' }}>
                                                {totalScore}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side Stats (Analysis Only) */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 30px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <span style={{ fontSize: 48, fontWeight: 'bold', color: '#fbbf24', lineHeight: 1 }}>99%</span>
                                        <span style={{ fontSize: 16, color: '#64748b', textTransform: 'uppercase', marginTop: 5, fontWeight: 'bold' }}>Accuracy</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 30px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <span style={{ fontSize: 48, fontWeight: 'bold', color: '#fbbf24', lineHeight: 1 }}>AI</span>
                                        <span style={{ fontSize: 16, color: '#64748b', textTransform: 'uppercase', marginTop: 5, fontWeight: 'bold' }}>Speed</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                {/* Label Pill */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 20px',
                                    borderRadius: '50px',
                                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(52, 211, 153, 0.2)',
                                    marginBottom: 30
                                }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', marginRight: 10 }}></div>
                                    <span style={{ color: '#10b981', fontSize: 14, fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>AI-POWERED ANALYSIS</span>
                                </div>

                                {/* Main Title */}
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 60, fontWeight: 900, marginBottom: 15, lineHeight: 1 }}>
                                    <span style={{ color: 'white', marginRight: 0 }}>วิเคราะห์</span>
                                    <span style={{ color: '#34d399', marginRight: 15 }}>ชื่อมงคล</span>
                                    <span style={{ color: '#fbbf24' }}>พลิกชีวิต</span>
                                </div>

                                {/* Subtitle */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 22, color: '#94a3b8', marginBottom: 40, lineHeight: 1.4, fontWeight: 500 }}>
                                    <div style={{ display: 'flex' }}>เจาะลึก 4 ศาสตร์มงคล: โดย <span style={{ color: '#e2e8f0', marginLeft: '6px', fontWeight: 'bold' }}>NameMongkol</span></div>
                                    <span>ครบจบในที่เดียว แม่นยำที่สุด</span>
                                </div>

                                {/* Bottom Cards */}
                                <div style={{ display: 'flex', gap: 30 }}>
                                    {/* Card 1 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140, padding: '20px 10px', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
                                        {/* Target Icon */}
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="12" r="6" />
                                            <circle cx="12" cy="12" r="2" />
                                        </svg>
                                        <span style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 10, lineHeight: 1 }}>99%</span>
                                        <span style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>แม่นยำ</span>
                                    </div>

                                    {/* Card 2 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140, padding: '20px 10px', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
                                        {/* Lightning Icon */}
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                        </svg>
                                        <span style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 10, lineHeight: 1 }}>AI</span>
                                        <span style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>รวดเร็ว</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
