import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

interface StatsDisplayProps {
  stats: {
    speed: number;
    spin: number;
    control: number;
    power: number;
    price: number;
  };
  grip: string;
  thickness: string;
  level: string;
  blade: Blade | null;
  forehand: Rubber | null;
  backhand: Rubber | null;
  racket: PreAssembledRacket | null;
  onRandomReroll: () => void;
}

const StatsDisplay = ({
  stats,
  grip,
  thickness,
  level,
  blade,
  forehand,
  backhand,
  racket,
  onRandomReroll,
}: StatsDisplayProps) => {
  const StatBar = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
    <div className="flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-foreground">{label}:</span>
          <span className="text-sm font-bold text-foreground">{value}</span>
        </div>
        <Progress value={value} className="h-3" />
      </div>
    </div>
  );

  const handleBuyClick = () => {
    if (racket) {
      window.open(racket.Racket_Affiliate_Link, "_blank");
    } else if (blade && forehand && backhand) {
      // Open all three links
      window.open(blade.Blade_Affiliate_Link, "_blank");
      setTimeout(() => window.open(forehand.Rubber_Affiliate_Link, "_blank"), 500);
      setTimeout(() => window.open(backhand.Rubber_Affiliate_Link, "_blank"), 1000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Price and Level */}
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-8 justify-center">
          <div className="text-center">
            <span className="text-sm text-muted-foreground block mb-1">Price</span>
            <span className="text-3xl font-bold text-foreground">${stats.price}</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <span className="text-sm text-muted-foreground block mb-1">Level</span>
            <span className="text-2xl font-semibold text-foreground">{level}</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <span className="text-sm text-muted-foreground block mb-1">Grip</span>
            <span className="text-2xl font-semibold text-foreground">{grip}</span>
          </div>
          {thickness && (
            <>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <span className="text-sm text-muted-foreground block mb-1">Sponge</span>
                <span className="text-2xl font-semibold text-foreground">{thickness}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border space-y-5">
        <h3 className="text-lg font-semibold text-foreground mb-4">Combined Stats</h3>
        <StatBar label="Speed" value={stats.speed} icon="💨" />
        <StatBar label="Spin" value={stats.spin} icon="🌀" />
        <StatBar label="Control" value={stats.control} icon="🎯" />
        <StatBar label="Power" value={stats.power} icon="⚡" />
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <Button
          onClick={handleBuyClick}
          variant="accent"
          size="lg"
          className="w-full text-lg py-7 font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Add to Cart
        </Button>
        <Button
          onClick={onRandomReroll}
          variant="default"
          size="lg"
          className="w-full text-lg py-7 font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Random Reroll
        </Button>
      </div>

      {/* Component Details */}
      {!racket && blade && forehand && backhand && (
        <Card className="p-6 space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-primary mb-3">Components</h3>
          
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">🏓 Blade</p>
                <p className="font-medium text-foreground">{blade.Blade_Name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(blade.Blade_Affiliate_Link, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">🔴 Forehand</p>
                <p className="font-medium text-foreground">{forehand.Rubber_Name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(forehand.Rubber_Affiliate_Link, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">🔵 Backhand</p>
                <p className="font-medium text-foreground">{backhand.Rubber_Name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(backhand.Rubber_Affiliate_Link, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatsDisplay;
