"""
Injects the new 3-sentence intro (Problem > Quick Answer > Roadmap) into the
first <p> block of every blog post, and appends a CTA block before the verdict.
Run from the project root: python scripts/seo_rewrites.py
"""
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "content", "blog")

# CTA block inserted before the final <h2>Verdict</h2> in every post
CTA = (
    '\n<div class="my-8 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">'
    '\n  <p class="font-body text-sm text-muted-foreground mb-3">'
    'Not sure which setup suits your style?</p>'
    '\n  <div class="flex flex-col sm:flex-row gap-3 justify-center">'
    '\n    <a href="/quiz" class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">'
    'Take the Racket Quiz →</a>'
    '\n    <a href="/configurator" class="inline-flex items-center justify-center rounded-md border border-primary px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/10">'
    'Build a Custom Setup →</a>'
    '\n  </div>'
    '\n</div>\n'
)

# New first-paragraph intros: Problem sentence. **Quick Answer.** Roadmap sentence.
INTROS = {
    "guide-to-table-tennis-rubbers": (
        "<p>Choosing the right rubber is harder than choosing a blade — most players "
        "upgrade their wood before they even understand what the rubber is doing for their game. "
        "<strong>The rubber defines your spin ceiling, ball speed, and how much physical effort "
        "you need on every shot — it matters more than any other single piece of equipment.</strong> "
        "In this guide we explain every rubber type, sponge thickness, and give you a clear "
        "shortlist based on your level in under five minutes.</p>"
    ),
    "beginners-guide-choosing-racket": (
        "<p>Most beginner rackets sold in sports shops are built to hit a price point, "
        "not to help you actually develop as a player. "
        "<strong>The right first racket is an all-round blade paired with medium rubbers around "
        "1.8&nbsp;mm sponge — not a pre-assembled 'starter' pack from the shelf.</strong> "
        "Here is everything you need to choose your first real table tennis racket and avoid "
        "the mistakes that hold most beginners back for years.</p>"
    ),
    "how-to-glue-table-tennis-rubbers": (
        "<p>A badly applied rubber creates air bubbles, peels early, and costs you spin "
        "consistency at the worst moments in a match. "
        "<strong>The correct method is two thin coats of water-based glue on each surface, "
        "left for three minutes until tacky, then aligned and rolled down firmly with "
        "zero stretching.</strong> "
        "Follow the steps below to get a tournament-quality glue job every time, including "
        "the most common mistakes to avoid.</p>"
    ),
    "guide-to-table-tennis-balls": (
        "<p>Not all 40+ poly balls play the same, and practicing with a low-quality ball can "
        "slow your development by giving you inconsistent feedback on spin and bounce. "
        "<strong>For training, a seamless 3-star poly ball from Nittaku, Butterfly, or DHS is "
        "the single best investment you can make after your racket.</strong> "
        "This guide breaks down what separates a quality ball from a cheap one, which brands "
        "to buy, and which ball matches your level and budget.</p>"
    ),
    "tenergy-05-vs-dignics-05": (
        "<p>Tenergy 05 and Dignics 05 look nearly identical on a spec sheet — the difference "
        "that actually matters only shows up in match play at high swing speeds. "
        "<strong>Tenergy 05 is the safer, more consistent choice for all-round attacking players; "
        "Dignics 05 is strictly for players whose technique fully activates a hard sponge "
        "at every shot.</strong> "
        "Below we compare every stat, explain the feel difference stroke by stroke, and tell "
        "you exactly which rubber suits your level and style.</p>"
    ),
    "viscaria-alc-vs-timo-boll-alc": (
        "<p>The Viscaria ALC and Timo Boll ALC are the two most debated blades in the Butterfly "
        "lineup, yet most reviews describe the difference in vague terms that do not help you "
        "make a decision. "
        "<strong>The Viscaria is faster and stiffer — the blade for players who attack from all "
        "distances with committed strokes; the Timo Boll ALC has more dwell and control, making "
        "it the smarter all-round choice for the vast majority of advanced players.</strong> "
        "This guide breaks down every spec difference, the real feel on forehand and backhand, "
        "and gives you a clear verdict based on your playing style.</p>"
    ),
    "dynaryz-agr-vs-rasanter-r50": (
        "<p>The Dynaryz AGR and Rasanter R50 are both marketed as premium tensor rubbers, "
        "but they play very differently — choosing the wrong one means spending $70 on a rubber "
        "that fights against your style. "
        "<strong>Dynaryz AGR is faster and more direct; Rasanter R50 has better arc and forgiveness "
        "on off-centre hits — if you are not sure which suits you, Dynaryz AGR is the safer "
        "first choice.</strong> "
        "Below you will find a full stat comparison, key feel differences, and an honest verdict "
        "for every player type.</p>"
    ),
    "dhs-hurricane-3-neo-vs-tenergy-05": (
        "<p>Hurricane 3 Neo and Tenergy 05 are the most iconic rubbers from opposite ends of the "
        "table tennis world, and comparing them directly exposes a fundamental difference in "
        "playing philosophy, not just specs. "
        "<strong>Hurricane 3 Neo rewards spin-first, close-table play with the highest topspin "
        "potential available; Tenergy 05 is the more complete, forgiving package for players who "
        "want speed, spin, and consistency from a single rubber.</strong> "
        "This guide compares every measurable stat, breaks down the style match, and tells you "
        "which rubber will raise your level faster.</p>"
    ),
    "timo-boll-alc-vs-timo-boll-zlc": (
        "<p>The Timo Boll ZLC costs $93 more than the ALC — and most players asking about the "
        "upgrade cannot tell the difference between the two in a real match. "
        "<strong>For 99% of club and tournament players, the Timo Boll ALC is the correct buy; "
        "the ZLC's additional stiffness and speed only benefits players whose technique is "
        "already maxing out the ALC's ceiling.</strong> "
        "Here is the full stat comparison, an honest feel analysis, and a clear breakdown of "
        "who genuinely benefits from paying the premium.</p>"
    ),
    "timo-boll-alc-tenergy-vs-budget-setup": (
        "<p>The classic Timo Boll ALC + Tenergy 05 build costs $394 — and players are "
        "increasingly questioning whether a $330 alternative actually produces a meaningfully "
        "different result on the table. "
        "<strong>The budget build with Dynaryz AGR and Rasanter R47 on the same blade saves "
        "$64 and delivers roughly 95% of the Tenergy 05 experience for players below "
        "national competition level.</strong> "
        "This guide compares both setups component-by-component so you can make the call "
        "in under five minutes.</p>"
    ),
    "best-table-tennis-setup-under-200": (
        "<p>Most players building their first custom setup under $200 do not know whether to "
        "prioritise control for development or speed for attacking play — and most guides do "
        "not answer this directly. "
        "<strong>The Andro Timber 5 ALL + Rasanter R42 build is the best all-round choice "
        "under $200; if you already have solid forehand loop technique, the DHS Power G5X + "
        "Hurricane build is the better offensive option.</strong> "
        "Below we compare both setups on every stat so you can pick the right build for "
        "your level in under five minutes.</p>"
    ),
    "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup": (
        "<p>Deciding between the Viscaria + Dignics 05 and the Timo Boll ALC + Tenergy 05 "
        "is one of the hardest calls at the premium Butterfly tier — they cost almost the same "
        "but reward completely different playing styles. "
        "<strong>The Viscaria + Dignics 05 setup is strictly for players who loop with full "
        "technique from every position; the TB ALC + Tenergy 05 setup is the more complete, "
        "consistent choice for everyone else.</strong> "
        "This guide compares every component stat and explains the real-world feel difference "
        "so you can decide with confidence.</p>"
    ),
    "chinese-rubber-setup-european-player-2025": (
        "<p>European players switching to Chinese rubbers like Hurricane 3 Neo often choose the "
        "wrong blade to pair it with — ending up with a setup that fights against their "
        "existing game rather than improving it. "
        "<strong>Pair Hurricane 3 Neo with the Petr Korbel for a forgiving European-Chinese "
        "hybrid, or the DHS Power G7 for a faster, full-value Chinese-style build under "
        "$200.</strong> "
        "Below we compare both setups in full, explain the Hurricane 3 Neo learning curve "
        "honestly, and give you a clear verdict for your playing style.</p>"
    ),
    "joola-full-setup-vs-andro-full-setup-2025": (
        "<p>Most setup guides compare individual rubbers or blades — few directly compare a "
        "complete JOOLA build against a full Andro build at the same level, even though both "
        "brands offer premium choices at very different price points. "
        "<strong>The Andro Treiber CI + Rasanter build saves $100 and loses almost no real-world "
        "performance; the JOOLA Vyzaryz + Dynaryz build is for players who specifically want "
        "the highest possible speed ceiling.</strong> "
        "This guide compares both setups component-by-component so you can decide in five "
        "minutes which brand best matches your budget and style.</p>"
    ),
}

def process_file(slug: str, new_intro: str) -> None:
    path = os.path.join(BLOG_DIR, f"{slug}.md")
    if not os.path.exists(path):
        print(f"MISSING: {slug}.md")
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace the first <p>...</p> block with the new intro
    updated = re.sub(r"<p>.*?</p>", new_intro, content, count=1, flags=re.DOTALL)

    # 2. Insert CTA block before the last <h2>Verdict</h2> section (if present)
    verdict_pattern = r"(<h2>Verdict</h2>)"
    if re.search(verdict_pattern, updated):
        updated = re.sub(verdict_pattern, CTA + r"\1", updated, count=1)

    if updated != content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"UPDATED: {slug}.md")
    else:
        print(f"NO CHANGE: {slug}.md")

for slug, intro in INTROS.items():
    process_file(slug, intro)

print("\nDone.")
