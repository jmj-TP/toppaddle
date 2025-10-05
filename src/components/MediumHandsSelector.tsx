import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mediumHandOptions = [
  {
    name: "Flared",
    value: "Shakehand Flared",
    desc: "Wider at the bottom; the most common choice, prevents slipping.",
    popular: true
  },
  {
    name: "Straight",
    value: "Shakehand Straight",
    desc: "Uniform shape, versatile for alternating grips.",
    popular: false
  }
];

interface MediumHandsSelectorProps {
  onSelect: (value: string) => void;
}

export default function MediumHandsSelector({ onSelect }: MediumHandsSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelection = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="space-y-4 w-full">
      {mediumHandOptions.map((handle, index) => (
        <div key={handle.name} className="relative">
          <Button
            onClick={() => handleSelection(handle.value)}
            variant="outline"
            className={`w-full p-6 h-auto text-left justify-start border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
              selected === handle.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-medium">
                    {handle.name}
                  </span>
                  {handle.popular && (
                    <span className="text-xs text-primary font-medium">Most Likely</span>
                  )}
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-primary transition-colors p-2 flex-shrink-0"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-64 bg-popover border-2 border-primary/20 shadow-lg"
                  side="top"
                  align="center"
                  sideOffset={10}
                >
                  <div className="relative">
                    <p className="text-sm text-popover-foreground leading-relaxed">
                      {handle.desc}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
}
