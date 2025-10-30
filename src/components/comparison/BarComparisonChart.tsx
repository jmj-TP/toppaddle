import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Trophy } from 'lucide-react';
import type { PerformanceView } from './RadarComparisonChart';

interface BarComparisonChartProps {
  paddles: ComparisonPaddle[];
  stat: 'speed' | 'control' | 'power' | 'spin';
  label: string;
  performanceView?: PerformanceView;
}

const COLORS = ['hsl(var(--accent))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export const BarComparisonChart = ({ paddles, stat, label, performanceView = 'overall' }: BarComparisonChartProps) => {
  // Get stats based on view
  const getViewStats = (paddle: ComparisonPaddle) => {
    switch (performanceView) {
      case 'forehand':
        return paddle.forehandStats || {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
        };
      case 'blade':
        return paddle.bladeStats || {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
        };
      case 'backhand':
        return paddle.backhandStats || {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
        };
      default:
        return {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
        };
    }
  };

  // Get display name based on view
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

  const paddlesWithStats = paddles
    .map(p => ({
      ...p,
      displayName: getDisplayName(p),
      statValue: getViewStats(p)[stat],
    }))
    .filter(p => p.statValue !== undefined);

  // Don't render if no paddles have this stat
  if (paddlesWithStats.length === 0) return null;

  const maxValue = Math.max(...paddlesWithStats.map(p => p.statValue));
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <div className="space-y-2">
        {paddlesWithStats.map((paddle, idx) => {
          const isHighest = paddle.statValue === maxValue;
          return (
            <div key={paddle.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate mr-2">{paddle.displayName}</span>
                <span className="font-medium text-foreground flex items-center gap-1 flex-shrink-0">
                  {paddle.statValue}
                  {isHighest && <Trophy className="w-3 h-3 text-primary" />}
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${paddle.statValue}%`,
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
