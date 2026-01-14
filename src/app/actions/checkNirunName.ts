'use server';

import { premiumNamesRaw } from '@/data/premiumNamesRaw';

// Cache the set for performance reuse in server environment
let nirunSet: Set<string> | null = null;

export async function checkNirunName(name: string): Promise<boolean> {
    if (!name) return false;

    if (!nirunSet) {
        const lines = premiumNamesRaw.split('\n');
        nirunSet = new Set(lines.map(line => line.trim()));
    }

    return nirunSet.has(name.trim());
}
