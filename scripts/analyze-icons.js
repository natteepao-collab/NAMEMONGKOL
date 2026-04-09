const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const iconDir = path.join(__dirname, '../public/icon');
const icons = fs.readdirSync(iconDir).filter(f => f.endsWith('.png') && f !== 'web-app-manifest-192x192.png');

async function analyzeIcon(filename) {
    const filepath = path.join(iconDir, filename);
    const { data, info } = await sharp(filepath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    let minX = width, maxX = 0, minY = height, maxY = 0;
    let hasContent = false;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * channels;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // Skip fully/mostly transparent pixels
            if (a < 25) continue;
            // Skip near-white pixels with high opacity (background)
            if (r > 245 && g > 245 && b > 245 && a > 200) continue;

            hasContent = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }

    if (!hasContent) return { filename, fillRatio: 0 };

    const contentW = maxX - minX + 1;
    const contentH = maxY - minY + 1;
    const maxDim = Math.max(contentW, contentH);
    const fillRatio = maxDim / Math.min(width, height);

    return { filename, width, height, contentW, contentH, fillRatio: +fillRatio.toFixed(3) };
}

async function main() {
    const results = [];
    for (const icon of icons) {
        const r = await analyzeIcon(icon);
        results.push(r);
        process.stdout.write('.');
    }
    console.log('\n');

    results.sort((a, b) => b.fillRatio - a.fillRatio);

    // Target fill ratio: ~0.75 (visually neutral with a little breathing room)
    const TARGET = 0.75;

    console.log('=== Icon Bounding Box Analysis ===\n');
    for (const r of results) {
        const name = r.filename.replace('.png', '');
        const fill = r.fillRatio;
        let action = '';

        if (fill > 0.92) {
            action = `iconPadding: 'p-2.5'`;
        } else if (fill > 0.85) {
            action = `iconPadding: 'p-2'`;
        } else if (fill > 0.78) {
            action = `iconPadding: 'p-1'`;
        } else if (fill >= TARGET) {
            action = `(no action needed)`;
        } else if (fill > 0.62) {
            const scale = Math.min((TARGET / fill), 1.18).toFixed(2);
            action = `iconScale: ${scale}`;
        } else {
            const scale = Math.min((TARGET / fill), 1.4).toFixed(2);
            action = `iconScale: ${scale}`;
        }

        console.log(`[${fill.toFixed(3)}] ${name.padEnd(25)} -> ${action}`);
    }
}

main().catch(console.error);
