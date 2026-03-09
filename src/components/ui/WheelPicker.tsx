'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WheelPickerProps {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    visibleItems?: number;
}

export function WheelPicker({ options, value, onChange, className, visibleItems = 3 }: WheelPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const ITEM_HEIGHT = 44;
    const halfVisible = Math.floor(visibleItems / 2);
    const gradientHeight = halfVisible * ITEM_HEIGHT;

    const selectedIndex = options.findIndex(o => o.value === value);

    const scrollToIndex = (index: number, animate = true) => {
        if (!containerRef.current) return;
        containerRef.current.scrollTo({
            top: index * ITEM_HEIGHT,
            behavior: animate ? 'smooth' : 'instant',
        });
    };

    useEffect(() => {
        scrollToIndex(selectedIndex, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        const clamped = Math.max(0, Math.min(options.length - 1, index));
        if (options[clamped]?.value !== value) {
            onChange(options[clamped].value);
        }
    };

    return (
        <div className={cn('relative select-none', className)}>
            {/* Gradient overlays */}
            <div
                className="pointer-events-none absolute top-0 left-0 right-0 bg-gradient-to-b from-background to-transparent z-10"
                style={{ height: gradientHeight }}
            />
            <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent z-10"
                style={{ height: gradientHeight }}
            />

            {/* Selection highlight */}
            <div
                className="pointer-events-none absolute left-0 right-0 z-10 border-t border-b border-primary/40 bg-primary/5"
                style={{ top: '50%', transform: 'translateY(-50%)', height: ITEM_HEIGHT }}
            />

            {/* Scrollable list */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="overflow-y-scroll scrollbar-none"
                style={{
                    height: ITEM_HEIGHT * visibleItems,
                    scrollSnapType: 'y mandatory',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {/* Top padding */}
                <div style={{ height: ITEM_HEIGHT * halfVisible }} />

                {options.map((opt) => (
                    <div
                        key={opt.value}
                        onClick={() => {
                            const idx = options.findIndex(o => o.value === opt.value);
                            scrollToIndex(idx);
                            onChange(opt.value);
                        }}
                        className={cn(
                            'flex items-center justify-center cursor-pointer transition-all duration-200 font-medium',
                            'scroll-snap-align-center px-4 text-center',
                            opt.value === value
                                ? 'text-foreground text-sm'
                                : 'text-muted-foreground text-xs opacity-60'
                        )}
                        style={{ height: ITEM_HEIGHT, scrollSnapAlign: 'center' }}
                    >
                        {opt.label}
                    </div>
                ))}

                {/* Bottom padding */}
                <div style={{ height: ITEM_HEIGHT * halfVisible }} />
            </div>
        </div>
    );
}
