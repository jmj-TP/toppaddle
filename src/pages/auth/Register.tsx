import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Loader2, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/utils/animations';
import SEO from '@/components/SEO';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await register(email, password, name);

    if (result.success) {
      toast({
        title: 'Welcome to TopPaddle! 🎉',
        description: 'Your premium account has been created.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Registration failed',
        description: result.error || 'Please try again',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <SEO 
        title="Sign Up - TopPaddle"
        description="Create your TopPaddle account and start tracking your table tennis training progress today."
      />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={staggerItem} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Start Your Premium Journey
            </div>
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join TopPaddle and track your improvement
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-card border border-border rounded-2xl p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-accent font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm font-medium text-accent mb-2">✨ Premium Features Included:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Track unlimited training sessions</li>
                <li>• Advanced performance analytics</li>
                <li>• AI-powered insights</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
