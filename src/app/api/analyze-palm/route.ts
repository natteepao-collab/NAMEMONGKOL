import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  DEFAULT_PALM_SYSTEM_PROMPT,
  GEMINI_API_KEY_SECRET_KEY,
  DEFAULT_PALM_USER_PROMPT,
  PALM_PROMPT_VERSION_KEY,
  PALM_SYSTEM_PROMPT_KEY,
  PALM_USER_PROMPT_KEY,
} from '@/lib/palmPromptDefaults';

export const maxDuration = 60;

const MIN_LINE_CONFIDENCE = 0.55;
const MIN_POINT_CONFIDENCE = 0.45;
const MAX_RETRIES = 3;

// ────── Utility helpers ──────

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

// ────── Point & Line normalisation ──────

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
    ...(quality.overall_score !== undefined ? { overall_score: clamp(toNumber(quality.overall_score, 65), 0, 100) } : {}),
    ...(quality.occlusion !== undefined ? { occlusion: clamp(toNumber(quality.occlusion, 65), 0, 100) } : {}),
    ...(quality.perspective !== undefined ? { perspective: clamp(toNumber(quality.perspective, 65), 0, 100) } : {}),
  };
}

function normalizeLineAnalysis(raw: unknown, defaultTitle = ''): { title: string; description: string; prediction?: string; highlights: string[] } | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const title = typeof item.title === 'string' && item.title.trim() ? item.title.trim() : defaultTitle;
  // Accept description OR prediction — at least one must have content
  const description = typeof item.description === 'string' && item.description.trim() ? item.description.trim() : '';
  const prediction = typeof item.prediction === 'string' && item.prediction.trim() ? item.prediction.trim() : undefined;
  const highlights = Array.isArray(item.highlights)
    ? item.highlights.map((h) => (typeof h === 'string' ? h.trim() : '')).filter((h) => h.length > 0)
    : [];
  // At least description or prediction must exist
  if (!description && !prediction) return null;
  // If description is empty but prediction exists, use prediction as description
  const finalDescription = description || prediction || '';
  return { title: title || defaultTitle, description: finalDescription, ...(prediction && prediction !== finalDescription ? { prediction } : {}), highlights };
}

function normalizePredictionsByTopic(raw: unknown) {
  if (!raw || typeof raw !== 'object') return undefined;
  const input = raw as Record<string, unknown>;
  const topics = ['work', 'money', 'love', 'family', 'health', 'luck'] as const;
  const result: Record<string, string> = {};
  let hasAny = false;
  for (const topic of topics) {
    const value = typeof input[topic] === 'string' && input[topic].trim() ? input[topic].trim() : '';
    result[topic] = value;
    if (value) hasAny = true;
  }
  return hasAny ? (result as { work: string; money: string; love: string; family: string; health: string; luck: string }) : undefined;
}

function normalizeAnalysisResult(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null;
  let input = raw as Record<string, unknown>;

  // Unwrap ta_thong_reading wrapper if Gemini nests data under it
  if (input.ta_thong_reading && typeof input.ta_thong_reading === 'object') {
    const wrapper = input.ta_thong_reading as Record<string, unknown>;
    // Smart merge: for each wrapper key, use it only if root doesn't have a meaningful value
    for (const [key, wrapperValue] of Object.entries(wrapper)) {
      const rootValue = input[key];
      const rootIsEmpty = rootValue === undefined || rootValue === null || rootValue === '' ||
        (typeof rootValue === 'object' && rootValue !== null && Object.keys(rootValue).length === 0);
      if (rootIsEmpty && wrapperValue !== undefined && wrapperValue !== null) {
        input[key] = wrapperValue;
      }
    }
  }

  // Scores (love / career / health)
  const rawScores = (input.scores && typeof input.scores === 'object' ? input.scores : {}) as Record<string, unknown>;
  const scores = {
    love: clamp(toNumber(rawScores.love, 50), 0, 100),
    career: clamp(toNumber(rawScores.career, 50), 0, 100),
    health: clamp(toNumber(rawScores.health, 50), 0, 100),
    destiny: clamp(toNumber(rawScores.destiny, 50), 0, 100),
  };

  // Line analysis
  const rawLineAnalysis = (input.line_analysis && typeof input.line_analysis === 'object' ? input.line_analysis : {}) as Record<string, unknown>;
  console.log('[analyze-palm] line_analysis keys:', Object.keys(rawLineAnalysis), 'sample life_line:', JSON.stringify(rawLineAnalysis.life_line)?.slice(0, 300));
  const lifeLine = normalizeLineAnalysis(rawLineAnalysis.life_line, 'เส้นชีวิต') ?? { title: 'เส้นชีวิต', description: 'ไม่สามารถวิเคราะห์ได้จากภาพ', highlights: [] };
  const headLine = normalizeLineAnalysis(rawLineAnalysis.head_line, 'เส้นสมอง') ?? { title: 'เส้นสมอง', description: 'ไม่สามารถวิเคราะห์ได้จากภาพ', highlights: [] };
  const heartLine = normalizeLineAnalysis(rawLineAnalysis.heart_line, 'เส้นหัวใจ') ?? { title: 'เส้นหัวใจ', description: 'ไม่สามารถวิเคราะห์ได้จากภาพ', highlights: [] };
  const fateLine = normalizeLineAnalysis(rawLineAnalysis.fate_line, 'เส้นวาสนา') ?? { title: 'เส้นวาสนา', description: 'ไม่พบเส้นวาสนาชัดเจนจากภาพ', highlights: [] };

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
    ? input.strengths.map((item) => (typeof item === 'string' ? item.trim() : '')).filter((item) => item.length > 0)
    : [];

  const areasForGrowth = Array.isArray(input.areas_for_growth)
    ? input.areas_for_growth.map((item) => (typeof item === 'string' ? item.trim() : '')).filter((item) => item.length > 0)
    : [];

  const summary =
    typeof input.summary === 'string' && input.summary.trim()
      ? input.summary.trim()
      : 'ไม่สามารถสรุปผลได้จากภาพที่ให้มา กรุณาลองถ่ายภาพใหม่ในที่แสงสว่าง';

  const spiritualGuidance =
    typeof input.spiritual_guidance === 'string' && input.spiritual_guidance.trim()
      ? input.spiritual_guidance.trim()
      : 'เสริมพลังใจด้วยการโฟกัสสิ่งที่ทำได้ดี และค่อย ๆ พัฒนาจุดที่ยังไม่มั่นใจอย่างสม่ำเสมอ';

  const lines = normalizeLines(input.lines || input.technical_lines);

  // New "ตาทอง" fields
  const predictionsByTopic = normalizePredictionsByTopic(input.predictions_by_topic);

  const monthlyForecast =
    typeof input.monthly_forecast === 'string' && input.monthly_forecast.trim()
      ? input.monthly_forecast.trim()
      : typeof input.monthly_forecast_feb_2026 === 'string' && input.monthly_forecast_feb_2026.trim()
        ? input.monthly_forecast_feb_2026.trim()
        : undefined;

  const warnings =
    typeof input.warnings === 'string' && input.warnings.trim()
      ? input.warnings.trim()
      : undefined;

  const taBlessing =
    typeof input.ta_blessing === 'string' && input.ta_blessing.trim()
      ? input.ta_blessing.trim()
      : undefined;

  if (personalityTraits.length === 0 && strengths.length === 0 && !predictionsByTopic) {
    return null;
  }

  return {
    scores,
    line_analysis: {
      life_line: lifeLine,
      head_line: headLine,
      heart_line: heartLine,
      fate_line: fateLine,
    },
    personality_traits: personalityTraits,
    strengths,
    areas_for_growth: areasForGrowth,
    summary,
    spiritual_guidance: spiritualGuidance,
    lines,
    ...(normalizeImageQuality(input.image_quality) ? { image_quality: normalizeImageQuality(input.image_quality) } : {}),
    ...(predictionsByTopic ? { predictions_by_topic: predictionsByTopic } : {}),
    ...(monthlyForecast ? { monthly_forecast: monthlyForecast } : {}),
    ...(warnings ? { warnings } : {}),
    ...(taBlessing ? { ta_blessing: taBlessing } : {}),
  };
}

// Detect MIME type from base64 data URI
function detectMimeType(dataUri: string): string {
  const match = dataUri.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : 'image/jpeg';
}

function getGeminiTextFromResponse(data: any): string | null {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  const text = parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();

  return text || null;
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

function extractBalancedJsonObject(text: string): string | null {
  const input = text.trim();
  const start = input.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < input.length; i++) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth++;
      continue;
    }

    if (char === '}') {
      depth--;
      if (depth === 0) {
        return input.slice(start, i + 1);
      }
    }
  }

  return null;
}

function parseGeminiJsonSafely(text: string): unknown | null {
  const cleaned = cleanMarkdownJson(text);
  const candidates = [
    cleaned,
    text.trim(),
    extractBalancedJsonObject(cleaned),
    extractBalancedJsonObject(text),
  ].filter((value, index, arr): value is string => typeof value === 'string' && value.length > 0 && arr.indexOf(value) === index);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }

  return null;
}

function parseRetryAfterToMs(retryAfterHeader: string | null): number | null {
  if (!retryAfterHeader) return null;

  const numeric = Number(retryAfterHeader);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return numeric * 1000;
  }

  const parsedDate = Date.parse(retryAfterHeader);
  if (!Number.isNaN(parsedDate)) {
    const delay = parsedDate - Date.now();
    return delay > 0 ? delay : 0;
  }

  return null;
}

type PromptConfig = {
  systemPrompt: string;
  userPrompt: string;
  version: string;
};

function validatePromptContent(value: unknown, minimumLength: number) {
  if (typeof value !== 'string') return false;
  return value.trim().length >= minimumLength;
}

async function getPalmPromptConfig(): Promise<PromptConfig> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      systemPrompt: DEFAULT_PALM_SYSTEM_PROMPT,
      userPrompt: DEFAULT_PALM_USER_PROMPT,
      version: 'default',
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const keys = [PALM_SYSTEM_PROMPT_KEY, PALM_USER_PROMPT_KEY, PALM_PROMPT_VERSION_KEY];
    const { data, error } = await supabase.from('app_settings').select('key, value').in('key', keys);
    if (error) throw error;

    const settingsMap = (data || []).reduce((acc, item) => {
      acc[item.key] = item.value || '';
      return acc;
    }, {} as Record<string, string>);

    const systemPrompt = validatePromptContent(settingsMap[PALM_SYSTEM_PROMPT_KEY], 200)
      ? settingsMap[PALM_SYSTEM_PROMPT_KEY].trim()
      : DEFAULT_PALM_SYSTEM_PROMPT;

    const userPrompt = validatePromptContent(settingsMap[PALM_USER_PROMPT_KEY], 20)
      ? settingsMap[PALM_USER_PROMPT_KEY].trim()
      : DEFAULT_PALM_USER_PROMPT;

    const version =
      typeof settingsMap[PALM_PROMPT_VERSION_KEY] === 'string' && settingsMap[PALM_PROMPT_VERSION_KEY].trim()
        ? settingsMap[PALM_PROMPT_VERSION_KEY].trim()
        : 'default';

    return { systemPrompt, userPrompt, version };
  } catch (error) {
    console.error('[analyze-palm] Failed to load prompt settings, fallback to defaults:', error);
    return {
      systemPrompt: DEFAULT_PALM_SYSTEM_PROMPT,
      userPrompt: DEFAULT_PALM_USER_PROMPT,
      version: 'default',
    };
  }
}

async function getGeminiApiKeyFromSecrets(): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data, error } = await supabase
      .from('app_secrets')
      .select('value')
      .eq('key', GEMINI_API_KEY_SECRET_KEY)
      .maybeSingle();

    if (error) throw error;

    if (typeof data?.value === 'string' && data.value.trim()) {
      return data.value.trim();
    }
  } catch (error) {
    const code = typeof (error as any)?.code === 'string' ? (error as any).code : '';
    const message = typeof (error as any)?.message === 'string' ? (error as any).message.toLowerCase() : '';
    const details = typeof (error as any)?.details === 'string' ? (error as any).details.toLowerCase() : '';
    const isMissingTable = code === 'PGRST205' || message.includes('app_secrets') || details.includes('app_secrets');

    if (!isMissingTable) {
      console.error('[analyze-palm] Failed to load gemini_api_key from app_secrets:', error);
    }
  }

  return null;
}

// ────── Simple in-memory cache to avoid re-processing identical images ──────

interface CacheEntry {
  result: ReturnType<typeof normalizeAnalysisResult>;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_SIZE = 20;

function getCacheKey(base64Data: string, promptVersion: string): string {
  // Use first 200 + last 200 chars as a fingerprint (avoids hashing megabytes)
  const head = base64Data.slice(0, 200);
  const tail = base64Data.slice(-200);
  return promptVersion + '::' + head + '::' + base64Data.length + '::' + tail;
}

function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of responseCache) {
    if (now - entry.timestamp > CACHE_TTL) {
      responseCache.delete(key);
    }
  }
  // Evict oldest if still too large
  while (responseCache.size > CACHE_MAX_SIZE) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey !== undefined) responseCache.delete(firstKey);
    else break;
  }
}

// ────── Server-side rate limiter — prevent excessive calls ──────

const lastRequestTimeByIp = new Map<string, number>();
const MIN_REQUEST_INTERVAL = 12500; // 12.5 seconds between requests (Free tier: 5 RPM)

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (!forwarded) return 'local';
  return forwarded.split(',')[0]?.trim() || 'local';
}

// ────── POST handler ──────

export async function POST(req: Request) {
  try {
    // Server-side rate limiter
    const clientIp = getClientIp(req);
    const now = Date.now();
    const lastRequestTime = lastRequestTimeByIp.get(clientIp) ?? 0;
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      const retryAfterSeconds = Math.max(1, Math.ceil((MIN_REQUEST_INTERVAL - (now - lastRequestTime)) / 1000));
      return NextResponse.json(
        {
          error: 'กรุณารอสักครู่',
          details: 'กรุณารออย่างน้อย 12 วินาที ก่อนลองอีกครั้ง',
          code: 'RATE_LIMITED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }
    lastRequestTimeByIp.set(clientIp, now);

    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = (await getGeminiApiKeyFromSecrets()) || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[analyze-palm] GEMINI_API_KEY is not set');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const mimeType = detectMimeType(imageBase64);
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const promptConfig = await getPalmPromptConfig();

    // Check cache first
    pruneCache();
    const cacheKey = getCacheKey(base64Data, promptConfig.version);
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[analyze-palm] Returning cached result');
      return NextResponse.json(cached.result);
    }

    // Model fallback order — Gemini 2.5 Flash primary (per project spec)
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];

    let lastError: unknown = null;
    const failedModels = new Set<string>();
    let last429RetryAfterSeconds: number | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      // Pick model: skip models that returned non-429 errors
      let model = models[attempt % models.length];
      if (failedModels.has(model)) {
        const available = models.filter((m) => !failedModels.has(m));
        if (available.length === 0) break; // all models failed
        model = available[attempt % available.length];
      }

      try {
        console.log('[analyze-palm] Attempt ' + (attempt + 1) + '/' + MAX_RETRIES + ' model: ' + model);

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: promptConfig.systemPrompt }],
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
                  { text: promptConfig.userPrompt },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 16384,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[analyze-palm] Model ' + model + ' failed (' + response.status + '):', errorText);
          lastError = errorText;

          if (response.status === 429) {
            const retryAfterMs = parseRetryAfterToMs(response.headers.get('retry-after'));
            last429RetryAfterSeconds = Math.max(1, Math.ceil((retryAfterMs ?? 30000) / 1000));
            // Mark model as rate-limited, try fallback model instead of returning immediately
            failedModels.add(model);
            console.log('[analyze-palm] Model ' + model + ' rate-limited (429), trying fallback');
          } else if (response.status === 404) {
            // Model not found — skip it permanently
            failedModels.add(model);
            console.log('[analyze-palm] Model ' + model + ' not found, skipping');
          }
          continue;
        }

        const data = await response.json();
        const finishReason = data?.candidates?.[0]?.finishReason;
        console.log('[analyze-palm] Raw response (finishReason=' + finishReason + '):', JSON.stringify(data).slice(0, 500));

        if (finishReason === 'MAX_TOKENS') {
          console.warn('[analyze-palm] Output truncated (MAX_TOKENS) — retrying with next model');
          lastError = 'AI response was truncated';
          continue;
        }

        const resultText = getGeminiTextFromResponse(data);
        if (!resultText) {
          console.error('[analyze-palm] No text in response:', JSON.stringify(data));
          lastError = 'No text content in AI response';
          continue;
        }

        const parsedResult = parseGeminiJsonSafely(resultText);
        if (!parsedResult) {
          console.error('[analyze-palm] Failed to parse JSON from AI response:', resultText.slice(0, 500));
          lastError = 'Invalid JSON from AI response';
          continue;
        }
        const normalizedResult = normalizeAnalysisResult(parsedResult);

        if (!normalizedResult) {
          console.error('[analyze-palm] Incomplete/invalid result structure:', Object.keys(parsedResult || {}));
          lastError = 'AI returned incomplete data';
          continue;
        }

        console.log('[analyze-palm] Successfully analyzed with model:', model);
        // Cache the result
        responseCache.set(cacheKey, { result: normalizedResult, timestamp: Date.now() });
        return NextResponse.json(normalizedResult);
      } catch (modelError) {
        console.error('[analyze-palm] Error with model ' + model + ':', modelError);
        lastError = modelError;
        continue;
      }
    }

    // All retries failed
    console.error('[analyze-palm] All retries failed. Last error:', lastError);

    // If all failures were 429 rate limits, return 429 to client
    if (last429RetryAfterSeconds !== null) {
      return NextResponse.json(
        {
          error: 'โควต้า API หมดชั่วคราว',
          details: 'ระบบใช้งาน Gemini API เกินโควต้าที่กำหนด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง',
          code: 'QUOTA_EXHAUSTED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(last429RetryAfterSeconds),
          },
        }
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
