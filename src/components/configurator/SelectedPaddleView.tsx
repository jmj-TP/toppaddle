import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Gauge, Target, Shield, Star, Weight, DollarSign } from "lucide-react";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";

interface SelectedPaddleViewProps {
  blade?: Blade;
  forehand?: Rubber;
  backhand?: Rubber;
  racket?: PreAssembledRacket;
  grip?: string;
  forehandThickness?: string;
  backhandThickness?: string;
  forehandColor?: string;
  backhandColor?: string;
}

export const SelectedPaddleView = ({
  blade,
  forehand,
  backhand,
  racket,
  grip,
  forehandThickness,
  backhandThickness,
  forehandColor,
  backhandColor
}: SelectedPaddleViewProps) => {
  // Calculate total stats
  const totalSpeed = racket
    ? racket.Racket_Speed
    : blade && forehand && backhand
    ? Math.round((blade.Blade_Speed + forehand.Rubber_Speed + backhand.Rubber_Speed) / 3)
    : 0;

  const totalSpin = racket
    ? racket.Racket_Spin
    : blade && forehand && backhand
    ? Math.round((blade.Blade_Spin + forehand.Rubber_Spin + backhand.Rubber_Spin) / 3)
    : 0;

  const totalControl = racket
    ? racket.Racket_Control
    : blade && forehand && backhand
    ? Math.round((blade.Blade_Control + forehand.Rubber_Control + backhand.Rubber_Control) / 3)
    : 0;

  const totalPower = racket
    ? racket.Racket_Power
    : Math.round((totalSpeed + totalSpin) / 2);

  const totalPrice = racket
    ? racket.Racket_Price
    : (blade?.Blade_Price || 0) + (forehand?.Rubber_Price || 0) + (backhand?.Rubber_Price || 0);

  const totalWeight = blade && forehand && backhand
    ? (blade.Blade_Weight || 88) + (forehand.Rubber_Weight || 48) + (backhand.Rubber_Weight || 48)
    : 184;

  const StatBar = ({ label, value, Icon }: { label: string; value: number; Icon: any }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold text-accent">{value}</span>
      </div>
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <Card className="sticky top-6 p-8 rounded-3xl border-2 border-border bg-card">
      <h2 className="text-2xl font-semibold mb-6">Your Configuration</h2>

      {/* Visual Paddle Preview */}
      <div className="mb-8 relative">
        <div className="aspect-[3/4] max-w-xs mx-auto bg-gradient-to-br from-muted/50 to-muted/20 rounded-3xl flex items-center justify-center border-2 border-border overflow-hidden">
          <div className="text-center p-8">
            <Package className="w-24 h-24 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Paddle visualization
            </p>
          </div>
        </div>
      </div>

      {/* Components List */}
      <div className="space-y-4 mb-8">
        {racket ? (
          <div className="p-4 rounded-2xl bg-muted/30 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Pre-Assembled</p>
                <p className="font-semibold text-sm leading-tight line-clamp-2">
                  {racket.Racket_Name}
                </p>
                <Badge variant="secondary" className="text-xs mt-2">
                  {racket.Racket_Level}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Blade */}
            {blade && (
              <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Blade</p>
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {blade.Blade_Name}
                    </p>
                    {grip && (
                      <Badge variant="outline" className="text-xs mt-2">
                        {grip} Grip
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Forehand */}
            {forehand && (
              <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Forehand Rubber</p>
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {forehand.Rubber_Name}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {forehandColor && (
                        <Badge variant="outline" className="text-xs">
                          {forehandColor}
                        </Badge>
                      )}
                      {forehandThickness && (
                        <Badge variant="outline" className="text-xs">
                          {forehandThickness}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backhand */}
            {backhand && (
              <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Backhand Rubber</p>
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {backhand.Rubber_Name}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {backhandColor && (
                        <Badge variant="outline" className="text-xs">
                          {backhandColor}
                        </Badge>
                      )}
                      {backhandThickness && (
                        <Badge variant="outline" className="text-xs">
                          {backhandThickness}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Performance Stats */}
      <div className="space-y-4 mb-6 p-6 rounded-2xl bg-muted/20 border border-border">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Performance
        </h3>
        <StatBar label="Speed" value={totalSpeed} Icon={Gauge} />
        <StatBar label="Spin" value={totalSpin} Icon={Target} />
        <StatBar label="Control" value={totalControl} Icon={Shield} />
        <StatBar label="Power" value={totalPower} Icon={Star} />
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <Weight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Weight</span>
          <span className="text-sm font-semibold">{totalWeight}g</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          <span className="text-2xl font-semibold text-accent">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};
