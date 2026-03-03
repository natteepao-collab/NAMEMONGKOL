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
  overall_score?: number;
  occlusion?: number;
  perspective?: number;
}

export interface PalmLineAnalysis {
  title: string;
  description: string;
  prediction?: string;
  highlights: string[];
}

export interface PalmScores {
  love: number;
  career: number;
  health: number;
  destiny: number;
}

export interface PalmPredictionsByTopic {
  work: string;
  money: string;
  love: string;
  family: string;
  health: string;
  luck: string;
}

export interface PalmAnalysisResult {
  scores: PalmScores;
  line_analysis: {
    life_line: PalmLineAnalysis;
    head_line: PalmLineAnalysis;
    heart_line: PalmLineAnalysis;
    fate_line: PalmLineAnalysis;
  };
  personality_traits: {
    name: string;
    score: number;
  }[];
  strengths: string[];
  areas_for_growth: string[];
  summary: string;
  spiritual_guidance: string;
  lines: PalmLine[];
  image_quality?: PalmImageQuality;
  predictions_by_topic?: PalmPredictionsByTopic;
  monthly_forecast?: string;
  warnings?: string;
  ta_blessing?: string;
}
