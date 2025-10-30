import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface StatSliderProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  onChange: (value: number) => void;
  description?: string;
  showValue?: boolean;
}

const statDescriptions: Record<string, string> = {
  Speed: "How fast the ball travels off the paddle. Higher speed means more offensive power.",
  Spin: "Ability to generate rotation on the ball. Essential for topspin and serves.",
  Control: "How predictable and forgiving the paddle is. Higher control means more consistency.",
  Power: "Combined force of speed and spin. Determines overall attacking capability.",
  Weight: "Total weight of the assembled paddle. Affects maneuverability and fatigue.",
};

export const StatSlider = ({
  label,
  value,
  icon: Icon,
  onChange,
  description,
  showValue = true,
}: StatSliderProps) => {
  const desc = description || statDescriptions[label] || "";

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
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        {showValue && (
          <span className="text-sm font-semibold text-accent min-w-[40px] text-right">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};
