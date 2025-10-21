import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

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
}

const PRICE_OPTIONS = [
  { value: "30", label: "<30" },
  { value: "40", label: "<40" },
  { value: "50", label: "<50" },
  { value: "60", label: "<60" },
  { value: "70", label: "<70" },
  { value: "80", label: "<80" },
  { value: "100", label: "<100" },
  { value: "999999", label: "No Limit" },
];

const LEVEL_OPTIONS = [
  { value: "All", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const BLADE_STYLE_OPTIONS = [
  { value: "All", label: "All Styles" },
  { value: "Offensive", label: "Offensive" },
  { value: "Defensive", label: "Defensive" },
  { value: "All-Round", label: "All-Round" },
  { value: "Allround", label: "Allround" },
];

const RUBBER_STYLE_OPTIONS = [
  { value: "All", label: "All Styles" },
  { value: "Normal", label: "Normal" },
  { value: "Short Pimples", label: "Short Pimples" },
  { value: "Long Pimples", label: "Long Pimples" },
  { value: "Anti", label: "Anti" },
];

const SPONGE_SIZE_OPTIONS = [
  { value: "All", label: "All Sizes" },
  { value: "1.5mm", label: "1.5mm" },
  { value: "1.8mm", label: "1.8mm" },
  { value: "2.0mm", label: "2.0mm" },
  { value: "2.1mm", label: "2.1mm" },
  { value: "2.2mm", label: "2.2mm" },
  { value: "MAX", label: "MAX" },
];

const GRIP_TYPE_OPTIONS = [
  { value: "All", label: "All Grips" },
  { value: "ST", label: "Straight (ST)" },
  { value: "FL", label: "Flared (FL)" },
  { value: "AN", label: "Anatomic (AN)" },
];

const BRAND_OPTIONS = [
  { value: "All", label: "All Brands" },
  { value: "Butterfly", label: "Butterfly" },
  { value: "JOOLA", label: "JOOLA" },
  { value: "ANDRO", label: "ANDRO" },
  { value: "DHS", label: "DHS" },
];

export const ProductFilter = ({ filters, onFiltersChange, type, title, open, onOpenChange }: ProductFilterProps) => {
  const styleOptions = type === "blade" ? BLADE_STYLE_OPTIONS : RUBBER_STYLE_OPTIONS;

  const handleFilterChange = (newFilters: ProductFilters) => {
    onFiltersChange(newFilters);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8" title="Filter">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-6 bg-card border-2 border-border shadow-xl will-change-contents" 
        align="end"
        side="bottom"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          onOpenChange(false);
        }}
        onPointerDownOutside={(e) => {
          onOpenChange(false);
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-4">
          <div className="pb-3 border-b border-border flex justify-between items-center">
            <h4 className="font-semibold text-lg text-foreground">{title} Filters</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Max Price</Label>
            <Select
              value={filters.maxPrice.toString()}
              onValueChange={(value) =>
                handleFilterChange({ ...filters, maxPrice: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Level</Label>
            <ToggleGroup 
              type="multiple" 
              value={filters.level}
              onValueChange={(value) => {
                let newLevel = value.length > 0 ? value : ["All"];
                
                // If "All" is selected along with other options, remove "All"
                if (newLevel.includes("All") && newLevel.length > 1) {
                  newLevel = newLevel.filter(v => v !== "All");
                }
                
                // If only "All" was clicked while other options exist, clear everything else
                if (value.includes("All") && !filters.level.includes("All")) {
                  newLevel = ["All"];
                }
                
                // If all specific options are selected, switch to "All"
                const specificOptions = LEVEL_OPTIONS.filter(opt => opt.value !== "All");
                const allSpecificSelected = specificOptions.every(opt => newLevel.includes(opt.value));
                if (allSpecificSelected && newLevel.length === specificOptions.length) {
                  newLevel = ["All"];
                }
                
                handleFilterChange({ ...filters, level: newLevel });
              }}
              className="flex flex-wrap gap-2 justify-start"
            >
              {LEVEL_OPTIONS.map((option) => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label>Style</Label>
            <ToggleGroup 
              type="multiple" 
              value={filters.style}
              onValueChange={(value) => {
                let newStyle = value.length > 0 ? value : ["All"];
                
                // If "All" is selected along with other options, remove "All"
                if (newStyle.includes("All") && newStyle.length > 1) {
                  newStyle = newStyle.filter(v => v !== "All");
                }
                
                // If only "All" was clicked while other options exist, clear everything else
                if (value.includes("All") && !filters.style.includes("All")) {
                  newStyle = ["All"];
                }
                
                // If all specific options are selected, switch to "All"
                const specificOptions = styleOptions.filter(opt => opt.value !== "All");
                const allSpecificSelected = specificOptions.every(opt => newStyle.includes(opt.value));
                if (allSpecificSelected && newStyle.length === specificOptions.length) {
                  newStyle = ["All"];
                }
                
                handleFilterChange({ ...filters, style: newStyle });
              }}
              className="flex flex-wrap gap-2 justify-start"
            >
              {styleOptions.map((option) => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Sponge Size for Rubbers */}
          {type === "rubber" && (
            <div className="space-y-2">
              <Label>Sponge Size</Label>
              <Select
                value={filters.spongeSize || "All"}
                onValueChange={(value) =>
                  handleFilterChange({ ...filters, spongeSize: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPONGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Grip Type for Blades */}
          {type === "blade" && (
            <div className="space-y-2">
              <Label>Grip Type</Label>
              <Select
                value={filters.gripType || "All"}
                onValueChange={(value) =>
                  handleFilterChange({ ...filters, gripType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRIP_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Brand Filter */}
          <div className="space-y-2">
            <Label>Brand</Label>
            <ToggleGroup 
              type="multiple" 
              value={filters.brand || ["All"]}
              onValueChange={(value) => {
                let newBrand = value.length > 0 ? value : ["All"];
                
                // If "All" is selected along with other options, remove "All"
                if (newBrand.includes("All") && newBrand.length > 1) {
                  newBrand = newBrand.filter(v => v !== "All");
                }
                
                // If only "All" was clicked while other options exist, clear everything else
                if (value.includes("All") && !(filters.brand || ["All"]).includes("All")) {
                  newBrand = ["All"];
                }
                
                // If all specific options are selected, switch to "All"
                const specificOptions = BRAND_OPTIONS.filter(opt => opt.value !== "All");
                const allSpecificSelected = specificOptions.every(opt => newBrand.includes(opt.value));
                if (allSpecificSelected && newBrand.length === specificOptions.length) {
                  newBrand = ["All"];
                }
                
                handleFilterChange({ ...filters, brand: newBrand });
              }}
              className="flex flex-wrap gap-2 justify-start"
            >
              {BRAND_OPTIONS.map((option) => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
