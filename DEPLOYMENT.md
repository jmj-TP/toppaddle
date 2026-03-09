# TopPaddle — Deployment Guide

## Live site: Vercel (free tier)

### First-time setup (do once)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the GitHub repo
3. Vercel auto-detects Next.js — no settings needed (vercel.json already contains the config)
4. Click **Deploy** — your site is live in ~2 minutes

> The GitHub Actions workflow in `.github/workflows/deploy.yml` handles automatic redeploys. After the first Vercel deploy, copy the three secrets shown below.

### GitHub Secrets (Settings → Secrets → Actions)

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` (after linking with `npx vercel link`) |
| `VERCEL_PROJECT_ID` | same file |

---

## Managing blog posts (no code required)

Blog posts live as Markdown files in **`content/blog/`**. Each file is one post.

### Add a new post

1. Go to the repo on GitHub
2. Navigate to `content/blog/`
3. Click **Add file → Create new file**
4. Name it `your-post-slug.md` (slug = URL — keep it lowercase with hyphens)
5. Paste this template and fill in your content:

```markdown
---
title: "Your Post Title Here"
excerpt: "One sentence description for search results and the blog listing page."
thumbnail: "https://images.unsplash.com/photo-XXXXXXXX?w=800&q=80"
author: "TopPaddle Team"
date: "2025-04-01"
relatedQuizLink: "/quiz"
---

Your post body here. You can use HTML or Markdown.

## Section Heading

<table>
  <thead><tr><th>Col A</th><th>Col B</th></tr></thead>
  <tbody>
    <tr><td>Value</td><td>Value</td></tr>
  </tbody>
</table>
```

6. Click **Commit changes** → Vercel redeploys automatically in ~2 minutes
7. Your post is live at `yourdomain.com/blog/your-post-slug`

### Edit a post

1. Open the `.md` file in GitHub
2. Click the **pencil icon** (Edit)
3. Make changes → Commit → redeploy happens automatically

### Delete a post

1. Open the `.md` file in GitHub
2. Click **...** → **Delete file** → Commit → redeploy

---

## Local development

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
```

## Production build (test before deploying)

```bash
npm run build
```

---

## Environment variables

Set these in Vercel → Project Settings → Environment Variables:

```
GOOGLE_SHEETS_SPREADSHEET_ID=...
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
OPENAI_API_KEY=...        # if used
```
