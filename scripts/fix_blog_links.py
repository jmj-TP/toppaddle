import os
import glob

replacements = {
    "/products?search=Butterfly+Viscaria": "/product/blade/butterfly-viscaria",
    "/products?search=Butterfly+Dignics+05": "/product/rubber/butterfly-dignics-05",
    "/products?search=DHS+Hurricane+Long+5": "/product/blade/dhs-hurricane-long-5",
    "/products?search=DHS+Hurricane+3+Neo": "/product/rubber/dhs-hurricane-3-neo",
    "/products?search=Nittaku+Fastarc+G-1": "/product/rubber/nittaku-fastarc-g-1",
    "/products?search=Stiga+Cybershape+Carbon": "/product/blade/stiga-cybershape-carbon",
    "/products?search=Stiga+DNA+Platinum+XH": "/product/rubber/stiga-dna-platinum-xh",
    "/products?search=Butterfly+Timo+Boll+ALC": "/product/blade/butterfly-timo-boll-alc",
    "/products?search=Butterfly+Tenergy+05": "/product/rubber/butterfly-tenergy-05"
}

for filepath in glob.glob("content/blog/*.md"):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = False
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed product links in {filepath}")
