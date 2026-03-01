import { supabase } from '@/utils/supabase';

/**
 * คำนวณเครดิตที่ใช้ได้จริง (รวม welcome_credits ที่ยังไม่หมดอายุ)
 * ใช้แทน `.select('credits')` เมื่อต้องการแสดงยอดเครดิตรวม
 */
export async function getEffectiveCredits(userId: string): Promise<{
    total: number;
    purchased: number;
    welcome: number;
    welcomeExpiresAt: Date | null;
    welcomeExpired: boolean;
}> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('credits, welcome_credits, welcome_credits_granted_at')
        .eq('id', userId)
        .maybeSingle();

    if (error || !data) {
        return { total: 0, purchased: 0, welcome: 0, welcomeExpiresAt: null, welcomeExpired: true };
    }

    const purchased = data.credits ?? 0;
    let welcome = data.welcome_credits ?? 0;
    let welcomeExpiresAt: Date | null = null;
    let welcomeExpired = true;

    if (welcome > 0 && data.welcome_credits_granted_at) {
        const grantedAt = new Date(data.welcome_credits_granted_at);
        welcomeExpiresAt = new Date(grantedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

        if (new Date() < welcomeExpiresAt) {
            welcomeExpired = false;
        } else {
            welcome = 0; // หมดอายุแล้ว
            welcomeExpiresAt = null;
        }
    }

    return {
        total: purchased + welcome,
        purchased,
        welcome,
        welcomeExpiresAt,
        welcomeExpired
    };
}

/**
 * คำนวณเครดิตรวมจาก data object (สำหรับ inline use)
 * ใช้เมื่อมี data จาก query อยู่แล้ว ไม่ต้อง query ใหม่
 */
export function calculateEffectiveCredits(data: {
    credits?: number | null;
    welcome_credits?: number | null;
    welcome_credits_granted_at?: string | null;
}): number {
    const purchased = data.credits ?? 0;
    let welcome = data.welcome_credits ?? 0;

    if (welcome > 0 && data.welcome_credits_granted_at) {
        const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() >= grantedAt + thirtyDays) {
            welcome = 0; // หมดอายุแล้ว
        }
    }

    return purchased + welcome;
}
