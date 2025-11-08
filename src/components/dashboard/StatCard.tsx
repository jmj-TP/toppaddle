import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { GlassCard } from './GlassCard';
import { fadeInUp } from '@/utils/animations';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  decimals?: number;
}

export const StatCard = ({
  title,
  value,
  suffix = '',
  prefix = '',
  icon: Icon,
  trend,
  decimals = 0,
}: StatCardProps) => {
  return (
    <motion.div variants={fadeInUp}>
      <GlassCard hover className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">
                <AnimatedCounter
                  value={value}
                  suffix={suffix}
                  prefix={prefix}
                  decimals={decimals}
                />
              </h3>
              {trend && (
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-accent/10">
            <Icon className="w-6 h-6 text-accent" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
