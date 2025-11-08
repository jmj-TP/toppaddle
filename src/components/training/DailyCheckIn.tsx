import { useState } from 'react';
import { useTrainingStore, SessionType } from '@/stores/trainingStore';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmotionSlider } from './EmotionSlider';
import { toast } from '@/hooks/use-toast';
import { Trophy, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/utils/animations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { CATEGORY_LABELS } from '@/types/strokes';

export const DailyCheckIn = () => {
  const addSession = useTrainingStore((state) => state.addSession);
  const customStrokes = useTrainingStore((state) => state.customStrokes);
  const checkAndLevelUpStrokes = useTrainingStore((state) => state.checkAndLevelUpStrokes);
  const setPlayerRating = useTrainingStore((state) => state.setPlayerRating);
  const currentPlayerRating = useTrainingStore((state) => state.playerRating);

  const [sessionType, setSessionType] = useState<SessionType>('training');
  const [overallFeeling, setOverallFeeling] = useState(50);
  const [forehandRating, setForehandRating] = useState(50);
  const [backhandRating, setBackhandRating] = useState(50);
  const [serveRating, setServeRating] = useState(50);
  const [receiveRating, setReceiveRating] = useState(50);
  const [generalRating, setGeneralRating] = useState(50);
  const [playerRatingInput, setPlayerRatingInput] = useState('');
  const [customStrokeRatings, setCustomStrokeRatings] = useState<Record<string, number>>({});
  const [splitRatings, setSplitRatings] = useState<Record<string, Record<string, number>>>({});
  const [notes, setNotes] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const newPlayerRating = playerRatingInput.trim()
      ? parseInt(playerRatingInput)
      : undefined;

    if (newPlayerRating && !isNaN(newPlayerRating)) {
      setPlayerRating(newPlayerRating);
    }

    addSession({
      date: new Date().toISOString(),
      sessionType,
      overallFeeling,
      forehandRating,
      backhandRating,
      serveRating,
      receiveRating,
      generalRating,
      customStrokeRatings,
      splitRatings,
      playerRating: newPlayerRating,
      notes: notes.trim() || undefined,
    });

    // Check for level ups
    checkAndLevelUpStrokes();

    toast({
      title: 'Session logged! 🎉',
      description: 'Your training data has been saved.',
    });

    // Reset form
    setOverallFeeling(50);
    setForehandRating(50);
    setBackhandRating(50);
    setServeRating(50);
    setReceiveRating(50);
    setGeneralRating(50);
    setPlayerRatingInput('');
    setCustomStrokeRatings({});
    setSplitRatings({});
    setNotes('');
    setExpandedCategories(new Set());
  };

  const groupedStrokes = customStrokes.reduce((acc, stroke) => {
    if (!acc[stroke.category]) acc[stroke.category] = [];
    acc[stroke.category].push(stroke);
    return acc;
  }, {} as Record<string, typeof customStrokes>);

  return (
    <GlassCard>
      <div className="space-y-6">
        {/* Session Type */}
        <div>
          <Label className="text-base mb-3 block">Session Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={sessionType === 'training' ? 'default' : 'outline'}
              onClick={() => setSessionType('training')}
              className="h-auto py-4"
            >
              <Dumbbell className="w-5 h-5 mr-2" />
              Training
            </Button>
            <Button
              type="button"
              variant={sessionType === 'match' ? 'default' : 'outline'}
              onClick={() => setSessionType('match')}
              className="h-auto py-4"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Match
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-base mb-2 block">Player Rating (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Update your rating if it changed (e.g., from tournament)
            </p>
            <Input
              type="number"
              placeholder={`Current: ${currentPlayerRating}`}
              value={playerRatingInput}
              onChange={(e) => setPlayerRatingInput(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div>
            <Label className="text-base mb-4 block">Overall Personal Feeling</Label>
            <EmotionSlider value={overallFeeling} onChange={setOverallFeeling} max={100} />
          </div>

          <div>
            <Label className="text-base mb-4 block">Forehand Technique</Label>
            <EmotionSlider value={forehandRating} onChange={setForehandRating} max={100} />
          </div>

          <div>
            <Label className="text-base mb-4 block">Backhand Technique</Label>
            <EmotionSlider value={backhandRating} onChange={setBackhandRating} max={100} />
          </div>

          <div>
            <Label className="text-base mb-4 block">Serves Quality</Label>
            <EmotionSlider value={serveRating} onChange={setServeRating} max={100} />
          </div>

          <div>
            <Label className="text-base mb-4 block">Receives Consistency</Label>
            <EmotionSlider value={receiveRating} onChange={setReceiveRating} max={100} />
          </div>

          <div>
            <Label className="text-base mb-4 block">General Skills (Footwork, etc.)</Label>
            <EmotionSlider value={generalRating} onChange={setGeneralRating} max={100} />
          </div>

          {customStrokes.length > 0 && (
            <div>
              <Label className="text-base mb-3 block">Custom Strokes (Optional)</Label>
              <div className="space-y-3">
                {Object.entries(groupedStrokes).map(([category, strokes]) => (
                  <Collapsible
                    key={category}
                    open={expandedCategories.has(category)}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                        <span className="font-medium">{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {strokes.length} stroke{strokes.length !== 1 ? 's' : ''}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedCategories.has(category) ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-3 space-y-4 pl-2">
                        {strokes.map((stroke) => (
                          <div key={stroke.id} className="space-y-3">
                            <div>
                              <Label className="text-sm flex items-center gap-2">
                                {stroke.name} <span className="text-xs text-muted-foreground">(Optional - Level {stroke.level})</span>
                              </Label>
                              <div className="mt-2">
                                <EmotionSlider
                                  value={customStrokeRatings[stroke.id] || 50}
                                  onChange={(val) =>
                                    setCustomStrokeRatings((prev) => ({ ...prev, [stroke.id]: val }))
                                  }
                                  max={100}
                                />
                              </div>
                            </div>

                            {(stroke.splits?.length ?? 0) > 0 && (
                              <div className="pl-4 space-y-2 border-l-2 border-border/50">
                                {(stroke.splits || []).map((split) => (
                                  <div key={split.id}>
                                    <Label className="text-xs text-muted-foreground">{split.name} (Optional)</Label>
                                    <div className="mt-1">
                                      <EmotionSlider
                                        value={splitRatings[stroke.id]?.[split.id] || 50}
                                        onChange={(val) =>
                                          setSplitRatings((prev) => ({
                                            ...prev,
                                            [stroke.id]: {
                                              ...(prev[stroke.id] || {}),
                                              [split.id]: val,
                                            },
                                          }))
                                        }
                                        max={100}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did the session go? Any observations?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
              className="mt-2"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Log Session
        </Button>
      </div>
    </GlassCard>
  );
};
