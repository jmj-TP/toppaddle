const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { blades, rubbers, preAssembledRackets } = require('./tmp_products.cjs');

const PUBLIC_IMG_DIR = path.join(__dirname, 'public', 'images', 'products');

// Create directories if they don't exist
if (!fs.existsSync(PUBLIC_IMG_DIR)) {
    fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
}
['blades', 'rubbers', 'rackets'].forEach(type => {
    const dir = path.join(PUBLIC_IMG_DIR, type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function downloadImage(url, destPath) {
    if (!url || !url.startsWith('http')) return false;

    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, destPath).then(resolve);
            }
            if (response.statusCode !== 200) {
                console.warn(`Failed to download ${url}: HTTP ${response.statusCode}`);
                resolve(false);
                return;
            }

            const fileStream = fs.createWriteStream(destPath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve(true);
            });
        }).on('error', (err) => {
            console.error(`Error downloading ${url}:`, err.message);
            resolve(false);
        });
    });
}

function toCsv(items, fields) {
    const header = fields.map(f => `"${f}"`).join(',');
    const rows = items.map(item => {
        return fields.map(field => {
            let val = item[field];
            if (Array.isArray(val)) val = val.join(', ');
            if (val === undefined || val === null) val = '';
            val = String(val).replace(/"/g, '""'); // escape quotes
            return `"${val}"`;
        }).join(',');
    });
    return [header, ...rows].join('\n');
}

async function run() {
    console.log("Starting image downloads...");

    for (let i = 0; i < blades.length; i++) {
        const b = blades[i];
        if (b.Blade_Image && b.Blade_Image.startsWith('http')) {
            const ext = path.extname(new URL(b.Blade_Image).pathname) || '.jpg';
            const filename = slugify(b.Blade_Name) + ext;
            const localPath = `/images/products/blades/${filename}`;
            const dest = path.join(PUBLIC_IMG_DIR, 'blades', filename);

            const success = await downloadImage(b.Blade_Image, dest);
            if (success) {
                b.Blade_Image = localPath;
            }
        }
    }

    for (let i = 0; i < rubbers.length; i++) {
        const r = rubbers[i];
        if (r.Rubber_Image && r.Rubber_Image.startsWith('http')) {
            const ext = path.extname(new URL(r.Rubber_Image).pathname) || '.jpg';
            const filename = slugify(r.Rubber_Name) + ext;
            const localPath = `/images/products/rubbers/${filename}`;
            const dest = path.join(PUBLIC_IMG_DIR, 'rubbers', filename);

            const success = await downloadImage(r.Rubber_Image, dest);
            if (success) {
                r.Rubber_Image = localPath;
            }
        }
    }

    for (let i = 0; i < preAssembledRackets.length; i++) {
        const r = preAssembledRackets[i];
        if (r.Racket_Image && r.Racket_Image.startsWith('http')) {
            const ext = path.extname(new URL(r.Racket_Image).pathname) || '.jpg';
            const filename = slugify(r.Racket_Name) + ext;
            const localPath = `/images/products/rackets/${filename}`;
            const dest = path.join(PUBLIC_IMG_DIR, 'rackets', filename);

            const success = await downloadImage(r.Racket_Image, dest);
            if (success) {
                r.Racket_Image = localPath;
            }
        }
    }

    console.log("Images downloaded. Writing updated CSVs...");

    const bladeFields = ['Blade_Name', 'Blade_Speed', 'Blade_Spin', 'Blade_Control', 'Blade_Power', 'Blade_Level', 'Blade_Style', 'Blade_Price', 'Blade_Weight', 'Blade_Grip', 'Blade_Description', 'Blade_Image', 'Blade_Stiffness', 'Blade_Material', 'Blade_Brand'];
    fs.writeFileSync('blades.csv', toCsv(blades, bladeFields));

    const rubberFields = ['Rubber_Name', 'Rubber_Speed', 'Rubber_Spin', 'Rubber_Control', 'Rubber_Power', 'Rubber_Level', 'Rubber_Style', 'Rubber_Price', 'Rubber_Weight', 'Rubber_Sponge_Sizes', 'Rubber_Description', 'Rubber_Image', 'Rubber_Hardness', 'Rubber_ThrowAngle', 'Rubber_Surface', 'Rubber_Brand'];
    fs.writeFileSync('rubbers.csv', toCsv(rubbers, rubberFields));

    const racketFields = ['Racket_Name', 'Racket_Speed', 'Racket_Spin', 'Racket_Control', 'Racket_Power', 'Racket_Level', 'Racket_Price', 'Racket_Grip', 'Racket_Description', 'Racket_Image', 'Racket_Brand'];
    fs.writeFileSync('rackets.csv', toCsv(preAssembledRackets, racketFields));

    console.log("Done! CSVs updated with local paths.");
}

run();
