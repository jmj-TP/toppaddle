import re

with open("src/data/products.ts", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split('\n')
out = []
for line in lines:
    try:
        if "Rubber_Name:" in line and '"' in line:
            if "Rubber_Brand:" not in text:
                brand = line.split('"')[1].strip().split(" ")[0]
                line = line + f'\n    Rubber_Brand: "{brand}",'
        elif "Racket_Name:" in line and '"' in line:
            if "Racket_Brand:" not in text:
                brand = line.split('"')[1].strip().split(" ")[0]
                line = line + f'\n    Racket_Brand: "{brand}",'
        elif "Blade_Name:" in line and '"' in line:
            if "Blade_Brand:" not in text:
                brand = line.split('"')[1].strip().split(" ")[0]
                line = line + f'\n    Blade_Brand: "{brand}",'
    except Exception as e:
        pass
    out.append(line)

with open("src/data/products.ts", "w", encoding="utf-8") as f:
    f.write('\n'.join(out))
print("Brands added to Products")
