import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ children, className, hover = false, onClick }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6',
        'shadow-[var(--shadow-card)]',
        hover && 'transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </div>
  );
};
