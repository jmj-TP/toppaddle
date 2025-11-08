import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrainingStore } from '@/stores/trainingStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { EmotionSlider } from './EmotionSlider';
import { toast } from '@/hooks/use-toast';
import { Dumbbell, Trophy, CheckCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/utils/animations';

interface DailyCheckInProps {
  onComplete?: () => void;
}

export const DailyCheckIn = ({ onComplete }: DailyCheckInProps) => {
  const [sessionType, setSessionType] = useState<'training' | 'match'>('training');
  const [overallFeeling, setOverallFeeling] = useState(4);
  const [forehandRating, setForehandRating] = useState(5);
  const [backhandRating, setBackhandRating] = useState(5);
  const [serveRating, setServeRating] = useState(5);
  const [receiveRating, setReceiveRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSession = useTrainingStore((state) => state.addSession);
  const currentSetup = useTrainingStore((state) => state.currentSetup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    addSession({
      date: new Date().toISOString(),
      sessionType,
      overallFeeling,
      forehandRating,
      backhandRating,
      serveRating,
      receiveRating,
      notes: notes.trim() || undefined,
      currentSetup,
    });

    toast({
      title: 'Session logged! 🎉',
      description: 'Your training data has been saved.',
    });

    // Reset form
    setOverallFeeling(4);
    setForehandRating(5);
    setBackhandRating(5);
    setServeRating(5);
    setReceiveRating(5);
    setNotes('');
    setIsSubmitting(false);

    onComplete?.();
  };

  return (
    <motion.form
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
    >
      <GlassCard>
        <div className="space-y-6">
          {/* Session Type Toggle */}
          <motion.div variants={staggerItem} className="space-y-2">
            <Label>Session Type</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSessionType('training')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  sessionType === 'training'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <Dumbbell className="w-5 h-5" />
                Training
              </button>
              <button
                type="button"
                onClick={() => setSessionType('match')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  sessionType === 'match'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Trophy className="w-5 h-5" />
                Match
              </button>
            </div>
          </motion.div>

          {/* Overall Feeling */}
          <motion.div variants={staggerItem}>
            <EmotionSlider
              label="Overall Feeling"
              value={overallFeeling}
              onChange={setOverallFeeling}
            />
          </motion.div>

          {/* Skill Ratings */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-semibold">Skill Ratings</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Forehand Technique</Label>
                  <span className="text-sm font-medium">{forehandRating}/10</span>
                </div>
                <Slider
                  value={[forehandRating]}
                  onValueChange={([val]) => setForehandRating(val)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Backhand Technique</Label>
                  <span className="text-sm font-medium">{backhandRating}/10</span>
                </div>
                <Slider
                  value={[backhandRating]}
                  onValueChange={([val]) => setBackhandRating(val)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Serves Quality</Label>
                  <span className="text-sm font-medium">{serveRating}/10</span>
                </div>
                <Slider
                  value={[serveRating]}
                  onValueChange={([val]) => setServeRating(val)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Receives Consistency</Label>
                  <span className="text-sm font-medium">{receiveRating}/10</span>
                </div>
                <Slider
                  value={[receiveRating]}
                  onValueChange={([val]) => setReceiveRating(val)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div variants={staggerItem} className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did the session go? Any observations?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {notes.length}/500
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fadeInUp}>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Log Session
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </GlassCard>
    </motion.form>
  );
};
