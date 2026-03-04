import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  PHONE_AI_SYSTEM_PROMPT_KEY,
  DEFAULT_PHONE_AI_SYSTEM_PROMPT,
} from '@/lib/phoneAiPromptDefaults';
import { GEMINI_API_KEY_SECRET_KEY } from '@/lib/palmPromptDefaults';

export const maxDuration = 30;

const MAX_RETRIES = 3;

// ────── JSON parsing helpers (same pattern as analyze-palm) ──────

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
  ].filter(
    (value, index, arr): value is string =>
      typeof value === 'string' && value.length > 0 && arr.indexOf(value) === index
  );

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }

  return null;
}

function getGeminiTextFromResponse(data: any): string | null { // eslint-disable-line @typescript-eslint/no-explicit-any
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  const text = parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : '')) // eslint-disable-line @typescript-eslint/no-explicit-any
    .join('')
    .trim();

  return text || null;
}

// ────── Normalize AI response ──────

function normalizePhoneAiResult(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null;
  const input = raw as Record<string, unknown>;

  // alignment
  const rawAlignment = input.alignment as Record<string, unknown> | undefined;
  if (!rawAlignment || typeof rawAlignment !== 'object') return null;
  const alignmentTitle = typeof rawAlignment.title === 'string' ? rawAlignment.title.trim() : '';
  const alignmentContent = typeof rawAlignment.content === 'string' ? rawAlignment.content.trim() : '';
  const alignmentScore = typeof rawAlignment.score === 'number' ? Math.min(100, Math.max(0, rawAlignment.score)) : 50;
  if (!alignmentContent) return null;

  // hidden_potential
  const rawHidden = input.hidden_potential as Record<string, unknown> | undefined;
  const hiddenTitle = rawHidden && typeof rawHidden.title === 'string' ? rawHidden.title.trim() : 'พลังซ่อนในเบอร์ของคุณ';
  const hiddenContent = rawHidden && typeof rawHidden.content === 'string' ? rawHidden.content.trim() : '';
  if (!hiddenContent) return null;

  // strategy
  const rawStrategy = input.strategy as Record<string, unknown> | undefined;
  const strategyTitle = rawStrategy && typeof rawStrategy.title === 'string' ? rawStrategy.title.trim() : 'กลยุทธ์เสริมดวงตามอาชีพ';
  const strategyContent = rawStrategy && typeof rawStrategy.content === 'string' ? rawStrategy.content.trim() : '';
  if (!strategyContent) return null;

  // verdict
  const verdict = typeof input.verdict === 'string' ? input.verdict.trim() : '';
  if (!verdict) return null;

  return {
    alignment: { title: alignmentTitle, content: alignmentContent, score: alignmentScore },
    hidden_potential: { title: hiddenTitle, content: hiddenContent },
    strategy: { title: strategyTitle, content: strategyContent },
    verdict,
  };
}

// ────── Config loaders ──────

async function getPhoneAiSystemPrompt(): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return DEFAULT_PHONE_AI_SYSTEM_PROMPT;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', PHONE_AI_SYSTEM_PROMPT_KEY)
      .maybeSingle();

    if (error) throw error;

    if (typeof data?.value === 'string' && data.value.trim().length >= 100) {
      return data.value.trim();
    }
  } catch (error) {
    console.error('[analyze-phone-ai] Failed to load system prompt from DB:', error);
  }

  return DEFAULT_PHONE_AI_SYSTEM_PROMPT;
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
    const code = typeof (error as any)?.code === 'string' ? (error as any).code : ''; // eslint-disable-line @typescript-eslint/no-explicit-any
    const message = typeof (error as any)?.message === 'string' ? (error as any).message.toLowerCase() : ''; // eslint-disable-line @typescript-eslint/no-explicit-any
    const details = typeof (error as any)?.details === 'string' ? (error as any).details.toLowerCase() : ''; // eslint-disable-line @typescript-eslint/no-explicit-any
    const isMissingTable = code === 'PGRST205' || message.includes('app_secrets') || details.includes('app_secrets');

    if (!isMissingTable) {
      console.error('[analyze-phone-ai] Failed to load gemini_api_key from app_secrets:', error);
    }
  }

  return null;
}

// ────── Server-side rate limiter ──────

const lastRequestTimeByIp = new Map<string, number>();
const MIN_REQUEST_INTERVAL = 10000; // 10 seconds between requests

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (!forwarded) return 'local';
  return forwarded.split(',')[0]?.trim() || 'local';
}

// ────── POST handler ──────

export async function POST(req: Request) {
  try {
    // Rate limit
    const clientIp = getClientIp(req);
    const now = Date.now();
    const lastRequestTime = lastRequestTimeByIp.get(clientIp) ?? 0;
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      const retryAfterSeconds = Math.max(1, Math.ceil((MIN_REQUEST_INTERVAL - (now - lastRequestTime)) / 1000));
      return NextResponse.json(
        { error: 'กรุณารอสักครู่', details: 'กรุณารออย่างน้อย 10 วินาทีก่อนลองอีกครั้ง', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }
    lastRequestTimeByIp.set(clientIp, now);

    // Parse & validate body
    const body = await req.json();
    const { phoneNumber, profession, pairs, grade, stats, totalScore } = body;

    if (!phoneNumber || !profession || !pairs || !grade || !stats) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    if (typeof profession !== 'string' || profession.trim().length < 2) {
      return NextResponse.json({ error: 'กรุณาระบุอาชีพ' }, { status: 400 });
    }

    // Load API key + system prompt in parallel
    const [secretKey, systemPrompt] = await Promise.all([
      getGeminiApiKeyFromSecrets(),
      getPhoneAiSystemPrompt(),
    ]);

    const envKey = typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : '';
    const apiKey = envKey || secretKey;
    const apiKeySource = envKey ? 'env' : secretKey ? 'app_secrets' : 'none';
    if (!apiKey) {
      console.error('[analyze-phone-ai] GEMINI_API_KEY is not set');
      // Reset rate limiter on config error so user can retry
      lastRequestTimeByIp.delete(clientIp);
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    console.log('[analyze-phone-ai] Gemini key source:', apiKeySource);

    // Build user prompt with analysis data
    const pairsSummary = pairs
      .map((p: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const levelLabel = p.level === 1 ? 'ดี' : p.level === 2 ? 'ร้าย' : 'ทั่วไป';
        return `คู่ ${p.pair} (${levelLabel}): ${p.title} - ${p.description?.slice(0, 80) || ''}`;
      })
      .join('\n');

    const statsText = Object.entries(stats)
      .map(([key, val]: [string, any]) => `${key}: จุดแข็ง ${val.pos}/100, จุดอ่อน ${val.neg}/100`) // eslint-disable-line @typescript-eslint/no-explicit-any
      .join('\n');

    const userPrompt = `วิเคราะห์เบอร์โทรศัพท์ ${phoneNumber} สำหรับอาชีพ "${profession.trim()}"

ข้อมูลการวิเคราะห์พื้นฐาน:
- เกรด: ${grade}
- คะแนนรวม: ${totalScore}
- คู่เลข:
${pairsSummary}

- สถิติ:
${statsText}

กรุณาวิเคราะห์ว่าเบอร์นี้สอดคล้องกับอาชีพ "${profession.trim()}" อย่างไร ตอบเป็น JSON ตามรูปแบบที่กำหนด`;

    // Model fallback chain
    const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    let lastError: unknown = null;
    const failedModels = new Set<string>();
    let last429RetryAfterSeconds: number | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      let model = models[attempt % models.length];
      if (failedModels.has(model)) {
        const available = models.filter((m) => !failedModels.has(m));
        if (available.length === 0) break;
        model = available[attempt % available.length];
      }

      try {
        console.log(`[analyze-phone-ai] Attempt ${attempt + 1}/${MAX_RETRIES} model: ${model}`);

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json',
            },
            ...(model.startsWith('gemini-2.5') ? { thinkingConfig: { thinkingBudget: 512 } } : {}),
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[analyze-phone-ai] Model ${model} failed (${response.status}):`, errorText);
          lastError = errorText;

          if (response.status === 429) {
            const retryAfterHeader = response.headers.get('retry-after');
            const retryMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 30000;
            last429RetryAfterSeconds = Math.max(1, Math.ceil(retryMs / 1000));
            failedModels.add(model);
          } else if (response.status === 404) {
            failedModels.add(model);
          }
          continue;
        }

        const data = await response.json();
        const finishReason = data?.candidates?.[0]?.finishReason;

        if (finishReason === 'MAX_TOKENS') {
          console.warn('[analyze-phone-ai] Output truncated — retrying');
          lastError = 'AI response was truncated';
          continue;
        }

        const resultText = getGeminiTextFromResponse(data);
        if (!resultText) {
          lastError = 'No text content in AI response';
          continue;
        }

        const parsedResult = parseGeminiJsonSafely(resultText);
        if (!parsedResult) {
          console.error('[analyze-phone-ai] Failed to parse JSON:', resultText.slice(0, 500));
          lastError = 'Invalid JSON from AI response';
          continue;
        }

        const normalizedResult = normalizePhoneAiResult(parsedResult);
        if (!normalizedResult) {
          console.error('[analyze-phone-ai] Incomplete result structure:', Object.keys(parsedResult || {}));
          lastError = 'AI returned incomplete data';
          continue;
        }

        console.log('[analyze-phone-ai] Successfully analyzed with model:', model);
        return NextResponse.json({ success: true, analysis: normalizedResult });
      } catch (modelError) {
        console.error(`[analyze-phone-ai] Error with model ${model}:`, modelError);
        lastError = modelError;
        continue;
      }
    }

    // All retries failed
    // Reset rate limiter so user can retry after quota recovers
    lastRequestTimeByIp.delete(clientIp);

    if (last429RetryAfterSeconds !== null) {
      return NextResponse.json(
        { error: 'โควต้า API หมดชั่วคราว', details: 'กรุณารอ 30 วินาทีแล้วลองใหม่', code: 'QUOTA_EXHAUSTED' },
        { status: 429, headers: { 'Retry-After': String(last429RetryAfterSeconds) } }
      );
    }

    return NextResponse.json(
      { error: 'ไม่สามารถวิเคราะห์ได้', details: String(lastError), code: 'AI_FAILED' },
      { status: 502 }
    );
  } catch (error) {
    console.error('[analyze-phone-ai] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
