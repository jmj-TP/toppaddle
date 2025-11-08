import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SessionType = 'training' | 'match';

export interface TrainingSession {
  id: string;
  date: string; // ISO date string
  sessionType: SessionType;
  overallFeeling: number; // 1-7
  forehandRating: number; // 1-10
  backhandRating: number; // 1-10
  serveRating: number; // 1-10
  receiveRating: number; // 1-10
  notes?: string;
  currentSetup?: {
    blade?: string;
    forehandRubber?: string;
    backhandRubber?: string;
  };
}

interface TrainingState {
  sessions: TrainingSession[];
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
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      sessions: [],
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
    }),
    {
      name: 'training-storage',
    }
  )
);
