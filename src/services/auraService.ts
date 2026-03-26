// =============================================================================
// Aura Analysis Service — with Gemini Image Generation
// =============================================================================

import { createHash } from 'crypto';
import { generateAuraResult } from '@/utils/auraAnalysis';
import type { AuraResult, ImageStyle } from '@/data/auraAnalysis';
import { AURA_AI_SYSTEM_PROMPT } from '@/data/auraAnalysis';
import { GEMINI_API_KEY_SECRET_KEY } from '@/lib/palmPromptDefaults';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PURPOSE_LABELS: Record<string, string> = {
    self: 'ชื่อตัวเอง',
    baby: 'ชื่อลูก',
    brand: 'ชื่อแบรนด์',
};

const PURPOSE_IMAGE_CONTEXT: Record<'self' | 'baby' | 'brand', string> = {
    self: 'personal identity portrait',
    baby: 'future child identity portrait',
    brand: 'brand identity visual',
};

const GENDER_LABELS: Record<string, string> = {
    male: 'ชาย',
    female: 'หญิง',
};

/** Image models to try in order (Nano Banana 2 → Nano Banana fallback) */
const IMAGE_MODELS = [
    process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview',
    'gemini-2.5-flash-image',
];

const STORAGE_BUCKET = 'aura-images';
const IMAGE_GEN_TIMEOUT_MS = 25_000;

const STYLE_DIRECTIONS: Record<ImageStyle, string> = {
    auto: '',
    corporate: 'Art direction override: clean corporate headshot, modern office background, tailored navy suit, Bloomberg/Fortune magazine editorial aesthetic, confident executive posture.',
    luxury: 'Art direction override: opulent high-fashion editorial, rich textures, Vogue-level styling, dramatic chiaroscuro lighting, jewel tone accents, gold and velvet details.',
    minimal: 'Art direction override: Scandinavian minimalist aesthetic, white/cream clean background, soft diffused natural lighting, muted earth tones, negative space, Kinfolk magazine style.',
    mystical: 'Art direction override: cosmic fantasy atmosphere, deep nebula background, magical aura particles, ethereal purple/teal/gold color grading, volumetric god-rays, celestial energy.',
};

// ---------------------------------------------------------------------------
// Text prompt builder (for future Gemini text analysis)
// ---------------------------------------------------------------------------

export function buildAuraUserPrompt(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
): string {
    const purposeLabel = PURPOSE_LABELS[purpose] ?? purpose;
    const genderLabel = gender ? GENDER_LABELS[gender] ?? gender : 'ไม่ระบุ';
    return `วิเคราะห์ชื่อ "${name}" จุดประสงค์: ${purposeLabel} เพศ: ${genderLabel}`;
}

/** Re-export for convenience */
export { AURA_AI_SYSTEM_PROMPT };

// ---------------------------------------------------------------------------
// Image prompt builder
// ---------------------------------------------------------------------------

function sanitizePromptContext(rawContext?: string): string {
    if (!rawContext) return '';
    return rawContext
        .replace(/[\r\n]+/g, ' ')
        .replace(/["'`]/g, '')
        .trim()
        .slice(0, 140);
}

function extractArchetypeEnglish(archetype: string): string {
    const english = archetype.split('(')[0]?.trim();
    return english || archetype;
}

export function buildAuraImagePrompt(result: AuraResult, userContext?: string, style: ImageStyle = 'auto'): string {
    const colors = result.moodboard.map((c) => c.name).join(', ');
    const keywords = result.visualMoodKeywords.join(', ');
    const traits = result.personalityTraits.slice(0, 4).join(', ');
    const archetypeEnglish = extractArchetypeEnglish(result.archetype);
    const promptContext = sanitizePromptContext(userContext);
    const purposeContext = PURPOSE_IMAGE_CONTEXT[result.purpose];

    const baseDirection = [
        `Render a premium ${purposeContext} inspired by Thai identity aesthetics.`,
        `Main archetype: ${archetypeEnglish}.`,
        `Name shown in metadata only: ${result.name}. Never place any text inside the image.`,
        `Mood keywords: ${keywords}. Color palette cues: ${colors}.`,
        `Key personality signals: ${traits}.`,
        promptContext ? `Use-case context: ${promptContext}.` : '',
        'Image quality target: cinematic, high-end, sharp details, natural skin texture, realistic lighting.',
        STYLE_DIRECTIONS[style] || '',
    ].filter(Boolean);

    if (result.purpose === 'brand') {
        return [
            ...baseDirection,
            `Create an elegant symbolic brand visual instead of a human portrait.`,
            `Incorporate spirit symbol inspiration from: ${result.spiritIdentity}.`,
            `Composition: square 1:1, centered focal object, sophisticated negative space, premium editorial look.`,
            `Art direction: modern luxury, cosmic minimalism, subtle gold aura, deep navy backdrop, volumetric light.`,
            `Negative prompt: text, logo, watermark, letters, clutter, low resolution, blurry edges.`,
        ].join(' ');
    }

    const genderWord = result.gender === 'female' ? 'female' : 'male';
    const ageContext = result.purpose === 'baby' ? '5-8 year-old child' : 'young adult';
    const careerHint = result.careerFit.split('/')[0]?.trim() || result.careerFit;

    return [
        ...baseDirection,
        `Create a detailed cinematic portrait of a Thai ${genderWord} ${ageContext}.`,
        `Wardrobe and styling should reflect: ${careerHint}.`,
        `Expression: trustworthy, composed, aspirational, with subtle power and warmth.`,
        `Portrait framing: chest-up, direct eye contact, centered composition, square 1:1 format.`,
        `Scene background: dark premium modern interior with cosmic aura accents and controlled bokeh.`,
        `Lighting: soft key light + rim light, premium studio look, photorealistic skin and hair texture.`,
        `Do not generate text overlays or logos.`,
        `Negative prompt: watermark, typography, duplicated face, deformed hands, extra limbs, blur, low detail.`,
    ].join(' ');
}

// ---------------------------------------------------------------------------
// Gemini API key loading (reuses existing pattern)
// ---------------------------------------------------------------------------

async function getGeminiApiKey(): Promise<string | null> {
    const envKey = typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : '';
    if (envKey) return envKey;

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
        if (typeof data?.value === 'string' && data.value.trim()) return data.value.trim();
    } catch (err) {
        console.error('[aura-image] Failed to load Gemini key from app_secrets:', err);
    }

    return null;
}

// ---------------------------------------------------------------------------
// Deterministic cache key
// ---------------------------------------------------------------------------

function buildCacheKey(name: string, purpose: string, gender: string | undefined, archetype: string, userContext?: string, style: ImageStyle = 'auto'): string {
    const normalizedContext = sanitizePromptContext(userContext).toLowerCase();
    const seed = `${name}:${purpose}:${gender ?? 'neutral'}:${archetype}:${normalizedContext}:${style}`;
    return createHash('sha256').update(seed).digest('hex').slice(0, 24);
}

// ---------------------------------------------------------------------------
// Supabase Storage helpers
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

async function checkCachedImage(cacheKey: string): Promise<string | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const filePath = `generated/${cacheKey}.png`;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    // Check if the file actually exists by making a HEAD request
    try {
        const res = await fetch(data.publicUrl, { method: 'HEAD' });
        if (res.ok) return data.publicUrl;
    } catch {
        // File doesn't exist
    }
    return null;
}

async function uploadGeneratedImage(cacheKey: string, imageBytes: Uint8Array): Promise<string | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const filePath = `generated/${cacheKey}.png`;
    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, imageBytes, {
            contentType: 'image/png',
            upsert: true,
        });

    if (error) {
        console.error('[aura-image] Storage upload failed:', error.message);
        return null;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Gemini Image Generation
// ---------------------------------------------------------------------------

async function generateImageWithGemini(prompt: string, apiKey: string): Promise<Uint8Array | null> {
    for (const model of IMAGE_MODELS) {
        try {
            console.log(`[aura-image] Trying model: ${model}`);
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), IMAGE_GEN_TIMEOUT_MS);

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseModalities: ['IMAGE', 'TEXT'],
                        temperature: 1.0,
                    },
                }),
            });

            clearTimeout(timeout);

            if (!res.ok) {
                const errText = await res.text();
                console.error(`[aura-image] Model ${model} failed (${res.status}):`, errText.slice(0, 200));
                continue;
            }

            const data = await res.json();
            const parts = data?.candidates?.[0]?.content?.parts;
            if (!Array.isArray(parts)) continue;

            // Find the image part
            for (const part of parts) {
                if (part?.inlineData?.mimeType?.startsWith('image/') && part.inlineData.data) {
                    const binaryStr = atob(part.inlineData.data);
                    const bytes = new Uint8Array(binaryStr.length);
                    for (let i = 0; i < binaryStr.length; i++) {
                        bytes[i] = binaryStr.charCodeAt(i);
                    }
                    console.log(`[aura-image] Generated image with ${model} (${bytes.length} bytes)`);
                    return bytes;
                }
            }

            console.warn(`[aura-image] Model ${model} returned no image data`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`[aura-image] Model ${model} error:`, msg);
        }
    }

    return null;
}

// ---------------------------------------------------------------------------
// Public API: Generate aura image
// ---------------------------------------------------------------------------

export async function generateAuraImage(
    result: AuraResult,
    userContext?: string,
    style: ImageStyle = 'auto',
): Promise<{ imageUrl: string; imageSource: 'generated' | 'placeholder'; imagePrompt: string }> {
    const prompt = buildAuraImagePrompt(result, userContext, style);

    try {
        const cacheKey = buildCacheKey(result.name, result.purpose, result.gender, result.archetype, userContext, style);

        // 1. Check cache first
        const cached = await checkCachedImage(cacheKey);
        if (cached) {
            console.log('[aura-image] Cache hit:', cacheKey);
            return { imageUrl: cached, imageSource: 'generated', imagePrompt: prompt };
        }

        // 2. Get API key
        const apiKey = await getGeminiApiKey();
        if (!apiKey) {
            console.warn('[aura-image] No API key available, using placeholder');
            return { imageUrl: result.imageUrl, imageSource: 'placeholder', imagePrompt: prompt };
        }

        // 3. Generate image
        const imageBytes = await generateImageWithGemini(prompt, apiKey);
        if (!imageBytes) {
            return { imageUrl: result.imageUrl, imageSource: 'placeholder', imagePrompt: prompt };
        }

        // 4. Upload to storage
        const publicUrl = await uploadGeneratedImage(cacheKey, imageBytes);
        if (publicUrl) {
            return { imageUrl: publicUrl, imageSource: 'generated', imagePrompt: prompt };
        }

        // 5. Fallback: return as base64 data URL if storage fails
        const base64 = Buffer.from(imageBytes).toString('base64');
        return { imageUrl: `data:image/png;base64,${base64}`, imageSource: 'generated', imagePrompt: prompt };
    } catch (err) {
        console.error('[aura-image] Unexpected error:', err);
        return { imageUrl: result.imageUrl, imageSource: 'placeholder', imagePrompt: prompt };
    }
}

// ---------------------------------------------------------------------------
// Public API: Analyze aura (mock text + optional AI image)
// ---------------------------------------------------------------------------

export async function analyzeAura(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
): Promise<AuraResult> {
    return generateAuraResult(name, purpose, gender);
}
