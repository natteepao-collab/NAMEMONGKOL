import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function collectImagePaths(directoryPath: string, relativePath = ''): Promise<string[]> {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const images: string[] = [];

    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;

        const absoluteEntryPath = path.join(directoryPath, entry.name);
        const relativeEntryPath = relativePath ? path.join(relativePath, entry.name) : entry.name;

        if (entry.isDirectory()) {
            const nestedImages = await collectImagePaths(absoluteEntryPath, relativeEntryPath);
            images.push(...nestedImages);
            continue;
        }

        const extension = path.extname(entry.name).toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) continue;

        images.push(`/images/articles/${relativeEntryPath.replaceAll('\\', '/')}`);
    }

    return images;
}

export async function GET() {
    try {
        const imagesRootDirectory = path.join(process.cwd(), 'public', 'images', 'articles');

        try {
            await fs.access(imagesRootDirectory);
        } catch {
            return NextResponse.json({ success: true, images: [] as string[] });
        }

        const images = await collectImagePaths(imagesRootDirectory);
        images.sort((a, b) => a.localeCompare(b));

        return NextResponse.json({ success: true, images });
    } catch (error) {
        console.error('Failed to list article images:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to list images' },
            { status: 500 }
        );
    }
}
