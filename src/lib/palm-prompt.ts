// Prompt builder for AI palm image generation (DALL-E 3)
// Separate from palmPromptDefaults.ts which handles palm ANALYSIS prompts (Gemini)

export const getPalmGenerationPrompt = (details: { gender?: string; age?: string } = {}) => {
  const { gender = 'neutral', age = 'adult' } = details;

  return `
    [SUBJECT]: A hyper-realistic, high-resolution top-down photo of a single ${gender} ${age} human palm.
    [POSITION]: Flat and fully open, fingers spread naturally, facing directly at the camera.
    [ANATOMY]: STRICTLY ANATOMICALLY CORRECT. Exactly five distinct fingers. No extra digits. No fused fingers. Correct bone structure and knuckle placement.
    [DETAILS]: High-contrast palm lines (Life, Head, Heart, and Fate lines). Clear skin texture with visible pores and natural creases.
    [LIGHTING]: Even, neutral studio lighting. No harsh shadows between fingers.
    [BACKGROUND]: Solid plain white background for easy image processing.
    [QUALITY]: 8k resolution, photorealistic, sharp focus.
  `.trim();
};

export const PALM_NEGATIVE_PROMPT =
  'extra fingers, missing fingers, deformed, mutated, fused, blurry, cartoon, 3D render, unrealistic proportions, double thumb, overlapping fingers';
