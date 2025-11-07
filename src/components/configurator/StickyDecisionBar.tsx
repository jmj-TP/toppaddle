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
        <div className="flex items-center justify-center gap-[clamp(0.25rem,1.5vw,0.75rem)] w-full">
          {/* Utility Drawer */}
          <div className="flex-shrink-0">
            <UtilityDrawer
              assembleForMe={assembleForMe}
              onAssembleChange={onAssembleChange}
              sealsService={sealsService}
              onSealsChange={onSealsChange}
              onRandomReroll={onRandomReroll}
              isPreassembled={isPreassembled}
            />
          </div>

          {/* Compare Button */}
          <Button
            onClick={onAddToCompare}
            variant="outline"
            size="lg"
            className="flex-shrink-0 py-[clamp(0.5rem,2vh,0.75rem)] text-[clamp(0.7rem,2.5vw,0.875rem)] font-semibold rounded-xl border-2 hover:bg-muted/50 px-[clamp(0.5rem,2vw,1rem)]"
          >
            <GitCompare className="w-[clamp(0.9rem,3.5vw,1.1rem)] h-[clamp(0.9rem,3.5vw,1.1rem)] mr-1" />
            <span>Compare</span>
          </Button>

          {/* Add to Cart Button (Primary CTA) */}
          <Button
            onClick={onAddToCart}
            size="lg"
            className="flex-shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground py-[clamp(0.5rem,2vh,0.75rem)] text-[clamp(0.7rem,2.5vw,0.875rem)] font-bold rounded-xl shadow-accent px-[clamp(0.5rem,2vw,1rem)]"
          >
            <ShoppingCart className="w-[clamp(0.9rem,3.5vw,1.1rem)] h-[clamp(0.9rem,3.5vw,1.1rem)] mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Cart ${totalPrice.toFixed(2)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyDecisionBar;
