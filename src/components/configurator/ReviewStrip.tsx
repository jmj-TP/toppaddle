import { Badge } from "@/components/ui/badge";
import { DollarSign, Scale } from "lucide-react";

interface ReviewStripProps {
  totalPrice: number;
  level: string;
  totalWeight: string;
  selections: {
    forehand: string;
    blade: string;
    backhand: string;
  };
  onChipClick: (section: 'forehand' | 'blade' | 'backhand') => void;
}

const ReviewStrip = ({
  totalPrice,
  level,
  totalWeight,
  selections,
  onChipClick,
}: ReviewStripProps) => {
  const truncateMiddle = (str: string, maxLength: number = 15) => {
    if (str.length <= maxLength) return str;
    const start = Math.ceil(maxLength / 2) - 1;
    const end = Math.floor(maxLength / 2) - 2;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
  };

  return (
    <div className="w-full bg-card border-t border-border py-[clamp(0.5rem,2vh,1rem)] px-[clamp(0.5rem,2vw,1.5rem)] lg:py-[clamp(0.5rem,1.5vh,1rem)] lg:px-[clamp(1rem,4vw,2rem)] overflow-x-hidden">
      <div className="max-w-full lg:max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-[clamp(0.5rem,1.5vh,1rem)] lg:gap-[clamp(0.75rem,2vw,1.5rem)]">
        {/* Left: Meta Info */}
        <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)] lg:gap-[clamp(0.5rem,1.5vw,1rem)] flex-wrap justify-center lg:justify-start">
          <div className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]">
            <DollarSign className="w-[clamp(1rem,4vw,1.25rem)] h-[clamp(1rem,4vw,1.25rem)] lg:w-[clamp(1rem,1.2vw,1.2rem)] lg:h-[clamp(1rem,1.2vw,1.2rem)] text-accent" />
            <span className="text-[clamp(1rem,4vw,1.5rem)] lg:text-[clamp(1rem,1.25vw,1.35rem)] font-bold text-[hsl(var(--primary))]">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          
          <div className="h-[clamp(1rem,4vh,2rem)] w-px bg-border hidden lg:block" />
          
          <Badge variant="secondary" className="text-[clamp(0.75rem,3vw,0.875rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)] px-[clamp(0.5rem,2vw,1rem)] lg:px-[clamp(0.5rem,1vw,1rem)] py-[clamp(0.25rem,0.5vh,0.5rem)]">
            {level}
          </Badge>
          
          <div className="h-[clamp(1rem,4vh,2rem)] w-px bg-border hidden lg:block" />
          
          <div className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]">
            <Scale className="w-[clamp(1rem,4vw,1.25rem)] h-[clamp(1rem,4vw,1.25rem)] lg:w-[clamp(1rem,1vw,1rem)] lg:h-[clamp(1rem,1vw,1rem)] text-muted-foreground" />
            <span className="text-[clamp(0.875rem,3.5vw,1rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)] text-muted-foreground">
              {totalWeight}
            </span>
          </div>
        </div>

        {/* Right: Selection Chips */}
        <div className="flex items-center gap-[clamp(0.25rem,1.5vw,0.75rem)] lg:gap-[clamp(0.25rem,0.8vw,0.75rem)] flex-wrap justify-center">
          <button
            onClick={() => onChipClick('forehand')}
            aria-label={`Forehand rubber: ${selections.forehand}`}
            className="px-[clamp(0.5rem,2.5vw,1rem)] lg:px-[clamp(0.5rem,1vw,1rem)] py-[clamp(0.25rem,0.75vh,0.5rem)] bg-muted hover:bg-muted/70 rounded-full text-[clamp(0.75rem,2.75vw,0.875rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)] font-medium text-foreground transition-colors duration-200 whitespace-nowrap"
          >
            {truncateMiddle(selections.forehand)}
          </button>
          
          <button
            onClick={() => onChipClick('blade')}
            aria-label={`Blade: ${selections.blade}`}
            className="px-[clamp(0.5rem,2.5vw,1rem)] lg:px-[clamp(0.5rem,1vw,1rem)] py-[clamp(0.25rem,0.75vh,0.5rem)] bg-muted hover:bg-muted/70 rounded-full text-[clamp(0.75rem,2.75vw,0.875rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)] font-medium text-foreground transition-colors duration-200 whitespace-nowrap"
          >
            {truncateMiddle(selections.blade)}
          </button>
          
          <button
            onClick={() => onChipClick('backhand')}
            aria-label={`Backhand rubber: ${selections.backhand}`}
            className="px-[clamp(0.5rem,2.5vw,1rem)] lg:px-[clamp(0.5rem,1vw,1rem)] py-[clamp(0.25rem,0.75vh,0.5rem)] bg-muted hover:bg-muted/70 rounded-full text-[clamp(0.75rem,2.75vw,0.875rem)] lg:text-[clamp(0.75rem,0.85vw,0.9rem)] font-medium text-foreground transition-colors duration-200 whitespace-nowrap"
          >
            {truncateMiddle(selections.backhand)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStrip;
