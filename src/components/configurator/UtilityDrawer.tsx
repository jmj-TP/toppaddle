import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Shuffle, ChevronDown } from "lucide-react";

interface UtilityDrawerProps {
  assembleForMe: boolean;
  onAssembleChange: (value: boolean) => void;
  sealsService: boolean;
  onSealsChange: (value: boolean) => void;
  onRandomReroll: () => void;
  isPreassembled: boolean;
}

const UtilityDrawer = ({
  assembleForMe,
  onAssembleChange,
  sealsService,
  onSealsChange,
  onRandomReroll,
  isPreassembled,
}: UtilityDrawerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusText = 'Utilities';

  // Desktop expanded view
  const ExpandedView = () => (
    <div className="space-y-[1.5vh] w-full">
      {/* Random Reroll Card */}
      <Card className="p-[2vh] bg-card/50 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[1vw]">
            <Shuffle className="w-[4vw] lg:w-[1.2vw] h-[4vw] lg:h-[1.2vw] text-accent" />
            <div>
              <h4 className="font-semibold text-[3.5vw] lg:text-[0.95vw] text-foreground">
                Random Reroll
              </h4>
              <p className="text-[3vw] lg:text-[0.8vw] text-muted-foreground">
                Discover new combinations
              </p>
            </div>
          </div>
          <Button
            onClick={onRandomReroll}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-[3vw] lg:px-[1.5vw] py-[1vh] text-[3vw] lg:text-[0.85vw] rounded-xl"
          >
            Roll
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <>
      {/* Desktop: Expandable section */}
      <div className="hidden lg:block fixed bottom-[12vh] right-[2vw] w-[22vw] z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-card border border-border rounded-t-2xl px-[1.5vw] py-[1.5vh] flex items-center justify-between hover:bg-muted/30 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="utility-content"
        >
          <span className="text-[0.85vw] text-muted-foreground font-medium">
            {statusText}
          </span>
          <ChevronDown className={`w-[1.2vw] h-[1.2vw] text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div
            id="utility-content"
            className="bg-card border border-t-0 border-border rounded-b-2xl p-[1.5vw] shadow-lg animate-accordion-down"
            style={{
              animation: 'accordion-down 200ms ease-out'
            }}
          >
            <ExpandedView />
          </div>
        )}
      </div>

      {/* Mobile: Bottom sheet */}
      <Drawer>
        <DrawerTrigger asChild className="lg:hidden">
          <button
            className="bg-orange hover:bg-orange/90 px-[4vw] py-[1.5vh] rounded-full text-[3vw] font-medium text-orange-foreground transition-colors"
            aria-label="Open utility options"
          >
            Utilities
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader>
            <DrawerTitle className="text-[4.5vw]">Utility Options</DrawerTitle>
            <DrawerDescription className="text-[3.5vw]">
              Configure assembly, services, and reroll
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-[4vw] overflow-y-auto">
            <ExpandedView />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="text-[3.5vw] py-[2vh]">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UtilityDrawer;
