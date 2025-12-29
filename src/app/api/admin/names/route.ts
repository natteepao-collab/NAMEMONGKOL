import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auspiciousNames } from '@/data/auspiciousNames';

// Target file path
const TARGET_FILE = path.join(process.cwd(), 'src/data/auspiciousNames.ts');

export async function GET() {
    try {
        // Return current list (using imported data for speed/caching, or read file if needed)
        // Reading file ensures we get latest disk state if hot reload is slow
        return NextResponse.json({
            success: true,
            count: auspiciousNames.length,
            names: auspiciousNames
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to read names' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { names } = body;

        if (!Array.isArray(names)) {
            return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
        }

        // De-duplicate immediately
        const uniqueNames = [...new Set(names)].sort((a: any, b: any) => a.localeCompare(b, 'th'));

        // Generate file content
        const fileContent = `export const auspiciousNames = [
    ${uniqueNames.map((name: string) => `"${name}"`).join(', ')}
];
`;

        // Write to file
        fs.writeFileSync(TARGET_FILE, fileContent, 'utf8');

        return NextResponse.json({
            success: true,
            message: 'Saved successfully',
            count: uniqueNames.length,
            names: uniqueNames
        });

    } catch (error: any) {
        console.error('Save error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
