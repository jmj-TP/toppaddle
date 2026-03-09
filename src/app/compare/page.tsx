import CompareClient from "./CompareClient";
import { Metadata } from "next";
import { fetchInventory } from "@/lib/googleSheets";

export const metadata: Metadata = {
    title: "Compare Table Tennis Paddles - Detailed Performance Analysis",
    description: "Compare up to 3 custom table tennis paddles side by side. Analyze performance stats, price, and get detailed insights to make the best choice.",
    alternates: {
        canonical: "https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/compare",
    },
};

export default async function ComparePage() {
    let inventory = null;
    try {
        inventory = await fetchInventory();
    } catch (e) {
        console.error("Failed to fetch inventory for compare page:", e);
    }
    return <CompareClient inventory={inventory} />;
}
