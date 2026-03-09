import { Button } from "@/components/ui/button";
import { GitCompare, Shuffle, MoreVertical } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StickyDecisionBarProps {
  totalPrice: number;
  onRequestQuotes: () => void;
  onAddToCompare: () => void;
  assembleForMe: boolean;
  onAssembleChange: (value: boolean) => void;
  sealsService: boolean;
  onSealsChange: (value: boolean) => void;
  onRandomReroll: () => void;
  isPreassembled: boolean;
  // For share button
  racketName?: string;
  score?: number;
  price?: number;
  isCustom?: boolean;
  forehandRubberName?: string;
  backhandRubberName?: string;
}

const StickyDecisionBar = ({
  totalPrice,
  onRequestQuotes,
  onAddToCompare,
  onRandomReroll,
  isPreassembled,
  racketName,
  score,
  price,
  isCustom,
  forehandRubberName,
  backhandRubberName,
}: StickyDecisionBarProps) => {
  const showShare = racketName && score !== undefined && price !== undefined && isCustom !== undefined;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-xl z-50 safe-area-inset-bottom overflow-x-hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), clamp(0.5rem, 2vh, 1rem))',
      }}
    >
      <div className="max-w-full lg:max-w-[1400px] mx-auto px-[clamp(0.5rem,2vw,1.5rem)] lg:px-[clamp(1rem,4vw,2rem)] py-[clamp(0.5rem,1.5vh,1rem)]">
        <div className="flex items-center justify-between gap-[clamp(0.25rem,1.5vw,0.75rem)] w-full">

          {/* Mobile Menu (Secondary Actions) */}
          <div className="flex sm:hidden flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-2 h-[clamp(2.5rem,8vh,3rem)] w-[clamp(2.5rem,8vh,3rem)]"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-2">
                <DropdownMenuItem onClick={onRandomReroll} className="py-3 cursor-pointer rounded-lg">
                  <Shuffle className="w-4 h-4 mr-3" />
                  Reroll
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddToCompare} className="py-3 cursor-pointer rounded-lg">
                  <GitCompare className="w-4 h-4 mr-3" />
                  Compare
                </DropdownMenuItem>
                {showShare && (
                  <div className="p-0">
                    <ShareButton
                      racketName={racketName!}
                      score={score!}
                      price={price!}
                      isCustom={isCustom!}
                      forehandRubberName={forehandRubberName}
                      backhandRubberName={backhandRubberName}
                      className="w-full justify-start border-none shadow-none hover:bg-accent hover:text-accent-foreground h-auto py-3 px-2 text-sm font-normal rounded-lg"
                    />
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-[clamp(0.25rem,1.5vw,0.75rem)] flex-shrink-0">
            {/* Random Reroll Button */}
            <Button
              onClick={onRandomReroll}
              variant="outline"
              size="lg"
              className="py-[clamp(0.5rem,2vh,0.75rem)] text-[clamp(0.7rem,2.5vw,0.875rem)] font-semibold rounded-xl border-2 hover:bg-muted/50 px-[clamp(0.5rem,2vw,1rem)]"
              title="Random Reroll"
            >
              <Shuffle className="w-[clamp(0.9rem,3.5vw,1.1rem)] h-[clamp(0.9rem,3.5vw,1.1rem)] mr-1" />
              <span>Reroll</span>
            </Button>

            {/* Share Button */}
            {showShare && (
              <ShareButton
                racketName={racketName!}
                score={score!}
                price={price!}
                isCustom={isCustom!}
                forehandRubberName={forehandRubberName}
                backhandRubberName={backhandRubberName}
                className="py-[clamp(0.5rem,2vh,0.75rem)] text-[clamp(0.7rem,2.5vw,0.875rem)] font-semibold rounded-xl border-2 hover:bg-muted/50 px-[clamp(0.5rem,2vw,1rem)] h-auto"
              />
            )}

            {/* Compare Button */}
            <Button
              onClick={onAddToCompare}
              variant="outline"
              size="lg"
              className="py-[clamp(0.5rem,2vh,0.75rem)] text-[clamp(0.7rem,2.5vw,0.875rem)] font-semibold rounded-xl border-2 hover:bg-muted/50 px-[clamp(0.5rem,2vw,1rem)]"
            >
              <GitCompare className="w-[clamp(0.9rem,3.5vw,1.1rem)] h-[clamp(0.9rem,3.5vw,1.1rem)] mr-1" />
              <span>Compare</span>
            </Button>
          </div>

          {/* Request Quotes Button (Primary CTA) */}
          <Button
            onClick={onRequestQuotes}
            size="lg"
            className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-accent-foreground py-[clamp(0.5rem,2vh,0.75rem)] h-[clamp(2.5rem,8vh,3rem)] sm:h-auto text-[clamp(0.75rem,3vw,0.9rem)] font-bold rounded-xl shadow-accent px-[clamp(0.5rem,4vw,2rem)] transition-all active:scale-95"
          >
            <GitCompare className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Ask for an offer from the best shops</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyDecisionBar;
