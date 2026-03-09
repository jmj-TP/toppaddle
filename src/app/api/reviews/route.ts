import { NextResponse } from 'next/server';
import { fetchReviews } from '@/lib/googleSheets';

export const revalidate = 3600; // refresh hourly

export async function GET() {
    try {
        const reviews = await fetchReviews();
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Reviews API error:', error);
        return NextResponse.json([], { status: 200 });
    }
}
