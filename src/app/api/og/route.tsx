import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

function limit(text: string, max = 120) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function toTitleCase(text: string) {
  if (!text) return '';
  return text
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const variant = searchParams.get('variant') || 'default';

  const title = limit(searchParams.get('title') || 'NameMongkol - วิเคราะห์ชื่อมงคล');
  const subtitle = limit(
    searchParams.get('subtitle') ||
    'วิเคราะห์ชื่อ-นามสกุล ผลรวมเลขศาสตร์ ทักษา อายตนะ 6 พร้อมคำแนะนำเสริมดวง'
  );
  const tag = limit(searchParams.get('tag') || 'namemongkol.com', 40);

  const name = limit(searchParams.get('name') || 'ชื่อของคุณ', 48);
  const surname = limit(searchParams.get('surname') || '', 48);
  const score = searchParams.get('score');
  const scoreLabel = score ? `ผลรวม ${score}` : '';

  const articleCategory = toTitleCase(limit(searchParams.get('category') || '', 40));
  const articleMeta = limit(searchParams.get('meta') || '', 80);

  const baseBackground = 'linear-gradient(135deg, #0f172a 0%, #111827 40%, #111827 70%, #0b1224 100%)';

  const pillStyle = {
    padding: '10px 18px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    color: '#cbd5e1',
    fontSize: 22,
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
  } as const;

  let content: React.ReactNode;

  if (variant === 'analysis') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ ...pillStyle, background: 'rgba(99,102,241,0.15)', color: '#c7d2fe', borderColor: 'rgba(99,102,241,0.35)' }}>
            วิเคราะห์ชื่อมงคล
          </div>
          {scoreLabel && (
            <div style={{ ...pillStyle, background: 'rgba(16,185,129,0.15)', color: '#a7f3d0', borderColor: 'rgba(16,185,129,0.35)' }}>
              {scoreLabel}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: '#f8fafc', letterSpacing: -1 }}>{name} {surname}</div>
          <div style={{ fontSize: 30, color: '#cbd5e1', maxWidth: 900 }}>{subtitle}</div>
        </div>
      </div>
    );
  } else if (variant === 'article') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {articleCategory ? (
            <div style={{ ...pillStyle, background: 'rgba(236,72,153,0.16)', color: '#fecdd3', borderColor: 'rgba(236,72,153,0.45)' }}>
              {articleCategory}
            </div>
          ) : null}
          <div style={{ ...pillStyle, background: 'rgba(59,130,246,0.16)', color: '#bfdbfe', borderColor: 'rgba(59,130,246,0.35)', fontSize: 20 }}>
            บทความ NameMongkol
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 58, fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>{title}</div>
          {articleMeta && (
            <div style={{ fontSize: 28, color: '#cbd5e1', maxWidth: 980 }}>{articleMeta}</div>
          )}
        </div>
      </div>
    );
  } else {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ ...pillStyle, background: 'rgba(99,102,241,0.14)', color: '#c7d2fe', borderColor: 'rgba(99,102,241,0.35)', width: 'fit-content' }}>
          บริการวิเคราะห์ชื่อมงคล
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 30, color: '#cbd5e1', maxWidth: 950 }}>{subtitle}</div>
      </div>
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          display: 'flex',
          position: 'relative',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          backgroundImage: baseBackground,
          overflow: 'hidden',
          color: '#f8fafc',
          fontFamily: 'Inter, "Noto Sans Thai", system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.01em',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.35), transparent 55%)',
            top: -80,
            right: -60,
            filter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 40%, rgba(16,185,129,0.35), transparent 60%)',
            bottom: -140,
            left: -40,
            filter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 28,
            padding: '64px 72px',
            position: 'relative',
            zIndex: 1,
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 28,
                boxShadow: '0 18px 40px rgba(99,102,241,0.35)',
              }}
            >
              NM
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0' }}>NameMongkol</div>
              <div style={{ fontSize: 18, color: '#cbd5e1' }}>วิเคราะห์ชื่อมงคล อันดับ 1</div>
            </div>
            {variant !== 'default' && (
              <div style={{ marginLeft: 'auto', ...pillStyle, fontSize: 20, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}>
                {variant === 'analysis' ? 'Personalized Result' : variant === 'article' ? 'Article' : 'Preview'}
              </div>
            )}
          </div>

          {content}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#cbd5e1', fontSize: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
              <span>พร้อมใช้งาน 24/7 · วิเคราะห์ฟรีบางฟีเจอร์</span>
            </div>
            <div style={{ ...pillStyle, fontSize: 20, padding: '10px 16px', background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}>
              {tag}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
