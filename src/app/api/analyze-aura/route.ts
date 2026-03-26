import { NextResponse } from 'next/server';
import { generateAuraResult } from '@/utils/auraAnalysis';
import { generateAuraImage } from '@/services/auraService';

export const maxDuration = 30;

// ---------------------------------------------------------------------------
// Rate limiter — 10-second minimum between requests per IP
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, number>();

function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return 'unknown';
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const last = rateLimitMap.get(ip);
    if (last && now - last < 10_000) return true;
    rateLimitMap.set(ip, now);
    return false;
}

// ---------------------------------------------------------------------------
// POST /api/analyze-aura
// ---------------------------------------------------------------------------

const VALID_PURPOSES = ['self', 'baby', 'brand'] as const;
const VALID_GENDERS = ['male', 'female'] as const;
const VALID_STYLES = ['auto', 'corporate', 'luxury', 'minimal', 'mystical'] as const;

export async function POST(req: Request) {
    try {
        // 1. Rate limiting
        const ip = getClientIp(req);
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { success: false, error: 'กรุณารอสักครู่ก่อนวิเคราะห์อีกครั้ง' },
                { status: 429 },
            );
        }

        // 2. Parse & validate body
        const body = await req.json();
        const { name, purpose, gender, context, style } = body as {
            name?: string;
            purpose?: string;
            gender?: string;
            context?: string;
            style?: string;
        };

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'กรุณากรอกชื่อ' },
                { status: 400 },
            );
        }

        if (name.trim().length > 100) {
            return NextResponse.json(
                { success: false, error: 'ชื่อไม่ควรยาวเกิน 100 ตัวอักษร' },
                { status: 400 },
            );
        }

        if (!purpose || !VALID_PURPOSES.includes(purpose as typeof VALID_PURPOSES[number])) {
            return NextResponse.json(
                { success: false, error: 'กรุณาเลือกจุดประสงค์ (self, baby, brand)' },
                { status: 400 },
            );
        }

        if (typeof context !== 'undefined') {
            if (typeof context !== 'string') {
                return NextResponse.json(
                    { success: false, error: 'บริบทต้องเป็นข้อความ' },
                    { status: 400 },
                );
            }
            if (context.trim().length > 140) {
                return NextResponse.json(
                    { success: false, error: 'บริบทไม่ควรยาวเกิน 140 ตัวอักษร' },
                    { status: 400 },
                );
            }
        }

        // Gender required for non-brand purposes
        if (purpose !== 'brand') {
            if (!gender || !VALID_GENDERS.includes(gender as typeof VALID_GENDERS[number])) {
                return NextResponse.json(
                    { success: false, error: 'กรุณาเลือกเพศ' },
                    { status: 400 },
                );
            }
        }

        // 3. Generate deterministic text result
        const result = generateAuraResult(
            name.trim(),
            purpose as 'self' | 'baby' | 'brand',
            gender as 'male' | 'female' | undefined,
        );

        // 4. Generate AI image (non-blocking — falls back to placeholder on failure)
        const validStyle = style && VALID_STYLES.includes(style as typeof VALID_STYLES[number])
            ? (style as typeof VALID_STYLES[number])
            : 'auto';
        const { imageUrl, imageSource, imagePrompt } = await generateAuraImage(
            result,
            typeof context === 'string' ? context.trim() : undefined,
            validStyle,
        );
        result.imageUrl = imageUrl;
        result.imageSource = imageSource;

        return NextResponse.json({ success: true, data: result, imagePrompt });
    } catch (error) {
        console.error('[analyze-aura] Error:', error);
        return NextResponse.json(
            { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
            { status: 500 },
        );
    }
}
