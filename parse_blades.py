import csv
import json

def map_mat(comp):
    if "(Outer)" in comp or "Titanium" in comp or "Carbon/Carbon" in comp: return "Outer-Carbon"
    if "(Inner)" in comp or "Mono-Core" in comp or "Balsa Core" in comp or "CCF Inner" in comp: return "Inner-Carbon"
    return "All-Wood"

out = "export const blades: Blade[] = [\n"
with open("blades_data.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        speed = int(row['Speed (1-100)'])
        control = int(row['Control (1-100)'])
        stiff = int(row['Stiffness (1-100)'])
        power = speed
        spin = min(99, int(round(control * 1.05 + (speed * 0.1))))
        level = "Advanced" if speed > 85 else ("Intermediate" if speed > 75 else "Beginner")
        style = '"Offensive"' if speed > 85 else ('"Allround"' if speed < 75 else '"All-Round"')
        price = 150 if speed > 90 else 80
        mat = map_mat(row['Composition (Veneers)'])
        brand = row['Blade Name'].split(" ")[0]
        
        out += f"""  {{
    Blade_Name: {json.dumps(row['Blade Name'])},
    Blade_Brand: "{brand}",
    Blade_Speed: {speed},
    Blade_Spin: {spin},
    Blade_Control: {control},
    Blade_Power: {power},
    Blade_Grip: ["FL", "ST"],
    Blade_Price: {price},
    Blade_Level: "{level}",
    Blade_Style: {style},
    Blade_Weight: 85,
    Blade_Stiffness: {stiff},
    Blade_Material: "{mat}",
    Blade_Description: {json.dumps(row['Specialist SEO Description'])},
  }},
"""
out += "];\n"

with open('blades_output.ts', 'w', encoding='utf-8') as f:
    f.write(out)
print(f"Generated blades_output.ts")
