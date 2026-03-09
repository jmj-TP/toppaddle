"""
Restores the complete and correct YAML frontmatter for all 14 blog posts.
The PowerShell script had accidentally stripped out 'title', 'excerpt', and 'thumbnail'
resulting in broken cards and empty titles on the frontend.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "content", "blog")

FRONTMATTERS = {
    "guide-to-table-tennis-rubbers": """---
title: "The Ultimate Guide to Table Tennis Rubbers: Spin, Speed, and Control"
excerpt: "Learn how table tennis rubbers affect spin, speed, and control, and find the perfect rubber setup for your paddle."
thumbnail: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80&fm=webp&auto=format"
author: "TopPaddle Team"
date: "2026-01-08"
relatedQuizLink: "/"
---""",

    "beginners-guide-choosing-racket": """---
title: "Beginner's Guide to Choosing the Perfect Table Tennis Racket"
excerpt: "A simple 2025 guide to choosing your first table tennis racket with the right balance of speed, control, and spin."
thumbnail: "https://images.unsplash.com/photo-1556817411-92969197da56?w=800&q=80&fm=webp&auto=format"
author: "TopPaddle Team"
date: "2026-01-12"
relatedQuizLink: "/"
---""",

    "how-to-glue-table-tennis-rubbers": """---
title: "How to Glue Table Tennis Rubbers on Your Racket"
excerpt: "Learn how to glue table tennis rubbers on your blade correctly and discover the best glues for consistent, professional results."
thumbnail: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&q=80&fm=webp&auto=format"
author: "TopPaddle Team"
date: "2026-01-16"
relatedQuizLink: "/"
---""",

    "guide-to-table-tennis-balls": """---
title: "The Complete Guide to Table Tennis Balls: What to Choose for Training and Competition"
excerpt: "Choosing the right table tennis ball matters more than most realize. Learn the difference between 3-star and training balls."
thumbnail: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80&fm=webp&auto=format"
author: "TopPaddle Team"
date: "2026-01-20"
relatedQuizLink: "/"
---""",

    "tenergy-05-vs-dignics-05": """---
title: "Butterfly Tenergy 05 vs Dignics 05: Which Rubber Should You Choose? (2026)"
excerpt: "Tenergy 05 and Dignics 05 are the two most discussed rubbers in table tennis. Here is a detailed stats comparison, key differences, and a clear verdict on which suits your game."
thumbnail: "https://images.unsplash.com/photo-1636734909254-ff5c43927e10?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-01-25"
relatedQuizLink: "/quiz"
---""",

    "viscaria-alc-vs-timo-boll-alc": """---
title: "Viscaria ALC vs Timo Boll ALC: Butterfly's Classic Blades Compared"
excerpt: "A detailed comparison of Butterfly's two most famous ALC blades. Find out which one fits your modern attacking style."
thumbnail: "https://images.unsplash.com/photo-1622599511051-16faea2506e4?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-01-28"
relatedQuizLink: "/quiz"
---""",

    "dynaryz-agr-vs-rasanter-r50": """---
title: "JOOLA Dynaryz AGR vs Andro Rasanter R50: Premium Tensor Review (2026)"
excerpt: "Comparing two of the best European tensor rubbers on the market. Which high-end German rubber delivers more power and spin?"
thumbnail: "https://plus.unsplash.com/premium_photo-1664303487310-a4d1933ba2de?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-02"
relatedQuizLink: "/quiz"
---""",

    "dhs-hurricane-3-neo-vs-tenergy-05": """---
title: "DHS Hurricane 3 Neo vs Butterfly Tenergy 05: East vs West"
excerpt: "The classic debate: tacky Chinese rubber vs bouncy European tensor. We break down the differences and who should use which."
thumbnail: "https://images.unsplash.com/photo-1599813217277-c9de29dc62a2?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-05"
relatedQuizLink: "/quiz"
---""",

    "timo-boll-alc-vs-timo-boll-zlc": """---
title: "Timo Boll ALC vs ZLC: Is the Zylon Core Worth the Premium?"
excerpt: "We compare the classic ALC against its more expensive ZLC sibling to see which one offers the best performance and value."
thumbnail: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-08"
relatedQuizLink: "/quiz"
---""",

    "timo-boll-alc-tenergy-vs-budget-setup": """---
title: "Pro Setup vs Budget Alternative: Does a $300 Racket Make You Better?"
excerpt: "We compare the famous Timo Boll ALC + Tenergy setup against a highly capable budget alternative that costs almost half the price."
thumbnail: "https://images.unsplash.com/photo-1534158914592-062992fbe900?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-12"
relatedQuizLink: "/configurator"
---""",

    "best-table-tennis-setup-under-200": """---
title: "The Best Custom Table Tennis Setup Under $200 (2026 Guide)"
excerpt: "Looking for a high-quality custom racket without breaking the bank? Here is the absolute best combination of blade and rubber under $200."
thumbnail: "https://images.unsplash.com/photo-1556817411-92969197da56?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-15"
relatedQuizLink: "/configurator"
---""",

    "viscaria-dignics-vs-timo-boll-alc-tenergy-full-setup": """---
title: "Viscaria ALC + Dignics 05 vs Timo Boll ALC + Tenergy 05: Premium Setup Comparison (2026)"
excerpt: "Two of the most discussed high-end Butterfly setups go head-to-head. Both use ALC carbon blades and premium rubbers. Full stats breakdown."
thumbnail: "https://images.unsplash.com/photo-1636734909254-ff5c43927e10?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-18"
relatedQuizLink: "/configurator"
---""",

    "chinese-rubber-setup-european-player-2025": """---
title: "Chinese Rubber Setup for European Players: DHS Power G7 vs Petr Korbel Build (2026)"
excerpt: "Want to try DHS Hurricane 3 Neo but unsure which blade to pair it with? We compare two popular Chinese-rubber setups for European players."
thumbnail: "https://images.unsplash.com/photo-1599813217277-c9de29dc62a2?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-21"
relatedQuizLink: "/configurator"
---""",

    "joola-full-setup-vs-andro-full-setup-2025": """---
title: "JOOLA Full Table Tennis Setup vs Andro Full Setup: Brand Battle 2026"
excerpt: "Best JOOLA blade-and-rubber combination vs top Andro equivalent — full stats, real-world feel, honest analysis, and a clear verdict."
thumbnail: "https://plus.unsplash.com/premium_photo-1664303487310-a4d1933ba2de?fm=webp&q=75&w=800&auto=format&fit=crop"
author: "TopPaddle Team"
date: "2026-02-25"
relatedQuizLink: "/configurator"
---"""
}

for slug, new_fm in FRONTMATTERS.items():
    path = os.path.join(BLOG_DIR, f"{slug}.md")
    if not os.path.exists(path):
        continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    parts = content.split("---", 2)
    if len(parts) >= 3:
        body = parts[2].lstrip()
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_fm + "\n\n" + body)
        print(f"RESTORED: {slug}.md")

print("Done.")
