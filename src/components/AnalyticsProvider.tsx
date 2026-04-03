'use client';

import { useEffect } from 'react';
import { attachAutoCapture } from '@/lib/analytics';

/**
 * Mount once in root layout — attaches a global click listener
 * that auto-tracks any element with a `data-track` attribute.
 */
export function AnalyticsProvider() {
    useEffect(() => {
        attachAutoCapture();
    }, []);

    return null;
}
