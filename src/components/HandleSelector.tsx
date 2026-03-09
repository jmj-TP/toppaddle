import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const handleOptions = [
  {
    name: "Really small hands",
    value: "Small Hands Special",
    desc: "Special selection for players with really small hands. Only DHS brand blades will be recommended with Flared handles.",
    popular: false
  },
  {
    name: "Medium hands",
    value: "Medium Hands",
    desc: "Most common hand size. You'll choose between Flared (most popular) and Straight handles.",
    popular: true
  },
  {
    name: "Really large hands",
    value: "Anatomic",
    desc: "Anatomic handle- Contoured to fit the palm; secure and ergonomic. Perfect for larger hands.",
    popular: false
  }
];

interface HandleSelectorProps {
  onSelect: (value: string) => void;
}

export default function HandleSelector({ onSelect }: HandleSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelection = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="space-y-4 w-full">
      {handleOptions.map((handle, index) => (
        <div key={handle.name} className="relative">
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelection(handle.value);
              }
            }}
            onClick={() => handleSelection(handle.value)}
            className={`cursor-pointer w-full p-6 h-auto text-left flex border-2 rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${selected === handle.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary hover:bg-primary/5"
              }`}
          >
            <div className="flex flex-1 items-center justify-between w-full">
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
          </div>
        </div>
      ))}
    </div>
  );
}
