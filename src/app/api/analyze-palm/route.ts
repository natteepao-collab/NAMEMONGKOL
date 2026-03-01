import { NextResponse } from 'next/server';

export const maxDuration = 60;

const MIN_LINE_CONFIDENCE = 0.55;
const MIN_POINT_CONFIDENCE = 0.45;

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

type NormalizedPoint = { x: number; y: number; confidence?: number };

function normalizePoint(point: unknown): NormalizedPoint | null {
  if (Array.isArray(point) && point.length >= 2) {
    const x = clamp(toNumber(point[0]), 0, 100);
    const y = clamp(toNumber(point[1]), 0, 100);
    const confidence = point.length > 2 ? clamp(toNumber(point[2], 1), 0, 1) : undefined;
    if (confidence !== undefined && confidence < MIN_POINT_CONFIDENCE) return null;
    return { x, y, ...(confidence !== undefined ? { confidence } : {}) };
  }

  if (point && typeof point === 'object') {
    const item = point as Record<string, unknown>;
    const x = clamp(toNumber(item.x), 0, 100);
    const y = clamp(toNumber(item.y), 0, 100);
    const rawConfidence = item.confidence;
    const confidence = rawConfidence === undefined ? undefined : clamp(toNumber(rawConfidence, 1), 0, 1);
    if (confidence !== undefined && confidence < MIN_POINT_CONFIDENCE) return null;
    return { x, y, ...(confidence !== undefined ? { confidence } : {}) };
  }

  return null;
}

function normalizeLines(lines: unknown): Array<{ id: string; name: string; confidence?: number; points: NormalizedPoint[] }> {
  if (!Array.isArray(lines)) return [];

  return lines
    .map((line, index) => {
      if (!line || typeof line !== 'object') return null;

      const item = line as Record<string, unknown>;
      const rawPoints = Array.isArray(item.points) ? item.points : [];
      const normalizedPoints = rawPoints
        .map(normalizePoint)
        .filter((point): point is NormalizedPoint => point !== null);

      const rawLineConfidence = item.confidence;
      const lineConfidence =
        rawLineConfidence === undefined ? undefined : clamp(toNumber(rawLineConfidence, 1), 0, 1);

      if (lineConfidence !== undefined && lineConfidence < MIN_LINE_CONFIDENCE) return null;
      if (normalizedPoints.length < 2) return null;

      const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `line_${index + 1}`;
      const name = typeof item.name === 'string' && item.name.trim() ? item.name.trim() : id;

      return {
        id,
        name,
        ...(lineConfidence !== undefined ? { confidence: lineConfidence } : {}),
        points: normalizedPoints,
      };
    })
    .filter(
      (line): line is { id: string; name: string; confidence?: number; points: NormalizedPoint[] } => line !== null
    );
}

function normalizeImageQuality(imageQuality: unknown) {
  if (!imageQuality || typeof imageQuality !== 'object') return undefined;

  const quality = imageQuality as Record<string, unknown>;
  return {
    sharpness: clamp(toNumber(quality.sharpness, 65), 0, 100),
    lighting: clamp(toNumber(quality.lighting, 65), 0, 100),
    occlusion: clamp(toNumber(quality.occlusion, 65), 0, 100),
    perspective: clamp(toNumber(quality.perspective, 65), 0, 100),
  };
}

function normalizeAnalysisResult(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null;
  const input = raw as Record<string, unknown>;

  const personalityTraits = Array.isArray(input.personality_traits)
    ? input.personality_traits
        .map((trait) => {
          if (!trait || typeof trait !== 'object') return null;
          const item = trait as Record<string, unknown>;
          const name = typeof item.name === 'string' ? item.name.trim() : '';
          if (!name) return null;
          const score = clamp(toNumber(item.score, 50), 0, 100);
          return { name, score };
        })
        .filter((trait): trait is { name: string; score: number } => trait !== null)
    : [];

  const strengths = Array.isArray(input.strengths)
    ? input.strengths
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0)
    : [];

  const weaknesses = Array.isArray(input.weaknesses)
    ? input.weaknesses
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0)
    : [];

  const spiritualGuidance =
    typeof input.spiritual_guidance === 'string' && input.spiritual_guidance.trim()
      ? input.spiritual_guidance.trim()
      : 'เสริมพลังใจด้วยการโฟกัสสิ่งที่ทำได้ดี และค่อย ๆ พัฒนาจุดที่ยังไม่มั่นใจอย่างสม่ำเสมอ';

  const lines = normalizeLines(input.lines);

  if (personalityTraits.length === 0 || strengths.length === 0 || weaknesses.length === 0) {
    return null;
  }

  return {
    personality_traits: personalityTraits,
    strengths,
    weaknesses,
    lines,
    spiritual_guidance: spiritualGuidance,
    ...(normalizeImageQuality(input.image_quality) ? { image_quality: normalizeImageQuality(input.image_quality) } : {}),
  };
}

// Detect MIME type from base64 data URI
function detectMimeType(dataUri: string): string {
  const match = dataUri.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : 'image/jpeg';
}

function getGeminiTextFromResponse(data: any): string | null {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

function cleanMarkdownJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```json')) {
    return trimmed.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  }
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return trimmed;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[analyze-palm] GEMINI_API_KEY is not set');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Detect mime type before stripping the prefix
    const mimeType = detectMimeType(imageBase64);

    // Remove data:image/...;base64, prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const systemInstruction = `คุณคือผู้เชี่ยวชาญด้านจิตวิทยาและหัตถศาสตร์
ตอบเป็นภาษาไทยสุภาพ และต้องตอบกลับเป็น JSON เท่านั้น
ให้วิเคราะห์เฉพาะสิ่งที่เห็นจากภาพจริง ห้ามแต่งเติมเกินภาพ

เงื่อนไขสำคัญสำหรับการวาดเส้นลายมือ:
- วิเคราะห์เฉพาะ 3 เส้นหลัก: life_line, head_line, heart_line
- แต่ละเส้นต้องมีจุด 40-120 จุด เพื่อให้เส้นละเอียด
- จุดแต่ละจุดใช้พิกัด 0-100 เทียบกับขนาดภาพ และควรมี confidence 0-1
- แต่ละเส้นควรมี confidence 0-1
- หากภาพไม่ชัด ให้ลด confidence ตามจริง และให้ image_quality ตามจริง

โครงสร้าง JSON:
{
  "personality_traits": [{ "name": "...", "score": 0-100 }],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "lines": [
    {
      "id": "life_line|head_line|heart_line",
      "name": "...",
      "confidence": 0.0,
      "points": [{ "x": 0, "y": 0, "confidence": 0.0 }]
    }
  ],
  "spiritual_guidance": "...",
  "image_quality": { "sharpness": 0-100, "lighting": 0-100, "occlusion": 0-100, "perspective": 0-100 }
}`;

    // Try multiple model names in order of preference
    const models = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash',
    ];

    let lastError: unknown = null;
    let isQuotaExhausted = false;

    for (const model of models) {
      try {
        console.log(`[analyze-palm] Trying model: ${model}`);

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data,
                    },
                  },
                  {
                    text: 'วิเคราะห์ลายมือนี้และคืน JSON ตามโครงสร้างที่กำหนด โดยเน้นความแม่นยำของพิกัดเส้นและระดับความเชื่อมั่น',
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 4096,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[analyze-palm] Model ${model} failed (${response.status}):`, errorText);
          lastError = errorText;

          // Detect quota / rate-limit errors
          if (response.status === 429) {
            isQuotaExhausted = true;
            // Wait before trying next model (exponential-ish backoff)
            await new Promise((r) => setTimeout(r, 3000));
          }
          continue; // Try next model
        }

        const data = await response.json();
        console.log('[analyze-palm] Raw response:', JSON.stringify(data).slice(0, 500));

        const resultText = getGeminiTextFromResponse(data);
        if (!resultText) {
          console.error('[analyze-palm] No text in response:', JSON.stringify(data));
          lastError = 'No text content in AI response';
          continue;
        }

        // Parse JSON from the response (handle markdown code blocks)
        const cleanedText = cleanMarkdownJson(resultText);

        const parsedResult = JSON.parse(cleanedText);
        const normalizedResult = normalizeAnalysisResult(parsedResult);

        // Validate the structure has required fields
        if (!normalizedResult) {
          console.error('[analyze-palm] Incomplete/invalid result structure:', Object.keys(parsedResult || {}));
          lastError = 'AI returned incomplete data';
          continue;
        }

        console.log('[analyze-palm] Successfully analyzed with model:', model);
        return NextResponse.json(normalizedResult);
      } catch (modelError) {
        console.error(`[analyze-palm] Error with model ${model}:`, modelError);
        lastError = modelError;
        continue;
      }
    }

    // All models failed
    console.error('[analyze-palm] All models failed. Last error:', lastError);

    if (isQuotaExhausted) {
      return NextResponse.json(
        {
          error: 'โควต้า API หมดชั่วคราว',
          details: 'ระบบใช้งาน Gemini API เกินโควต้าที่กำหนด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (ประมาณ 1-2 นาที)',
          code: 'QUOTA_EXHAUSTED',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'ไม่สามารถวิเคราะห์ภาพได้', details: String(lastError) },
      { status: 502 }
    );
  } catch (error) {
    console.error('[analyze-palm] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
