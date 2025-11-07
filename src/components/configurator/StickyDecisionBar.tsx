import { Button } from "@/components/ui/button";
import { ShoppingCart, GitCompare } from "lucide-react";
import UtilityDrawer from "./UtilityDrawer";

interface StickyDecisionBarProps {
  totalPrice: number;
  onAddToCart: () => void;
  onAddToCompare: () => void;
  assembleForMe: boolean;
  onAssembleChange: (value: boolean) => void;
  sealsService: boolean;
  onSealsChange: (value: boolean) => void;
  onRandomReroll: () => void;
  isPreassembled: boolean;
}

const StickyDecisionBar = ({
  totalPrice,
  onAddToCart,
  onAddToCompare,
  assembleForMe,
  onAssembleChange,
  sealsService,
  onSealsChange,
  onRandomReroll,
  isPreassembled,
}: StickyDecisionBarProps) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-xl z-50 safe-area-inset-bottom overflow-x-hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), clamp(0.5rem, 2vh, 1rem))',
      }}
    >
      <div className="max-w-full lg:max-w-[1400px] mx-auto px-[clamp(0.5rem,2vw,1.5rem)] lg:px-[clamp(1rem,4vw,2rem)] py-[clamp(0.5rem,1.5vh,1rem)]">
        <div className="flex items-center justify-between gap-[clamp(0.25rem,1vw,0.75rem)] w-full">
          {/* Left: Utility status pill (Desktop only, opens drawer) */}
          <div className="hidden lg:flex items-center flex-shrink-0" style={{ width: '33%', maxWidth: '200px' }}>
            <UtilityDrawer
              assembleForMe={assembleForMe}
              onAssembleChange={onAssembleChange}
              sealsService={sealsService}
              onSealsChange={onSealsChange}
              onRandomReroll={onRandomReroll}
              isPreassembled={isPreassembled}
            />
          </div>

          {/* Center/Right: Action buttons */}
          <div className="flex items-center gap-[clamp(0.25rem,1.5vw,0.75rem)] flex-1 lg:flex-none justify-end">
            {/* Compare Button */}
            <Button
              onClick={onAddToCompare}
              variant="outline"
              size="lg"
              className="flex-shrink-0 w-[clamp(80px,30%,140px)] lg:w-auto lg:min-w-[120px] py-[clamp(0.5rem,2vh,1rem)] text-[clamp(0.75rem,3vw,0.875rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)] font-semibold rounded-xl border-2 hover:bg-muted/50 px-[clamp(0.5rem,2vw,1rem)]"
            >
              <GitCompare className="w-[clamp(1rem,4vw,1.25rem)] h-[clamp(1rem,4vw,1.25rem)] lg:w-[clamp(1rem,1.2vw,1.2rem)] lg:h-[clamp(1rem,1.2vw,1.2rem)] lg:mr-[0.5vw]" />
              <span className="hidden lg:inline">Compare</span>
            </Button>

            {/* Add to Cart Button (Primary CTA) */}
            <Button
              onClick={onAddToCart}
              size="lg"
              className="flex-shrink-0 w-[clamp(140px,45%,240px)] lg:w-auto lg:min-w-[200px] bg-accent hover:bg-accent/90 text-accent-foreground py-[clamp(0.5rem,2vh,1rem)] text-[clamp(0.75rem,3vw,0.875rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)] font-bold rounded-xl shadow-accent px-[clamp(0.5rem,2vw,1rem)]"
            >
              <ShoppingCart className="w-[clamp(1rem,4vw,1.25rem)] h-[clamp(1rem,4vw,1.25rem)] lg:w-[clamp(1rem,1.2vw,1.2rem)] lg:h-[clamp(1rem,1.2vw,1.2rem)] lg:mr-[0.5vw] flex-shrink-0" />
              <span className="truncate flex-1 text-left lg:text-center">Cart</span>
              <span className="text-[clamp(0.75rem,3vw,0.875rem)] lg:text-[clamp(0.875rem,0.9vw,0.95rem)] font-bold ml-auto whitespace-nowrap">
                ${totalPrice.toFixed(2)}
              </span>
            </Button>
          </div>

          {/* Mobile: Utility drawer trigger */}
          <div className="lg:hidden flex-shrink-0">
            <UtilityDrawer
              assembleForMe={assembleForMe}
              onAssembleChange={onAssembleChange}
              sealsService={sealsService}
              onSealsChange={onSealsChange}
              onRandomReroll={onRandomReroll}
              isPreassembled={isPreassembled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyDecisionBar;
