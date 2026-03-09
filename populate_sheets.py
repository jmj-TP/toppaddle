"""
populate_sheets.py
------------------
Populates both Google Sheets with all product data from products.ts.

Run with:  python populate_sheets.py

On first run it will open your browser to authorize access to your Google Sheets.
The token is then saved locally so future runs don't need re-authorization.
"""

import os
import json
import pickle

# --- Sheet IDs ---
PRODUCTS_SHEET_ID = "1pUViKlKj0p1ZYMD9T_mM_FhOSf9LOR0HlW_LNTQan1I"
REVIEWS_SHEET_ID  = "1jtUyZ8_fyqj3j5MBmpYnr9yilDuDKzR-VV7NPG8XD0g"

# ─────────────────────────────────────────────────────────────────
BLADES = [
    ["Name","Speed","Spin","Control","Power","Level","Style","Price","Weight_g","Grips","Description","Image_URL"],
    ["Butterfly Primorac",68,74,86,62,"Intermediate","Allround",84.53,88,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Primorac Carbon",80,75,74,78,"Intermediate","Offensive",125.58,88,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Petr Korbel",76,76,84,70,"Intermediate","Allround",74.87,91,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Viscaria ALC",88,82,72,85,"Advanced","Offensive",200.45,87,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Timo Boll ALC",86,78,74,84,"Advanced","Offensive",200.45,86,"FL,ST,AN","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Timo Boll ZLC",90,80,70,88,"Advanced","Offensive",293.42,84,"FL,ST,AN","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly TB5 Alpha",78,75,76,74,"Intermediate","Allround",70.04,88,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Maze Advance",80,78,74,76,"Intermediate","Allround",79.68,82,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Falcima",74,73,78,70,"Intermediate","Allround",80.41,87,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Timo Boll CAF",84,80,75,82,"Advanced","Offensive",114.09,82,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Vyzaryz Trinity",92,86,73,90,"Advanced","Offensive",232.85,90,"FL","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Vyzaryz Freeze",90,85,74,88,"Advanced","Offensive",180.79,85,"FL","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA CWX",62,65,88,58,"Intermediate","Defensive",67.05,90,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Andro Inizio OFF",80,70,74,74,"Intermediate","Offensive",49.61,84,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Andro Treiber FO",89,76,71,81,"Advanced","Offensive",108.62,90,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Andro Treiber CI",87,75,73,79,"Intermediate","Offensive",108.62,90,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Andro Treiber CO",88,76,72,80,"Advanced","Offensive",108.62,90,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Andro Timber 5 ALL",68,68,86,64,"Intermediate","Allround",60.32,83,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Andro Timber 5 OFF",80,74,76,76,"Intermediate","Offensive",60.32,83,"FL","Write a 2-3 sentence description for SEO.",""],
    ["DHS Power G7",81,86,67,82,"Intermediate","Offensive",51.87,89,"FL","Write a 2-3 sentence description for SEO.",""],
    ["DHS Power G5X",80,82,74,78,"Intermediate","Offensive",54.28,89,"FL","Write a 2-3 sentence description for SEO.",""],
    ["DHS Hurricane Long 5X",92,89,68,91,"Advanced","Offensive",239.09,95,"FL","Write a 2-3 sentence description for SEO.",""],
    ["DHS Hurricane 301",88,86,72,86,"Advanced","Offensive",108.62,89,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["DHS Hurricane King 3",86,80,75,85,"Advanced","Offensive",200.39,87,"FL","Write a 2-3 sentence description for SEO.",""],
    ["DHS Fang Bo B2",82,80,76,78,"Intermediate","Offensive",92.92,90,"FL","Write a 2-3 sentence description for SEO.",""],
    ["ANDRO ANDRO Kanter CO",90,88,64,92,"Advanced","Offensive",108.62,68,"FL","Write a 2-3 sentence description for SEO.",""],
]

RUBBERS = [
    ["Name","Speed","Spin","Control","Power","Level","Style","Price","Weight_g","Sponge_Sizes","Description","Image_URL"],
    ["Butterfly Tenergy 05",92,96,72,90,"Advanced","Normal",96.59,46,"1.7mm,1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Tenergy 05 FX",86,92,78,82,"Advanced","Normal",96.59,44,"1.7mm,1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Tenergy 05 Hard",94,97,68,93,"Advanced","Normal",97.69,49,"1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Dignics 05",91,97,71,91,"Advanced","Normal",102.14,48.5,"1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Dignics 09C",89,98,70,90,"Advanced","Normal",113.49,49.1,"1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Rozena",83,72,82,78,"Intermediate","Normal",48.29,47,"1.7mm,1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Sriver",72,70,86,68,"Intermediate","Normal",39.84,42,"1.5mm,1.7mm,1.9mm,2.1mm,Max","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Sriver FX",76,73,84,72,"Intermediate","Normal",39.84,39,"1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly Feint Long II (long pips)",45,20,92,30,"Advanced","Long Pimples",37.42,49,"OX,0.5mm,1.1mm,1.3mm","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Dynaryz CMD",86,88,79,84,"Advanced","Normal",79.41,48,"2.0mm,Max","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Dynaryz ZGR",90,92,75,88,"Advanced","Normal",71.25,56,"2.0mm,Max","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Dynaryz AGR",92,93,73,90,"Advanced","Normal",69.09,46,"2.0mm,Max","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Dynaryz ACC",91,90,74,89,"Advanced","Normal",72.51,46,"2.0mm,Max","Write a 2-3 sentence description for SEO.",""],
    ["Andro Rasanter R50",92,93,70,89,"Advanced","Normal",56.74,51,"1.7mm,2.0mm,2.3mm","Write a 2-3 sentence description for SEO.",""],
    ["Andro Rasanter R47",90,91,72,87,"Advanced","Normal",60.32,48,"1.7mm,2.0mm,2.3mm","Write a 2-3 sentence description for SEO.",""],
    ["Andro Rasanter R42",85,86,77,80,"Intermediate","Normal",60.32,46,"1.7mm,2.0mm,2.3mm","Write a 2-3 sentence description for SEO.",""],
    ["Andro Rasanter R45",89,83,75,87,"Intermediate","Normal",59.57,49,"1.7mm,2.0mm,Ultramax","Write a 2-3 sentence description for SEO.",""],
    ["Andro Hexer PowerGrip SFX",89,87,75,86,"Intermediate","Normal",58.02,48,"1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["Andro Hexer Duro",89,88,72,86,"Intermediate","Normal",60.65,43,"1.9mm,2.1mm","Write a 2-3 sentence description for SEO.",""],
    ["DHS Hurricane 3 Neo (Provincial)",78,94,68,80,"Advanced","Normal",64.61,46,"2.15mm,2.2mm","Write a 2-3 sentence description for SEO.",""],
    ["DHS Hurricane 3 Neo (Blue Sponge / National)",80,95,66,82,"Advanced","Normal",81.57,50,"2.15mm","Write a 2-3 sentence description for SEO.",""],
    ["DHS Hurricane 3-50",77,90,70,78,"Advanced","Normal",60.32,48,"2.15mm","Write a 2-3 sentence description for SEO.",""],
    ["DHS Hurricane 8",85,86,73,83,"Advanced","Normal",41.04,52,"2.0mm,2.1mm,2.2mm","Write a 2-3 sentence description for SEO.",""],
    ["DHS Gold Arc 8",90,89,71,88,"Advanced","Normal",59.16,49,"2.0mm,2.1mm,2.2mm","Write a 2-3 sentence description for SEO.",""],
]

RACKETS = [
    ["Name","Speed","Spin","Control","Power","Level","Price","Grips","Description","Image_URL"],
    ["JOOLA Carbon X Pro",80,79,40,80,"Advanced",55.13,"FL,ST","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Infinity Carbon",86,78,69,84,"Advanced",124.13,"FL","Write a 2-3 sentence description for SEO.",""],
    ["JOOLA Match Pro",74,70,82,72,"Beginner",27.53,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly B302FL",56,50,84,55,"Beginner",34.27,"FL","Write a 2-3 sentence description for SEO.",""],
    ["Butterfly 401",64,60,80,60,"Beginner",52.43,"FL","Write a 2-3 sentence description for SEO.",""],
    ["DHS 9002",87,86,70,86,"Advanced",115.91,"FL","Write a 2-3 sentence description for SEO.",""],
    ["DHS 5002",78,80,76,76,"Intermediate",82.79,"FL","Write a 2-3 sentence description for SEO.",""],
]

REVIEWS_HEADERS = [
    ["Date","Reviewer_Name","Rating","Blade","FH_Rubber","BH_Rubber","Review_Text","Approved"],
    ["2024-01-01","Admin Test",5,"Butterfly Viscaria ALC","Butterfly Tenergy 05","Butterfly Rozena","This is a test review — delete before going live.","FALSE"],
]

# ─────────────────────────────────────────────────────────────────
try:
    import gspread
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
except ImportError:
    print("Installing required packages...")
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "gspread", "google-auth", "google-auth-oauthlib", "--quiet"])
    import gspread
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
TOKEN_FILE = "google_token.pickle"

# ─────────────────────────────────────────────────────────────────
# Try to use gspread with service account (if available)
# Otherwise fall back to simple API key approach notice

def get_credentials():
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "rb") as f:
            creds = pickle.load(f)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Check if credentials.json exists
            if not os.path.exists("credentials.json"):
                print("""
ERROR: credentials.json not found.

To use this script you need Google API credentials:
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable the Google Sheets API
4. Go to APIs & Services → Credentials
5. Create OAuth 2.0 Client ID → Desktop app
6. Download the JSON and save it as 'credentials.json' in this folder
7. Run this script again

Alternatively, the simpler method:
- Use gspread with a service account (see README for steps)
""")
                return None
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "wb") as f:
            pickle.dump(creds, f)

    return creds


def write_tab(spreadsheet, tab_name, data, existing_tabs):
    """Write data to a named tab, creating it if it doesn't exist."""
    if tab_name in existing_tabs:
        ws = spreadsheet.worksheet(tab_name)
        ws.clear()
    else:
        ws = spreadsheet.add_worksheet(title=tab_name, rows=200, cols=20)
    
    ws.update(data, value_input_option="USER_ENTERED")
    print(f"  ✓ {tab_name}: wrote {len(data)-1} rows")
    return ws


def main():
    creds = get_credentials()
    if not creds:
        return

    gc = gspread.authorize(creds)

    # ── Products Sheet ──
    print(f"\nOpening Products sheet ({PRODUCTS_SHEET_ID})...")
    products_sheet = gc.open_by_key(PRODUCTS_SHEET_ID)
    existing = [ws.title for ws in products_sheet.worksheets()]
    print(f"  Existing tabs: {existing}")

    write_tab(products_sheet, "Blades", BLADES, existing)
    write_tab(products_sheet, "Rubbers", RUBBERS, existing)
    write_tab(products_sheet, "Rackets", RACKETS, existing)

    # Remove default Sheet1 if it still exists and is empty
    for ws in products_sheet.worksheets():
        if ws.title in ("Sheet1", "Sheet 1") and ws.row_count > 0:
            try:
                products_sheet.del_worksheet(ws)
                print("  ✓ Removed default Sheet1")
            except Exception:
                pass

    # ── Reviews Sheet ──
    print(f"\nOpening Reviews sheet ({REVIEWS_SHEET_ID})...")
    reviews_sheet = gc.open_by_key(REVIEWS_SHEET_ID)
    rev_existing = [ws.title for ws in reviews_sheet.worksheets()]
    ws = write_tab(reviews_sheet, "Reviews", REVIEWS_HEADERS, rev_existing)

    print("\n✅ Done! Both sheets are populated.")
    print(f"\nProducts sheet: https://docs.google.com/spreadsheets/d/{PRODUCTS_SHEET_ID}/edit")
    print(f"Reviews sheet:  https://docs.google.com/spreadsheets/d/{REVIEWS_SHEET_ID}/edit")


if __name__ == "__main__":
    main()
