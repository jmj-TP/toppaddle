import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MembershipTier = 'free' | 'premium';

export interface User {
  id: string;
  email: string;
  name: string;
  membershipTier: MembershipTier;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Mock users for demo
const MOCK_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'demo@toppaddle.com',
    password: 'demo123',
    user: {
      id: 'demo-user-1',
      email: 'demo@toppaddle.com',
      name: 'Demo Player',
      membershipTier: 'premium',
    },
  },
  {
    email: 'test@example.com',
    password: 'test123',
    user: {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      membershipTier: 'free',
    },
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (mockUser) {
          set({ user: mockUser.user, isAuthenticated: true });
          return { success: true };
        }

        return { success: false, error: 'Invalid email or password' };
      },

      register: async (email: string, password: string, name: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if email already exists
        const existingUser = MOCK_USERS.find((u) => u.email === email);
        if (existingUser) {
          return { success: false, error: 'Email already registered' };
        }

        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          membershipTier: 'premium', // Everyone starts with premium in demo
        };

        // Add to mock users
        MOCK_USERS.push({ email, password, user: newUser });

        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
