import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface FilterPanelProps {
  selectedGrip: string;
  setSelectedGrip: (grip: string) => void;
  selectedThickness: string;
  setSelectedThickness: (thickness: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  availableGrips: string[];
}

const FilterPanel = ({
  selectedGrip,
  setSelectedGrip,
  selectedThickness,
  setSelectedThickness,
  priceRange,
  setPriceRange,
  availableGrips,
}: FilterPanelProps) => {
  const gripTypes = [
    { value: "ST", label: "Straight (ST)" },
    { value: "FL", label: "Flared (FL)" },
    { value: "AN", label: "Anatomic (AN)" },
  ];

  const thicknessOptions = [
    { value: "1.5mm", label: "1.5mm" },
    { value: "2.0mm", label: "2.0mm" },
    { value: "2.2mm", label: "2.2mm" },
    { value: "MAX", label: "MAX" },
  ];

  return (
    <Card className="p-8 space-y-8 shadow-lg border border-border rounded-2xl bg-card">
      <h3 className="text-xl font-semibold text-foreground">Customize Your Setup</h3>

      {/* Grip Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Grip Type</Label>
        <RadioGroup value={selectedGrip} onValueChange={setSelectedGrip} className="grid grid-cols-3 gap-3">
          {gripTypes.map((grip) => (
            <div key={grip.value}>
              <RadioGroupItem 
                value={grip.value} 
                id={grip.value}
                disabled={!availableGrips.includes(grip.value)}
                className="peer sr-only"
              />
              <Label 
                htmlFor={grip.value}
                className={`flex items-center justify-center rounded-lg border-2 border-border bg-background px-4 py-3 hover:bg-secondary cursor-pointer transition-all
                  peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                  ${!availableGrips.includes(grip.value) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-sm font-medium">{grip.value}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Sponge Thickness */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sponge Thickness</Label>
        <RadioGroup value={selectedThickness} onValueChange={setSelectedThickness} className="grid grid-cols-4 gap-3">
          {thicknessOptions.map((thickness) => (
            <div key={thickness.value}>
              <RadioGroupItem 
                value={thickness.value} 
                id={thickness.value}
                className="peer sr-only"
              />
              <Label 
                htmlFor={thickness.value}
                className="flex items-center justify-center rounded-lg border-2 border-border bg-background px-3 py-3 hover:bg-secondary cursor-pointer transition-all
                  peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <span className="text-sm font-medium">{thickness.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Price Range</Label>
        <Slider
          min={0}
          max={500}
          step={10}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
          className="w-full"
        />
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-foreground">${priceRange[0]}</span>
          <span className="text-lg font-semibold text-foreground">${priceRange[1]}</span>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;
