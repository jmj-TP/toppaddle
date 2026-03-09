'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ReviewFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    defaultBlade?: string;
    defaultFhRubber?: string;
    defaultBhRubber?: string;
}

export default function ReviewForm({
    isOpen,
    onOpenChange,
    defaultBlade = '',
    defaultFhRubber = '',
    defaultBhRubber = '',
}: ReviewFormProps) {
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [blade, setBlade] = useState(defaultBlade);
    const [fhRubber, setFhRubber] = useState(defaultFhRubber);
    const [bhRubber, setBhRubber] = useState(defaultBhRubber);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewerName.trim() || !reviewText.trim()) return;
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/reviews/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewerName, rating, blade, fhRubber, bhRubber, reviewText }),
            });

            if (res.ok) {
                setIsSuccess(true);
                toast.success('Review submitted!', {
                    description: 'It will appear after moderation (usually within 24h).',
                });
            } else {
                throw new Error('Submit failed');
            }
        } catch {
            toast.error('Failed to submit — please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with your equipment
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-8 text-center space-y-2">
                        <div className="text-4xl">🏓</div>
                        <p className="font-semibold">Thanks for your review!</p>
                        <p className="text-sm text-muted-foreground">It will appear after approval.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Star rating */}
                        <div className="space-y-1">
                            <Label>Rating</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                    >
                                        <Star
                                            className={`h-7 w-7 transition-colors ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="reviewer-name">Your Name</Label>
                            <Input
                                id="reviewer-name"
                                value={reviewerName}
                                onChange={e => setReviewerName(e.target.value)}
                                placeholder="John D."
                                required
                                maxLength={60}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Blade</Label>
                                <Input value={blade} onChange={e => setBlade(e.target.value)} placeholder="Optional" className="text-xs" maxLength={80} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">FH Rubber</Label>
                                <Input value={fhRubber} onChange={e => setFhRubber(e.target.value)} placeholder="Optional" className="text-xs" maxLength={80} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">BH Rubber</Label>
                                <Input value={bhRubber} onChange={e => setBhRubber(e.target.value)} placeholder="Optional" className="text-xs" maxLength={80} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="review-text">Review</Label>
                            <Textarea
                                id="review-text"
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                placeholder="Share your experience with this equipment combination..."
                                required
                                maxLength={1000}
                                rows={4}
                            />
                            <p className="text-xs text-muted-foreground text-right">{reviewText.length}/1000</p>
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
