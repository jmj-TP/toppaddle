import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Blade, Rubber } from "@/data/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ProductFilters {
  maxPrice: number;
  level: string[];
  style: string[];
  spongeSize?: string;
  gripType?: string;
  brand?: string[];
}

interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  type: "blade" | "rubber";
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: (Blade | Rubber)[];
}

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const BLADE_STYLE_OPTIONS = ["Offensive", "Defensive", "Allround"];
const RUBBER_STYLE_OPTIONS = ["Normal", "Short Pimples", "Long Pimples", "Anti"];
const SPONGE_SIZE_OPTIONS = ["1.5mm", "1.8mm", "2.0mm", "2.1mm", "2.2mm", "MAX"];
const GRIP_TYPE_OPTIONS = ["ST", "FL", "AN", "CS"];
const BRAND_OPTIONS = ["Butterfly", "DHS", "STIGA", "YASAKA", "TIBHAR", "XIOM", "Nittaku", "JOOLA", "ANDRO", "VICTAS", "DONIC", "GEWO"];

// Helper component for selectable chips to replace ToggleGroup/Select
const FilterChip = ({
  label,
  value,
  activeValues,
  onToggle,
  available = true,
  singleSelect = false
}: {
  label: string;
  value: string;
  activeValues: string[];
  onToggle: (v: string) => void;
  available?: boolean;
  singleSelect?: boolean;
}) => {
  const isActive = activeValues.includes(value) || (activeValues.includes('All') && value === 'All') || (singleSelect && activeValues.length === 0 && value === 'All');

  return (
    <button
      onClick={(e) => {
        if (!available) {
          e.preventDefault();
          toast.info(`${label} is not available with your current filter selections.`);
          return;
        }
        onToggle(value);
      }}
      disabled={!available}
      className={cn(
        "px-2.5 py-1.5 text-xs font-medium rounded-full transition-all border outline-none select-none",
        isActive
          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
          : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/80",
        !available && "opacity-40 cursor-not-allowed grayscale"
      )}
    >
      {label}
    </button>
  );
};

export const ProductFilter = ({ filters, onFiltersChange, type, title, open, onOpenChange, products }: ProductFilterProps) => {
  const styleOptions = type === "blade" ? BLADE_STYLE_OPTIONS : RUBBER_STYLE_OPTIONS;

  // Generic multi-toggle handler that correctly resets to 'All'
  const handleToggleMulti = (category: keyof ProductFilters, value: string, allOptionsList: string[]) => {
    const currentValues = (filters[category] as string[]) || ["All"];
    let newValues: string[];

    if (value === "All") {
      newValues = ["All"];
    } else {
      // Remove 'All' if it's there
      let withoutAll = currentValues.filter(v => v !== "All");

      // Toggle the specific value
      if (withoutAll.includes(value)) {
        withoutAll = withoutAll.filter(v => v !== value);
      } else {
        withoutAll.push(value);
      }

      // If nothing selected or everything selected, revert to All
      if (withoutAll.length === 0 || withoutAll.length === allOptionsList.length) {
        newValues = ["All"];
      } else {
        newValues = withoutAll;
      }
    }
    onFiltersChange({ ...filters, [category]: newValues });
  };

  // Single select for sponge/grip
  const handleToggleSingle = (category: 'spongeSize' | 'gripType', value: string) => {
    onFiltersChange({ ...filters, [category]: value === 'All' ? undefined : value });
  };

  // Calculate available options to dim out impossible combinations
  const availableOptions = useMemo(() => {
    const getProductBrand = (product: Blade | Rubber) => {
      const name = ('Blade_Name' in product ? product.Blade_Name : (product as Rubber).Rubber_Name).toUpperCase();
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

    const getFilteredProducts = (excludeDimension: string) => {
      return products.filter(product => {
        const brand = getProductBrand(product);
        const level = 'Blade_Level' in product ? product.Blade_Level : (product as Rubber).Rubber_Level;
        let style = 'Blade_Style' in product ? product.Blade_Style : (product as Rubber).Rubber_Style;
        if (style === 'All-Round') style = 'Allround';
        const price = 'Blade_Price' in product ? product.Blade_Price : (product as Rubber).Rubber_Price;

        if (excludeDimension !== 'brand' && filters.brand && !filters.brand.includes('All') && !filters.brand.includes(brand)) return false;
        if (excludeDimension !== 'level' && !filters.level.includes('All') && !filters.level.includes(level)) return false;

        if (excludeDimension !== 'style' && !filters.style.includes('All')) {
          if (!filters.style.includes(style || '')) return false;
        }

        if (excludeDimension !== 'price' && filters.maxPrice < 999999 && price > filters.maxPrice) return false;

        if (type === 'rubber' && excludeDimension !== 'spongeSize' && filters.spongeSize) {
          if (!(product as Rubber).Rubber_Sponge_Sizes?.includes(filters.spongeSize)) return false;
        }

        if (type === 'blade' && excludeDimension !== 'gripType' && filters.gripType) {
          if (!(product as Blade).Blade_Grip.includes(filters.gripType)) return false;
        }

        return true;
      });
    };

    const sets = {
      levels: new Set<string>(), styles: new Set<string>(), brands: new Set<string>(),
      spongeSizes: new Set<string>(), gripTypes: new Set<string>()
    };

    getFilteredProducts('level').forEach(p => sets.levels.add('Blade_Level' in p ? p.Blade_Level : (p as Rubber).Rubber_Level));
    getFilteredProducts('style').forEach(p => {
      let style = 'Blade_Style' in p ? p.Blade_Style || '' : (p as Rubber).Rubber_Style;
      if (style === 'All-Round') style = 'Allround';
      sets.styles.add(style);
    });
    getFilteredProducts('brand').forEach(p => sets.brands.add(getProductBrand(p)));

    if (type === 'rubber') getFilteredProducts('spongeSize').forEach(p => (p as Rubber).Rubber_Sponge_Sizes?.forEach(s => sets.spongeSizes.add(s)));
    if (type === 'blade') getFilteredProducts('gripType').forEach(p => (p as Blade).Blade_Grip.forEach(g => sets.gripTypes.add(g)));

    return {
      levels: Array.from(sets.levels), styles: Array.from(sets.styles), brands: Array.from(sets.brands),
      spongeSizes: Array.from(sets.spongeSizes), gripTypes: Array.from(sets.gripTypes)
    };
  }, [products, filters, type]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-[34px] rounded-full px-4 font-medium" title="Filter list">
          <Settings className="w-3.5 h-3.5 mr-2" /> Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[320px] sm:w-[380px] p-5 rounded-2xl bg-card border border-border shadow-2xl"
        align="end"
        side="bottom"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-card">
            <h4 className="font-semibold text-lg text-foreground tracking-tight">{title} Filters</h4>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-7 pb-2">

            {/* Price Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Max Price</Label>
                <span className="font-medium text-foreground bg-muted px-2 py-0.5 rounded text-sm">
                  {filters.maxPrice === 999999 ? 'No Limit' : `$${filters.maxPrice}`}
                </span>
              </div>
              <div className="px-2 pt-2">
                <Slider
                  min={30} max={150} step={10}
                  value={[filters.maxPrice === 999999 ? 150 : filters.maxPrice]}
                  onValueChange={(val) => onFiltersChange({ ...filters, maxPrice: val[0] >= 150 ? 999999 : val[0] })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Skill Level</Label>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All Levels" value="All" activeValues={filters.level} onToggle={(v) => handleToggleMulti('level', v, LEVEL_OPTIONS)} />
                {LEVEL_OPTIONS.map(opt => (
                  <FilterChip key={opt} label={opt} value={opt} activeValues={filters.level} available={availableOptions.levels.includes(opt)} onToggle={(v) => handleToggleMulti('level', v, LEVEL_OPTIONS)} />
                ))}
              </div>
            </div>

            {/* Play Style */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Play Style</Label>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All Styles" value="All" activeValues={filters.style} onToggle={(v) => handleToggleMulti('style', v, styleOptions)} />
                {styleOptions.map(opt => (
                  <FilterChip key={opt} label={opt} value={opt} activeValues={filters.style} available={availableOptions.styles.includes(opt)} onToggle={(v) => handleToggleMulti('style', v, styleOptions)} />
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Brand</Label>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All Brands" value="All" activeValues={filters.brand || ["All"]} onToggle={(v) => handleToggleMulti('brand', v, BRAND_OPTIONS)} />
                {BRAND_OPTIONS.map(opt => (
                  <FilterChip key={opt} label={opt} value={opt} activeValues={filters.brand || []} available={availableOptions.brands.includes(opt)} onToggle={(v) => handleToggleMulti('brand', v, BRAND_OPTIONS)} />
                ))}
              </div>
            </div>

            {/* Hardware Specific (Sponge / Grip) */}
            {type === "rubber" ? (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sponge Size</Label>
                <div className="flex flex-wrap gap-2">
                  <FilterChip singleSelect label="Any Size" value="All" activeValues={[filters.spongeSize || 'All']} onToggle={(v) => handleToggleSingle('spongeSize', v)} />
                  {SPONGE_SIZE_OPTIONS.map(opt => (
                    <FilterChip singleSelect key={opt} label={opt} value={opt} activeValues={[filters.spongeSize || '']} available={availableOptions.spongeSizes.includes(opt)} onToggle={(v) => handleToggleSingle('spongeSize', v)} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Grip Type</Label>
                <div className="flex flex-wrap gap-2">
                  <FilterChip singleSelect label="Any Grip" value="All" activeValues={[filters.gripType || 'All']} onToggle={(v) => handleToggleSingle('gripType', v)} />
                  {GRIP_TYPE_OPTIONS.map(opt => (
                    <FilterChip singleSelect key={opt} label={opt} value={opt} activeValues={[filters.gripType || '']} available={availableOptions.gripTypes.includes(opt)} onToggle={(v) => handleToggleSingle('gripType', v)} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
