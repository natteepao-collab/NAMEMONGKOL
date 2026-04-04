// =============================================================================
// AI Personality & Name Mirroring — Gemini AI + Deterministic Fallback
// =============================================================================

import {
    type AuraResult,
    type ArchetypeData,
    type AuraColor,
    ARCHETYPES,
    PERSONA_IMAGES,
    AURA_AI_SYSTEM_PROMPT,
} from '@/data/auraAnalysis';
import { calculateScore } from '@/utils/numerologyUtils';
import { getSumPrediction } from '@/data/sumPredictions';

// ---------------------------------------------------------------------------
// Gemini API Key loading (reuses existing pattern from auraService)
// ---------------------------------------------------------------------------

import { GEMINI_API_KEY_SECRET_KEY } from '@/lib/palmPromptDefaults';
import { createClient } from '@supabase/supabase-js';

const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
const TEXT_GEN_TIMEOUT_MS = 25_000;

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
        console.error('[aura-text] Failed to load Gemini key from app_secrets:', err);
    }

    return null;
}

// ---------------------------------------------------------------------------
// Purpose / Gender labels
// ---------------------------------------------------------------------------

const PURPOSE_LABELS: Record<string, string> = {
    self: 'ชื่อตัวเอง',
    baby: 'ชื่อลูก',
    brand: 'ชื่อแบรนด์',
};

const GENDER_LABELS: Record<string, string> = {
    male: 'ชาย',
    female: 'หญิง',
};

// ---------------------------------------------------------------------------
// Build user prompt for Gemini text analysis
// ---------------------------------------------------------------------------

function buildUserPrompt(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
    context?: string,
): string {
    const purposeLabel = PURPOSE_LABELS[purpose] ?? purpose;
    const genderLabel = gender ? GENDER_LABELS[gender] ?? gender : 'ไม่ระบุ';
    let prompt = `วิเคราะห์ชื่อ "${name}" จุดประสงค์: ${purposeLabel} เพศ: ${genderLabel}`;
    if (context && context.trim()) {
        prompt += ` บริบทเพิ่มเติม: ${context.trim()}`;
    }
    return prompt;
}

// ---------------------------------------------------------------------------
// Call Gemini API for text analysis
// ---------------------------------------------------------------------------

async function callGeminiTextAnalysis(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
    context?: string,
): Promise<Partial<AuraResult> | null> {
    try {
        const apiKey = await getGeminiApiKey();
        if (!apiKey) {
            console.warn('[aura-text] No API key available');
            return null;
        }

        const userPrompt = buildUserPrompt(name, purpose, gender, context);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TEXT_GEN_TIMEOUT_MS);

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: AURA_AI_SYSTEM_PROMPT }],
                },
                contents: [{ parts: [{ text: userPrompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    responseMimeType: 'application/json',
                },
            }),
        });

        clearTimeout(timeout);

        if (!res.ok) {
            const errText = await res.text();
            console.error(`[aura-text] Gemini API failed (${res.status}):`, errText.slice(0, 300));
            return null;
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
            console.warn('[aura-text] No text in Gemini response');
            return null;
        }

        // Parse JSON from response (strip markdown fences if present)
        const cleanedText = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        // Validate essential fields
        if (!parsed.archetype || !Array.isArray(parsed.personalityTraits)) {
            console.warn('[aura-text] Invalid response structure:', Object.keys(parsed));
            return null;
        }

        return parsed;
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[aura-text] Error:', msg);
        return null;
    }
}

// ---------------------------------------------------------------------------
// Deterministic hash (fallback)
// ---------------------------------------------------------------------------

function hashName(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const code = name.charCodeAt(i);
        hash = ((hash << 5) - hash + code) | 0; // djb2-style hash
    }
    return Math.abs(hash);
}

function pickFromArray<T>(arr: readonly T[], hash: number): T {
    return arr[hash % arr.length];
}

function selectImage(
    purpose: 'self' | 'baby' | 'brand',
    gender: 'male' | 'female' | undefined,
    hash: number,
): string {
    if (purpose === 'brand') {
        return pickFromArray(PERSONA_IMAGES.brand.neutral, hash);
    }
    const g = gender ?? 'male';
    const images = PERSONA_IMAGES[purpose][g];
    return pickFromArray(images, hash);
}

function generateFallbackResult(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
): AuraResult {
    const trimmed = name.trim();
    const seed = `${trimmed}:${purpose}:${gender ?? 'neutral'}`;
    const hash = hashName(seed);

    const archetype: ArchetypeData = pickFromArray(ARCHETYPES, hash);
    const imageUrl = selectImage(purpose, gender, hash >> 3);

    return {
        name: trimmed,
        purpose,
        gender,
        score: archetype.score,
        archetype: archetype.archetype,
        personalityTraits: archetype.personalityTraits,
        vibeAnalysis: archetype.vibeAnalysis,
        careerFit: archetype.careerFit,
        voiceTone: archetype.voiceTone,
        spiritIdentity: archetype.spiritIdentity,
        moodboard: archetype.moodboard,
        imageUrl,
        imageSource: 'placeholder',
        visualMoodKeywords: archetype.visualMoodKeywords,
        phoneticAnalysis: archetype.phoneticAnalysis,
        semanticAnalysis: archetype.semanticAnalysis,
        nameEnergyBreakdown: archetype.nameEnergyBreakdown,
        firstImpressionScore: archetype.firstImpressionScore,
        socialPerception: archetype.socialPerception,
        // New fields — fallback defaults
        meaning: `ชื่อ "${trimmed}" สื่อถึงพลังงานที่โดดเด่นและมีความหมายลึกซึ้ง`,
        meaningBreakdown: archetype.semanticAnalysis,
        identity: archetype.personalityTraits.slice(0, 4).map(t => `มีลักษณะเด่นคือความ${t} ซึ่งสะท้อนจากพลังงานของชื่อ`),
        auraColors: [
            { emoji: '🟡', color: archetype.moodboard[0]?.name ?? 'Gold', meaning: 'พลังงานหลักที่ส่งเสริมความสำเร็จและความมั่นคง' },
            { emoji: '🔵', color: archetype.moodboard[1]?.name ?? 'Blue', meaning: 'พลังงานรองที่สนับสนุนความสงบและปัญญา' },
        ],
        relationship: 'เจ้าของชื่อมีแนวโน้มที่จะเป็นคนจริงใจในความรัก ให้ความสำคัญกับความมั่นคงและการสนับสนุนซึ่งกันและกัน',
        // Numerology — computed server-side (same as /name-analysis)
        numerologyTotal: calculateScore(trimmed),
        numerologyMeaning: getSumPrediction(calculateScore(trimmed)).desc,
    };
}

// ---------------------------------------------------------------------------
// Type-safe coercion helpers — Gemini AI may return objects instead of strings
// ---------------------------------------------------------------------------

function safeString(value: unknown, fallback: string = ''): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>;
        if (typeof obj.text === 'string') return obj.text;
        if (typeof obj.value === 'string') return obj.value;
        if (typeof obj.name === 'string') return obj.name;
        try { return JSON.stringify(value); } catch { /* ignore */ }
    }
    return fallback;
}

function safeStringArray(value: unknown, fallback: string[] = []): string[] {
    if (!Array.isArray(value)) return fallback;
    return value
        .map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
                const obj = item as Record<string, unknown>;
                if (typeof obj.text === 'string') return obj.text;
                if (typeof obj.name === 'string') return obj.name;
                if (typeof obj.meaning === 'string') return obj.meaning;
                try { return JSON.stringify(item); } catch { return String(item); }
            }
            return String(item);
        })
        .filter((s): s is string => typeof s === 'string' && s.length > 0);
}

function safeMoodboard(value: unknown): { hex: string; name: string }[] {
    const defaults = [
        { hex: '#D4AF37', name: 'Gold' },
        { hex: '#1B1464', name: 'Navy' },
        { hex: '#8B0000', name: 'Crimson' },
        { hex: '#F5F5DC', name: 'Ivory' },
    ];
    if (!Array.isArray(value)) return defaults;
    const result = value.slice(0, 6).map(item => ({
        hex: typeof (item as Record<string, unknown>)?.hex === 'string' ? (item as Record<string, unknown>).hex as string : '#D4AF37',
        name: typeof (item as Record<string, unknown>)?.name === 'string' ? (item as Record<string, unknown>).name as string : 'Color',
    }));
    return result.length > 0 ? result : defaults;
}

function safeAuraColors(value: unknown): AuraColor[] {
    const defaults: AuraColor[] = [
        { emoji: '🟡', color: 'Gold', meaning: 'พลังงานหลัก' },
        { emoji: '🔵', color: 'Blue', meaning: 'พลังงานรอง' },
    ];
    if (!Array.isArray(value) || value.length < 2) return defaults;
    return value.slice(0, 4).map(item => ({
        emoji: safeString((item as Record<string, unknown>)?.emoji, '✨'),
        color: safeString((item as Record<string, unknown>)?.color, 'Unknown'),
        meaning: safeString((item as Record<string, unknown>)?.meaning, ''),
    }));
}

// ---------------------------------------------------------------------------
// Public API: Generate aura result (async — AI first, fallback to hash)
// ---------------------------------------------------------------------------

export async function generateAuraResult(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
    context?: string,
): Promise<AuraResult> {
    const trimmed = name.trim();

    // Compute numerology server-side (same logic as /name-analysis page)
    const computedNumerologyTotal = calculateScore(trimmed);
    const computedNumerologyPrediction = getSumPrediction(computedNumerologyTotal);

    // Try Gemini AI first
    const aiResult = await callGeminiTextAnalysis(trimmed, purpose, gender, context);

    if (aiResult) {
        // Merge AI result with required structural fields
        const seed = `${trimmed}:${purpose}:${gender ?? 'neutral'}`;
        const hash = hashName(seed);
        const imageUrl = selectImage(purpose, gender, hash >> 3);

        // Coerce all AI fields to correct types (Gemini may return objects)
        const personalityTraits = safeStringArray(aiResult.personalityTraits, ['มุ่งมั่น', 'มีเสน่ห์', 'เด็ดขาด']);
        const vmk = safeStringArray(aiResult.visualMoodKeywords, ['Grand', 'Luxurious', 'Authoritative']);
        const visualMoodKeywords: [string, string, string] = vmk.length >= 3
            ? [vmk[0], vmk[1], vmk[2]]
            : ['Grand', 'Luxurious', 'Authoritative'];

        return {
            name: trimmed,
            purpose,
            gender,
            score: safeString(aiResult.score, 'A'),
            archetype: safeString(aiResult.archetype, 'The Visionary (นักฝันผู้สร้างสรรค์)'),
            personalityTraits,
            vibeAnalysis: safeString(aiResult.vibeAnalysis, ''),
            careerFit: safeString(aiResult.careerFit, ''),
            voiceTone: safeString(aiResult.voiceTone, ''),
            spiritIdentity: safeString(aiResult.spiritIdentity, '✨ พลังงานแห่งจักรวาล'),
            moodboard: safeMoodboard(aiResult.moodboard),
            imageUrl,
            imageSource: 'placeholder',
            visualMoodKeywords,
            phoneticAnalysis: safeString(aiResult.phoneticAnalysis, ''),
            semanticAnalysis: safeString(aiResult.semanticAnalysis, ''),
            nameEnergyBreakdown: safeString(aiResult.nameEnergyBreakdown, ''),
            firstImpressionScore: typeof aiResult.firstImpressionScore === 'number' ? aiResult.firstImpressionScore : 85,
            socialPerception: safeString(aiResult.socialPerception, ''),
            meaning: safeString(aiResult.meaning, `ชื่อ "${trimmed}" มีพลังงานที่โดดเด่น`),
            meaningBreakdown: safeString(aiResult.meaningBreakdown, safeString(aiResult.semanticAnalysis, '')),
            identity: safeStringArray(aiResult.identity, []),
            auraColors: safeAuraColors(aiResult.auraColors),
            relationship: safeString(aiResult.relationship, ''),
            // Numerology — ALWAYS computed server-side (same as /name-analysis)
            numerologyTotal: computedNumerologyTotal,
            numerologyMeaning: computedNumerologyPrediction.desc,
        };
    }

    // Fallback to deterministic hash-based result
    console.log('[aura-text] Using fallback deterministic result');
    return generateFallbackResult(trimmed, purpose, gender);
}

/**
 * Synchronous fallback — kept for backward compatibility
 */
export function generateAuraResultSync(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
): AuraResult {
    return generateFallbackResult(name, purpose, gender);
}
