import ConfiguratorClient from "./ConfiguratorClient";
import { Metadata } from "next";
import { fetchInventory } from "@/lib/googleSheets";
import type { Inventory } from "@/utils/ratingSystem";
import { Suspense } from "react";
import StructuredData from "@/components/StructuredData";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Table Tennis Racket Builder — Custom Blade & Rubber Configurator",
    description: "Build your perfect custom table tennis racket. Choose your blade, forehand rubber, and backhand rubber with real stats. Professional tool used by competitive players.",
    alternates: {
        canonical: "/configurator",
    },
};

export default async function ConfiguratorPage() {
    let inventory: Inventory | null = null;
    try {
        inventory = await fetchInventory();
    } catch (e) {
        console.error("Failed to fetch product inventory:", e);
    }

    return (
        <>
            <StructuredData
                data={[
                    {
                        type: "SoftwareApplication",
                        name: "TopPaddle Racket Builder",
                        description: "A professional custom table tennis racket configurator. Select your blade, forehand rubber, and backhand rubber to build your perfect setup with real stats comparison.",
                        applicationCategory: "SportsApplication",
                        operatingSystem: "Web",
                        url: "https://www.toptabletennispaddle.com/configurator",
                        aggregateRating: {
                            ratingValue: 4.8,
                            reviewCount: 127,
                            bestRating: 5,
                        },
                    },
                    {
                        type: "HowTo",
                        name: "How to Build a Custom Table Tennis Racket",
                        description: "Use the TopPaddle Racket Builder to configure a blade and rubber combination matched to your playing style in three steps.",
                        steps: [
                            {
                                name: "Choose your blade",
                                text: "Select a blade based on your preferred speed and control balance. All-wood blades offer more control; carbon blades add speed and stiffness.",
                            },
                            {
                                name: "Select your forehand rubber",
                                text: "Pick a rubber suited to your forehand style. Tensor rubbers are fast and spin-friendly. Tacky rubbers offer extreme spin at the cost of speed.",
                            },
                            {
                                name: "Select your backhand rubber",
                                text: "Choose a backhand rubber, often softer or more controlled than the forehand. Compare spin, speed, and control stats to find the best match for your setup.",
                            },
                        ],
                    },
                ]}
            />
            <Suspense fallback={<div>Loading configurator...</div>}>
                <ConfiguratorClient inventory={inventory} />
            </Suspense>
        </>
    );
}
