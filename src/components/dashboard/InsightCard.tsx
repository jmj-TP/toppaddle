import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Insight } from '@/utils/trainingAnalytics';
import { fadeInUp } from '@/utils/animations';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard = ({ insight }: InsightCardProps) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'positive':
        return <TrendingUp className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'attention':
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (insight.type) {
      case 'positive':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'warning':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'attention':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  return (
    <motion.div variants={fadeInUp}>
      <GlassCard hover>
        <div className="flex gap-4">
          <div className={`p-2 rounded-lg shrink-0 border ${getColorClasses()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-1">{insight.title}</h4>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
