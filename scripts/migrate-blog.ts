/**
 * Run once to generate /content/blog/*.md from the hardcoded TypeScript data.
 * Usage:  npx tsx scripts/migrate-blog.ts
 */
import { blogPosts } from "../src/data/blogPosts.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "content", "blog");
fs.mkdirSync(outDir, { recursive: true });

let created = 0;
for (const post of blogPosts) {
    const { id, content, ...meta } = post;
    const yaml = Object.entries(meta)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}: ${JSON.stringify(String(v))}`)
        .join("\n");

    const filepath = path.join(outDir, `${id}.md`);
    if (fs.existsSync(filepath)) {
        console.log(`SKIP ${id}.md (already exists)`);
        continue;
    }
    fs.writeFileSync(filepath, `---\n${yaml}\n---\n\n${content}`, "utf8");
    console.log(`✓  ${id}.md`);
    created++;
}
console.log(`\n${created} file(s) created in content/blog/`);
