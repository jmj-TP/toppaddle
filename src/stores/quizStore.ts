import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAnswers } from '@/utils/ratingSystem';

interface QuizState {
  answers: Partial<QuizAnswers>;
  completeAnswers: QuizAnswers | null;
  recommendation: any;
  isComplete: boolean;
  setAnswers: (answers: Partial<QuizAnswers>) => void;
  setRecommendation: (recommendation: any, completeAnswers: QuizAnswers) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      answers: {},
      completeAnswers: null,
      recommendation: null,
      isComplete: false,
      setAnswers: (answers) => set({ answers }),
      setRecommendation: (recommendation, completeAnswers) => 
        set({ recommendation, completeAnswers, isComplete: true }),
      resetQuiz: () => 
        set({ 
          answers: {}, 
          completeAnswers: null, 
          recommendation: null, 
          isComplete: false 
        }),
    }),
    {
      name: 'quiz-storage',
    }
  )
);
