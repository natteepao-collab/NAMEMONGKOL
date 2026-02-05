import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  checkRateLimit, 
  resetRateLimit,
  generateRateLimitKey, 
  getClientIp, 
  RATE_LIMIT_CONFIGS,
  formatRateLimitMessage 
} from '@/lib/rateLimit';
import { z } from 'zod';

// Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .email('กรุณากรอกอีเมลที่ถูกต้อง')
    .max(255, 'อีเมลยาวเกินไป')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'กรุณากรอกรหัสผ่าน')
    .max(100, 'รหัสผ่านยาวเกินไป'),
});

// Create Supabase admin client for server-side auth
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    // 1. Get client IP for rate limiting
    const ip = getClientIp(request);
    const rateLimitKey = generateRateLimitKey('login', ip);
    
    // 2. Check rate limit BEFORE processing
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.login);
    
    if (!rateLimitResult.success) {
      // Log suspicious activity
      console.warn(`[RATE_LIMIT] Login blocked for IP: ${ip}, attempts: ${rateLimitResult.totalAttempts}`);
      
      return NextResponse.json(
        { 
          error: formatRateLimitMessage(rateLimitResult),
          code: 'RATE_LIMITED',
          retryAfter: rateLimitResult.retryAfterSeconds,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.login.maxAttempts.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': rateLimitResult.retryAfterSeconds?.toString() || '900',
          },
        }
      );
    }
    
    // 3. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }
    
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { 
          error: firstError.message,
          code: 'VALIDATION_ERROR',
          field: firstError.path[0],
        },
        { status: 400 }
      );
    }
    
    const { email, password } = validationResult.data;
    
    // 4. Add email-specific rate limiting (prevent enumeration)
    const emailRateLimitKey = generateRateLimitKey('login', `email:${email}`);
    const emailRateLimitResult = checkRateLimit(emailRateLimitKey, {
      maxAttempts: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 60 * 60 * 1000, // 1 hour block
      progressiveBlocking: false,
    });
    
    if (!emailRateLimitResult.success) {
      console.warn(`[RATE_LIMIT] Login blocked for email: ${email.substring(0, 3)}***`);
      
      return NextResponse.json(
        { 
          error: 'บัญชีนี้ถูกระงับชั่วคราว กรุณาลองใหม่ภายหลัง',
          code: 'ACCOUNT_RATE_LIMITED',
          retryAfter: emailRateLimitResult.retryAfterSeconds,
        },
        { status: 429 }
      );
    }
    
    // 5. Attempt login with Supabase
    const { data, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) {
      // Log failed attempt (don't reveal if email exists)
      console.log(`[AUTH] Failed login attempt for: ${email.substring(0, 3)}*** from IP: ${ip}`);
      
      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { 
          error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          code: 'INVALID_CREDENTIALS',
          remaining: rateLimitResult.remaining - 1,
        },
        { 
          status: 401,
          headers: {
            'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
          },
        }
      );
    }
    
    // 6. Success - Reset rate limits
    resetRateLimit(rateLimitKey);
    resetRateLimit(emailRateLimitKey);
    
    console.log(`[AUTH] Successful login for: ${email.substring(0, 3)}*** from IP: ${ip}`);
    
    // 7. Return session data for client to set
    return NextResponse.json(
      { 
        message: 'เข้าสู่ระบบสำเร็จ',
        session: data.session,
        user: {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
        },
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': RATE_LIMIT_CONFIGS.login.maxAttempts.toString(),
        },
      }
    );
    
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    
    return NextResponse.json(
      { 
        error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// Prevent other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
