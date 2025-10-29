import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Check, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InsightsSectionProps {
  paddles: ComparisonPaddle[];
  selectedPaddleId?: string | null;
  onPaddleSelect?: (paddleId: string) => void;
}

export const InsightsSection = ({ paddles, selectedPaddleId, onPaddleSelect }: InsightsSectionProps) => {
  if (paddles.length < 2) return null;

  const selectedPaddle = paddles.find(p => p.id === selectedPaddleId) || paddles[0];
  const otherPaddles = paddles.filter(p => p.id !== selectedPaddle.id);

  const cycleToNextPaddle = () => {
    const currentIndex = paddles.findIndex(p => p.id === selectedPaddle.id);
    const nextIndex = (currentIndex + 1) % paddles.length;
    const nextPaddle = paddles[nextIndex];
    if (onPaddleSelect) {
      onPaddleSelect(nextPaddle.id);
    }
  };

  const generateInsights = (paddle1: ComparisonPaddle, paddle2: ComparisonPaddle) => {
    const insights: { text: string; isPositive: boolean }[] = [];

    // Compare stats
    const speedDiff = ((paddle1.speed - paddle2.speed) / paddle2.speed) * 100;
    const controlDiff = ((paddle1.control - paddle2.control) / paddle2.control) * 100;
    const powerDiff = ((paddle1.power - paddle2.power) / paddle2.power) * 100;
    const spinDiff = ((paddle1.spin - paddle2.spin) / paddle2.spin) * 100;
    const weightDiff = paddle1.weight - paddle2.weight;
    const priceDiff = paddle1.price - paddle2.price;

    // Show ALL differences, even tiny ones (0.1% threshold)
    if (Math.abs(speedDiff) > 0.1) {
      insights.push({
        text: `${Math.abs(speedDiff).toFixed(1)}% ${speedDiff > 0 ? 'higher' : 'lower'} speed`,
        isPositive: speedDiff > 0,
      });
    }

    if (Math.abs(controlDiff) > 0.1) {
      insights.push({
        text: `${Math.abs(controlDiff).toFixed(1)}% ${controlDiff > 0 ? 'better' : 'lower'} control`,
        isPositive: controlDiff > 0,
      });
    }

    if (Math.abs(powerDiff) > 0.1) {
      insights.push({
        text: `${Math.abs(powerDiff).toFixed(1)}% ${powerDiff > 0 ? 'more' : 'less'} power`,
        isPositive: powerDiff > 0,
      });
    }

    if (Math.abs(spinDiff) > 0.1) {
      insights.push({
        text: `${Math.abs(spinDiff).toFixed(1)}% ${spinDiff > 0 ? 'more' : 'less'} spin`,
        isPositive: spinDiff > 0,
      });
    }

    if (Math.abs(weightDiff) > 0.1) {
      insights.push({
        text: `${Math.abs(weightDiff).toFixed(1)}g ${weightDiff > 0 ? 'heavier' : 'lighter'}`,
        isPositive: weightDiff < 0,
      });
    }

    if (Math.abs(priceDiff) > 0.1) {
      insights.push({
        text: `$${Math.abs(priceDiff).toFixed(2)} ${priceDiff > 0 ? 'more expensive' : 'cheaper'}`,
        isPositive: priceDiff < 0,
      });
    }

    return insights;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Comparison Insights</h2>
      <div className="space-y-6">
        {otherPaddles.map((otherPaddle) => {
          const insights = generateInsights(selectedPaddle, otherPaddle);
          const positiveInsights = insights.filter(i => i.isPositive);
          
          return (
            <div key={`${selectedPaddle.id}-${otherPaddle.id}`} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm">
                  Why is <span className="text-primary">{selectedPaddle.name}</span> better than{' '}
                  <span className="text-muted-foreground">{otherPaddle.name}</span>?
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cycleToNextPaddle}
                  className="flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {positiveInsights.length === 0 ? (
                  <li className="text-sm text-muted-foreground">
                    {selectedPaddle.name} has no significant advantages over {otherPaddle.name}
                  </li>
                ) : (
                  positiveInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">
                        {insight.text}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
