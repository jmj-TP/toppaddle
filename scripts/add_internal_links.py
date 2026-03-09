"""
Adds internal links between blog posts.
For the first occurrence of each term (not already inside an <a> tag,
not in the current post), wraps it with a link to the relevant post.

Run from project root: python scripts/add_internal_links.py
"""
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "content", "blog")

# ── Link map: each entry defines a term, its target post slug, and which
#    posts to skip (self and closely related posts that already cover the topic).
LINKS = [
    {
        "term": "Tenergy 05",
        "slug": "tenergy-05-vs-dignics-05",
        "skip": {"tenergy-05-vs-dignics-05",
                 "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup",
                 "timo-boll-alc-tenergy-vs-budget-setup"},
    },
    {
        "term": "Dignics 05",
        "slug": "tenergy-05-vs-dignics-05",
        "skip": {"tenergy-05-vs-dignics-05",
                 "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup"},
    },
    {
        "term": "Viscaria ALC",
        "slug": "viscaria-alc-vs-timo-boll-alc",
        "skip": {"viscaria-alc-vs-timo-boll-alc",
                 "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup"},
    },
    {
        "term": "Timo Boll ALC",
        "slug": "timo-boll-alc-vs-timo-boll-zlc",
        "skip": {"timo-boll-alc-vs-timo-boll-zlc",
                 "viscaria-alc-vs-timo-boll-alc",
                 "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup",
                 "timo-boll-alc-tenergy-vs-budget-setup"},
    },
    {
        "term": "Timo Boll ZLC",
        "slug": "timo-boll-alc-vs-timo-boll-zlc",
        "skip": {"timo-boll-alc-vs-timo-boll-zlc"},
    },
    {
        "term": "Dynaryz AGR",
        "slug": "dynaryz-agr-vs-rasanter-r50",
        "skip": {"dynaryz-agr-vs-rasanter-r50",
                 "timo-boll-alc-tenergy-vs-budget-setup"},
    },
    {
        "term": "Rasanter R50",
        "slug": "dynaryz-agr-vs-rasanter-r50",
        "skip": {"dynaryz-agr-vs-rasanter-r50"},
    },
    {
        "term": "Rasanter R47",
        "slug": "dynaryz-agr-vs-rasanter-r50",
        "skip": {"dynaryz-agr-vs-rasanter-r50",
                 "timo-boll-alc-tenergy-vs-budget-setup"},
    },
    {
        "term": "Hurricane 3 Neo",
        "slug": "dhs-hurricane-3-neo-vs-tenergy-05",
        "skip": {"dhs-hurricane-3-neo-vs-tenergy-05",
                 "chinese-rubber-setup-european-player-2025"},
    },
    {
        "term": "Petr Korbel",
        "slug": "chinese-rubber-setup-european-player-2025",
        "skip": {"chinese-rubber-setup-european-player-2025"},
    },
    {
        "term": "Power G7",
        "slug": "chinese-rubber-setup-european-player-2025",
        "skip": {"chinese-rubber-setup-european-player-2025"},
    },
    {
        "term": "Rasanter R42",
        "slug": "dynaryz-agr-vs-rasanter-r50",
        "skip": {"dynaryz-agr-vs-rasanter-r50"},
    },
]


def already_linked(content: str, slug: str) -> bool:
    """Check if the target post is already linked in this file."""
    return f'/blog/{slug}' in content


def safe_replace_first(content: str, term: str, slug: str) -> str:
    """
    Replace the first occurrence of `term` in `content` with a blog link,
    but ONLY if it is not already inside an <a ...> tag.
    """
    link = f'<a href="/blog/{slug}">{term}</a>'
    pattern = re.compile(re.escape(term))

    # Split content into segments: inside <a>...</a> tags vs. outside
    # We only want to replace in segments OUTSIDE existing anchor tags
    result = []
    last_end = 0
    replaced = False

    # Find all <a ...>...</a> spans to protect them
    anchor_spans = [(m.start(), m.end()) for m in re.finditer(r'<a\b[^>]*>.*?</a>', content, re.DOTALL)]

    for m in pattern.finditer(content):
        start, end = m.start(), m.end()
        # Check if this match overlaps with any anchor tag
        in_anchor = any(a_start <= start and end <= a_end for a_start, a_end in anchor_spans)
        if not in_anchor and not replaced:
            result.append(content[last_end:start])
            result.append(link)
            last_end = end
            replaced = True

    result.append(content[last_end:])
    return "".join(result) if replaced else content


def process_file(slug: str, applicable_links: list) -> None:
    path = os.path.join(BLOG_DIR, f"{slug}.md")
    if not os.path.exists(path):
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split into frontmatter and body to avoid linking inside YAML
    parts = content.split("---", 2)
    if len(parts) < 3:
        return
    frontmatter = "---" + parts[1] + "---"
    body = parts[2]

    original_body = body
    links_added = []

    for link in applicable_links:
        if slug == link["slug"]:
            continue  # skip — this post IS the target
        if slug in link["skip"]:
            continue  # skip — this post is in the exclusion list

        # Only link each target post once per file (avoid over-linking)
        if already_linked(body, link["slug"]):
            continue

        new_body = safe_replace_first(body, link["term"], link["slug"])
        if new_body != body:
            body = new_body
            links_added.append(f'{link["term"]} → /blog/{link["slug"]}')

    if body != original_body:
        with open(path, "w", encoding="utf-8") as f:
            f.write(frontmatter + body)
        print(f"\nLINKED: {slug}.md")
        for l in links_added:
            print(f"  + {l}")
    else:
        print(f"NO CHANGE: {slug}.md")


# Process each blog file
for md_file in sorted(os.listdir(BLOG_DIR)):
    if not md_file.endswith(".md"):
        continue
    slug = md_file[:-3]
    applicable = [l for l in LINKS if slug not in l["skip"]]
    process_file(slug, applicable)

print("\nDone.")
