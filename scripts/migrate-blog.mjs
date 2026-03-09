/**
 * One-time migration: reads posts from the hardcoded TypeScript data and
 * writes each one as a Markdown file under content/blog/<id>.md
 *
 * Run ONCE:  node scripts/migrate-blog.mjs
 *
 * After running, verify content/blog/ looks correct, then delete
 * src/data/blogPosts.ts and src/data/setupComparisons.ts.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "content", "blog");

// ─── PASTE THE EXPORTED POSTS HERE ──────────────────────────────────────────
// This is a plain-JS copy of blogPosts so the script has no TS dependency.
// Keep it in sync with src/data/blogPosts.ts until migration is complete.
const SNAPSHOT_FILE = path.join(ROOT, "scripts", "blog-snapshot.json");

if (!fs.existsSync(SNAPSHOT_FILE)) {
    console.error(
        "No snapshot found. Run `node scripts/export-blog-snapshot.mjs` first."
    );
    process.exit(1);
}

const posts = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, "utf8"));

fs.mkdirSync(OUT_DIR, { recursive: true });

let created = 0;
for (const post of posts) {
    const { id, content, ...frontmatter } = post;
    const slug = id;

    // Build YAML frontmatter
    const yaml = Object.entries(frontmatter)
        .map(([k, v]) => `${k}: ${JSON.stringify(String(v))}`)
        .join("\n");

    const md = `---\n${yaml}\n---\n\n${content}`;
    const dest = path.join(OUT_DIR, `${slug}.md`);

    if (fs.existsSync(dest)) {
        console.log(`SKIP (already exists): ${slug}.md`);
        continue;
    }

    fs.writeFileSync(dest, md, "utf8");
    console.log(`Created: ${slug}.md`);
    created++;
}

console.log(`\nDone — ${created} file(s) written to content/blog/`);
