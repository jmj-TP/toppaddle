import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Trophy } from 'lucide-react';

interface BarComparisonChartProps {
  paddles: ComparisonPaddle[];
  stat: 'speed' | 'control' | 'power' | 'spin';
  label: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export const BarComparisonChart = ({ paddles, stat, label }: BarComparisonChartProps) => {
  const maxValue = Math.max(...paddles.map(p => p[stat]));
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <div className="space-y-2">
        {paddles.map((paddle, idx) => {
          const isHighest = paddle[stat] === maxValue;
          return (
            <div key={paddle.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{paddle.name}</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  {paddle[stat]}
                  {isHighest && <Trophy className="w-3 h-3 text-primary" />}
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${paddle[stat]}%`,
                    backgroundColor: COLORS[idx],
                    boxShadow: isHighest ? `0 0 8px ${COLORS[idx]}` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
