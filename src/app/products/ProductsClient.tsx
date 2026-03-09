'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductFilter, type ProductFilters } from '@/components/configurator/ProductFilter';
import type { Inventory } from '@/utils/ratingSystem';
import type { Blade, Rubber } from '@/data/products';
import { slugify } from '@/lib/googleSheets';
import { cn } from '@/lib/utils';

function StatBar({ value, max = 100 }: { value: number; max?: number }) {
    return (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(value / max) * 100}%` }} />
        </div>
    );
}

interface ProductsClientProps {
    initialBlades: Blade[];
    initialRubbers: Rubber[];
}

export default function ProductsClient({ initialBlades, initialRubbers }: ProductsClientProps) {
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

    // Helper function to extract brand from product name (sync with ReviewsClient)
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

    const filterProducts = <T extends Blade | Rubber>(products: T[], filters: ProductFilters, search: string): T[] => {
        return products.filter(p => {
            const name = 'Blade_Name' in p ? p.Blade_Name : (p as Rubber).Rubber_Name;
            const price = 'Blade_Price' in p ? p.Blade_Price : (p as Rubber).Rubber_Price;
            const level = 'Blade_Level' in p ? p.Blade_Level : (p as Rubber).Rubber_Level;
            let style = 'Blade_Style' in p ? p.Blade_Style : (p as Rubber).Rubber_Style;
            if (style === 'All-Round') style = 'Allround';
            const brand = extractBrand(name);

            // Search query
            if (search.trim() && !name.toLowerCase().includes(search.toLowerCase()) && !brand.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }

            // Price filter
            if (price > filters.maxPrice) return false;

            // Level filter
            if (!filters.level.includes("All") && !filters.level.includes(level)) return false;

            // Style filter
            if (!filters.style.includes("All") && !filters.style.includes(style || "")) return false;

            // Brand filter
            if (filters.brand && !filters.brand.includes("All") && !filters.brand.includes(brand)) return false;

            return true;
        });
    };

    const filteredBlades = useMemo(() => filterProducts(initialBlades, bladeFilters, searchQuery), [initialBlades, bladeFilters, searchQuery]);
    const filteredRubbers = useMemo(() => filterProducts(initialRubbers, rubberFilters, searchQuery), [initialRubbers, rubberFilters, searchQuery]);

    const clearFilters = () => {
        setBladeFilters({ maxPrice: 999999, level: ["All"], style: ["All"], brand: ["All"] });
        setRubberFilters({ maxPrice: 999999, level: ["All"], style: ["All"], brand: ["All"] });
        setSearchQuery('');
    };

    const isAnyFilterActive = searchQuery ||
        !Object.values(bladeFilters).every(v => Array.isArray(v) ? v.includes("All") : v === 999999) ||
        !Object.values(rubberFilters).every(v => Array.isArray(v) ? v.includes("All") : v === 999999);

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
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Search Tools</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search blades or rubbers..."
                                        className="pl-9 bg-muted/50 border-transparent focus:border-primary/50 rounded-lg"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Blade Filters</h3>
                                    <Badge variant="outline" className="text-[10px] px-1.5 h-4">{filteredBlades.length}</Badge>
                                </div>
                                <ProductFilter
                                    type="blade"
                                    title="Blade"
                                    filters={bladeFilters}
                                    onFiltersChange={setBladeFilters}
                                    open={bladeFilterOpen}
                                    onOpenChange={setBladeFilterOpen}
                                    products={initialBlades}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Rubber Filters</h3>
                                    <Badge variant="outline" className="text-[10px] px-1.5 h-4">{filteredRubbers.length}</Badge>
                                </div>
                                <ProductFilter
                                    type="rubber"
                                    title="Rubber"
                                    filters={rubberFilters}
                                    onFiltersChange={setRubberFilters}
                                    open={rubberFilterOpen}
                                    onOpenChange={setRubberFilterOpen}
                                    products={initialRubbers}
                                />
                            </div>

                            {isAnyFilterActive && (
                                <Button
                                    variant="outline"
                                    className="w-full rounded-lg text-xs h-9"
                                    onClick={clearFilters}
                                >
                                    Reset all filters
                                </Button>
                            )}
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 space-y-12">
                        {/* Hero */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl font-bold">Table Tennis Equipment</h1>
                                <p className="text-muted-foreground max-w-xl">
                                    Browse our complete database of professional equipment. Filter by specs to find your ideal match.
                                </p>
                            </div>
                            <Button variant="outline" className="md:hidden rounded-full h-10 px-4" onClick={() => setIsFilterMobileOpen(true)}>
                                <Filter className="h-4 w-4 mr-2" /> Filters
                            </Button>
                        </div>

                        {/* Blades Section */}
                        {filteredBlades.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-border pb-2">
                                    <h2 className="text-2xl font-bold">🪵 Blades</h2>
                                    <span className="text-sm text-muted-foreground">({filteredBlades.length})</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredBlades.map((blade) => (
                                        <Link key={slugify(blade.Blade_Name)} href={`/product/blade/${slugify(blade.Blade_Name)}`}>
                                            <Card className="group p-5 h-full hover:shadow-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer bg-card overflow-hidden">
                                                <div className="aspect-square bg-muted/30 rounded-xl flex items-center justify-center mb-4 p-4 group-hover:bg-muted/50 transition-colors">
                                                    {blade.Blade_Image ? (
                                                        <img src={blade.Blade_Image} alt={blade.Blade_Name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🏓</span>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{blade.Blade_Level}</Badge>
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{blade.Blade_Style}</Badge>
                                                    </div>
                                                    <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{blade.Blade_Name}</h3>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-black text-primary">${blade.Blade_Price.toFixed(0)}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">List Price</span>
                                                    </div>
                                                    <div className="space-y-2 pt-2">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><span>Speed</span><span>{blade.Blade_Speed}</span></div>
                                                            <StatBar value={blade.Blade_Speed} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><span>Control</span><span>{blade.Blade_Control}</span></div>
                                                            <StatBar value={blade.Blade_Control} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Rubbers Section */}
                        {filteredRubbers.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-border pb-2">
                                    <h2 className="text-2xl font-bold">⚫ Rubbers</h2>
                                    <span className="text-sm text-muted-foreground">({filteredRubbers.length})</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRubbers.map((rubber) => (
                                        <Link key={slugify(rubber.Rubber_Name)} href={`/product/rubber/${slugify(rubber.Rubber_Name)}`}>
                                            <Card className="group p-5 h-full hover:shadow-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer bg-card overflow-hidden">
                                                <div className="aspect-square bg-muted/30 rounded-xl flex items-center justify-center mb-4 p-4 group-hover:bg-muted/50 transition-colors">
                                                    {rubber.Rubber_Image ? (
                                                        <img src={rubber.Rubber_Image} alt={rubber.Rubber_Name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🏓</span>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{rubber.Rubber_Level}</Badge>
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{rubber.Rubber_Style}</Badge>
                                                    </div>
                                                    <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{rubber.Rubber_Name}</h3>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-black text-primary">${rubber.Rubber_Price.toFixed(0)}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">List Price</span>
                                                    </div>
                                                    <div className="space-y-2 pt-2">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><span>Speed</span><span>{rubber.Rubber_Speed}</span></div>
                                                            <StatBar value={rubber.Rubber_Speed} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><span>Spin</span><span>{rubber.Rubber_Spin}</span></div>
                                                            <StatBar value={rubber.Rubber_Spin} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {filteredBlades.length === 0 && filteredRubbers.length === 0 && (
                            <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-3xl">🚫</div>
                                <div>
                                    <p className="text-xl font-bold">No products match your criteria</p>
                                    <p className="text-muted-foreground">Try loosening your filters or search terms.</p>
                                </div>
                                <Button onClick={clearFilters} variant="link" className="text-primary font-bold">
                                    Reset all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
