/**
 * Rate Limiting Utility for Brute Force Protection
 * 
 * This module provides in-memory rate limiting for login attempts
 * and other sensitive operations. For production with multiple servers,
 * consider using Upstash Redis or similar distributed store.
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil: number;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
  // Progressive blocking: multiply block duration after each consecutive block
  progressiveBlocking?: boolean;
  maxBlockDurationMs?: number;
}

// Default configurations
export const RATE_LIMIT_CONFIGS = {
  // Login: 5 attempts per 15 minutes, block for 15 minutes
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 15 * 60 * 1000,
    progressiveBlocking: true,
    maxBlockDurationMs: 24 * 60 * 60 * 1000, // Max 24 hours
  },
  // Password reset: 3 attempts per hour, block for 1 hour
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
    progressiveBlocking: false,
  },
  // API general: 100 attempts per minute
  api: {
    maxAttempts: 100,
    windowMs: 60 * 1000,
    blockDurationMs: 60 * 1000,
    progressiveBlocking: false,
  },
  // OTP verification: 5 attempts per 10 minutes
  otp: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
    progressiveBlocking: true,
    maxBlockDurationMs: 2 * 60 * 60 * 1000,
  },
} as const;

// Store for rate limit entries
const rateLimitStore = new Map<string, RateLimitEntry>();
const blockCountStore = new Map<string, number>(); // Track consecutive blocks

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Cleanup expired entries to prevent memory leak
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  // Only cleanup every CLEANUP_INTERVAL
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries where both window and block have expired
    const config = getConfigFromKey(key);
    const windowExpired = now - entry.firstAttempt > config.windowMs;
    const blockExpired = now > entry.blockedUntil;
    
    if (windowExpired && blockExpired) {
      rateLimitStore.delete(key);
      blockCountStore.delete(key);
    }
  }
}

/**
 * Get config based on key prefix
 */
function getConfigFromKey(key: string): RateLimitConfig {
  if (key.startsWith('login:')) return RATE_LIMIT_CONFIGS.login;
  if (key.startsWith('password-reset:')) return RATE_LIMIT_CONFIGS.passwordReset;
  if (key.startsWith('otp:')) return RATE_LIMIT_CONFIGS.otp;
  return RATE_LIMIT_CONFIGS.api;
}

/**
 * Generate rate limit key
 */
export function generateRateLimitKey(
  type: 'login' | 'password-reset' | 'api' | 'otp',
  identifier: string
): string {
  return `${type}:${identifier}`;
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // X-Forwarded-For (first IP in chain)
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // X-Real-IP
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Check rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  blockedUntil: number | null;
  retryAfterSeconds: number | null;
  totalAttempts: number;
}

/**
 * Check if an action is rate limited
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api
): RateLimitResult {
  const now = Date.now();
  
  // Trigger cleanup occasionally
  cleanupExpiredEntries();
  
  let entry = rateLimitStore.get(key);
  
  // Check if currently blocked
  if (entry && entry.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blockedUntil: entry.blockedUntil,
      retryAfterSeconds,
      totalAttempts: entry.count,
    };
  }
  
  // Reset if window has expired
  if (!entry || now - entry.firstAttempt > config.windowMs) {
    entry = {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      blockedUntil: 0,
    };
    rateLimitStore.set(key, entry);
    
    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
      blockedUntil: null,
      retryAfterSeconds: null,
      totalAttempts: 1,
    };
  }
  
  // Increment count
  entry.count++;
  entry.lastAttempt = now;
  
  // Check if limit exceeded
  if (entry.count > config.maxAttempts) {
    // Calculate block duration (progressive if enabled)
    let blockDuration = config.blockDurationMs;
    
    if (config.progressiveBlocking) {
      const consecutiveBlocks = (blockCountStore.get(key) || 0) + 1;
      blockCountStore.set(key, consecutiveBlocks);
      
      // Double block duration for each consecutive block
      blockDuration = Math.min(
        config.blockDurationMs * Math.pow(2, consecutiveBlocks - 1),
        config.maxBlockDurationMs || config.blockDurationMs * 16
      );
    }
    
    entry.blockedUntil = now + blockDuration;
    rateLimitStore.set(key, entry);
    
    const retryAfterSeconds = Math.ceil(blockDuration / 1000);
    
    return {
      success: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blockedUntil: entry.blockedUntil,
      retryAfterSeconds,
      totalAttempts: entry.count,
    };
  }
  
  rateLimitStore.set(key, entry);
  
  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.firstAttempt + config.windowMs,
    blockedUntil: null,
    retryAfterSeconds: null,
    totalAttempts: entry.count,
  };
}

/**
 * Reset rate limit after successful action (e.g., successful login)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
  blockCountStore.delete(key);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  key: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    return {
      success: true,
      remaining: config.maxAttempts,
      resetTime: now + config.windowMs,
      blockedUntil: null,
      retryAfterSeconds: null,
      totalAttempts: 0,
    };
  }
  
  if (entry.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blockedUntil: entry.blockedUntil,
      retryAfterSeconds,
      totalAttempts: entry.count,
    };
  }
  
  if (now - entry.firstAttempt > config.windowMs) {
    return {
      success: true,
      remaining: config.maxAttempts,
      resetTime: now + config.windowMs,
      blockedUntil: null,
      retryAfterSeconds: null,
      totalAttempts: 0,
    };
  }
  
  return {
    success: entry.count < config.maxAttempts,
    remaining: Math.max(0, config.maxAttempts - entry.count),
    resetTime: entry.firstAttempt + config.windowMs,
    blockedUntil: null,
    retryAfterSeconds: null,
    totalAttempts: entry.count,
  };
}

/**
 * Format Thai message for rate limit error
 */
export function formatRateLimitMessage(result: RateLimitResult): string {
  if (!result.retryAfterSeconds) {
    return 'กรุณาลองใหม่อีกครั้ง';
  }
  
  const minutes = Math.ceil(result.retryAfterSeconds / 60);
  const hours = Math.ceil(result.retryAfterSeconds / 3600);
  
  if (result.retryAfterSeconds < 60) {
    return `พยายามมากเกินไป กรุณารอ ${result.retryAfterSeconds} วินาที`;
  } else if (result.retryAfterSeconds < 3600) {
    return `พยายามมากเกินไป กรุณารอ ${minutes} นาที`;
  } else {
    return `พยายามมากเกินไป กรุณารอ ${hours} ชั่วโมง`;
  }
}
