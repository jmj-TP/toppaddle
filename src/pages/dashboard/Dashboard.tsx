import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { useTrainingStore } from '@/stores/trainingStore';
import { calculateStats, generateInsights } from '@/utils/trainingAnalytics';
import { Activity, TrendingUp, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/utils/animations';
import SEO from '@/components/SEO';

export default function Dashboard() {
  const sessions = useTrainingStore((state) => state.getSessions());
  const stats = calculateStats(sessions);
  const insights = generateInsights(sessions);

  return (
    <>
      <SEO title="Dashboard - TopPaddle" description="Track your training progress and performance" />
      <DashboardLayout
        title="Dashboard"
        description="Track your training progress and performance"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Sessions"
              value={stats.totalSessions}
              icon={Activity}
            />
            <StatCard
              title="Current Streak"
              value={stats.currentStreak}
              suffix=" days"
              icon={Flame}
            />
            <StatCard
              title="Avg Feeling"
              value={stats.averageFeeling}
              suffix="/7"
              decimals={1}
              icon={TrendingUp}
            />
            <StatCard
              title="Best Area"
              value={0}
              icon={Target}
            />
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <motion.div variants={staggerItem}>
              <h2 className="text-2xl font-bold mb-4">Insights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </DashboardLayout>
    </>
  );
}
