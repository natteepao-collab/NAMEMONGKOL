/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabaseServer';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const FILE_PATH = path.join(process.cwd(), 'src/data/premiumNamesRaw.ts');

function extractPremiumNamesBlock(fileContent: string): string {
    const match = fileContent.match(/export\s+const\s+premiumNamesRaw\s*=\s*`([\s\S]*?)`;/);
    if (!match) {
        throw new Error('Could not parse premiumNamesRaw.ts string block');
    }
    return match[1];
}

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) };
    }

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) };
    }

    return { user };
}

function readPremiumNames(): string[] {
    const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
    const lines = extractPremiumNamesBlock(fileContent)
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('//'));
    return [...new Set(lines)];
}

function writePremiumNames(names: string[]) {
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'th'));
    const content = `// IMPORTANT: This is a sample of the data. 
// Please replace the content inside the backticks with the full dataset provided in your request.
// Copy the lines starting from "กมลวัทน์..." to the end.

export const premiumNamesRaw = \`
${sorted.join('\n')}
\`;
`;
    fs.writeFileSync(FILE_PATH, content, 'utf-8');
}

export async function GET() {
    try {
        const auth = await requireAdmin();
        if ('error' in auth && auth.error) return auth.error;

        const names = readPremiumNames();
        return NextResponse.json({ success: true, count: names.length, names });
    } catch (error: any) {
        console.error('Premium names GET error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAdmin();
        if ('error' in auth && auth.error) return auth.error;

        const body = await req.json();
        const { names } = body;

        if (!Array.isArray(names)) {
            return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
        }

        // Sanitize input
        const incoming = names
            .map((n: any) => (typeof n === 'string' ? n.trim() : ''))
            .filter((n: string) => n.length > 0);

        const uniqueIncoming = [...new Set(incoming)];
        const duplicatesInPayload = incoming.length - uniqueIncoming.length;

        // Read existing
        const existing = readPremiumNames();
        const existingSet = new Set(existing);

        // Find truly new names
        const newNames: string[] = [];
        let skippedDuplicate = 0;
        for (const name of uniqueIncoming) {
            if (existingSet.has(name)) {
                skippedDuplicate++;
            } else {
                newNames.push(name);
                existingSet.add(name);
            }
        }

        // Write merged result
        const merged = Array.from(existingSet);
        writePremiumNames(merged);

        console.log(`[Premium Names] POST received=${incoming.length} new=${newNames.length} skipped=${skippedDuplicate}`);

        return NextResponse.json({
            success: true,
            message: `Added ${newNames.length} new names`,
            stats: {
                received: incoming.length,
                uniqueInPayload: uniqueIncoming.length,
                inserted: newNames.length,
                skippedDuplicate,
                duplicatesInPayload,
                invalid: names.length - incoming.length,
                totalAfter: merged.length,
            },
        });
    } catch (error: any) {
        console.error('Premium names POST error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
