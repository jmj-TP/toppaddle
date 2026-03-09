/**
 * File-based blog utilities
 *
 * Blog posts live as Markdown files in  /content/blog/<slug>.md
 * Each file has YAML frontmatter (title, excerpt, thumbnail, author, date,
 * relatedQuizLink) followed by the post body (HTML or Markdown).
 *
 * To ADD a post  → create a new .md file, push to GitHub, Vercel redeploys.
 * To DELETE      → remove the .md file, push to GitHub.
 * To EDIT        → edit the .md file directly on GitHub (or locally), push.
 *
 * SEO impact: ZERO. Next.js still generates every post as static HTML via
 * generateStaticParams(). Google only ever sees prerendered HTML pages.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    author: string;
    date: string;
    content: string;
    relatedQuizLink?: string;
}

/** Return all posts sorted newest-first. */
export function getAllPosts(): BlogPost[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    const files = fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".md"));

    const posts: BlogPost[] = files.map((filename) => {
        const id = filename.replace(/\.md$/, "");
        const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
        const { data, content } = matter(raw);

        return {
            id,
            title: data.title ?? "",
            excerpt: data.excerpt ?? "",
            thumbnail: data.thumbnail ?? "",
            author: data.author ?? "TopPaddle Team",
            date: data.date ?? "",
            content: marked(content) as string,
            relatedQuizLink: data.relatedQuizLink,
        };
    });

    return posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/** Return a single post by its slug (filename without .md). */
export function getPostById(id: string): BlogPost | undefined {
    const filepath = path.join(BLOG_DIR, `${id}.md`);
    if (!fs.existsSync(filepath)) return undefined;

    const raw = fs.readFileSync(filepath, "utf8");
    const { data, content } = matter(raw);

    return {
        id,
        title: data.title ?? "",
        excerpt: data.excerpt ?? "",
        thumbnail: data.thumbnail ?? "",
        author: data.author ?? "TopPaddle Team",
        date: data.date ?? "",
        content: marked(content) as string,
        relatedQuizLink: data.relatedQuizLink,
    };
}

/** Return every post slug for generateStaticParams(). */
export function getAllPostIds(): string[] {
    if (!fs.existsSync(BLOG_DIR)) return [];
    return fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""));
}

export interface TocItem {
    id: string;
    text: string;
}

/**
 * Extract h2 headings from rendered HTML.
 * Returns the HTML with id attributes injected into each <h2> tag,
 * plus an ordered list of TOC items for rendering the sidebar/nav.
 */
export function extractToc(html: string): { modifiedHtml: string; toc: TocItem[] } {
    const toc: TocItem[] = [];
    const modifiedHtml = html.replace(/<h2>([^<]+)<\/h2>/g, (_match, text: string) => {
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .trim()
            .replace(/\s+/g, "-");
        toc.push({ id, text });
        return `<h2 id="${id}">${text}</h2>`;
    });
    return { modifiedHtml, toc };
}
