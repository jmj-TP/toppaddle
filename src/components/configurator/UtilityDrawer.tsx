import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Wrench, Shuffle, Shield, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface UtilityDrawerProps {
  assembleForMe: boolean;
  onAssembleChange: (value: boolean) => void;
  sealsService: boolean;
  onSealsChange: (value: boolean) => void;
  onRandomReroll: () => void;
  onUndo?: () => void;
  isCustomMode: boolean;
}

const UtilityDrawer = ({ 
  assembleForMe, 
  onAssembleChange, 
  sealsService, 
  onSealsChange, 
  onRandomReroll,
  onUndo,
  isCustomMode
}: UtilityDrawerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [rerollHistory, setRerollHistory] = useState<any>(null);

  const handleReroll = () => {
    // Store current state for undo
    setRerollHistory({ assembleForMe, sealsService });
    onRandomReroll();
    
    // Show undo toast
    const undoToast = toast("Randomized!", {
      description: "Your paddle has been rerolled",
      action: onUndo ? {
        label: "Undo",
        onClick: () => {
          if (onUndo) onUndo();
          toast.dismiss(undoToast);
        }
      } : undefined,
      duration: 5000,
    });
  };

  const statusSummary = `Assembly: ${assembleForMe ? 'On' : 'Free'} • Seal: ${sealsService ? 'On' : 'Off'} • Random`;

  // Mobile version (Sheet)
  const MobileDrawer = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8 px-3 bg-background border-border hover:bg-accent/5"
        >
          <Wrench className="w-3.5 h-3.5 mr-1.5" />
          Utilities
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Utilities</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <UtilityCards />
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop version (Expandable)
  const DesktopDrawer = () => (
    <Card className="overflow-hidden border-2 border-border bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-accent/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-muted-foreground">{statusSummary}</span>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
          <UtilityCards />
        </div>
      )}
    </Card>
  );

  const UtilityCards = () => (
    <>
      {/* Pro Assembly */}
      <Card className="p-3 bg-background border border-border">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-accent" />
              <h4 className="text-sm font-semibold text-foreground">Pro Assembly</h4>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent">Free</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Professional gluing & cutting by experts
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
              <li>• Perfect rubber alignment</li>
              <li>• Optimal glue thickness</li>
            </ul>
          </div>
          <Switch 
            checked={assembleForMe} 
            onCheckedChange={onAssembleChange}
            aria-label="Toggle pro assembly"
          />
        </div>
      </Card>

      {/* Blade Seal Service */}
      {isCustomMode && (
        <Card className="p-3 bg-background border border-border">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-accent" />
                <h4 className="text-sm font-semibold text-foreground">Blade Seal Service</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Protective coating for blade longevity
              </p>
              {sealsService && (
                <p className="text-[10px] text-muted-foreground/70 italic">
                  Note: Sealing may slightly affect feel
                </p>
              )}
            </div>
            <Switch 
              checked={sealsService} 
              onCheckedChange={onSealsChange}
              aria-label="Toggle blade seal service"
            />
          </div>
        </Card>
      )}

      {/* Random Reroll */}
      <Card className="p-3 bg-background border border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shuffle className="w-4 h-4 text-accent" />
              <h4 className="text-sm font-semibold text-foreground">Random Reroll</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Randomize all selections for new ideas
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleReroll}
            className="bg-accent hover:bg-accent/90 text-accent-foreground h-8 px-3 text-xs"
          >
            Reroll
          </Button>
        </div>
      </Card>
    </>
  );

  return (
    <>
      {/* Mobile: Sheet */}
      <div className="md:hidden">
        <MobileDrawer />
      </div>
      
      {/* Desktop: Expandable Card */}
      <div className="hidden md:block">
        <DesktopDrawer />
      </div>
    </>
  );
};

export default UtilityDrawer;
