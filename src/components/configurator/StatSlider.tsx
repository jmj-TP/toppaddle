import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { statExplanations } from "@/constants/statExplanations";

interface StatSliderProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  onChange: (value: number) => void;
  description?: string;
  showValue?: boolean;
}

export const StatSlider = ({
  label,
  value,
  icon: Icon,
  onChange,
  description,
  showValue = true,
}: StatSliderProps) => {
  const desc = description || statExplanations[label]?.short || "";
  
  // Special handling for Weight slider
  const isWeight = label === "Weight";
  const displayValue = isWeight ? value : value;
  const minValue = isWeight ? 150 : 0;
  const maxValue = isWeight ? 250 : 100;

  return (
    <div className="group py-4 px-5 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">{label}</span>
        {desc && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto">
                  <Info className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{desc}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Slider
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            min={minValue}
            max={maxValue}
            step={1}
            className="w-full"
          />
        </div>
        {showValue && (
          <span className="text-sm font-semibold text-accent min-w-[50px] text-right">
            {isWeight ? `${displayValue}g` : displayValue}
          </span>
        )}
      </div>
    </div>
  );
};
