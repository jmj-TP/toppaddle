import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Wrench, Shield, Shuffle, ChevronDown } from "lucide-react";

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

  const statusText = `Assembly: ${assembleForMe ? 'On' : 'Free'} - Seal: ${sealsService ? 'On' : 'Off'} - Random`;

  // Desktop expanded view
  const ExpandedView = () => (
    <div className="space-y-[1.5vh] w-full">
      {/* Pro Assembly Card */}
      {!isPreassembled && (
        <Card className="p-[2vh] space-y-[1vh] bg-card/50 border-border">
          <div className="flex items-start gap-[1vw]">
            <Wrench className="w-[4vw] lg:w-[1.2vw] h-[4vw] lg:h-[1.2vw] text-accent flex-shrink-0 mt-[0.5vh]" />
            <div className="flex-1 space-y-[0.5vh]">
              <h4 className="font-semibold text-[3.5vw] lg:text-[0.95vw] text-foreground">
                Free Professional Assembly
              </h4>
              <p className="text-[3vw] lg:text-[0.8vw] text-muted-foreground leading-relaxed">
                Expert gluing service included
              </p>
              <ul className="text-[2.8vw] lg:text-[0.75vw] text-muted-foreground space-y-[0.3vh] mt-[1vh]">
                <li>• Perfect alignment & pressure</li>
                <li>• Professional-grade adhesive</li>
              </ul>
            </div>
            <div className="flex items-center gap-[1vw]">
              <span className="text-[3vw] lg:text-[0.8vw] font-medium text-muted-foreground">
                {assembleForMe ? 'On' : 'Off'}
              </span>
              <Checkbox
                checked={assembleForMe}
                onCheckedChange={onAssembleChange}
                className="w-[4vw] h-[4vw] lg:w-[1.2vw] lg:h-[1.2vw]"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Blade Seal Service Card */}
      {!isPreassembled && (
        <Card className="p-[2vh] space-y-[1vh] bg-card/50 border-border">
          <div className="flex items-start gap-[1vw]">
            <Shield className="w-[4vw] lg:w-[1.2vw] h-[4vw] lg:h-[1.2vw] text-accent flex-shrink-0 mt-[0.5vh]" />
            <div className="flex-1 space-y-[0.5vh]">
              <h4 className="font-semibold text-[3.5vw] lg:text-[0.95vw] text-foreground">
                Blade Seal Service
              </h4>
              <p className="text-[3vw] lg:text-[0.8vw] text-muted-foreground leading-relaxed">
                Protective edge coating for durability
              </p>
              {sealsService && (
                <p className="text-[2.5vw] lg:text-[0.7vw] text-muted-foreground/80 italic mt-[1vh]">
                  Note: Adds 2-3 business days to processing
                </p>
              )}
            </div>
            <div className="flex items-center gap-[1vw]">
              <span className="text-[3vw] lg:text-[0.8vw] font-medium text-muted-foreground">
                {sealsService ? 'On' : 'Off'}
              </span>
              <Checkbox
                checked={sealsService}
                onCheckedChange={onSealsChange}
                className="w-[4vw] h-[4vw] lg:w-[1.2vw] lg:h-[1.2vw]"
              />
            </div>
          </div>
        </Card>
      )}

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
            className="bg-muted hover:bg-muted/70 px-[4vw] py-[1.5vh] rounded-full text-[3vw] font-medium text-foreground transition-colors"
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
