import { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface RadarComparisonChartProps {
  paddles: ComparisonPaddle[];
  selectedPaddle?: string | null;
  onPaddleSelect?: (paddleId: string) => void;
  performanceView?: PerformanceView;
  onPerformanceViewChange?: (view: PerformanceView) => void;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

type PerformanceView = 'overall' | 'forehand' | 'blade' | 'backhand';

const VIEW_LABELS = {
  overall: 'Overall Performance Overview',
  forehand: 'Forehand Rubber Performance Overview',
  blade: 'Blade Performance Overview',
  backhand: 'Backhand Rubber Performance Overview',
};

export const RadarComparisonChart = ({ 
  paddles, 
  selectedPaddle, 
  onPaddleSelect,
  performanceView: externalPerformanceView,
  onPerformanceViewChange 
}: RadarComparisonChartProps) => {
  const [internalPerformanceView, setInternalPerformanceView] = useState<PerformanceView>('overall');
  
  // Use external view if provided, otherwise use internal
  const performanceView = externalPerformanceView || internalPerformanceView;

  if (paddles.length === 0) return null;

  const cycleView = () => {
    const views: PerformanceView[] = ['overall', 'forehand', 'blade', 'backhand'];
    const currentIndex = views.indexOf(performanceView);
    const nextIndex = (currentIndex + 1) % views.length;
    const nextView = views[nextIndex];
    
    if (onPerformanceViewChange) {
      onPerformanceViewChange(nextView);
    } else {
      setInternalPerformanceView(nextView);
    }
  };

  // Get stats based on view
  const getViewStats = (paddle: ComparisonPaddle) => {
    switch (performanceView) {
      case 'forehand':
        return paddle.forehandStats || {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
          price: paddle.price,
        };
      case 'blade':
        return paddle.bladeStats || {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
          price: paddle.price,
        };
      case 'backhand':
        return paddle.backhandStats || {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
          price: paddle.price,
        };
      default:
        return {
          speed: paddle.speed,
          control: paddle.control,
          power: paddle.power,
          spin: paddle.spin,
          price: paddle.price,
        };
    }
  };

  // Convert price to radar value (inverse: cheaper = higher score)
  const priceToRadarValue = (price: number) => {
    const maxPrice = 500; // Maximum expected price
    return Math.max(0, Math.min(100, ((maxPrice - price) / maxPrice) * 100));
  };

  // Convert weight to radar value (optimal weight = 175g)
  const weightToRadarValue = (weight: number) => {
    const optimalWeight = 175;
    const maxDeviation = 50; // Maximum deviation from optimal
    const deviation = Math.abs(weight - optimalWeight);
    return Math.max(0, Math.min(100, ((maxDeviation - deviation) / maxDeviation) * 100));
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

  const includeWeight = performanceView === 'overall';

  const data = [
    {
      stat: 'Speed',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [getDisplayName(paddle)]: Math.min(100, getViewStats(paddle).speed),
      }), {})
    },
    {
      stat: 'Control',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [getDisplayName(paddle)]: Math.min(100, getViewStats(paddle).control),
      }), {})
    },
    {
      stat: 'Power',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [getDisplayName(paddle)]: Math.min(100, getViewStats(paddle).power),
      }), {})
    },
    {
      stat: 'Spin',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [getDisplayName(paddle)]: Math.min(100, getViewStats(paddle).spin),
      }), {})
    },
    {
      stat: 'Value',
      ...paddles.reduce((acc, paddle) => {
        const stats = getViewStats(paddle);
        const price = stats.price || paddle.price;
        return {
          ...acc,
          [getDisplayName(paddle)]: priceToRadarValue(price),
        };
      }, {})
    },
    ...(includeWeight ? [{
      stat: 'Weight',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [getDisplayName(paddle)]: weightToRadarValue(paddle.weight),
      }), {})
    }] : []),
  ];

  const handleLegendClick = (entry: any) => {
    const paddle = paddles.find(p => getDisplayName(p) === entry.value);
    if (paddle && onPaddleSelect) {
      onPaddleSelect(paddle.id);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{VIEW_LABELS[performanceView]}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={cycleView}
          className="gap-2"
        >
          Next View
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full h-[400px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="stat" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 14, fontWeight: 500 }}
            />
            {paddles.map((paddle, idx) => {
              const displayName = getDisplayName(paddle);
              return (
                <Radar
                  key={paddle.id}
                  name={displayName}
                  dataKey={displayName}
                  stroke={COLORS[idx]}
                  fill={COLORS[idx]}
                  fillOpacity={selectedPaddle ? (selectedPaddle === paddle.id ? 0.6 : 0.1) : 0.3}
                  strokeWidth={selectedPaddle === paddle.id ? 3 : 2}
                />
              );
            })}
            <Legend 
              onClick={handleLegendClick}
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Click on paddle names above to highlight and compare
      </p>
    </div>
  );
};

export type { PerformanceView };
