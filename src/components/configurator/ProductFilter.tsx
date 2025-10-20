import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface ProductFilters {
  maxPrice: number;
  level: string;
  style: string;
  spongeSize?: string;
  gripType?: string;
}

interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  type: "blade" | "rubber";
  title: string;
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

export const ProductFilter = ({ filters, onFiltersChange, type, title }: ProductFilterProps) => {
  const styleOptions = type === "blade" ? BLADE_STYLE_OPTIONS : RUBBER_STYLE_OPTIONS;

  const handleFilterChange = (newFilters: ProductFilters) => {
    onFiltersChange(newFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8" title="Filter">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-6 bg-card border-2 border-border shadow-xl" 
        align="end"
        side="bottom"
      >
        <div className="space-y-4">
          <div className="pb-3 border-b border-border">
            <h4 className="font-semibold text-lg text-foreground">{title} Filters</h4>
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
            <Select
              value={filters.level}
              onValueChange={(value) =>
                handleFilterChange({ ...filters, level: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              value={filters.style}
              onValueChange={(value) =>
                handleFilterChange({ ...filters, style: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
      </PopoverContent>
    </Popover>
  );
};
