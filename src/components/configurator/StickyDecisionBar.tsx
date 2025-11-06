import { Button } from "@/components/ui/button";
import { ShoppingCart, GitCompare } from "lucide-react";

interface StickyDecisionBarProps {
  totalPrice: number;
  onAddToCart: () => void;
  onCompare: () => void;
  isLoading?: boolean;
  utilityButton?: React.ReactNode;
}

const StickyDecisionBar = ({ 
  totalPrice, 
  onAddToCart, 
  onCompare, 
  isLoading = false,
  utilityButton
}: StickyDecisionBarProps) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-card/95 backdrop-blur-md shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Utility Status */}
          <div className="flex-shrink-0">
            {utilityButton}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="outline"
              onClick={onCompare}
              disabled={isLoading}
              className="h-10 px-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Compare</span>
            </Button>

            <Button
              onClick={onAddToCart}
              disabled={isLoading}
              className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span>Add to Cart</span>
              <span className="ml-2 font-bold">${totalPrice.toFixed(2)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyDecisionBar;
