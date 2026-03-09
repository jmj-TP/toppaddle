import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BrandSelectorProps {
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
}

const BRANDS = [
  { value: "ANDRO", label: "Andro" },
  { value: "BUTTERFLY", label: "Butterfly" },
  { value: "JOOLA", label: "Joola" },
  { value: "DHS", label: "DHS" },
  { value: "TIBHAR", label: "Tibhar" },
  { value: "YASAKA", label: "Yasaka" },
  { value: "XIOM", label: "Xiom" },
  { value: "NITTAKU", label: "Nittaku" },
  { value: "DONIC", label: "Donic" },
  { value: "GEWO", label: "Gewo" },
  { value: "STIGA", label: "Stiga" },
  { value: "VICTAS", label: "Victas" }
];

const BrandSelector = ({ selectedBrands, onBrandToggle }: BrandSelectorProps) => {
  // All brands selected by default (empty array = all selected)
  const allSelected = selectedBrands.length === 0 || selectedBrands.length === BRANDS.length;

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Click to unselect brands you don't want
      </div>

      {/* Individual Brand Options */}
      <div className="grid grid-cols-2 gap-3">
        {BRANDS.map((brand) => {
          const isSelected = selectedBrands.includes(brand.value) || allSelected;

          return (
            <Card
              key={brand.value}
              onClick={() => onBrandToggle(brand.value)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{brand.label}</span>
                {isSelected && <Check className="w-5 h-5" />}
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
