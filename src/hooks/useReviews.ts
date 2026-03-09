'use client';

import { useState, useEffect } from 'react';
import type { SheetReview } from '@/lib/googleSheets';

interface UseReviewsReturn {
    reviews: SheetReview[];
    isLoading: boolean;
    /** Reviews that match the given blade + FH rubber + BH rubber combo */
    matchingReviews: SheetReview[];
}

export function useReviews(blade?: string, fhRubber?: string, bhRubber?: string): UseReviewsReturn {
    const [reviews, setReviews] = useState<SheetReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/reviews', { signal: controller.signal })
            .then(r => r.json())
            .then((data: SheetReview[]) => setReviews(data))
            .catch(e => {
                if (e.name !== 'AbortError') {
                    console.error('Failed to load reviews:', e);
                }
            })
            .finally(() => setIsLoading(false));
        return () => controller.abort();
    }, []);

    const matchingReviews = reviews.filter(r => {
        if (!blade && !fhRubber && !bhRubber) return false;
        const bladeMatch = !blade || r.blade.toLowerCase().includes(blade.toLowerCase()) || blade.toLowerCase().includes(r.blade.toLowerCase());
        const fhMatch = !fhRubber || r.fhRubber.toLowerCase().includes(fhRubber.toLowerCase()) || fhRubber.toLowerCase().includes(r.fhRubber.toLowerCase());
        const bhMatch = !bhRubber || r.bhRubber.toLowerCase().includes(bhRubber.toLowerCase()) || bhRubber.toLowerCase().includes(r.bhRubber.toLowerCase());
        return bladeMatch && fhMatch && bhMatch;
    });

    return { reviews, isLoading, matchingReviews };
}
