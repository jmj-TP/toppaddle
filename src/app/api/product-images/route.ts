import { NextResponse } from 'next/server';
import { fetchInventory } from '@/lib/googleSheets';

// Cache for 1 hour — same as other sheet fetches
export const revalidate = 3600;

export async function GET() {
    try {
        const inventory = await fetchInventory();
        return NextResponse.json(inventory);
    } catch (e) {
        console.error('product-images API error:', e);
        return NextResponse.json({ blades: [], rubbers: [], preAssembledRackets: [] });
    }
}
