// =============================================================================
// AI Personality & Name Mirroring — Deterministic Hash-based Analysis
// =============================================================================

import {
    type AuraResult,
    type ArchetypeData,
    ARCHETYPES,
    PERSONA_IMAGES,
} from '@/data/auraAnalysis';

/**
 * Deterministic hash from a string — same input always yields same output.
 * Uses charCode sum similar to existing nameAnalysis.ts CHAR_SCORES pattern.
 */
function hashName(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const code = name.charCodeAt(i);
        hash = ((hash << 5) - hash + code) | 0; // djb2-style hash
    }
    return Math.abs(hash);
}

/**
 * Pick an item from an array deterministically based on a hash value.
 */
function pickFromArray<T>(arr: readonly T[], hash: number): T {
    return arr[hash % arr.length];
}

/**
 * Select the persona image based on purpose, gender, and hash.
 */
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

/**
 * Generate a deterministic aura analysis result.
 *
 * **Guarantee:** Same (name + purpose + gender) → identical result.
 * Different names → (very likely) different archetype / colors / scores.
 *
 * For future AI integration, swap this function's internals while keeping
 * the same return type `AuraResult`.
 */
export function generateAuraResult(
    name: string,
    purpose: 'self' | 'baby' | 'brand',
    gender?: 'male' | 'female',
): AuraResult {
    const trimmed = name.trim();
    // Include purpose & gender in the hash seed so "สมชาย as self" ≠ "สมชาย as brand"
    const seed = `${trimmed}:${purpose}:${gender ?? 'neutral'}`;
    const hash = hashName(seed);

    const archetype: ArchetypeData = pickFromArray(ARCHETYPES, hash);
    const imageUrl = selectImage(purpose, gender, hash >> 3); // shift to vary image independently

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
    };
}
