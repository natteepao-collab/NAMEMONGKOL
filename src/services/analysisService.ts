import { supabase } from '@/utils/supabase';

export interface SaveAnalysisParams {
    name: string;
    surname: string;
    day: string;
    nameScore: number;
    surnameScore: number;
    totalScore: number;
}

export const saveAnalysisResult = async (params: SaveAnalysisParams) => {
    // Check for duplicates
    const { data: existing } = await supabase
        .from('analysis_results')
        .select('id')
        .eq('name', params.name)
        .eq('surname', params.surname)
        .maybeSingle();

    if (existing) {
        return { status: 'skipped', message: 'Analysis already exists' };
    }

    const { data, error } = await supabase
        .from('analysis_results')
        .insert([
            {
                name: params.name,
                surname: params.surname,
                day: params.day,
                name_score: params.nameScore,
                surname_score: params.surnameScore,
                total_score: params.totalScore
            }
        ])
        .select();

    if (error) {
        console.error('Error saving analysis:', error);
        throw error;
    }

    return { status: 'success', data };
};
