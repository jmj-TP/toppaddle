export type StrokeCategory = 'forehand' | 'backhand' | 'serve' | 'receive' | 'general';

export interface TechniqueSplit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CustomStroke {
  id: string;
  name: string;
  category: StrokeCategory;
  description?: string;
  level: number; // Represents skill tier
  splits: TechniqueSplit[]; // Sub-components of the stroke
  createdAt: string;
}

export const CATEGORY_LABELS: Record<StrokeCategory, string> = {
  forehand: 'Forehand Technique',
  backhand: 'Backhand Technique',
  serve: 'Serves Quality',
  receive: 'Receives Consistency',
  general: 'General Skills',
};

export const getEmotionLabel = (value: number): string => {
  if (value <= 10) return 'Holding racket for first time 🫣';
  if (value <= 25) return 'Struggling 😰';
  if (value <= 40) return 'Below average 😐';
  if (value <= 60) return 'Solid performance 💪';
  if (value <= 75) return 'Good session 😊';
  if (value <= 90) return 'Excellent! 🔥';
  return 'Playing like Fan Zhendong 🏆';
};

export const getLevelDescription = (level: number, rating?: number): string => {
  const baseRating = rating || 1500;
  const targetRating = baseRating + (level * 100);
  return `Level ${level} - Targeting ${targetRating}+ ELO performance`;
};
