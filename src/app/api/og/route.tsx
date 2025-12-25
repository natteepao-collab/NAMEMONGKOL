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
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '40px 80px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 0 50px rgba(245, 158, 11, 0.1)',
                        }}
                    >
                        <div style={{ fontSize: 32, marginBottom: 20, color: '#fbbf24', fontWeight: 'bold' }}>
                            NAMEMONGKOL
                        </div>

                        {hasData ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 10, background: 'linear-gradient(to right, #fde68a, #fca5a5)', backgroundClip: 'text', color: 'transparent' }}>
                                    {name} {surname}
                                </div>
                                {totalScore && (
                                    <div style={{ fontSize: 36, color: '#cbd5e1' }}>
                                        ผลรวมมงคล: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{totalScore}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ fontSize: 48, fontWeight: 'bold', textAlign: 'center', maxWidth: 600 }}>
                                วิเคราะห์ชื่อ-นามสกุล
                                <br />
                                ดูพลังเงาตามหลักเลขศาสตร์
                            </div>
                        )}
                        <div style={{ marginTop: 30, fontSize: 24, color: '#94a3b8' }}>
                            www.namemongkol.com
                        </div>
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
