import { blades, rubbers, preAssembledRackets, type Blade, type Rubber, type PreAssembledRacket } from '@/data/products';

export interface QuizAnswers {
  Level: string;
  Playstyle: string;
  Forehand: string;
  Backhand: string;
  Power: string;
  Grip: string;
  Budget: string;
  AssemblyPreference: string;
}

export interface CustomSetup {
  blade: Blade;
  forehandRubber: Rubber;
  backhandRubber: Rubber;
  totalPrice: number;
  score: number;
}

export interface Recommendation {
  preAssembled?: PreAssembledRacket & { score: number };
  customSetup?: CustomSetup;
  totalScore: number;
}

// Calculate compatibility score between user preferences and product attributes
function calculateScore(answers: QuizAnswers, product: any): number {
  let score = 0;
  let maxScore = 0;

  // Level matching (25% weight)
  const levelWeight = 25;
  maxScore += levelWeight;
  if (answers.Level === product.Blade_Level || answers.Level === product.Racket_Level || answers.Level === product.Rubber_Level) {
    score += levelWeight;
  } else if (
    (answers.Level === 'Beginner' && (product.Blade_Level === 'Intermediate' || product.Racket_Level === 'Intermediate')) ||
    (answers.Level === 'Intermediate' && (product.Blade_Level === 'Advanced' || product.Racket_Level === 'Advanced'))
  ) {
    score += levelWeight * 0.7; // Partial match for progression
  }

  // Playstyle matching (30% weight)
  const playstyleWeight = 30;
  maxScore += playstyleWeight;
  
  const speed = product.Blade_Speed || product.Racket_Speed || product.Rubber_Speed || 0;
  const control = product.Blade_Control || product.Racket_Control || product.Rubber_Control || 0;
  const power = product.Blade_Power || product.Racket_Power || 0;
  const spin = product.Racket_Spin || product.Rubber_Spin || 0;

  if (answers.Playstyle.includes('Offensive')) {
    // Prefer high speed and power
    score += (speed / 100) * playstyleWeight * 0.6;
    score += (power / 100) * playstyleWeight * 0.4;
  } else if (answers.Playstyle.includes('Defensive')) {
    // Prefer high control
    score += (control / 100) * playstyleWeight;
  } else if (answers.Playstyle.includes('Allround')) {
    // Balanced approach
    score += ((speed + control) / 200) * playstyleWeight;
  }

  // Power preference matching (20% weight)
  const powerWeight = 20;
  maxScore += powerWeight;
  
  if (answers.Power.includes('A lot of power')) {
    score += (speed / 100) * powerWeight;
  } else if (answers.Power.includes('Control is more important')) {
    score += (control / 100) * powerWeight;
  } else if (answers.Power.includes('Balanced')) {
    score += ((speed + control) / 200) * powerWeight;
  }

  // Grip matching (15% weight)
  const gripWeight = 15;
  maxScore += gripWeight;
  
  const productGrip = product.Blade_Grip || product.Racket_Grip || '';
  if (answers.Grip.includes('Shakehand') && productGrip.includes('Flared')) {
    score += gripWeight;
  } else if (answers.Grip.includes('Straight') && productGrip.includes('Straight')) {
    score += gripWeight;
  } else if (answers.Grip.includes('Penhold') && productGrip.includes('Penhold')) {
    score += gripWeight;
  } else if (answers.Grip.includes('Not sure')) {
    score += gripWeight * 0.8; // Give benefit of doubt
  }

  // Forehand/Backhand style matching (10% weight)
  const styleWeight = 10;
  maxScore += styleWeight;
  
  if (answers.Forehand.includes('Fast & aggressive') || answers.Backhand.includes('Fast & aggressive')) {
    score += (speed / 100) * styleWeight;
  } else if (answers.Forehand.includes('Spin & topspin') || answers.Backhand.includes('Spin & topspin')) {
    score += (spin / 100) * styleWeight;
  } else if (answers.Forehand.includes('Calm & controlled') || answers.Backhand.includes('Calm & controlled')) {
    score += (control / 100) * styleWeight;
  }

  return Math.min(100, (score / maxScore) * 100);
}

// Get budget range
function getBudgetRange(budget: string): { min: number; max: number } {
  switch (budget) {
    case 'Under 50 USD':
      return { min: 0, max: 50 };
    case '50–100 USD':
      return { min: 50, max: 100 };
    case '100–150 USD':
      return { min: 100, max: 150 };
    case 'Over 150 USD':
      return { min: 150, max: 1000 };
    default:
      return { min: 0, max: 1000 };
  }
}

// Filter products by budget
function isWithinBudget(price: number, budget: string): boolean {
  const range = getBudgetRange(budget);
  return price >= range.min && price <= range.max;
}

// Find best pre-assembled racket
export function findBestPreAssembledRacket(answers: QuizAnswers): (PreAssembledRacket & { score: number }) | null {
  const suitableRackets = preAssembledRackets
    .filter(racket => isWithinBudget(racket.Racket_Price, answers.Budget))
    .map(racket => ({
      ...racket,
      score: calculateScore(answers, racket)
    }))
    .sort((a, b) => b.score - a.score);

  return suitableRackets.length > 0 ? suitableRackets[0] : null;
}

// Find best custom setup
export function findBestCustomSetup(answers: QuizAnswers): CustomSetup | null {
  const budgetRange = getBudgetRange(answers.Budget);
  const bestCombinations: CustomSetup[] = [];

  // Try all combinations of blade + 2 rubbers
  for (const blade of blades) {
    for (const fhRubber of rubbers) {
      for (const bhRubber of rubbers) {
        const totalPrice = blade.Blade_Price + fhRubber.Rubber_Price + bhRubber.Rubber_Price;
        
        if (totalPrice <= budgetRange.max) {
          // Calculate combined score
          const bladeScore = calculateScore(answers, blade);
          const fhScore = calculateScore(answers, fhRubber);
          const bhScore = calculateScore(answers, bhRubber);
          
          // Weight: blade 50%, forehand rubber 30%, backhand rubber 20%
          const combinedScore = (bladeScore * 0.5) + (fhScore * 0.3) + (bhScore * 0.2);
          
          bestCombinations.push({
            blade,
            forehandRubber: fhRubber,
            backhandRubber: bhRubber,
            totalPrice,
            score: combinedScore
          });
        }
      }
    }
  }

  // Sort by score and return best
  bestCombinations.sort((a, b) => b.score - a.score);
  return bestCombinations.length > 0 ? bestCombinations[0] : null;
}

// Get complete recommendation
export function getRecommendation(answers: QuizAnswers): Recommendation {
  const preAssembled = findBestPreAssembledRacket(answers);
  const customSetup = findBestCustomSetup(answers);

  // Determine which option to prioritize
  let totalScore = 0;
  
  if (answers.AssemblyPreference.includes('Ready-to-play') && preAssembled) {
    // Prefer pre-assembled for beginners
    totalScore = preAssembled.score || 0;
    return { preAssembled, customSetup, totalScore };
  } else if (answers.AssemblyPreference.includes('Custom setup') && customSetup) {
    // Prefer custom setup for advanced users
    totalScore = customSetup.score;
    return { preAssembled, customSetup, totalScore };
  } else {
    // Return both options, prioritize based on scores
    const preScore = preAssembled?.score || 0;
    const customScore = customSetup?.score || 0;
    totalScore = Math.max(preScore, customScore);
    return { preAssembled, customSetup, totalScore };
  }
}