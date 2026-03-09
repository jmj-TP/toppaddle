"""
Removes duplicated content caused by earlier PowerShell script corruption.
Truncates the file at the exact point where '.Groups[' begins.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "content", "blog")

for filename in os.listdir(BLOG_DIR):
    if not filename.endswith(".md"):
        continue

    filepath = os.path.join(BLOG_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # The PowerShell corruption pattern always starts with `.Groups[`
    if ".Groups[" in content:
        clean_content = content.split(".Groups[")[0]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(clean_content)
        print(f"CLEANED: {filename}")
    else:
        print(f"OK (No corruption): {filename}")

print("Done.")
