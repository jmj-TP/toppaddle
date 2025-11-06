import { Badge } from "@/components/ui/badge";
import { DollarSign, Layers, Weight as WeightIcon } from "lucide-react";

interface ReviewStripProps {
  totalPrice: number;
  level: string;
  totalWeight: number;
  selections: Array<{ id: string; name: string; label: string }>;
  onChipClick: (id: string) => void;
}

const ReviewStrip = ({ totalPrice, level, totalWeight, selections, onChipClick }: ReviewStripProps) => {
  const truncateMiddle = (str: string, maxLength: number = 12) => {
    if (str.length <= maxLength) return str;
    const start = str.slice(0, Math.floor(maxLength / 2) - 1);
    const end = str.slice(str.length - Math.floor(maxLength / 2) + 2);
    return `${start}…${end}`;
  };

  return (
    <div className="w-full border-t-2 border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-between">
          {/* Left: Key Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary text-primary-foreground">
              {level}
            </Badge>
            
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <WeightIcon className="w-4 h-4" />
              <span className="font-medium">{totalWeight}g</span>
            </div>
          </div>

          {/* Right: Selection Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {selections.map((sel) => (
              <button
                key={sel.id}
                onClick={() => onChipClick(sel.id)}
                className="px-2.5 py-1 text-xs rounded-full bg-background border border-border hover:border-accent hover:bg-accent/5 transition-colors duration-200 font-medium text-foreground"
                aria-label={`Scroll to ${sel.label}`}
              >
                {truncateMiddle(sel.name, 14)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStrip;
