import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ComparisonPaddle {
  id: string;
  name: string;
  image: string;
  speed: number;      // 1–100
  control: number;    // 1–100
  power: number;      // 1–100
  spin: number;       // 1–100
  price: number;
  weight: number;     // grams
  level: "Beginner" | "Intermediate" | "Advanced";
  blade?: string;
  forehandRubber?: string;
  backhandRubber?: string;
  // Component details for granular comparison
  bladeStats?: {
    speed: number;
    control: number;
    power: number;
    spin: number;
    price: number;
  };
  forehandStats?: {
    speed: number;
    control: number;
    power: number;
    spin: number;
    price: number;
  };
  backhandStats?: {
    speed: number;
    control: number;
    power: number;
    spin: number;
    price: number;
  };
}

interface ComparisonStore {
  paddles: ComparisonPaddle[];
  addPaddle: (paddle: ComparisonPaddle) => void;
  removePaddle: (id: string) => void;
  clearComparison: () => void;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set) => ({
      paddles: [],
      addPaddle: (paddle) =>
        set((state) => {
          // Limit to 3 paddles
          if (state.paddles.length >= 3) {
            return state;
          }
          // Check if paddle already exists
          if (state.paddles.some((p) => p.id === paddle.id)) {
            return state;
          }
          return { paddles: [...state.paddles, paddle] };
        }),
      removePaddle: (id) =>
        set((state) => ({
          paddles: state.paddles.filter((p) => p.id !== id),
        })),
      clearComparison: () => set({ paddles: [] }),
    }),
    {
      name: 'paddle-comparison-storage',
    }
  )
);
