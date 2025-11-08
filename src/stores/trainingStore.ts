import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomStroke } from '@/types/strokes';

export type SessionType = 'training' | 'match';

export interface TrainingSession {
  id: string;
  date: string; // ISO date string
  sessionType: SessionType;
  overallFeeling: number; // 1-100
  forehandRating: number; // 1-100
  backhandRating: number; // 1-100
  serveRating: number; // 1-100
  receiveRating: number; // 1-100
  generalRating: number; // 1-100
  customStrokeRatings?: Record<string, number>; // strokeId -> rating (1-100)
  splitRatings?: Record<string, Record<string, number>>; // strokeId -> splitId -> rating (1-100)
  playerRating?: number; // ELO rating
  notes?: string;
  currentSetup?: {
    blade?: string;
    forehandRubber?: string;
    backhandRubber?: string;
  };
}

interface TrainingState {
  sessions: TrainingSession[];
  customStrokes: CustomStroke[];
  playerRating: number; // Current ELO rating
  categoryLevels: Record<string, number>; // category -> level
  currentSetup?: {
    blade?: string;
    forehandRubber?: string;
    backhandRubber?: string;
  };
  addSession: (session: Omit<TrainingSession, 'id'>) => void;
  updateSession: (id: string, session: Partial<TrainingSession>) => void;
  deleteSession: (id: string) => void;
  getSessions: () => TrainingSession[];
  getSessionsByDateRange: (startDate: string, endDate: string) => TrainingSession[];
  setCurrentSetup: (setup: TrainingState['currentSetup']) => void;
  setPlayerRating: (rating: number) => void;
  addCustomStroke: (stroke: Omit<CustomStroke, 'id' | 'createdAt' | 'level'>) => void;
  updateCustomStroke: (id: string, stroke: Partial<CustomStroke>) => void;
  deleteCustomStroke: (id: string) => void;
  getStrokesByCategory: (category: CustomStroke['category']) => CustomStroke[];
  checkAndLevelUpStrokes: () => void; // Auto-level up based on performance
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      sessions: [],
      customStrokes: [],
      playerRating: 1500,
      categoryLevels: {
        forehand: 1,
        backhand: 1,
        serve: 1,
        receive: 1,
        general: 1,
      },
      currentSetup: undefined,

      addSession: (session) => {
        const newSession: TrainingSession = {
          ...session,
          id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
        }));
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session
          ),
        }));
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
        }));
      },

      getSessions: () => {
        return get().sessions;
      },

      getSessionsByDateRange: (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return get().sessions.filter((session) => {
          const sessionDate = new Date(session.date).getTime();
          return sessionDate >= start && sessionDate <= end;
        });
      },

      setCurrentSetup: (setup) => {
        set({ currentSetup: setup });
      },

      setPlayerRating: (rating) => {
        set({ playerRating: rating });
      },

      addCustomStroke: (stroke) => {
        const newStroke: CustomStroke = {
          ...stroke,
          id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          level: 1,
          splits: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          customStrokes: [...state.customStrokes, newStroke],
        }));
      },

      updateCustomStroke: (id, updates) => {
        set((state) => ({
          customStrokes: state.customStrokes.map((stroke) =>
            stroke.id === id ? { ...stroke, ...updates } : stroke
          ),
        }));
      },

      deleteCustomStroke: (id) => {
        set((state) => ({
          customStrokes: state.customStrokes.filter((stroke) => stroke.id !== id),
        }));
      },

      getStrokesByCategory: (category) => {
        return get().customStrokes.filter((stroke) => stroke.category === category);
      },

      checkAndLevelUpStrokes: () => {
        const { sessions, customStrokes } = get();
        const recentSessions = sessions.slice(0, 5);
        
        if (recentSessions.length < 5) return;

        const updatedStrokes = customStrokes.map((stroke) => {
          const strokeRatings = recentSessions
            .map((s) => s.customStrokeRatings?.[stroke.id])
            .filter((r): r is number => r !== undefined);

          if (strokeRatings.length < 5) return stroke;

          const average = strokeRatings.reduce((sum, r) => sum + r, 0) / strokeRatings.length;
          
          // Level up if consistently performing at 80+ on current level
          if (average >= 80) {
            return { ...stroke, level: stroke.level + 1 };
          }

          return stroke;
        });

        set({ customStrokes: updatedStrokes });

        // Update category levels
        const categoryLevels: Record<string, number> = {};
        Object.keys(get().categoryLevels).forEach((category) => {
          const categoryStrokes = updatedStrokes.filter((s) => s.category === category);
          if (categoryStrokes.length === 0) {
            categoryLevels[category] = 1;
          } else {
            const avgLevel = categoryStrokes.reduce((sum, s) => sum + s.level, 0) / categoryStrokes.length;
            categoryLevels[category] = Math.floor(avgLevel);
          }
        });

        set({ categoryLevels });
      },
    }),
    {
      name: 'training-storage',
    }
  )
);
