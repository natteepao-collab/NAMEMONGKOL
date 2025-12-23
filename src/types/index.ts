export type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'wednesday_night' | 'thursday' | 'friday' | 'saturday';

export interface PairDefinition {
    level: 0 | 1 | 2; // 0=Neutral, 1=Good, 2=Bad
    desc: string;
}

export interface PairAnalysis {
    pair: string;
    level: 0 | 1 | 2;
    desc: string;
}

export interface ThaksaDayConfig {
    name: string;
    borivan: string[];
    ayu: string[];
    dech: string[];
    si: string[];
    mula: string[];
    ussaha: string[];
    montri: string[];
    kali: string[];
}

export interface ThaksaMeaning {
    label: string;
    desc: string;
    color: string;
}

export interface AyatanaMeaning {
    title: string;
    desc: string;
}

export interface AyatanaResult extends AyatanaMeaning {
    score: number;
}

export interface PredictionResult {
    level: string;
    color: string;
    bgGradient: string;
    desc: string;
    stars: number;
}

export interface ThaksaAnalysisResult {
    analysis: Record<string, string[]>;
    hasKali: boolean;
    kaliChars: string[];
}

export interface AnalysisResult {
    nameScore: number;
    surnameScore: number;
    totalScore: number;
    namePairs: PairAnalysis[];
    surnamePairs: PairAnalysis[];
    namePrediction: PredictionResult;
    surnamePrediction: PredictionResult;
    prediction: PredictionResult;
    thaksa: ThaksaAnalysisResult | null;
    ayatana: AyatanaResult;
}
