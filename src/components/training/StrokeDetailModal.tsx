import { CustomStroke } from '@/types/strokes';
import { TrainingSession } from '@/stores/trainingStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CATEGORY_LABELS } from '@/types/strokes';
import { LevelBadge } from './LevelBadge';

interface StrokeDetailModalProps {
  stroke: CustomStroke | null;
  sessions: TrainingSession[];
  playerRating: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StrokeDetailModal = ({
  stroke,
  sessions,
  playerRating,
  open,
  onOpenChange,
}: StrokeDetailModalProps) => {
  if (!stroke) return null;

  const getStrokeData = () => {
    const strokeSessions = sessions
      .filter((s) => s.customStrokeRatings?.[stroke.id] !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((s) => ({
        date: format(new Date(s.date), 'MMM d'),
        rating: s.customStrokeRatings![stroke.id],
      }));

    if (strokeSessions.length === 0) return null;

    const average = strokeSessions.reduce((sum, s) => sum + s.rating, 0) / strokeSessions.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (strokeSessions.length >= 2) {
      const firstHalf = strokeSessions.slice(0, Math.floor(strokeSessions.length / 2));
      const secondHalf = strokeSessions.slice(Math.floor(strokeSessions.length / 2));
      const firstAvg = firstHalf.reduce((sum, s) => sum + s.rating, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, s) => sum + s.rating, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 5) trend = 'up';
      else if (secondAvg < firstAvg - 5) trend = 'down';
    }

    return { data: strokeSessions, average, trend, count: strokeSessions.length };
  };

  const getSplitData = (splitId: string) => {
    const splitSessions = sessions
      .filter((s) => s.splitRatings?.[stroke.id]?.[splitId] !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((s) => ({
        date: format(new Date(s.date), 'MMM d'),
        rating: s.splitRatings![stroke.id][splitId],
      }));

    if (splitSessions.length === 0) return null;

    const average = splitSessions.reduce((sum, s) => sum + s.rating, 0) / splitSessions.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (splitSessions.length >= 2) {
      const firstHalf = splitSessions.slice(0, Math.floor(splitSessions.length / 2));
      const secondHalf = splitSessions.slice(Math.floor(splitSessions.length / 2));
      const firstAvg = firstHalf.reduce((sum, s) => sum + s.rating, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, s) => sum + s.rating, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 5) trend = 'up';
      else if (secondAvg < firstAvg - 5) trend = 'down';
    }

    return { data: splitSessions, average, trend, count: splitSessions.length };
  };

  const strokeData = getStrokeData();
  const TrendIcon = strokeData?.trend === 'up' ? TrendingUp : strokeData?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = strokeData?.trend === 'up' ? 'text-green-500' : strokeData?.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-2xl">{stroke.name}</DialogTitle>
            <LevelBadge level={stroke.level} playerRating={playerRating} />
          </div>
          <DialogDescription>
            {CATEGORY_LABELS[stroke.category]}
            {stroke.description && ` • ${stroke.description}`}
          </DialogDescription>
        </DialogHeader>

        {strokeData && (
          <div className="space-y-6">
            {/* Overall Stroke Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="text-3xl font-bold">{strokeData.average.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="text-3xl font-bold">{strokeData.count}</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={strokeData.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
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
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Technique Details */}
            {(stroke.splits?.length ?? 0) > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Technique Details</h3>
                <div className="space-y-6">
                  {(stroke.splits || []).map((split) => {
                    const splitData = getSplitData(split.id);
                    
                    if (!splitData) {
                      return (
                        <div key={split.id} className="p-4 rounded-lg bg-background/50 border border-border/50">
                          <h4 className="font-medium mb-1">{split.name}</h4>
                          {split.description && (
                            <p className="text-xs text-muted-foreground mb-2">{split.description}</p>
                          )}
                          <p className="text-sm text-muted-foreground italic">No data yet</p>
                        </div>
                      );
                    }

                    const SplitTrendIcon = splitData.trend === 'up' ? TrendingUp : splitData.trend === 'down' ? TrendingDown : Minus;
                    const splitTrendColor = splitData.trend === 'up' ? 'text-green-500' : splitData.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

                    return (
                      <div key={split.id} className="p-4 rounded-lg bg-background/50 border border-border/50 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{split.name}</h4>
                            {split.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{split.description}</p>
                            )}
                          </div>
                          <SplitTrendIcon className={`w-4 h-4 ${splitTrendColor} flex-shrink-0`} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xl font-bold">{splitData.average.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">Average</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold">{splitData.count}</div>
                            <div className="text-xs text-muted-foreground">Sessions</div>
                          </div>
                        </div>

                        <ResponsiveContainer width="100%" height={150}>
                          <LineChart data={splitData.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="date" 
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: '0.7rem' }}
                            />
                            <YAxis 
                              domain={[0, 100]}
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: '0.7rem' }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="rating" 
                              stroke="hsl(var(--chart-2))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {!strokeData && (
          <div className="text-center py-12 text-muted-foreground">
            No data yet. Rate this stroke in your check-ins to see progress.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
