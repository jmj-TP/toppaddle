import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Check, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type PerformanceView } from './RadarComparisonChart';

// Must match COLORS in RadarComparisonChart.tsx and PADDLE_COLORS in CompareClient.tsx
const PADDLE_COLORS = [
  'hsl(210, 100%, 50%)', // Neon Blue
  'hsl(25, 100%, 50%)',  // Neon Orange
  'hsl(150, 80%, 40%)'   // Neon Green
];

interface InsightsSectionProps {
  paddles: ComparisonPaddle[];
  selectedPaddleId?: string | null;
  onPaddleSelect?: (paddleId: string) => void;
  performanceView?: PerformanceView;
}

export const InsightsSection = ({ paddles, selectedPaddleId, onPaddleSelect, performanceView = 'overall' }: InsightsSectionProps) => {
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

  const getStatsForView = (paddle: ComparisonPaddle) => {
    if (performanceView === 'blade' && paddle.bladeStats) {
      return paddle.bladeStats;
    } else if (performanceView === 'forehand' && paddle.forehandStats) {
      return paddle.forehandStats;
    } else if (performanceView === 'backhand' && paddle.backhandStats) {
      return paddle.backhandStats;
    }
    return {
      speed: paddle.speed,
      control: paddle.control,
      power: paddle.power,
      spin: paddle.spin,
      price: paddle.price
    };
  };

  const generateInsights = (paddle1: ComparisonPaddle, paddle2: ComparisonPaddle) => {
    const insights: { text: string; isPositive: boolean }[] = [];

    const stats1 = getStatsForView(paddle1);
    const stats2 = getStatsForView(paddle2);

    // Compare stats based on view
    const speedDiff = ((stats1.speed - stats2.speed) / stats2.speed) * 100;
    const controlDiff = ((stats1.control - stats2.control) / stats2.control) * 100;
    const powerDiff = ((stats1.power - stats2.power) / stats2.power) * 100;
    const spinDiff = ((stats1.spin - stats2.spin) / stats2.spin) * 100;
    const priceDiff = stats1.price - stats2.price;

    // Only include weight comparison for overall view
    const weightDiff = performanceView === 'overall' ? paddle1.weight - paddle2.weight : null;

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

    if (weightDiff !== null && Math.abs(weightDiff) > 0.1) {
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

  const getDisplayName = (paddle: ComparisonPaddle) => {
    switch (performanceView) {
      case 'forehand':
        return paddle.forehandRubber || paddle.name;
      case 'blade':
        return paddle.blade || paddle.name;
      case 'backhand':
        return paddle.backhandRubber || paddle.name;
      default:
        return paddle.name;
    }
  };

  const getViewTitle = () => {
    switch (performanceView) {
      case 'blade':
        return 'Blade Comparison';
      case 'forehand':
        return 'Forehand Rubber Comparison';
      case 'backhand':
        return 'Backhand Rubber Comparison';
      default:
        return 'Comparison Insights';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">{getViewTitle()}</h2>
      <div className="space-y-6">
        {otherPaddles.map((otherPaddle) => {
          const insights = generateInsights(selectedPaddle, otherPaddle);
          const positiveInsights = insights.filter(i => i.isPositive);

          return (
            <div key={`${selectedPaddle.id}-${otherPaddle.id}`} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm flex items-center gap-1 flex-wrap">
                  Why is{
                    ' '}
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: PADDLE_COLORS[paddles.indexOf(selectedPaddle)] }}
                    />
                    <span style={{ color: PADDLE_COLORS[paddles.indexOf(selectedPaddle)] }}>
                      {getDisplayName(selectedPaddle)}
                    </span>
                  </span>
                  {' '}better than{' '}
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: PADDLE_COLORS[paddles.indexOf(otherPaddle)] }}
                    />
                    <span style={{ color: PADDLE_COLORS[paddles.indexOf(otherPaddle)] }}>
                      {getDisplayName(otherPaddle)}
                    </span>
                  </span>?
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
                    {getDisplayName(selectedPaddle)} has no significant advantages over {getDisplayName(otherPaddle)}
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
