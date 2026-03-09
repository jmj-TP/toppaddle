import ReviewsClient from './ReviewsClient';
import { Metadata } from "next";
import { fetchInventory } from "@/lib/googleSheets";
import type { Inventory } from "@/utils/ratingSystem";
import { Suspense } from "react";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Player Reviews — Community Equipment Feedback",
    description: "Read real reviews from table tennis players about their blades and rubbers. Share your experience and find the perfect equipment combination.",
    alternates: {
        canonical: "/reviews",
    },
};

export default async function ReviewsPage() {
    let inventory: Inventory | null = null;
    try {
        inventory = await fetchInventory();
    } catch (e) {
        console.error("Failed to fetch product inventory for reviews:", e);
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading reviews...</div>}>
            <ReviewsClient inventory={inventory} />
        </Suspense>
    );
}
