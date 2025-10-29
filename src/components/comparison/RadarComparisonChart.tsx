import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ComparisonPaddle } from '@/stores/comparisonStore';

interface RadarComparisonChartProps {
  paddles: ComparisonPaddle[];
  highlightedPaddle?: string | null;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export const RadarComparisonChart = ({ paddles, highlightedPaddle }: RadarComparisonChartProps) => {
  if (paddles.length === 0) return null;

  const data = [
    {
      stat: 'Speed',
      ...paddles.reduce((acc, paddle, idx) => ({
        ...acc,
        [paddle.name]: paddle.speed,
      }), {})
    },
    {
      stat: 'Control',
      ...paddles.reduce((acc, paddle, idx) => ({
        ...acc,
        [paddle.name]: paddle.control,
      }), {})
    },
    {
      stat: 'Power',
      ...paddles.reduce((acc, paddle, idx) => ({
        ...acc,
        [paddle.name]: paddle.power,
      }), {})
    },
    {
      stat: 'Spin',
      ...paddles.reduce((acc, paddle, idx) => ({
        ...acc,
        [paddle.name]: paddle.spin,
      }), {})
    },
  ];

  return (
    <div className="w-full h-[500px] flex items-center justify-center">
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
              fillOpacity={highlightedPaddle ? (highlightedPaddle === paddle.id ? 0.6 : 0.1) : 0.3}
              strokeWidth={highlightedPaddle === paddle.id ? 3 : 2}
            />
          ))}
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px',
              fontWeight: 500
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
