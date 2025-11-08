import { motion } from 'framer-motion';
import { TrainingSession } from '@/stores/trainingStore';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { Calendar, Dumbbell, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { fadeInUp } from '@/utils/animations';

interface SessionCardProps {
  session: TrainingSession;
}

export const SessionCard = ({ session }: SessionCardProps) => {
  const Icon = session.sessionType === 'training' ? Dumbbell : Trophy;

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
          <div className="text-right">
            <div className="text-2xl font-bold">{session.overallFeeling}/7</div>
            <div className="text-xs text-muted-foreground">Overall</div>
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
