/**
 * googleSheets.ts
 * ---------------
 * Fetches product data and reviews from public Google Sheets
 * using the gviz JSON API (no API key needed for public sheets).
 */

import { type Blade, type Rubber, type PreAssembledRacket } from "@/data/products";

const PRODUCTS_SHEET_ID = "1jtUyZ8_fyqj3j5MBmpYnr9yilDuDKzR-VV7NPG8XD0g";
const REVIEWS_SHEET_ID = "1pUViKlKj0p1ZYMD9T_mM_FhOSf9LOR0HlW_LNTQan1I";

// ── Types ────────────────────────────────────────────────────────

export interface SheetReview {
    date: string;
    reviewerName: string;
    rating: number;
    blade: string;
    fhRubber: string;
    bhRubber: string;
    reviewText: string;
    approved: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────

export function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[()]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function gvizUrl(sheetId: string, tabName: string): string {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
}

function parseGviz(raw: string): Record<string, string | number | boolean | null>[] {
    // Strip the JS callback wrapper
    const jsonStr = raw.replace(/^[^(]+\(/, "").replace(/\);?\s*$/, "");
    const parsed = JSON.parse(jsonStr);
    const { cols, rows } = parsed.table;

    return rows.map((row: any) => {
        const obj: Record<string, string | number | boolean | null> = {};
        cols.forEach((col: any, i: number) => {
            const cell = row.c[i];
            obj[col.label] = cell ? cell.v : null;
        });
        return obj;
    });
}

async function fetchTab(sheetId: string, tabName: string) {
    const url = gvizUrl(sheetId, tabName);
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch sheet tab "${tabName}": ${res.status}`);
    const text = await res.text();
    return parseGviz(text);
}

// ── Public fetch functions ────────────────────────────────────────

export async function fetchBlades(): Promise<Blade[]> {
    try {
        const rows = await fetchTab(PRODUCTS_SHEET_ID, "Blades");
        return rows
            .filter(r => r["Blade_Name"])
            .map(r => ({
                Blade_Name: String(r["Blade_Name"]),
                Blade_Speed: Number(r["Blade_Speed"]) || 0,
                Blade_Spin: Number(r["Blade_Spin"]) || 0,
                Blade_Control: Number(r["Blade_Control"]) || 0,
                Blade_Power: Number(r["Blade_Power"]) || 0,
                Blade_Level: (String(r["Blade_Level"]) || "Intermediate") as Blade["Blade_Level"],
                Blade_Style: (String(r["Blade_Style"]) || "All-Round") as Blade["Blade_Style"],
                Blade_Price: Number(r["Blade_Price"]) || 0,
                Blade_Weight: r["Blade_Weight"] ? Number(r["Blade_Weight"]) : undefined,
                Blade_Grip: String(r["Blade_Grip"] || "FL").split(",").map(g => g.trim()).filter(Boolean),
                Blade_Description: String(r["Blade_Description"] || ""),
                Blade_Image: String(r["Blade_Image"] || ""),
                Blade_Stiffness: r["Blade_Stiffness"] ? Number(r["Blade_Stiffness"]) : undefined,
                Blade_Material: r["Blade_Material"] ? (String(r["Blade_Material"]) as Blade["Blade_Material"]) : undefined,
                Blade_Brand: r["Blade_Brand"] ? String(r["Blade_Brand"]) : undefined,
            }));
    } catch (e) {
        console.error("fetchBlades error:", e);
        return [];
    }
}

export async function fetchRubbers(): Promise<Rubber[]> {
    try {
        const rows = await fetchTab(PRODUCTS_SHEET_ID, "Rubbers");
        return rows
            .filter(r => r["Rubber_Name"])
            .map(r => ({
                Rubber_Name: String(r["Rubber_Name"]),
                Rubber_Speed: Number(r["Rubber_Speed"]) || 0,
                Rubber_Spin: Number(r["Rubber_Spin"]) || 0,
                Rubber_Control: Number(r["Rubber_Control"]) || 0,
                Rubber_Power: Number(r["Rubber_Power"]) || 0,
                Rubber_Level: (String(r["Rubber_Level"]) || "Intermediate") as Rubber["Rubber_Level"],
                Rubber_Style: (String(r["Rubber_Style"]) || "Normal") as Rubber["Rubber_Style"],
                Rubber_Price: Number(r["Rubber_Price"]) || 0,
                Rubber_Weight: r["Rubber_Weight"] ? Number(r["Rubber_Weight"]) : undefined,
                Rubber_Sponge_Sizes: String(r["Rubber_Sponge_Sizes"] || "").split(",").map(s => s.trim()).filter(Boolean),
                Rubber_Description: String(r["Rubber_Description"] || ""),
                Rubber_Image: String(r["Rubber_Image"] || ""),
                Rubber_Hardness: r["Rubber_Hardness"] ? (String(r["Rubber_Hardness"]) as Rubber["Rubber_Hardness"]) : undefined,
                Rubber_ThrowAngle: r["Rubber_ThrowAngle"] ? (String(r["Rubber_ThrowAngle"]) as Rubber["Rubber_ThrowAngle"]) : undefined,
                Rubber_Surface: r["Rubber_Surface"] ? (String(r["Rubber_Surface"]) as Rubber["Rubber_Surface"]) : undefined,
                Rubber_Brand: r["Rubber_Brand"] ? String(r["Rubber_Brand"]) : undefined,
            }));
    } catch (e) {
        console.error("fetchRubbers error:", e);
        return [];
    }
}

export async function fetchRackets(): Promise<PreAssembledRacket[]> {
    try {
        const rows = await fetchTab(PRODUCTS_SHEET_ID, "Rackets");
        return rows
            .filter(r => r["Racket_Name"])
            .map(r => ({
                Racket_Name: String(r["Racket_Name"]),
                Racket_Blade: String(r["Racket_Blade"] || ""),
                Racket_FH_Rubber: String(r["Racket_FH_Rubber"] || ""),
                Racket_BH_Rubber: String(r["Racket_BH_Rubber"] || ""),
                Racket_FH_Rubber_Style: (String(r["Racket_FH_Rubber_Style"] || "Normal")) as PreAssembledRacket["Racket_FH_Rubber_Style"],
                Racket_BH_Rubber_Style: (String(r["Racket_BH_Rubber_Style"] || "Normal")) as PreAssembledRacket["Racket_BH_Rubber_Style"],
                Racket_Speed: Number(r["Racket_Speed"]) || 0,
                Racket_Spin: Number(r["Racket_Spin"]) || 0,
                Racket_Control: Number(r["Racket_Control"]) || 0,
                Racket_Power: Number(r["Racket_Power"]) || 0,
                Racket_Level: (String(r["Racket_Level"]) || "Intermediate") as PreAssembledRacket["Racket_Level"],
                Racket_Price: Number(r["Racket_Price"]) || 0,
                Racket_Grip: String(r["Racket_Grip"] || "FL").split(",").map(g => g.trim()).filter(Boolean),
                Racket_Description: String(r["Racket_Description"] || ""),
                Racket_Image: String(r["Racket_Image"] || ""),
                Racket_Brand: r["Racket_Brand"] ? String(r["Racket_Brand"]) : undefined,
            }));
    } catch (e) {
        console.error("fetchRackets error:", e);
        return [];
    }
}

export async function fetchReviews(): Promise<SheetReview[]> {
    try {
        const rows = await fetchTab(REVIEWS_SHEET_ID, "Reviews");
        return rows
            .filter(r => r["Review_Text"] && r["Approved"] === true)
            .map(r => ({
                date: String(r["Date"] || ""),
                reviewerName: String(r["Reviewer_Name"] || "Anonymous"),
                rating: Number(r["Rating"]) || 5,
                blade: String(r["Blade"] || ""),
                fhRubber: String(r["FH_Rubber"] || ""),
                bhRubber: String(r["BH_Rubber"] || ""),
                reviewText: String(r["Review_Text"] || ""),
                approved: true,
            }));
    } catch (e) {
        console.error("fetchReviews error:", e);
        return [];
    }
}

export async function fetchInventory() {
    const [blades, rubbers, preAssembledRackets] = await Promise.all([
        fetchBlades(),
        fetchRubbers(),
        fetchRackets(),
    ]);

    return { blades, rubbers, preAssembledRackets };
}
