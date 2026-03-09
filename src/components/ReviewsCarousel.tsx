'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SheetReview } from '@/lib/googleSheets';
import ReviewForm from '@/components/ReviewForm';

interface ReviewsCarouselProps {
    reviews: SheetReview[];
    isLoading?: boolean;
    /** Pre-fill the review form with the current build */
    currentBlade?: string;
    currentFhRubber?: string;
    currentBhRubber?: string;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                />
            ))}
        </div>
    );
}

export default function ReviewsCarousel({
    reviews,
    isLoading,
    currentBlade,
    currentFhRubber,
    currentBhRubber,
}: ReviewsCarouselProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const PER_PAGE = 3;
    const totalPages = Math.ceil(reviews.length / PER_PAGE);
    const visible = reviews.slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE);

    if (isLoading) {
        return (
            <div className="w-full py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Quote className="h-4 w-4 text-primary" />
                    Player Reviews
                </h2>
                <div className="flex items-center gap-2">
                    {totalPages > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground">{currentPage + 1}/{totalPages}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage >= totalPages - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setIsReviewFormOpen(true)}>
                        Leave a Review
                    </Button>
                </div>
            </div>

            {reviews.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                    <p className="text-sm">No reviews yet — be the first!</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsReviewFormOpen(true)}>
                        Write a Review
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {visible.map((review, i) => (
                        <Card key={i} className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <StarRating rating={review.rating} />
                                <span className="text-xs text-muted-foreground shrink-0">{review.date}</span>
                            </div>
                            <p className="text-sm leading-relaxed line-clamp-4 text-muted-foreground italic">
                                &ldquo;{review.reviewText}&rdquo;
                            </p>
                            <div className="pt-1 border-t space-y-0.5">
                                <p className="text-xs font-medium">— {review.reviewerName}</p>
                                {(review.blade || review.fhRubber) && (
                                    <p className="text-xs text-muted-foreground truncate">
                                        {[review.blade, review.fhRubber, review.bhRubber].filter(Boolean).join(' + ')}
                                    </p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ReviewForm
                isOpen={isReviewFormOpen}
                onOpenChange={setIsReviewFormOpen}
                defaultBlade={currentBlade}
                defaultFhRubber={currentFhRubber}
                defaultBhRubber={currentBhRubber}
            />
        </div>
    );
}
