'use client';

import { useState, useMemo } from 'react';
import { Star, Search, Filter, X, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewForm from '@/components/ReviewForm';
import { useReviews } from '@/hooks/useReviews';
import { ProductFilter, type ProductFilters } from '@/components/configurator/ProductFilter';
import type { Inventory } from '@/utils/ratingSystem';
import type { Blade, Rubber } from '@/data/products';
import { cn } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-3 w-3 sm:h-4 sm:w-4 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
            ))}
        </div>
    );
}

interface ReviewsClientProps {
    inventory: Inventory | null;
}

export default function ReviewsClient({ inventory }: ReviewsClientProps) {
    const { reviews, isLoading } = useReviews();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

    // Filter states
    const [bladeFilters, setBladeFilters] = useState<ProductFilters>({
        maxPrice: 999999,
        level: ["All"],
        style: ["All"],
        brand: ["All"],
    });
    const [rubberFilters, setRubberFilters] = useState<ProductFilters>({
        maxPrice: 999999,
        level: ["All"],
        style: ["All"],
        brand: ["All"],
    });

    const [bladeFilterOpen, setBladeFilterOpen] = useState(false);
    const [rubberFilterOpen, setRubberFilterOpen] = useState(false);

    const allBlades = inventory?.blades || [];
    const allRubbers = inventory?.rubbers || [];

    // Helper function to extract brand from product name (sync with SlotMachine)
    const extractBrand = (productName: string): string => {
        const name = productName.toUpperCase();
        if (name.includes('TIMO BOLL') || name.includes('VISCARIA') || name.includes('TENERGY') || name.includes('DIGNICS') || name.includes('ROZENA') || name.includes('GLAYZER') || name.includes('KORBEL') || name.includes('FAN ZHENDONG') || name.startsWith('BUTTERFLY')) return 'Butterfly';
        if (name.startsWith('JOOLA')) return 'JOOLA';
        if (name.startsWith('ANDRO')) return 'ANDRO';
        if (name.startsWith('DHS') || name.startsWith('HURRICANE')) return 'DHS';
        if (name.startsWith('STIGA') || name.startsWith('CYBERSHAPE') || name.startsWith('CLIPPER')) return 'STIGA';
        if (name.startsWith('YASAKA') || name.startsWith('RAKZA') || name.startsWith('MARK V') || name.startsWith('FALCK') || name.startsWith('MA LIN')) return 'YASAKA';
        if (name.startsWith('TIBHAR') || name.startsWith('EVOLUTION') || name.startsWith('AURUS') || name.startsWith('QUANTUM') || name.startsWith('MK') || name.startsWith('SAMSONOV') || name.startsWith('LEBRUN') || name.startsWith('DARKO')) return 'TIBHAR';
        if (name.startsWith('NITTAKU') || name.startsWith('FASTARC') || name.startsWith('ACOUSTIC') || name.startsWith('VIOLIN') || name.startsWith('MORISTO')) return 'Nittaku';
        if (name.startsWith('XIOM') || name.startsWith('VEGA') || name.startsWith('OMEGA') || name.startsWith('JEFFREY')) return 'XIOM';
        if (name.startsWith('VICTAS') || name.startsWith('V>15') || name.startsWith('KOJI')) return 'VICTAS';
        if (name.startsWith('DONIC') || name.startsWith('BLUEFIRE') || name.startsWith('ACUDA') || name.startsWith('BARACUDA') || name.startsWith('OVTCHAROV')) return 'DONIC';
        if (name.startsWith('GEWO')) return 'GEWO';
        return 'Other';
    };

    const filterProducts = <T extends Blade | Rubber>(products: T[], filters: ProductFilters, type: 'blade' | 'rubber'): T[] => {
        return products.filter(p => {
            const price = 'Blade_Price' in p ? p.Blade_Price : (p as Rubber).Rubber_Price;
            const level = 'Blade_Level' in p ? p.Blade_Level : (p as Rubber).Rubber_Level;
            let style = 'Blade_Style' in p ? p.Blade_Style : (p as Rubber).Rubber_Style;
            if (style === 'All-Round') style = 'Allround';
            const name = 'Blade_Name' in p ? p.Blade_Name : (p as Rubber).Rubber_Name;
            const brand = extractBrand(name);

            if (price > filters.maxPrice) return false;
            if (!filters.level.includes("All") && !filters.level.includes(level)) return false;
            if (!filters.style.includes("All") && !filters.style.includes(style || "")) return false;
            if (filters.brand && !filters.brand.includes("All") && !filters.brand.includes(brand)) return false;

            return true;
        });
    };

    const filteredReviews = useMemo(() => {
        let result = reviews;

        // Search query filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.reviewerName.toLowerCase().includes(query) ||
                r.reviewText.toLowerCase().includes(query) ||
                r.blade.toLowerCase().includes(query) ||
                r.fhRubber.toLowerCase().includes(query) ||
                r.bhRubber.toLowerCase().includes(query)
            );
        }

        // Product attribute filters
        const activeBladeFilters = !Object.values(bladeFilters).every(v => Array.isArray(v) ? v.includes("All") : v === 999999);
        const activeRubberFilters = !Object.values(rubberFilters).every(v => Array.isArray(v) ? v.includes("All") : v === 999999);

        if (activeBladeFilters || activeRubberFilters) {
            const validBlades = filterProducts(allBlades, bladeFilters, 'blade').map(b => b.Blade_Name.toLowerCase());
            const validRubbers = filterProducts(allRubbers, rubberFilters, 'rubber').map(r => r.Rubber_Name.toLowerCase());

            result = result.filter(r => {
                let matches = true;

                if (activeBladeFilters && r.blade) {
                    // Check if the review's blade is in the filtered list of blades
                    matches = matches && validBlades.some(vb => r.blade.toLowerCase().includes(vb) || vb.includes(r.blade.toLowerCase()));
                }

                if (activeRubberFilters) {
                    let rubberMatches = true;
                    if (r.fhRubber) {
                        rubberMatches = validRubbers.some(vr => r.fhRubber.toLowerCase().includes(vr) || vr.includes(r.fhRubber.toLowerCase()));
                    }
                    if (r.bhRubber) {
                        const bhMatch = validRubbers.some(vr => r.bhRubber.toLowerCase().includes(vr) || vr.includes(r.bhRubber.toLowerCase()));
                        rubberMatches = rubberMatches || bhMatch; // If either rubber matches the filters
                    }
                    matches = matches && rubberMatches;
                }

                return matches;
            });
        }

        return result;
    }, [reviews, searchQuery, bladeFilters, rubberFilters, allBlades, allRubbers]);

    const avgRating = reviews.length
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
        : null;

    const clearFilters = () => {
        setBladeFilters({ maxPrice: 999999, level: ["All"], style: ["All"], brand: ["All"] });
        setRubberFilters({ maxPrice: 999999, level: ["All"], style: ["All"], brand: ["All"] });
        setSearchQuery('');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <aside className={cn(
                        "md:w-64 lg:w-72 space-y-6 shrink-0 md:block",
                        isFilterMobileOpen ? "block" : "hidden md:block"
                    )}>
                        <div className="flex items-center justify-between md:hidden mb-4">
                            <h2 className="font-bold text-lg">Filters</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsFilterMobileOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-5 space-y-8 sticky top-24">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Search Reviews</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products or text..."
                                        className="pl-9 bg-muted/50 border-transparent focus:border-primary/50 rounded-lg"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Blade Filters</h3>
                                <ProductFilter
                                    type="blade"
                                    title="Blade"
                                    filters={bladeFilters}
                                    onFiltersChange={setBladeFilters}
                                    open={bladeFilterOpen}
                                    onOpenChange={setBladeFilterOpen}
                                    products={allBlades}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Rubber Filters</h3>
                                <ProductFilter
                                    type="rubber"
                                    title="Rubber"
                                    filters={rubberFilters}
                                    onFiltersChange={setRubberFilters}
                                    open={rubberFilterOpen}
                                    onOpenChange={setRubberFilterOpen}
                                    products={allRubbers}
                                />
                            </div>

                            {(searchQuery || !Object.values(bladeFilters).every(v => Array.isArray(v) ? v.includes("All") : v === 999999) || !Object.values(rubberFilters).every(v => Array.isArray(v) ? v.includes("All") : v === 999999)) && (
                                <Button
                                    variant="outline"
                                    className="w-full rounded-lg text-xs"
                                    onClick={clearFilters}
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 space-y-8">
                        {/* Hero */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl font-bold">Player Reviews</h1>
                                <p className="text-muted-foreground max-w-xl">
                                    Real feedback from the community. Filter by equipment type to find reviews that match your specs.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="md:hidden rounded-full h-10 px-4" onClick={() => setIsFilterMobileOpen(true)}>
                                    <Filter className="h-4 w-4 mr-2" /> Filters
                                </Button>
                                <Button onClick={() => setIsFormOpen(true)} className="rounded-full h-10 px-6 shadow-md hover:shadow-lg transition-all">
                                    Write a Review
                                </Button>
                            </div>
                        </div>

                        {avgRating && (
                            <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-yellow-400/10 p-2 rounded-lg">
                                        <StarRating rating={5} />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-bold">{avgRating}</span>
                                        <span className="text-muted-foreground"> / 5.0</span>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground font-medium">
                                    Based on {reviews.length} community reviews
                                </div>
                            </div>
                        )}

                        {/* Reviews Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-48 bg-muted/50 rounded-2xl animate-pulse border border-border/50" />
                                ))}
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-3xl">🏓</div>
                                <div>
                                    <p className="text-xl font-bold">No matching reviews</p>
                                    <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                                </div>
                                <Button onClick={clearFilters} variant="link" className="text-primary">
                                    Show all reviews
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredReviews.map((review, i) => (
                                    <Card key={i} className="group p-6 rounded-2xl border-border/60 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1 bg-card">
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="space-y-1">
                                                <StarRating rating={review.rating} />
                                                <p className="text-sm font-bold text-foreground">— {review.reviewerName}</p>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                                {review.date}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute -left-2 -top-2 text-4xl text-primary/10 font-serif leading-none italic">"</span>
                                            <p className="text-sm leading-relaxed text-muted-foreground italic px-2 relative z-10">
                                                {review.reviewText}
                                            </p>
                                        </div>
                                        {(review.blade || review.fhRubber || review.bhRubber) && (
                                            <div className="mt-6 pt-4 border-t border-border/50">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center">
                                                    <ChevronRight className="h-3 w-3 text-primary mr-1" /> Equipment Setup
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {[review.blade, review.fhRubber, review.bhRubber].filter(Boolean).map((item, idx) => (
                                                        <span key={idx} className="text-[11px] font-medium bg-primary/5 text-primary px-2 py-1 rounded-md border border-primary/10">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
            <ReviewForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
        </div>
    );
}
