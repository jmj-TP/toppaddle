import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, DollarSign } from 'lucide-react';

interface VerdictSectionProps {
  paddles: ComparisonPaddle[];
  considerPrice: boolean;
}

export const VerdictSection = ({ paddles, considerPrice }: VerdictSectionProps) => {
  if (paddles.length === 0) return null;

  const calculateStatsScore = (paddle: ComparisonPaddle) => {
    return (paddle.speed + paddle.control + paddle.power + paddle.spin) / 4;
  };

  const calculateValueScore = (paddle: ComparisonPaddle) => {
    return calculateStatsScore(paddle) / paddle.price;
  };

  const bestPerformance = paddles.reduce((best, current) =>
    calculateStatsScore(current) > calculateStatsScore(best) ? current : best
  );

  const bestValue = paddles.reduce((best, current) =>
    calculateValueScore(current) > calculateValueScore(best) ? current : best
  );

  const winner = considerPrice ? bestValue : bestPerformance;

  return (
    <div className="space-y-4">
      <Card className="p-6 border-2 border-primary shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">
            {considerPrice ? 'Best Price/Performance' : 'Best Overall Performance'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={winner.image}
            alt={winner.name}
            className="w-20 h-20 object-contain rounded-lg bg-muted"
          />
          <div>
            <h3 className="font-bold text-lg">{winner.name}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{winner.level}</Badge>
              <Badge variant="outline">${winner.price}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Stats Score: {calculateStatsScore(winner).toFixed(1)}
              {considerPrice && ` • Value: ${calculateValueScore(winner).toFixed(3)}`}
            </p>
          </div>
        </div>
      </Card>

      {!considerPrice && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-chart-2" />
            <h2 className="text-lg font-semibold">Best Value</h2>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={bestValue.image}
              alt={bestValue.name}
              className="w-16 h-16 object-contain rounded-lg bg-muted"
            />
            <div>
              <h3 className="font-semibold">{bestValue.name}</h3>
              <p className="text-sm text-muted-foreground">
                Value Score: {calculateValueScore(bestValue).toFixed(3)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
