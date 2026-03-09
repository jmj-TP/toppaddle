'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductBackButton() {
    const router = useRouter();

    const handleBack = () => {
        // If there's history, go back. Otherwise fallback to configurator
        if (window.history.length > 2) {
            router.back();
        } else {
            router.push('/configurator');
        }
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
            <ArrowLeft className="h-4 w-4" /> Back
        </button>
    );
}
