import re

with open('blades_output.ts', 'r', encoding='utf-8') as f:
    blades_str = f.read().strip()

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    products_str = f.read()

# Replace using string split
start_marker = "export const blades: Blade[] = ["
end_marker = "];"
start_idx = products_str.find(start_marker)
if start_idx != -1:
    end_idx = products_str.find(end_marker, start_idx)
    if end_idx != -1:
        end_idx += len(end_marker)
        new_products_str = products_str[:start_idx] + blades_str + products_str[end_idx:]
        
        with open('src/data/products.ts', 'w', encoding='utf-8') as f:
            f.write(new_products_str)
        print("Updated products.ts")
    else:
        print("End marker not found")
else:
    print("Start marker not found")
