export interface PalmLinePoint {
  x: number;
  y: number;
  confidence?: number;
}

export interface PalmLine {
  id: string;
  name: string;
  confidence?: number;
  points: PalmLinePoint[];
}

export interface PalmImageQuality {
  sharpness: number;
  lighting: number;
  occlusion: number;
  perspective: number;
}

export interface PalmAnalysisResult {
  personality_traits: {
    name: string;
    score: number;
  }[];
  strengths: string[];
  weaknesses: string[];
  lines: PalmLine[];
  spiritual_guidance: string;
  image_quality?: PalmImageQuality;
}
