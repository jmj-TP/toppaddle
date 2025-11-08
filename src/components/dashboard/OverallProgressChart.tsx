import { useTrainingStore } from '@/stores/trainingStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { useMemo } from 'react';

export const OverallProgressChart = () => {
  const sessions = useTrainingStore((state) => state.sessions);
  const customStrokes = useTrainingStore((state) => state.customStrokes);
  const categoryLevels = useTrainingStore((state) => state.categoryLevels);

  const chartData = useMemo(() => {
    const sorted = [...sessions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-20); // Last 20 sessions

    return sorted.map((session) => {
      // Calculate overall score combining all factors
      const baseRatings = [
        session.forehandRating,
        session.backhandRating,
        session.serveRating,
        session.receiveRating,
        session.generalRating,
      ];

      const baseAvg = baseRatings.reduce((sum, r) => sum + r, 0) / baseRatings.length;

      // Factor in custom stroke ratings and their levels
      let strokeScore = 0;
      let strokeCount = 0;
      customStrokes.forEach((stroke) => {
        const rating = session.customStrokeRatings?.[stroke.id];
        if (rating !== undefined) {
          strokeScore += (rating / 100) * stroke.level * 20; // Level multiplier
          strokeCount++;
        }
      });

      const customStrokeAvg = strokeCount > 0 ? strokeScore / strokeCount : 0;

      // Calculate category level bonus
      const categoryLevelAvg = Object.values(categoryLevels).reduce((sum, l) => sum + l, 0) / Object.keys(categoryLevels).length;

      // Combine all factors
      const overallScore = (baseAvg * 0.4) + (customStrokeAvg * 0.4) + (categoryLevelAvg * 10 * 0.2);

      return {
        date: format(new Date(session.date), 'MMM d'),
        overall: Math.round(overallScore),
        feeling: session.overallFeeling,
        playerRating: session.playerRating,
      };
    });
  }, [sessions, customStrokes, categoryLevels]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No data yet. Complete check-ins to see your overall progress!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '0.75rem' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '0.75rem' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="overall" 
          stroke="hsl(var(--primary))" 
          strokeWidth={3}
          name="Overall Score"
          dot={{ fill: 'hsl(var(--primary))' }}
        />
        <Line 
          type="monotone" 
          dataKey="feeling" 
          stroke="hsl(var(--chart-2))" 
          strokeWidth={2}
          name="Session Feeling"
          dot={{ fill: 'hsl(var(--chart-2))' }}
        />
        {chartData.some(d => d.playerRating) && (
          <Line 
            type="monotone" 
            dataKey="playerRating" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            name="Player Rating"
            dot={{ fill: 'hsl(var(--chart-3))' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};
