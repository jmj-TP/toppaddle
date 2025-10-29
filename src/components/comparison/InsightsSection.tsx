import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface InsightsSectionProps {
  paddles: ComparisonPaddle[];
}

export const InsightsSection = ({ paddles }: InsightsSectionProps) => {
  if (paddles.length < 2) return null;

  const generateInsights = (paddle1: ComparisonPaddle, paddle2: ComparisonPaddle) => {
    const insights: { text: string; isPositive: boolean }[] = [];

    // Compare stats
    const speedDiff = ((paddle1.speed - paddle2.speed) / paddle2.speed) * 100;
    const controlDiff = ((paddle1.control - paddle2.control) / paddle2.control) * 100;
    const powerDiff = ((paddle1.power - paddle2.power) / paddle2.power) * 100;
    const spinDiff = ((paddle1.spin - paddle2.spin) / paddle2.spin) * 100;
    const weightDiff = paddle1.weight - paddle2.weight;
    const priceDiff = paddle1.price - paddle2.price;

    if (Math.abs(speedDiff) > 5) {
      insights.push({
        text: `${Math.abs(speedDiff).toFixed(0)}% ${speedDiff > 0 ? 'higher' : 'lower'} speed`,
        isPositive: speedDiff > 0,
      });
    }

    if (Math.abs(controlDiff) > 5) {
      insights.push({
        text: `${Math.abs(controlDiff).toFixed(0)}% ${controlDiff > 0 ? 'better' : 'lower'} control`,
        isPositive: controlDiff > 0,
      });
    }

    if (Math.abs(powerDiff) > 5) {
      insights.push({
        text: `${Math.abs(powerDiff).toFixed(0)}% ${powerDiff > 0 ? 'more' : 'less'} power`,
        isPositive: powerDiff > 0,
      });
    }

    if (Math.abs(spinDiff) > 5) {
      insights.push({
        text: `${Math.abs(spinDiff).toFixed(0)}% ${spinDiff > 0 ? 'more' : 'less'} spin`,
        isPositive: spinDiff > 0,
      });
    }

    if (Math.abs(weightDiff) > 5) {
      insights.push({
        text: `${Math.abs(weightDiff).toFixed(0)}g ${weightDiff > 0 ? 'heavier' : 'lighter'}`,
        isPositive: weightDiff < 0,
      });
    }

    if (Math.abs(priceDiff) > 10) {
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
        {paddles.map((paddle1, idx1) =>
          paddles.slice(idx1 + 1).map((paddle2, idx2) => {
            const insights = generateInsights(paddle1, paddle2);
            return (
              <div key={`${paddle1.id}-${paddle2.id}`} className="space-y-3">
                <h3 className="font-semibold text-sm">
                  Why is <span className="text-primary">{paddle1.name}</span> better than{' '}
                  <span className="text-chart-2">{paddle2.name}</span>?
                </h3>
                <ul className="space-y-2">
                  {insights.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                      These paddles have very similar performance characteristics
                    </li>
                  ) : (
                    insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        {insight.isPositive ? (
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        )}
                        <span className={insight.isPositive ? 'text-foreground' : 'text-muted-foreground'}>
                          {insight.text}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
