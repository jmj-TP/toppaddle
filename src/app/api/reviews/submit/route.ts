import { NextRequest, NextResponse } from 'next/server';

const REVIEWS_SHEET_ID = "1pUViKlKj0p1ZYMD9T_mM_FhOSf9LOR0HlW_LNTQan1I";
// We append rows via the Google Sheets gviz append endpoint.
// Since this requires auth, we use a Google Apps Script Web App as a free proxy.
// Set NEXT_PUBLIC_REVIEWS_SCRIPT_URL in .env.local to your Apps Script deployment URL.
const SCRIPT_URL = process.env.REVIEWS_SCRIPT_URL || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reviewerName, rating, blade, fhRubber, bhRubber, reviewText } = body;

        // Validate
        if (!reviewerName || !reviewText || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
        }

        const reviewData = {
            date: new Date().toISOString().split('T')[0],
            reviewerName: String(reviewerName).slice(0, 100),
            rating: Number(rating),
            blade: String(blade || '').slice(0, 100),
            fhRubber: String(fhRubber || '').slice(0, 100),
            bhRubber: String(bhRubber || '').slice(0, 100),
            reviewText: String(reviewText).slice(0, 2000),
            approved: false,
        };

        if (SCRIPT_URL) {
            // Post to Google Apps Script Web App which appends the row
            await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData),
            });
        } else {
            // Log for now — in production set REVIEWS_SCRIPT_URL
            console.log('[Review submitted - pending Apps Script setup]:', reviewData);
        }

        return NextResponse.json({ success: true, message: 'Review submitted for approval' });
    } catch (error) {
        console.error('Submit review error:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
