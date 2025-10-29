import { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ComparisonPaddle } from '@/stores/comparisonStore';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface RadarComparisonChartProps {
  paddles: ComparisonPaddle[];
  selectedPaddle?: string | null;
  onPaddleSelect?: (paddleId: string) => void;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

type PerformanceView = 'overall' | 'forehand' | 'blade' | 'backhand';

const VIEW_LABELS = {
  overall: 'Overall Performance Overview',
  forehand: 'Forehand Rubber Performance Overview',
  blade: 'Blade Performance Overview',
  backhand: 'Backhand Rubber Performance Overview',
};

export const RadarComparisonChart = ({ paddles, selectedPaddle, onPaddleSelect }: RadarComparisonChartProps) => {
  const [performanceView, setPerformanceView] = useState<PerformanceView>('overall');

  if (paddles.length === 0) return null;

  const cycleView = () => {
    const views: PerformanceView[] = ['overall', 'forehand', 'blade', 'backhand'];
    const currentIndex = views.indexOf(performanceView);
    const nextIndex = (currentIndex + 1) % views.length;
    setPerformanceView(views[nextIndex]);
  };

  // Adjust stats based on view (simplified for demo - you can add more complex logic)
  const getViewStats = (paddle: ComparisonPaddle) => {
    switch (performanceView) {
      case 'forehand':
        return {
          speed: paddle.speed * 1.1,
          control: paddle.control * 0.9,
          power: paddle.power * 1.15,
          spin: paddle.spin * 1.2,
        };
      case 'blade':
        return {
          speed: paddle.speed * 0.95,
          control: paddle.control * 1.1,
          power: paddle.power * 0.9,
          spin: paddle.spin * 0.85,
        };
      case 'backhand':
        return {
          speed: paddle.speed * 0.9,
          control: paddle.control * 1.2,
          power: paddle.power * 0.85,
          spin: paddle.spin * 1.1,
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

  const data = [
    {
      stat: 'Speed',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [paddle.name]: Math.min(100, getViewStats(paddle).speed),
      }), {})
    },
    {
      stat: 'Control',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [paddle.name]: Math.min(100, getViewStats(paddle).control),
      }), {})
    },
    {
      stat: 'Power',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [paddle.name]: Math.min(100, getViewStats(paddle).power),
      }), {})
    },
    {
      stat: 'Spin',
      ...paddles.reduce((acc, paddle) => ({
        ...acc,
        [paddle.name]: Math.min(100, getViewStats(paddle).spin),
      }), {})
    },
  ];

  const handleLegendClick = (entry: any) => {
    const paddle = paddles.find(p => p.name === entry.value);
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
            {paddles.map((paddle, idx) => (
              <Radar
                key={paddle.id}
                name={paddle.name}
                dataKey={paddle.name}
                stroke={COLORS[idx]}
                fill={COLORS[idx]}
                fillOpacity={selectedPaddle ? (selectedPaddle === paddle.id ? 0.6 : 0.1) : 0.3}
                strokeWidth={selectedPaddle === paddle.id ? 3 : 2}
              />
            ))}
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
