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
    { value: "1.5mm", label: "1.5mm (Thin)" },
    { value: "2.0mm", label: "2.0mm (Medium)" },
    { value: "2.2mm", label: "2.2mm (Thick)" },
    { value: "MAX", label: "MAX" },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Grip Type</h3>
        <RadioGroup value={selectedGrip} onValueChange={setSelectedGrip}>
          {gripTypes.map((grip) => (
            <div key={grip.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={grip.value} 
                id={grip.value}
                disabled={!availableGrips.includes(grip.value)}
              />
              <Label 
                htmlFor={grip.value}
                className={!availableGrips.includes(grip.value) ? "text-muted-foreground" : ""}
              >
                {grip.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Sponge Thickness</h3>
        <RadioGroup value={selectedThickness} onValueChange={setSelectedThickness}>
          {thicknessOptions.map((thickness) => (
            <div key={thickness.value} className="flex items-center space-x-2">
              <RadioGroupItem value={thickness.value} id={thickness.value} />
              <Label htmlFor={thickness.value}>{thickness.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={500}
            step={10}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(value) => setPriceRange([value[0], value[1]])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FilterPanel;
