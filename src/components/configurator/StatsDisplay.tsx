import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Gauge, Target, Shield, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

interface StatsDisplayProps {
  stats: {
    speed: number;
    spin: number;
    control: number;
    power: number;
    price: number;
  };
  level: string;
  blade: Blade | null;
  forehand: Rubber | null;
  backhand: Rubber | null;
  racket: PreAssembledRacket | null;
  onRandomReroll: () => void;
}

const StatsDisplay = ({
  stats,
  level,
  blade,
  forehand,
  backhand,
  racket,
  onRandomReroll,
}: StatsDisplayProps) => {
  const StatBar = ({ label, value, Icon }: { label: string; value: number; Icon: any }) => (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="text-sm font-medium min-w-[60px]">{label}:</span>
      <div className="flex-1 bg-muted rounded-full h-2">
        <div 
          className="bg-primary rounded-full h-2 transition-all duration-500" 
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-semibold min-w-[30px]">{value}</span>
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
    <>
      <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
        {/* Left Column - Price, Level, and Stats */}
        <div className="space-y-6">
          {/* Price and Level Row */}
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xl font-bold text-foreground">Price: ${stats.price.toFixed(2)}</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <span className="text-xl font-bold text-foreground">Level: {level}</span>
            </div>
          </div>

          {/* Stats Bars */}
          <div className="space-y-2">
            <StatBar label="Speed" value={stats.speed} Icon={Gauge} />
            <StatBar label="Spin" value={stats.spin} Icon={Target} />
            <StatBar label="Control" value={stats.control} Icon={Shield} />
            <StatBar label="Power" value={stats.power} Icon={Star} />
          </div>
        </div>

        {/* Right Column - Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="w-full text-xl py-8 font-bold shadow-lg hover:shadow-xl transition-all bg-orange-500 hover:bg-orange-600 text-white border-4 border-black rounded-2xl"
          >
            Add to cart
          </Button>
          <Button
            onClick={onRandomReroll}
            size="lg"
            className="w-full text-xl py-8 font-bold shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white border-4 border-black rounded-2xl"
          >
            Random Reroll
          </Button>
        </div>
      </div>

      {/* Component Details Below */}
      <div className="mt-12">
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
    </>
  );
};

export default StatsDisplay;
