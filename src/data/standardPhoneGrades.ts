export type PhoneGrade = 'good' | 'bad' | 'neutral';

export const standardPhoneGrades: Record<string, PhoneGrade> = {
    // Row 0
    '00': 'bad', '01': 'bad', '02': 'bad', '03': 'bad', '04': 'bad', '05': 'bad', '06': 'bad', '07': 'bad', '08': 'bad', '09': 'bad',
    // Row 1
    '10': 'bad', '11': 'bad', '12': 'bad', '13': 'bad', '14': 'good', '15': 'good', '16': 'good', '17': 'bad', '18': 'bad', '19': 'good',
    // Row 2
    '20': 'bad', '21': 'bad', '22': 'good', '23': 'good', '24': 'good', '25': 'bad', '26': 'good', '27': 'bad', '28': 'good', '29': 'good',
    // Row 3
    '30': 'bad', '31': 'bad', '32': 'good', '33': 'neutral', '34': 'bad', '35': 'good', '36': 'good', '37': 'bad', '38': 'bad', '39': 'good',
    // Row 4
    '40': 'bad', '41': 'good', '42': 'good', '43': 'bad', '44': 'good', '45': 'good', '46': 'good', '47': 'neutral', '48': 'bad', '49': 'good',
    // Row 5
    '50': 'bad', '51': 'good', '52': 'bad', '53': 'good', '54': 'good', '55': 'good', '56': 'good', '57': 'bad', '58': 'bad', '59': 'good',
    // Row 6
    '60': 'bad', '61': 'good', '62': 'good', '63': 'good', '64': 'good', '65': 'good', '66': 'good', '67': 'bad', '68': 'bad', '69': 'good',
    // Row 7
    '70': 'bad', '71': 'bad', '72': 'bad', '73': 'bad', '74': 'neutral', '75': 'bad', '76': 'bad', '77': 'bad', '78': 'good', '79': 'good',
    // Row 8
    '80': 'bad', '81': 'bad', '82': 'good', '83': 'bad', '84': 'bad', '85': 'bad', '86': 'bad', '87': 'good', '88': 'bad', '89': 'good',
    // Row 9
    '90': 'bad', '91': 'good', '92': 'good', '93': 'good', '94': 'good', '95': 'good', '96': 'good', '97': 'good', '98': 'good', '99': 'good',
};

// Helper for UI Color Mapping
export const getGradeColorClass = (grade: PhoneGrade | string): string => {
    switch (grade) {
        case 'good': return 'bg-emerald-500 hover:bg-emerald-400 text-white';
        case 'bad': return 'bg-red-600 hover:bg-red-500 text-white';
        case 'neutral': return 'bg-amber-500 hover:bg-amber-400 text-white';
        default: return 'bg-slate-700 hover:bg-slate-600 text-slate-400';
    }
};
