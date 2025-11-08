export type StrokeCategory = 'forehand' | 'backhand' | 'serve' | 'receive';

export interface CustomStroke {
  id: string;
  name: string;
  category: StrokeCategory;
  description?: string;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<StrokeCategory, string> = {
  forehand: 'Forehand Technique',
  backhand: 'Backhand Technique',
  serve: 'Serves Quality',
  receive: 'Receives Consistency',
};

export const getEmotionLabel = (value: number): string => {
  const labels: Record<number, string> = {
    1: 'Holding racket for first time 🫣',
    2: 'Struggling 😰',
    3: 'Below average 😐',
    4: 'Solid performance 💪',
    5: 'Good session 😊',
    6: 'Excellent! 🔥',
    7: 'Playing like Fan Zhendong 🏆',
  };
  return labels[value] || labels[4];
};
