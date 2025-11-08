import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DashboardNav } from './DashboardNav';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';
import { fadeIn } from '@/utils/animations';
import Header from '@/components/Header';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 space-y-6">
              {/* User Profile */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                {user?.membershipTier === 'premium' && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Premium Member
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="p-4 rounded-2xl border border-border bg-card">
                <DashboardNav />
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main variants={fadeIn} initial="hidden" animate="visible">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              {description && (
                <p className="text-lg text-muted-foreground">{description}</p>
              )}
            </div>
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
};
