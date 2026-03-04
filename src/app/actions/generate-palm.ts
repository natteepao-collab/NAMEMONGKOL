'use server';

import { getPalmGenerationPrompt } from '@/lib/palm-prompt';

export async function generatePalmImageAction(formData: FormData) {
  const gender = (formData.get('gender') as string) || 'neutral';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: getPalmGenerationPrompt({ gender }),
      n: 1,
      size: '1024x1024',
      quality: 'hd', // บังคับ HD เพื่อความชัดของลายมือ
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `OpenAI API error: ${response.status} ${errorData?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  return data.data[0].url;
}
