import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BrandSelectorProps {
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
}

const BRANDS = [
  { value: "ANDRO", label: "ANDRO" },
  { value: "BUTTERFLY", label: "BUTTERFLY" },
  { value: "JOOLA", label: "JOOLA" },
  { value: "DHS", label: "DHS" }
];

const BrandSelector = ({ selectedBrands, onBrandToggle }: BrandSelectorProps) => {
  const allSelected = selectedBrands.length === 0 || selectedBrands.length === BRANDS.length;

  const handleSelectAll = () => {
    if (allSelected) {
      // If all are selected, deselect all (but keep at least one)
      onBrandToggle(BRANDS[0].value);
    } else {
      // Select all by clearing the array (empty = all brands)
      BRANDS.forEach(brand => {
        if (!selectedBrands.includes(brand.value)) {
          onBrandToggle(brand.value);
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Select one or more brands (or select all)
      </div>

      {/* Select All Option */}
      <Card
        onClick={handleSelectAll}
        className={`p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
          allSelected
            ? "bg-primary text-primary-foreground border-primary shadow-lg"
            : "bg-card hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">All Brands</span>
          {allSelected && <Check className="w-5 h-5" />}
        </div>
      </Card>

      {/* Individual Brand Options */}
      <div className="grid grid-cols-2 gap-3">
        {BRANDS.map((brand) => {
          const isSelected = selectedBrands.includes(brand.value) || allSelected;
          
          return (
            <Card
              key={brand.value}
              onClick={() => onBrandToggle(brand.value)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isSelected && !allSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{brand.label}</span>
                {isSelected && !allSelected && <Check className="w-5 h-5" />}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected brands info */}
      {selectedBrands.length > 0 && selectedBrands.length < BRANDS.length && (
        <div className="text-sm text-muted-foreground text-center mt-2">
          {selectedBrands.length} brand{selectedBrands.length > 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
