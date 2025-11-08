import { motion } from 'framer-motion';
import { TrainingSession, useTrainingStore } from '@/stores/trainingStore';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { Calendar, Dumbbell, Trophy, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fadeInUp } from '@/utils/animations';
import { getEmotionLabel } from '@/types/strokes';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface SessionCardProps {
  session: TrainingSession;
}

export const SessionCard = ({ session }: SessionCardProps) => {
  const Icon = session.sessionType === 'training' ? Dumbbell : Trophy;
  const deleteSession = useTrainingStore((state) => state.deleteSession);

  const handleDelete = () => {
    deleteSession(session.id);
    toast({
      title: 'Session deleted',
      description: 'The training session has been removed.',
    });
  };

  return (
    <motion.div variants={fadeInUp}>
      <GlassCard hover>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              session.sessionType === 'training' ? 'bg-accent/10' : 'bg-primary/10'
            }`}>
              <Icon className={`w-5 h-5 ${
                session.sessionType === 'training' ? 'text-accent' : 'text-primary'
              }`} />
            </div>
            <div>
              <p className="font-medium capitalize">{session.sessionType}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(session.date), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground">
                {getEmotionLabel(session.overallFeeling)}
              </div>
              <div className="text-xs text-muted-foreground">Personal feeling</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-lg font-semibold">{session.forehandRating}</div>
            <div className="text-xs text-muted-foreground">FH</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{session.backhandRating}</div>
            <div className="text-xs text-muted-foreground">BH</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{session.serveRating}</div>
            <div className="text-xs text-muted-foreground">Serve</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{session.receiveRating}</div>
            <div className="text-xs text-muted-foreground">Receive</div>
          </div>
        </div>

        {session.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{session.notes}</p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};
