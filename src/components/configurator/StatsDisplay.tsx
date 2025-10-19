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
}: StatsDisplayProps) => {
  const StatBar = ({ label, value, color = "primary" }: { label: string; value: number; color?: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-accent">{value}</span>
      </div>
      <Progress value={value} className="h-2" />
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
    <div className="space-y-6">
      {/* Main Stats */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-primary mb-4">Performance Stats</h3>
        <StatBar label="Speed" value={stats.speed} />
        <StatBar label="Spin" value={stats.spin} />
        <StatBar label="Control" value={stats.control} />
        <StatBar label="Power" value={stats.power} />
      </Card>

      {/* Details */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-2xl font-bold text-accent">${stats.price}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <Badge variant="secondary" className="text-base">{level}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grip</p>
            <p className="font-semibold text-foreground">{grip}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sponge</p>
            <p className="font-semibold text-foreground">{thickness}</p>
          </div>
        </div>

        <Button
          onClick={handleBuyClick}
          variant="accent"
          size="lg"
          className="w-full gap-2"
        >
          <ExternalLink className="h-5 w-5" />
          Buy Now (Amazon)
        </Button>
      </Card>

      {/* Component Details */}
      {!racket && blade && forehand && backhand && (
        <Card className="p-6 space-y-4">
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
