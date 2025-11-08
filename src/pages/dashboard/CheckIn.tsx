import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DailyCheckIn } from '@/components/training/DailyCheckIn';
import { SessionCard } from '@/components/training/SessionCard';
import { useTrainingStore } from '@/stores/trainingStore';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/utils/animations';
import SEO from '@/components/SEO';

export default function CheckIn() {
  const sessions = useTrainingStore((state) => state.getSessions());
  const recentSessions = sessions.slice(0, 5);

  return (
    <>
      <SEO title="Daily Check-In - TopPaddle" description="Log your training session and track your progress" />
      <DashboardLayout
        title="Daily Check-In"
        description="Log your training session and track your progress"
      >
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <DailyCheckIn />
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h2 className="text-xl font-bold">Recent Sessions</h2>
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <motion.div key={session.id} variants={staggerItem}>
                  <SessionCard session={session} />
                </motion.div>
              ))
            ) : (
              <p className="text-muted-foreground">No sessions yet. Log your first one!</p>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </>
  );
}
