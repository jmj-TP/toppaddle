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
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-xl z-50 safe-area-inset-bottom"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 2vh)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-[4vw] lg:px-[6vw] py-[2vh]">
        <div className="flex items-center gap-[2vw] lg:gap-[1vw]">
          {/* Left: Utility status pill (Desktop only, opens drawer) */}
          <div className="hidden lg:flex items-center">
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
          <div className="flex-1 flex items-center gap-[2vw] lg:gap-[1vw]">
            {/* Compare Button */}
            <Button
              onClick={onAddToCompare}
              variant="outline"
              size="lg"
              className="flex-1 lg:flex-none lg:w-[12vw] py-[2.5vh] text-[3.5vw] lg:text-[0.9vw] font-semibold rounded-xl border-2 hover:bg-muted/50"
            >
              <GitCompare className="w-[4vw] h-[4vw] lg:w-[1.2vw] lg:h-[1.2vw] mr-[1vw] lg:mr-[0.5vw]" />
              Compare
            </Button>

            {/* Add to Cart Button (Primary CTA) */}
            <Button
              onClick={onAddToCart}
              size="lg"
              className="flex-1 lg:flex-none lg:w-[18vw] bg-accent hover:bg-accent/90 text-accent-foreground py-[2.5vh] text-[3.5vw] lg:text-[0.9vw] font-bold rounded-xl shadow-accent relative group"
            >
              <ShoppingCart className="w-[4vw] h-[4vw] lg:w-[1.2vw] lg:h-[1.2vw] mr-[1vw] lg:mr-[0.5vw]" />
              <span className="flex-1 text-left lg:text-center">Add to Cart</span>
              <span className="text-[3.5vw] lg:text-[0.9vw] font-bold ml-auto lg:ml-[1vw]">
                ${totalPrice.toFixed(2)}
              </span>
            </Button>
          </div>

          {/* Mobile: Utility drawer trigger */}
          <div className="lg:hidden">
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
