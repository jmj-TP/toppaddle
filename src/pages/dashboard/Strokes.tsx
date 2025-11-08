import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useTrainingStore } from '@/stores/trainingStore';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { CATEGORY_LABELS, StrokeCategory, getEmotionLabel } from '@/types/strokes';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function Strokes() {
  const customStrokes = useTrainingStore((state) => state.customStrokes);
  const sessions = useTrainingStore((state) => state.sessions);
  const [selectedCategory, setSelectedCategory] = useState<StrokeCategory | 'all'>('all');

  const getStrokeData = (strokeId: string) => {
    const strokeSessions = sessions
      .filter((s) => s.customStrokeRatings?.[strokeId] !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((s) => ({
        date: format(new Date(s.date), 'MMM d'),
        rating: s.customStrokeRatings![strokeId],
      }));

    if (strokeSessions.length === 0) return null;

    const average = strokeSessions.reduce((sum, s) => sum + s.rating, 0) / strokeSessions.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (strokeSessions.length >= 2) {
      const firstHalf = strokeSessions.slice(0, Math.floor(strokeSessions.length / 2));
      const secondHalf = strokeSessions.slice(Math.floor(strokeSessions.length / 2));
      const firstAvg = firstHalf.reduce((sum, s) => sum + s.rating, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, s) => sum + s.rating, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 0.5) trend = 'up';
      else if (secondAvg < firstAvg - 0.5) trend = 'down';
    }

    return { data: strokeSessions, average, trend, count: strokeSessions.length };
  };

  const filteredStrokes = selectedCategory === 'all' 
    ? customStrokes 
    : customStrokes.filter((s) => s.category === selectedCategory);

  const categories: Array<{ value: StrokeCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Strokes' },
    ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      value: key as StrokeCategory,
      label,
    })),
  ];

  return (
    <DashboardLayout title="Stroke Analytics">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-4xl font-bold mb-2">Stroke Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress across all your custom strokes
          </p>
        </motion.div>

        {customStrokes.length === 0 ? (
          <motion.div variants={fadeInUp}>
            <GlassCard>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No custom strokes yet. Add strokes in the Check-In tab to start tracking!
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <>
            <Tabs value={selectedCategory} onValueChange={(val) => setSelectedCategory(val as any)}>
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value}>
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent key={cat.value} value={cat.value} className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredStrokes.map((stroke) => {
                      const data = getStrokeData(stroke.id);
                      
                      if (!data) {
                        return (
                          <motion.div key={stroke.id} variants={fadeInUp}>
                            <GlassCard>
                              <h3 className="font-semibold text-lg mb-2">{stroke.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {CATEGORY_LABELS[stroke.category]}
                              </p>
                              <div className="text-center py-8 text-muted-foreground">
                                No data yet. Rate this stroke in your check-ins to see progress.
                              </div>
                            </GlassCard>
                          </motion.div>
                        );
                      }

                      const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
                      const trendColor = data.trend === 'up' ? 'text-green-500' : data.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

                      return (
                        <motion.div key={stroke.id} variants={fadeInUp}>
                          <GlassCard>
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{stroke.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {CATEGORY_LABELS[stroke.category]}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-2xl font-bold">{data.average.toFixed(1)}</div>
                                <div className="text-xs text-muted-foreground">Average</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold">{data.count}</div>
                                <div className="text-xs text-muted-foreground">Sessions</div>
                              </div>
                            </div>

                            <ResponsiveContainer width="100%" height={150}>
                              <LineChart data={data.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="hsl(var(--muted-foreground))"
                                  style={{ fontSize: '0.75rem' }}
                                />
                                <YAxis 
                                  domain={[1, 10]}
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
                                <Line 
                                  type="monotone" 
                                  dataKey="rating" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={2}
                                  dot={{ fill: 'hsl(var(--primary))' }}
                                />
                              </LineChart>
                            </ResponsiveContainer>

                            {stroke.description && (
                              <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">{stroke.description}</p>
                              </div>
                            )}
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
