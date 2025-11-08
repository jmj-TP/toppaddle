import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenSquare, Settings, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Check-In', path: '/dashboard/check-in', icon: PenSquare },
  { name: 'My Strokes', path: '/dashboard/strokes', icon: Target },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export const DashboardNav = () => {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
              isActive
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};
