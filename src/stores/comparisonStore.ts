import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { rubbers } from '@/data/products';
import { applySpongeMultipliers } from '@/utils/spongeCalculations';

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
  forehandSponge?: string;
  backhandSponge?: string;
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
  updateSponge: (id: string, side: 'forehand' | 'backhand', thickness: string) => void;
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
      updateSponge: (id, side, thickness) =>
        set((state) => ({
          paddles: state.paddles.map((p) => {
            if (p.id !== id) return p;
            
            // Find the rubber to get base stats
            const rubberName = side === 'forehand' ? p.forehandRubber : p.backhandRubber;
            const rubber = rubbers.find(r => r.Rubber_Name === rubberName);
            
            if (!rubber) {
              // If rubber not found, just update thickness without recalculating
              return {
                ...p,
                [side === 'forehand' ? 'forehandSponge' : 'backhandSponge']: thickness,
              };
            }
            
            // Calculate adjusted stats with new sponge thickness
            const adjustedStats = applySpongeMultipliers(
              {
                speed: rubber.Rubber_Speed,
                control: rubber.Rubber_Control,
                power: rubber.Rubber_Power || Math.round((rubber.Rubber_Speed + rubber.Rubber_Spin) / 2),
                spin: rubber.Rubber_Spin,
              },
              thickness
            );
            
            // Update the paddle with new thickness and recalculated stats
            const updatedPaddle = {
              ...p,
              [side === 'forehand' ? 'forehandSponge' : 'backhandSponge']: thickness,
            };
            
            // Update component stats
            if (side === 'forehand') {
              updatedPaddle.forehandStats = {
                ...adjustedStats,
                price: rubber.Rubber_Price,
              };
            } else {
              updatedPaddle.backhandStats = {
                ...adjustedStats,
                price: rubber.Rubber_Price,
              };
            }
            
            // Recalculate overall stats if this is a custom paddle
            if (p.blade && p.forehandRubber && p.backhandRubber) {
              const fhStats = side === 'forehand' ? adjustedStats : (p.forehandStats || { speed: 0, control: 0, power: 0, spin: 0 });
              const bhStats = side === 'backhand' ? adjustedStats : (p.backhandStats || { speed: 0, control: 0, power: 0, spin: 0 });
              const bladeStats = p.bladeStats || { speed: 0, control: 0, power: 0, spin: 0 };
              
              updatedPaddle.speed = Math.round((bladeStats.speed + fhStats.speed + bhStats.speed) / 3);
              updatedPaddle.control = Math.round((bladeStats.control + fhStats.control + bhStats.control) / 3);
              updatedPaddle.power = Math.round((bladeStats.power + fhStats.power + bhStats.power) / 3);
              updatedPaddle.spin = Math.round((bladeStats.spin + fhStats.spin + bhStats.spin) / 3);
            }
            
            return updatedPaddle;
          }),
        })),
    }),
    {
      name: 'paddle-comparison-storage',
    }
  )
);
