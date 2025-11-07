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
    <div className="w-full bg-card border-t border-border py-[3vh] px-[4vw] lg:py-[2vh] lg:px-[6vw]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-[2vh] lg:gap-[3vw]">
        {/* Left: Meta Info */}
        <div className="flex items-center gap-[3vw] lg:gap-[1.5vw] flex-wrap justify-center lg:justify-start">
          <div className="flex items-center gap-[1vw]">
            <DollarSign className="w-[4vw] h-[4vw] lg:w-[1.2vw] lg:h-[1.2vw] text-accent" />
            <span className="text-[4vw] lg:text-[1.25vw] font-bold text-foreground">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          
          <div className="h-[4vh] w-px bg-border hidden lg:block" />
          
          <Badge variant="secondary" className="text-[3vw] lg:text-[0.85vw] px-[2vw] lg:px-[1vw] py-[0.5vh]">
            {level}
          </Badge>
          
          <div className="h-[4vh] w-px bg-border hidden lg:block" />
          
          <div className="flex items-center gap-[1vw]">
            <Scale className="w-[4vw] h-[4vw] lg:w-[1vw] lg:h-[1vw] text-muted-foreground" />
            <span className="text-[3.5vw] lg:text-[0.9vw] text-muted-foreground">
              {totalWeight}
            </span>
          </div>
        </div>

        {/* Right: Selection Chips */}
        <div className="flex items-center gap-[2vw] lg:gap-[0.8vw] flex-wrap justify-center">
          <button
            onClick={() => onChipClick('forehand')}
            aria-label={`Forehand rubber: ${selections.forehand}`}
            className="px-[3vw] lg:px-[1vw] py-[1vh] bg-muted hover:bg-muted/70 rounded-full text-[3vw] lg:text-[0.85vw] font-medium text-foreground transition-colors duration-200"
          >
            {truncateMiddle(selections.forehand)}
          </button>
          
          <button
            onClick={() => onChipClick('blade')}
            aria-label={`Blade: ${selections.blade}`}
            className="px-[3vw] lg:px-[1vw] py-[1vh] bg-muted hover:bg-muted/70 rounded-full text-[3vw] lg:text-[0.85vw] font-medium text-foreground transition-colors duration-200"
          >
            {truncateMiddle(selections.blade)}
          </button>
          
          <button
            onClick={() => onChipClick('backhand')}
            aria-label={`Backhand rubber: ${selections.backhand}`}
            className="px-[3vw] lg:px-[1vw] py-[1vh] bg-muted hover:bg-muted/70 rounded-full text-[3vw] lg:text-[0.85vw] font-medium text-foreground transition-colors duration-200"
          >
            {truncateMiddle(selections.backhand)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStrip;
