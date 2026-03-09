'use server';

import { fetchInventory } from "@/lib/googleSheets";

export async function getInventoryAction() {
    return await fetchInventory();
}
