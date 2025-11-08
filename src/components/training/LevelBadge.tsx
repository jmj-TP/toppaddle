import { Trophy } from 'lucide-react';
import { getLevelDescription } from '@/types/strokes';

interface LevelBadgeProps {
  level: number;
  playerRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const LevelBadge = ({ level, playerRating, size = 'md' }: LevelBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 font-semibold ${sizeClasses[size]}`}
      title={getLevelDescription(level, playerRating)}
    >
      <Trophy className={iconSizes[size]} />
      <span>Level {level}</span>
    </div>
  );
};
