import { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Button } from '@/components/ui/button';
import { ChevronRight, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { statExplanations } from '@/constants/statExplanations';

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

  // Calculate value as stats per dollar
  const statsToValueRadar = (stats: { speed?: number; control?: number; power?: number; spin?: number }, price: number) => {
    const speed = stats.speed || 0;
    const control = stats.control || 0;
    const power = stats.power || 0;
    const spin = stats.spin || 0;
    const totalStats = speed + control + power + spin;
    
    if (price <= 0 || totalStats === 0) return 0;
    
    // Stats per dollar
    const statsPerDollar = totalStats / price;
    
    // Value = (statsPerDollar / 2) × 100, capped at 100
    // 2 stats per dollar ($0.5 per stat) = 100 value (maximum)
    // 1 stat per dollar ($1 per stat) = 50 value
    // 0.5 stats per dollar ($2 per stat) = 25 value
    const value = (statsPerDollar / 2) * 100;
    return Math.min(100, Math.max(0, value));
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
        if (!price) return null;
        
        return statsToValueRadar(stats, price);
      },
    }] : []),
    ...(includeWeight && performanceView === 'overall' ? [{
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl font-bold min-h-[2rem] flex items-center">{VIEW_LABELS[performanceView]}</h2>
            <div className="flex flex-wrap items-center gap-2 min-h-[2rem]">
              {performanceView === 'overall' && (
                <>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={includeValue ? "default" : "outline"}
                          size="sm"
                          onClick={() => setInternalIncludeValue(!internalIncludeValue)}
                          className="h-8 px-3 text-xs"
                        >
                          Value
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs font-medium">Stats per dollar (higher is better)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={includeWeight ? "default" : "outline"}
                          size="sm"
                          onClick={() => setInternalIncludeWeight(!internalIncludeWeight)}
                          className="h-8 px-3 text-xs"
                        >
                          Weight
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs font-medium">Total paddle weight (Overall view only)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
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
        </div>
      )}
      <div className="w-full space-y-6">
        <div className="w-full h-[350px] sm:h-[450px] lg:h-[500px]">
          <TooltipProvider delayDuration={100}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                data={data}
                margin={{ top: 20, right: 50, bottom: 20, left: 50 }}
                className="mx-auto"
              >
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="stat" 
                tick={(props: any) => {
                  const { x, y, payload, cx, cy } = props;
                  const statName = payload.value;
                  const explanation = statExplanations[statName];
                  
                  // Calculate angle from center to point
                  const angle = Math.atan2(y - cy, x - cx);
                  const cos = Math.cos(angle);
                  const sin = Math.sin(angle);
                  
                  // Extend label further from center
                  const radius = 15;
                  const labelX = x + cos * radius;
                  const labelY = y + sin * radius;
                  
                  // Determine text anchor based on position
                  let anchor = 'middle';
                  if (cos > 0.5) anchor = 'start';
                  else if (cos < -0.5) anchor = 'end';
                  
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <g>
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor={anchor}
                            dominantBaseline="middle"
                            fill="hsl(var(--foreground))"
                            fontSize={12}
                            fontWeight={500}
                            className="cursor-help select-none"
                          >
                            {statName}
                          </text>
                        </g>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        {explanation && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold">{statName}</p>
                            <p className="text-xs text-muted-foreground">{explanation.detailed}</p>
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
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
                display: 'none'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {paddles.map((paddle, idx) => {
            const displayName = getDisplayName(paddle);
            return (
              <button
                key={paddle.id}
                onClick={() => handleLegendClick({ value: displayName })}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: COLORS[idx] }}
                />
                <span className="text-sm font-medium text-foreground">
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export type { PerformanceView };
