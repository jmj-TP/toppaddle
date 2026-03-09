'use client';

import { useState, useEffect } from 'react';
import { useComparisonStore } from '@/stores/comparisonStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { slugify } from '@/lib/googleSheets';
import { getProductImage } from '@/utils/addProductImages';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import { RadarComparisonChart, type PerformanceView } from '@/components/comparison/RadarComparisonChart';
import { BarComparisonChart } from '@/components/comparison/BarComparisonChart';
import { InsightsSection } from '@/components/comparison/InsightsSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, Trophy, DollarSign, SkipForward } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import type { Inventory } from '@/utils/ratingSystem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import StructuredData from '@/components/StructuredData';

// Must match the COLORS array in RadarComparisonChart.tsx
const PADDLE_COLORS = [
    'hsl(210, 100%, 50%)', // Neon Blue
    'hsl(25, 100%, 50%)',  // Neon Orange
    'hsl(150, 80%, 40%)'   // Neon Green
];

export default function CompareClient({ inventory }: { inventory: Inventory | null }) {
    const { paddles, removePaddle, clearComparison, updateSponge } = useComparisonStore();
    const [selectedPaddle, setSelectedPaddle] = useState<string | null>(paddles[0]?.id || null);
    const [performanceView, setPerformanceView] = useState<PerformanceView>('overall');
    const [showValue, setShowValue] = useState(true);
    const [showWeight, setShowWeight] = useState(true);
    const router = useRouter();
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [leadEquipmentDetail, setLeadEquipmentDetail] = useState<any>(null);


    // Calculate best overall and best value
    const bestOverall = paddles.length > 0 ? paddles.reduce((best, paddle) => {
        const paddleScore = (paddle.speed + paddle.control + paddle.power + paddle.spin) / 4;
        const bestScore = (best.speed + best.control + best.power + best.spin) / 4;
        return paddleScore > bestScore ? paddle : best;
    }, paddles[0]) : null;

    const bestValue = paddles.length > 0 ? paddles.reduce((best, paddle) => {
        const paddleTotalStats = paddle.speed + paddle.control + paddle.power + paddle.spin;
        const paddleStatsPerDollar = paddleTotalStats / paddle.price;
        const paddleValue = Math.min(100, (paddleStatsPerDollar / 2) * 100);

        const bestTotalStats = best.speed + best.control + best.power + best.spin;
        const bestStatsPerDollar = bestTotalStats / best.price;
        const bestValueScore = Math.min(100, (bestStatsPerDollar / 2) * 100);

        return paddleValue > bestValueScore ? paddle : best;
    }, paddles[0]) : null;

    const cycleRadarView = () => {
        const views: PerformanceView[] = ['forehand', 'blade', 'backhand', 'overall'];
        const currentIndex = views.indexOf(performanceView);
        setPerformanceView(views[(currentIndex + 1) % views.length]);
    };

    const getRadarSubhead = () => {
        switch (performanceView) {
            case 'overall': return 'Overall';
            case 'forehand': return 'FH Rubber';
            case 'blade': return 'Blade';
            case 'backhand': return 'BH Rubber';
        }
    };

    const tooltips = {
        value: "Price-to-performance ratio",
        weight: "Total weight in grams"
    };

    const handleRequestQuotes = (paddle: any) => {
        setLeadEquipmentDetail({
            type: paddle.id.startsWith('pre-') ? 'pre' : 'custom',
            data: paddle,
            score: 100,
            rank: 1
        });
        setIsLeadModalOpen(true);
    };

    if (paddles.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                            <ArrowRight className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold">No Paddles to Compare</h1>
                        <p className="text-muted-foreground">
                            Head to the configurator to create custom paddles and add them to comparison.
                        </p>
                        <Button onClick={() => router.push('/configurator')} size="lg">
                            Go to Configurator
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <StructuredData
                data={{
                    type: 'BreadcrumbList',
                    items: [
                        { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
                        { name: 'Compare', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/compare' }
                    ]
                }}
            />
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">Paddle Comparison</h1>
                        <p className="text-muted-foreground mt-2">
                            Compare up to {3 - paddles.length} more {3 - paddles.length === 1 ? 'paddle' : 'paddles'}
                        </p>
                    </div>
                    {paddles.length > 0 && (
                        <Button variant="outline" onClick={clearComparison}>
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Paddle Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paddles.map((paddle, index) => (
                        <Card
                            key={paddle.id}
                            className="p-6 relative flex flex-col border-2"
                            style={{ borderColor: PADDLE_COLORS[index] }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2">{paddle.name}</h3>
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {paddle.id === bestOverall?.id && (
                                            <Badge variant="default" className="gap-1">
                                                <Trophy className="w-3 h-3" />
                                                Best Overall
                                            </Badge>
                                        )}
                                        {paddle.id === bestValue?.id && (
                                            <Badge variant="secondary" className="gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                Best Value
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePaddle(paddle.id)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                {paddle.id.startsWith('custom-') ? (
                                    <div className="grid grid-cols-3 gap-2 mb-4 h-40">
                                        <Link
                                            href={paddle.forehandRubber ? `/product/rubber/${slugify(paddle.forehandRubber)}` : '#'}
                                            target="_blank"
                                            className="bg-muted rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-2 group relative"
                                        >
                                            <div className="product-img-wrap flex-1 w-full relative mb-1">
                                                <Image
                                                    src={paddle.forehandImage || getProductImage({}, 'rubber')}
                                                    alt="Forehand"
                                                    fill
                                                    unoptimized
                                                    className="product-img object-contain group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center relative z-10">Forehand</span>
                                        </Link>
                                        <Link
                                            href={paddle.blade ? `/product/blade/${slugify(paddle.blade)}` : '#'}
                                            target="_blank"
                                            className="bg-muted rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-2 group relative"
                                        >
                                            <div className="product-img-wrap flex-1 w-full relative mb-1">
                                                <Image
                                                    src={paddle.bladeImage || getProductImage({}, 'blade')}
                                                    alt="Blade"
                                                    fill
                                                    unoptimized
                                                    className="product-img object-contain group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center relative z-10">Blade</span>
                                        </Link>
                                        <Link
                                            href={paddle.backhandRubber ? `/product/rubber/${slugify(paddle.backhandRubber)}` : '#'}
                                            target="_blank"
                                            className="bg-muted rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-2 group relative"
                                        >
                                            <div className="product-img-wrap flex-1 w-full relative mb-1">
                                                <Image
                                                    src={paddle.backhandImage || getProductImage({}, 'rubber')}
                                                    alt="Backhand"
                                                    fill
                                                    unoptimized
                                                    className="product-img object-contain group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center relative z-10">Backhand</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="product-img-wrap relative w-full h-40 mb-4 bg-muted rounded-lg overflow-hidden flex items-center justify-center p-2">
                                        {paddle.image ? (
                                            <Image
                                                src={paddle.image}
                                                alt={paddle.name}
                                                fill
                                                unoptimized
                                                className="product-img object-contain"
                                            />
                                        ) : (
                                            <span className="text-5xl">🏓</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 text-sm flex-1">
                                {paddle.blade && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Blade:</span>
                                        <span className="font-medium text-right flex-1 ml-2">{paddle.blade}</span>
                                    </div>
                                )}
                                {paddle.forehandRubber && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Forehand:</span>
                                            <span className="font-medium text-right flex-1 ml-2">
                                                {paddle.forehandRubber}
                                            </span>
                                        </div>
                                        {paddle.forehandSponge && (() => {
                                            const rubber = inventory?.rubbers.find(r => r.Rubber_Name === paddle.forehandRubber);
                                            const availableSizes = rubber?.Rubber_Sponge_Sizes || ['1.5mm', '1.8mm', '2.0mm', '2.1mm', 'Max'];
                                            return (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground text-xs pl-4">Thickness:</span>
                                                    <Select
                                                        value={paddle.forehandSponge}
                                                        onValueChange={(value) => updateSponge(paddle.id, 'forehand', value, inventory?.rubbers || [])}
                                                    >
                                                        <SelectTrigger className="h-7 w-24 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableSizes.map(size => (
                                                                <SelectItem key={size} value={size}>{size}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            );
                                        })()}
                                    </>
                                )}
                                {paddle.backhandRubber && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Backhand:</span>
                                            <span className="font-medium text-right flex-1 ml-2">
                                                {paddle.backhandRubber}
                                            </span>
                                        </div>
                                        {paddle.backhandSponge && (() => {
                                            const rubber = inventory?.rubbers.find(r => r.Rubber_Name === paddle.backhandRubber);
                                            const availableSizes = rubber?.Rubber_Sponge_Sizes || ['1.5mm', '1.8mm', '2.0mm', '2.1mm', 'Max'];
                                            return (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground text-xs pl-4">Thickness:</span>
                                                    <Select
                                                        value={paddle.backhandSponge}
                                                        onValueChange={(value) => updateSponge(paddle.id, 'backhand', value, inventory?.rubbers || [])}
                                                    >
                                                        <SelectTrigger className="h-7 w-24 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableSizes.map(size => (
                                                                <SelectItem key={size} value={size}>{size}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            );
                                        })()}
                                    </>
                                )}
                            </div>
                            <div className="space-y-2 text-sm mt-4 pt-4 border-t border-border">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Price:</span>
                                    <span className="font-semibold">${paddle.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Weight:</span>
                                    <span className="font-semibold">{paddle.weight}g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Level:</span>
                                    <span className="font-semibold">{paddle.level}</span>
                                </div>
                            </div>
                            <Button
                                className="w-full mt-4 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => handleRequestQuotes(paddle)}
                            >
                                <SkipForward className="w-4 h-4 mr-2" />
                                Ask for an offer from the best shops
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Radar Chart and Insights Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-[2vh] gap-[1vh]">
                            <div className="text-center sm:text-left">
                                <h3 className="text-[clamp(1.125rem,4.5vw,1.5rem)] lg:text-[clamp(1.125rem,1.2vw,1.35rem)] font-semibold text-[hsl(var(--primary))]">
                                    Performance Overview
                                </h3>
                                <p className="text-[clamp(0.75rem,3vw,0.875rem)] lg:text-[clamp(0.75rem,0.8vw,0.85rem)] text-muted-foreground mt-[0.5vh]">
                                    {getRadarSubhead()}
                                </p>
                            </div>
                            <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)] flex-wrap justify-center">
                                <Button
                                    onClick={cycleRadarView}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl px-[clamp(0.75rem,3vw,1.5rem)] py-[1.5vh] text-[clamp(0.75rem,3vw,0.85rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)] hover:bg-accent/10"
                                >
                                    <SkipForward className="mr-[clamp(0.25rem,1vw,0.5rem)] h-[clamp(0.875rem,3.5vw,1rem)] w-[clamp(0.875rem,3.5vw,1rem)] lg:h-[clamp(0.875rem,1vw,1rem)] lg:w-[clamp(0.875rem,1vw,1rem)]" />
                                    Next View
                                </Button>
                                {performanceView === 'overall' && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => setShowValue(!showValue)}
                                                    variant={showValue ? "default" : "outline"}
                                                    size="sm"
                                                    className="rounded-xl px-[clamp(0.75rem,3vw,1.5rem)] py-[1.5vh] text-[clamp(0.75rem,3vw,0.85rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)]"
                                                >
                                                    Value
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{tooltips.value}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {performanceView === 'overall' && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => setShowWeight(!showWeight)}
                                                    variant={showWeight ? "default" : "outline"}
                                                    size="sm"
                                                    className="rounded-xl px-[clamp(0.75rem,3vw,1.5rem)] py-[1.5vh] text-[clamp(0.75rem,3vw,0.85rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)]"
                                                >
                                                    Weight
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{tooltips.weight}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        </div>
                        <div className="transition-all duration-250 motion-reduce:transition-none">
                            <RadarComparisonChart
                                paddles={paddles}
                                selectedPaddle={selectedPaddle}
                                onPaddleSelect={(id) => {
                                    setSelectedPaddle(id);
                                }}
                                performanceView={performanceView}
                                onPerformanceViewChange={setPerformanceView}
                                includeValue={performanceView === 'overall' && showValue}
                                includeWeight={performanceView === 'overall' && showWeight}
                                hideControls={true}
                            />
                        </div>
                    </Card>
                    <InsightsSection
                        paddles={paddles}
                        selectedPaddleId={selectedPaddle}
                        onPaddleSelect={setSelectedPaddle}
                        performanceView={performanceView}
                    />
                </div>

                {/* Bar Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-4">
                        <BarComparisonChart paddles={paddles} stat="speed" label="Speed" performanceView={performanceView} />
                    </Card>
                    <Card className="p-4">
                        <BarComparisonChart paddles={paddles} stat="control" label="Control" performanceView={performanceView} />
                    </Card>
                    <Card className="p-4">
                        <BarComparisonChart paddles={paddles} stat="power" label="Power" performanceView={performanceView} />
                    </Card>
                    <Card className="p-4">
                        <BarComparisonChart paddles={paddles} stat="spin" label="Spin" performanceView={performanceView} />
                    </Card>
                </div>
            </main>
            <Footer />
            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onOpenChange={setIsLeadModalOpen}
                equipmentDetails={leadEquipmentDetail}
            />
        </div>
    );
}
