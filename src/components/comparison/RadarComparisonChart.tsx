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
  includeValue?: boolean;
  includeWeight?: boolean;
  hideControls?: boolean;
}

const COLORS = ['hsl(var(--accent))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

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
  onPerformanceViewChange,
  includeValue: externalIncludeValue,
  includeWeight: externalIncludeWeight,
  hideControls = false
}: RadarComparisonChartProps) => {
  const [internalPerformanceView, setInternalPerformanceView] = useState<PerformanceView>('overall');
  const [internalIncludeWeight, setInternalIncludeWeight] = useState(true);
  const [internalIncludeValue, setInternalIncludeValue] = useState(true);
  
  // Use external values if provided, otherwise use internal
  const performanceView = externalPerformanceView || internalPerformanceView;
  const includeWeight = externalIncludeWeight !== undefined ? externalIncludeWeight : internalIncludeWeight;
  const includeValue = externalIncludeValue !== undefined ? externalIncludeValue : internalIncludeValue;

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

  // Define all possible stats with their calculations
  const statDefinitions = [
    {
      key: 'speed',
      stat: 'Speed',
      getValue: (paddle: ComparisonPaddle) => {
        const stats = getViewStats(paddle);
        return stats.speed !== undefined ? Math.min(100, stats.speed) : null;
      },
    },
    {
      key: 'control',
      stat: 'Control',
      getValue: (paddle: ComparisonPaddle) => {
        const stats = getViewStats(paddle);
        return stats.control !== undefined ? Math.min(100, stats.control) : null;
      },
    },
    {
      key: 'power',
      stat: 'Power',
      getValue: (paddle: ComparisonPaddle) => {
        const stats = getViewStats(paddle);
        return stats.power !== undefined ? Math.min(100, stats.power) : null;
      },
    },
    {
      key: 'spin',
      stat: 'Spin',
      getValue: (paddle: ComparisonPaddle) => {
        const stats = getViewStats(paddle);
        return stats.spin !== undefined ? Math.min(100, stats.spin) : null;
      },
    },
    ...(includeValue ? [{
      key: 'value',
      stat: 'Value',
      getValue: (paddle: ComparisonPaddle) => {
        const stats = getViewStats(paddle);
        const price = stats.price || paddle.price;
        return price !== undefined ? priceToRadarValue(price) : null;
      },
    }] : []),
    ...(includeWeight ? [{
      key: 'weight',
      stat: 'Weight',
      getValue: (paddle: ComparisonPaddle) => {
        return paddle.weight !== undefined ? weightToRadarValue(paddle.weight) : null;
      },
    }] : []),
  ];

  // Filter out stats where all paddles have null values
  const availableStats = statDefinitions.filter(statDef => 
    paddles.some(paddle => statDef.getValue(paddle) !== null)
  );

  const data = availableStats.map(statDef => ({
    stat: statDef.stat,
    ...paddles.reduce((acc, paddle) => {
      const value = statDef.getValue(paddle);
      return {
        ...acc,
        [getDisplayName(paddle)]: value !== null ? value : 0,
      };
    }, {})
  }));

  const handleLegendClick = (entry: any) => {
    const paddle = paddles.find(p => getDisplayName(p) === entry.value);
    if (paddle && onPaddleSelect) {
      onPaddleSelect(paddle.id);
    }
  };

  return (
    <div className="w-full space-y-4">
      {!hideControls && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{VIEW_LABELS[performanceView]}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={includeWeight ? "default" : "outline"}
              size="sm"
              onClick={() => setInternalIncludeWeight(!internalIncludeWeight)}
              className="h-8 px-3 text-xs"
            >
              Weight
            </Button>
            <Button
              variant={includeValue ? "default" : "outline"}
              size="sm"
              onClick={() => setInternalIncludeValue(!internalIncludeValue)}
              className="h-8 px-3 text-xs"
            >
              Value
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleView}
              className="gap-2 h-8 px-3"
            >
              Next View
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
      <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            data={data}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
            className="mx-auto"
          >
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="stat" 
              tick={{ 
                fill: 'hsl(var(--foreground))', 
                fontSize: 11,
                fontWeight: 500 
              }}
              tickLine={false}
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
    </div>
  );
};

export type { PerformanceView };
