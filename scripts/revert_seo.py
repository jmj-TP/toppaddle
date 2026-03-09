"""
Reverts the SEO changes made by seo_rewrites.py:
  1. Removes injected CTA blocks
  2. Restores the original first paragraph of each post

Run from the project root: python scripts/revert_seo.py
"""
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "content", "blog")

# ── Original first paragraphs (before SEO intro rewrite) ──────────────────────
ORIGINALS = {
    # 4 original guide posts (paragraphs confirmed from file views)
    "guide-to-table-tennis-rubbers": (
        "<p>When players talk about upgrading their racket, they often focus on the blade. "
        "But the truth is, your rubbers influence your performance more than almost anything "
        "else. They define how much spin you can create, how fast the ball leaves your racket, "
        "and how much control you have during rallies.</p>"
    ),
    "beginners-guide-choosing-racket": (
        "<p>Choosing your first table tennis racket can feel confusing. There are hundreds of "
        "options, and every product claims to be the best. The truth is, as a beginner, your "
        "focus should be on developing good control and consistency, not on speed or power.</p>"
    ),
    "how-to-glue-table-tennis-rubbers": (
        "<p>Replacing your rubbers is one of the most satisfying parts of maintaining your "
        "table tennis racket. Whether you are upgrading to a faster setup or your old rubbers "
        "have lost their grip, learning how to glue them properly ensures you get the best "
        "performance and feel from your blade.</p>"
    ),
    "guide-to-table-tennis-balls": (
        "<p>Choosing the right table tennis ball may sound simple, but for players who want "
        "to improve their consistency, spin control, and match performance, the type of ball "
        "you use matters more than most realize. A well-selected ball can make your practice "
        "sessions smoother and your game feel more predictable.</p>"
    ),
    # 5 rubber/blade comparison posts
    "tenergy-05-vs-dignics-05": (
        "<p><strong>TL;DR:</strong> Dignics 05 is the successor to Tenergy 05. It produces "
        "higher spin at the top of the arc and rewards confident, complete strokes. Tenergy 05 "
        "is more forgiving, more consistent at lower swing speeds, and still one of the best "
        "all-round rubbers ever made. If you are already at an advanced level and play with "
        "heavy topspin, Dignics 05. If you want a rubber that works across the whole game "
        "without punishing mistakes, Tenergy 05.</p>"
    ),
    "viscaria-alc-vs-timo-boll-alc": (
        "<p><strong>TL;DR:</strong> The Viscaria ALC is faster and stiffer — better for "
        "all-out attacking players who generate power through arm speed. The Timo Boll ALC "
        "has more dwell and control — the more complete blade for all-round players. Both are "
        "outstanding; the choice comes down to your playing style, not quality.</p>"
    ),
    "dynaryz-agr-vs-rasanter-r50": (
        "<p><strong>TL;DR:</strong> Dynaryz AGR is faster and more direct — better for power "
        "players who want explosive output. Rasanter R50 produces a better arc and is slightly "
        "more forgiving — great for players who rely on spin consistency. At similar prices, "
        "Dynaryz AGR is the slightly safer first pick for most attacking players.</p>"
    ),
    "dhs-hurricane-3-neo-vs-tenergy-05": (
        "<p><strong>TL;DR:</strong> Hurricane 3 Neo delivers unmatched topspin potential and "
        "is the choice for Chinese-style close-table players. Tenergy 05 is faster, more "
        "consistent, and easier to use across all styles. If you are switching from European "
        "rubbers, Tenergy 05. If you want to develop a powerful topspin game, Hurricane 3 Neo.</p>"
    ),
    "timo-boll-alc-vs-timo-boll-zlc": (
        "<p><strong>TL;DR:</strong> For most players, the Timo Boll ALC is the right choice. "
        "It is well-priced, complete, and works for a wide range of styles. The Timo Boll ZLC "
        "is faster and stiffer — only worth the extra cost for players who have fully exhausted "
        "what the ALC can offer.</p>"
    ),
    # 5 setup comparison posts
    "timo-boll-alc-tenergy-vs-budget-setup": (
        "<p><strong>TL;DR:</strong> Setup A (Timo Boll ALC + Tenergy 05 + Tenergy 05 FX) is "
        "the best combination of performance and consistency at this price tier. Setup B "
        "(TB ALC + Dynaryz AGR + Rasanter R47) saves $64 and loses almost nothing in "
        "real-world match performance.</p>"
    ),
    "best-table-tennis-setup-under-200": (
        "<p><strong>TL;DR:</strong> Setup A (~$117) is the better value entry point for "
        "players who want maximum control at low cost. Setup B (~$178) is the stronger "
        "all-round option if you play with drive and topspin and want a premium-feeling blade.</p>"
    ),
    "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup": (
        "<p><strong>TL;DR:</strong> Setup A (Viscaria + Dignics 05 + T05 FX) is faster, "
        "spinnier, and less forgiving — built for players who attack from both wings with "
        "heavy topspin. Setup B (Timo Boll ALC + Tenergy 05 + T05 FX) is marginally more "
        "controllable and complete across all areas of the game. The price difference is "
        "minimal — this is purely a playing style decision.</p>"
    ),
    "chinese-rubber-setup-european-player-2025": (
        "<p><strong>TL;DR:</strong> Setup A (DHS Power G7 + Hurricane 3 Neo + Dynaryz AGR) "
        "is the more affordable entry point at ~$186. Setup B (Petr Korbel + Hurricane 3 Neo "
        "Provincial + Tenergy 05 FX) is the classic European-Chinese hybrid at ~$237 — a more "
        "forgiving blade with a proven European backhand option. Both are outstanding for "
        "spin-first, aggressive play.</p>"
    ),
    "joola-full-setup-vs-andro-full-setup-2025": (
        "<p><strong>TL;DR:</strong> The JOOLA setup is faster, pricier, and designed for pure "
        "power play. The Andro setup is better balanced, $100 cheaper, and extremely consistent. "
        "The JOOLA is for players who prioritise explosive speed. The Andro is for players who "
        "want spin, control, and consistency at a lower price point.</p>"
    ),
}

# The SEO intro paragraphs that were injected (to find and replace them)
SEO_INTROS = {
    "guide-to-table-tennis-rubbers": r"<p>Choosing the right rubber is harder than choosing a blade.*?five minutes\.</p>",
    "beginners-guide-choosing-racket": r"<p>Most beginner rackets sold in sports shops.*?for years\.</p>",
    "how-to-glue-table-tennis-rubbers": r"<p>A badly applied rubber creates air bubbles.*?to avoid\.</p>",
    "guide-to-table-tennis-balls": r"<p>Not all 40\+ poly balls.*?and budget\.</p>",
    "tenergy-05-vs-dignics-05": r"<p>Tenergy 05 and Dignics 05 look nearly identical.*?and style\.</p>",
    "viscaria-alc-vs-timo-boll-alc": r"<p>The Viscaria ALC and Timo Boll ALC are the two most debated.*?playing style\.</p>",
    "dynaryz-agr-vs-rasanter-r50": r"<p>The Dynaryz AGR and Rasanter R50 are both marketed.*?player type\.</p>",
    "dhs-hurricane-3-neo-vs-tenergy-05": r"<p>Hurricane 3 Neo and Tenergy 05 are the most iconic.*?level faster\.</p>",
    "timo-boll-alc-vs-timo-boll-zlc": r"<p>The Timo Boll ZLC costs \$93 more.*?the premium\.</p>",
    "timo-boll-alc-tenergy-vs-budget-setup": r"<p>The classic Timo Boll ALC \+ Tenergy 05 build.*?five minutes\.</p>",
    "best-table-tennis-setup-under-200": r"<p>Most players building their first custom.*?five minutes\.</p>",
    "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup": r"<p>Deciding between the Viscaria \+ Dignics 05.*?confidence\.</p>",
    "chinese-rubber-setup-european-player-2025": r"<p>European players switching to Chinese rubbers.*?playing style\.</p>",
    "joola-full-setup-vs-andro-full-setup-2025": r"<p>Most setup guides compare individual.*?and style\.</p>",
}

CTA_PATTERN = (
    r'\n<div class="my-8 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">'
    r'.*?</div>\n'
)

def revert_file(slug: str) -> None:
    path = os.path.join(BLOG_DIR, f"{slug}.md")
    if not os.path.exists(path):
        print(f"MISSING: {slug}.md")
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # Step 1: Remove CTA block
    content = re.sub(CTA_PATTERN, "\n", content, flags=re.DOTALL)

    # Step 2: Restore original first paragraph
    seo_pattern = SEO_INTROS.get(slug)
    original_para = ORIGINALS.get(slug)
    if seo_pattern and original_para:
        content = re.sub(seo_pattern, original_para, content, count=1, flags=re.DOTALL)

    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"REVERTED: {slug}.md")
    else:
        print(f"NO CHANGE: {slug}.md")

for slug in ORIGINALS:
    revert_file(slug)

print("\nDone.")
