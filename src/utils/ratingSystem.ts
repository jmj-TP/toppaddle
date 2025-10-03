import { blades, rubbers, preAssembledRackets, type Blade, type Rubber, type PreAssembledRacket } from '@/data/products';

export interface QuizAnswers {
  Level: string;
  Playstyle: string;
  Forehand: string;
  Backhand: string;
  Power: string;
  HandlePreference: string;
  WantsSpecialHandle?: string;
  HandSize?: string;
  Grip: string;
  WantsSpecialRubbers: string;
  ForehandRubberStyle: string;
  BackhandRubberStyle: string;
  Brand: string[]; // Array of selected brands
  Budget: string;
  WeightPreference?: string;
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
  preAssembled2?: PreAssembledRacket & { score: number };
  customSetup?: CustomSetup;
  customSetup2?: CustomSetup;
  totalScore: number;
  forehandThickness: string;
  forehandThicknessExplanation: string;
  backhandThickness: string;
  backhandThicknessExplanation: string;
  handleType: string;
  handleTypeExplanation: string;
}

// Calculate compatibility score between user preferences and product attributes
function calculateScore(answers: QuizAnswers, product: any): number {
  let score = 0;
  let maxScore = 0;

  // Level matching (5% weight)
  const levelWeight = 5;
  maxScore += levelWeight;
  const productLevel = product.Blade_Level || product.Racket_Level || product.Rubber_Level;
  
  if (answers.Level === productLevel) {
    score += levelWeight;
  } else if (answers.Level === 'Advanced' && productLevel === 'Intermediate') {
    // Advanced players should see Intermediate products (full match)
    score += levelWeight;
  } else if (answers.Level === 'Beginner' && productLevel === 'Intermediate') {
    score += levelWeight * 0.7; // Partial match for progression
  } else if (answers.Level === 'Intermediate' && productLevel === 'Advanced') {
    score += levelWeight * 0.7; // Partial match for progression
  } else if (answers.Level === 'Advanced' && productLevel === 'Beginner') {
    // Filter out Beginner products for Advanced players
    return 0;
  } else if (answers.Level === 'Beginner' && productLevel === 'Advanced') {
    // Filter out Advanced products for Beginner players
    return 0;
  }

  // Playstyle matching (40% weight)
  const playstyleWeight = 40;
  maxScore += playstyleWeight;
  
  const speed = product.Blade_Speed || product.Racket_Speed || product.Rubber_Speed || 0;
  const control = product.Blade_Control || product.Racket_Control || product.Rubber_Control || 0;
  const power = product.Blade_Power || product.Racket_Power || product.Rubber_Power || 0;
  const spin = product.Racket_Spin || product.Rubber_Spin || 0;

  if (answers.Playstyle.includes('Offensive')) {
    // Heavily prefer high speed and power, penalize excessive control
    score += (speed / 100) * playstyleWeight * 0.5;
    score += (power / 100) * playstyleWeight * 0.5;
    // Penalize overly control-focused rubbers for offensive play
    if (control > 88) {
      score -= playstyleWeight * 0.2;
    }
  } else if (answers.Playstyle.includes('Defensive')) {
    // Prefer high control
    score += (control / 100) * playstyleWeight;
  } else if (answers.Playstyle.includes('Allround')) {
    // Balanced approach
    score += ((speed + control) / 200) * playstyleWeight;
  }

  // Power preference matching (25% weight)
  const powerWeight = 25;
  maxScore += powerWeight;
  
  if (answers.Power.includes('A lot of power')) {
    score += (speed / 100) * powerWeight * 0.6;
    score += (power / 100) * powerWeight * 0.4;
  } else if (answers.Power.includes('Control is more important')) {
    score += (control / 100) * powerWeight;
  } else if (answers.Power.includes('Balanced')) {
    score += ((speed + control + power) / 300) * powerWeight;
  }

  // Grip matching (100% weight)
  const gripWeight = 100;
  maxScore += gripWeight;
  
  const productGrip = product.Blade_Grip || product.Racket_Grip || '';
  if (answers.Grip.includes('Shakehand') && productGrip.includes('Flared')) {
    score += gripWeight;
  } else if (answers.Grip.includes('Straight') && productGrip.includes('Straight')) {
    score += gripWeight;
  } else if (answers.Grip.includes('Penhold') && productGrip.includes('Penhold')) {
    score += gripWeight;
  } else if (answers.Grip.includes('Small Hands Special') && productGrip.includes('Flared')) {
    score += gripWeight; // Small hands special uses Flared handle
  } else if (answers.Grip.includes('Not sure')) {
    score += gripWeight * 0.8; // Give benefit of doubt
  }

  // Forehand/Backhand style matching (15% weight)
  const styleWeight = 15;
  maxScore += styleWeight;
  
  if (answers.Forehand.includes('Fast & aggressive') || answers.Backhand.includes('Fast & aggressive')) {
    score += (speed / 100) * styleWeight * 0.6;
    score += (power / 100) * styleWeight * 0.4;
  } else if (answers.Forehand.includes('Spin & topspin') || answers.Backhand.includes('Spin & topspin')) {
    // Spin players need good spin AND control
    score += (spin / 100) * styleWeight * 0.6;
    score += (control / 100) * styleWeight * 0.4;
  } else if (answers.Forehand.includes('Calm & controlled') || answers.Backhand.includes('Calm & controlled')) {
    score += (control / 100) * styleWeight;
  }

  // Weight matching (20% weight) - only for advanced players
  if (answers.WeightPreference && answers.Level === 'Advanced') {
    const weightMatchWeight = 20;
    maxScore += weightMatchWeight;
    
    const productWeight = product.Blade_Weight || product.Racket_Weight || 0;
    
    if (productWeight > 0) {
      if (answers.WeightPreference === 'Lightweight' && productWeight < 85) {
        score += weightMatchWeight;
      } else if (answers.WeightPreference === 'Medium' && productWeight >= 85 && productWeight <= 95) {
        score += weightMatchWeight;
      } else if (answers.WeightPreference === 'Heavy' && productWeight > 95) {
        score += weightMatchWeight;
      } else {
        // Partial score for close matches
        score += weightMatchWeight * 0.5;
      }
    }
  }

  return Math.min(100, (score / maxScore) * 100);
}

// Extract brand from product name
function extractBrand(productName: string): string {
  const name = productName.toUpperCase();
  if (name.startsWith('JOOLA')) return 'JOOLA';
  if (name.startsWith('ANDRO')) return 'ANDRO';
  if (name.startsWith('BUTTERFLY')) return 'BUTTERFLY';
  if (name.startsWith('DHS')) return 'DHS';
  return 'UNKNOWN';
}

// Check if product matches brand filter (strict dealbreaker)
function matchesBrandFilter(productName: string, selectedBrands: string[]): boolean {
  // Empty array or all brands selected means accept all
  if (selectedBrands.length === 0 || selectedBrands.length === 4) return true;
  
  const productBrand = extractBrand(productName);
  return selectedBrands.some(brand => brand.toUpperCase() === productBrand);
}

// Get budget range
function getBudgetRange(budget: string): { min: number; max: number } {
  switch (budget) {
    case '<50$':
      return { min: 0, max: 50 };
    case '<100$':
      return { min: 0, max: 100 };
    case '<120$':
      return { min: 0, max: 120 };
    case '<140$':
      return { min: 0, max: 140 };
    case '<160$':
      return { min: 0, max: 160 };
    case '<180$':
      return { min: 0, max: 180 };
    case '<200$':
      return { min: 0, max: 200 };
    case '<250$':
      return { min: 0, max: 250 };
    case '<300$':
      return { min: 0, max: 300 };
    case 'No limit':
      return { min: 0, max: 10000 };
    default:
      return { min: 0, max: 10000 };
  }
}

// Filter products by budget
function isWithinBudget(price: number, budget: string): boolean {
  const range = getBudgetRange(budget);
  return price >= range.min && price <= range.max;
}

// Calculate recommended handle type based on grip preference
function calculateHandleType(answers: QuizAnswers): {
  handleType: string;
  explanation: string;
} {
  const { Grip, Level } = answers;
  
  // Small Hands Special
  if (Grip.includes('Small Hands Special')) {
    return {
      handleType: 'Flared (DHS brand only)',
      explanation: 'For players with really small hands, we recommend DHS blades with Flared handles, which are designed to work well for smaller hand sizes.'
    };
  }
  
  // Anatomic grip
  if (Grip.includes('Anatomic')) {
    return {
      handleType: 'Anatomic',
      explanation: 'An Anatomic handle is contoured to fit your palm perfectly, providing secure and ergonomic grip that reduces hand fatigue during long play sessions. Great for players with really large hands.'
    };
  }
  
  // Penhold grip
  if (Grip.includes('Penhold')) {
    return {
      handleType: 'Penhold',
      explanation: 'A Penhold handle is designed for the traditional Chinese grip style, offering excellent control and feel for penhold players.'
    };
  }
  
  // Straight grip preference
  if (Grip.includes('Straight')) {
    return {
      handleType: 'Straight',
      explanation: 'A Straight handle offers uniform shape and versatility, perfect for players who like to adjust their grip position frequently.'
    };
  }
  
  // Shakehand or Not sure - recommend Flared (most popular)
  if (Grip.includes('Shakehand') || Grip.includes('Not sure')) {
    return {
      handleType: 'Flared',
      explanation: 'A Flared handle is the most popular choice for shakehand grip. It\'s wider at the bottom, prevents slipping, and provides excellent control and comfort for most playing styles.'
    };
  }
  
  // Default fallback to Flared
  return {
    handleType: 'Flared',
    explanation: 'A Flared handle is the most common and versatile choice, offering excellent grip security and comfort for most players.'
  };
}

// Calculate recommended sponge thickness based on player level and style
function calculateSpongeThickness(answers: QuizAnswers): { 
  forehandThickness: string; 
  forehandExplanation: string;
  backhandThickness: string;
  backhandExplanation: string;
} {
  const { Level, Forehand, Backhand, ForehandRubberStyle, BackhandRubberStyle } = answers;
  
  // Helper function to determine thickness for a side
  const getThicknessForSide = (side: 'forehand' | 'backhand') => {
    const playStyle = side === 'forehand' ? Forehand : Backhand;
    const rubberStyle = side === 'forehand' ? ForehandRubberStyle : BackhandRubberStyle;
    const sideName = side === 'forehand' ? 'Forehand' : 'Backhand';
    
    // Special rubber types need specific thicknesses
    if (rubberStyle === "Long Pimples" || rubberStyle === "Anti") {
      return {
        thickness: "0.5-1.0 mm (OX or thin)",
        explanation: `For ${sideName} with ${rubberStyle}, use a very thin sponge (0.5-1.0 mm) or OX (no sponge). This maximizes the disruptive effect and gives you better control of the special rubber.`
      };
    }
    
    if (rubberStyle === "Short Pimples") {
      return {
        thickness: "1.5-1.8 mm",
        explanation: `For ${sideName} with Short Pimples, use 1.5-1.8 mm sponge. This provides good speed while maintaining the direct, no-nonsense hitting style of short pimples.`
      };
    }
    
    // For normal rubbers, consider play style and level
    // Beginner level
    if (Level === 'Beginner') {
      return {
        thickness: '1.7 mm',
        explanation: `For ${sideName}: Since you're starting out, 1.7 mm provides balanced control and prevents bottoming out, making it easier to develop proper technique.`
      };
    }
    
    // Calm & controlled style
    if (playStyle.includes('Calm & controlled')) {
      return {
        thickness: '1.5-1.7 mm',
        explanation: `For ${sideName}: Since you play calmly and controlled, 1.5-1.7 mm gives maximum control for precise placement and consistent play.`
      };
    }
    
    // Fast & aggressive style with Advanced level
    if (playStyle.includes('Fast & aggressive') && Level === 'Advanced') {
      return {
        thickness: '2.1-2.3 mm',
        explanation: `For ${sideName}: Since you play fast and aggressive at an advanced level, 2.1-2.3 mm gives maximum spin and speed for powerful attacks.`
      };
    }
    
    // Fast & aggressive style (intermediate)
    if (playStyle.includes('Fast & aggressive')) {
      return {
        thickness: '2.0 mm',
        explanation: `For ${sideName}: Since you play fast and aggressively, 2.0 mm provides great speed and spin while maintaining good control.`
      };
    }
    
    // Spin & topspin style
    if (playStyle.includes('Spin & topspin')) {
      if (Level === 'Advanced') {
        return {
          thickness: '2.1-2.3 mm',
          explanation: `For ${sideName}: Since you focus on spin and topspin at an advanced level, 2.1-2.3 mm maximizes your spin generation and loop power.`
        };
      }
      return {
        thickness: '1.8-2.0 mm',
        explanation: `For ${sideName}: Since you focus on spin and topspin, 1.8-2.0 mm provides excellent spin potential with good control.`
      };
    }
    
    // Both sides the same / not sure
    if (playStyle.includes('Both sides the same')) {
      return {
        thickness: '1.8-2.0 mm',
        explanation: `For ${sideName}: Since you play similarly on both sides, 1.8-2.0 mm provides versatile performance for various playing styles.`
      };
    }
    
    // Default fallback
    return {
      thickness: '1.8-2.0 mm',
      explanation: `For ${sideName}: Based on your style, 1.8-2.0 mm provides balanced performance suitable for most situations.`
    };
  };
  
  const forehand = getThicknessForSide('forehand');
  const backhand = getThicknessForSide('backhand');
  
  return {
    forehandThickness: forehand.thickness,
    forehandExplanation: forehand.explanation,
    backhandThickness: backhand.thickness,
    backhandExplanation: backhand.explanation
  };
}

// Find best pre-assembled rackets (top N)
export function findBestPreAssembledRackets(answers: QuizAnswers, topN: number = 2): (PreAssembledRacket & { score: number })[] {
  const suitableRackets = preAssembledRackets
    .filter(racket => {
      // Small Hands Special - ONLY DHS brand (STRICT - dealbreaker)
      if (answers.Grip.includes('Small Hands Special')) {
        if (extractBrand(racket.Racket_Name) !== 'DHS') return false;
      }
      
      // Brand filter (STRICT - dealbreaker)
      if (!matchesBrandFilter(racket.Racket_Name, answers.Brand)) return false;
      
      // Budget filter
      if (!isWithinBudget(racket.Racket_Price, answers.Budget)) return false;
      
      // Rubber style filter
      if (racket.Racket_FH_Rubber_Style !== answers.ForehandRubberStyle) return false;
      if (racket.Racket_BH_Rubber_Style !== answers.BackhandRubberStyle) return false;
      
      // Grip/Handle filter (STRICT - dealbreaker for Anatomic only)
      const productGrip = racket.Racket_Grip || '';
      if (answers.Grip.includes('Anatomic') && !productGrip.includes('Anatomic')) return false;
      
      return true;
    })
    .map(racket => ({
      ...racket,
      score: calculateScore(answers, racket)
    }))
    .sort((a, b) => b.score - a.score);

  // Normalize scores more accurately to show real differences
  if (suitableRackets.length > 0) {
    const maxScoreInBudget = suitableRackets[0].score;
    const minScoreInBudget = suitableRackets[suitableRackets.length - 1].score;
    const scoreRange = maxScoreInBudget - minScoreInBudget;
    
    // Normalize scores for all top N rackets with wider range
    const topRackets = suitableRackets.slice(0, topN).map((racket, index) => {
      let normalizedScore;
      if (scoreRange > 0) {
        // Scale from 65 to 99, but prefer raw score if it's already good
        const scaledScore = 65 + ((racket.score - minScoreInBudget) / scoreRange) * 34;
        // Use the higher of scaled or raw score (capped at 99)
        normalizedScore = Math.min(99, Math.max(scaledScore, racket.score));
      } else {
        // If all scores are the same, decrease slightly for each rank
        normalizedScore = Math.min(99, racket.score) - (index * 1);
      }
      
      return {
        ...racket,
        score: normalizedScore
      };
    });
    
    // Ensure second racket has lower score than first
    if (topRackets.length > 1 && topRackets[1].score >= topRackets[0].score) {
      topRackets[1].score = topRackets[0].score - 1;
    }
    
    return topRackets;
  }

  return [];
}

// Legacy function for backward compatibility
export function findBestPreAssembledRacket(answers: QuizAnswers): (PreAssembledRacket & { score: number }) | null {
  const rackets = findBestPreAssembledRackets(answers, 1);
  return rackets.length > 0 ? rackets[0] : null;
}

// Find best custom setups (top 2)
export function findBestCustomSetups(answers: QuizAnswers, topN: number = 2): CustomSetup[] {
  const budgetRange = getBudgetRange(answers.Budget);
  const bestCombinations: CustomSetup[] = [];

  // Filter rubbers by style preference for each side
  const forehandRubbers = rubbers.filter(rubber => rubber.Rubber_Style === answers.ForehandRubberStyle);
  const backhandRubbers = rubbers.filter(rubber => rubber.Rubber_Style === answers.BackhandRubberStyle);

  // Try all combinations of blade + 2 rubbers
  for (const blade of blades) {
    // Small Hands Special - ONLY DHS brand (STRICT - dealbreaker)
    if (answers.Grip.includes('Small Hands Special')) {
      if (extractBrand(blade.Blade_Name) !== 'DHS') {
        continue;
      }
    }
    
    // Brand filter (STRICT - dealbreaker)
    if (!matchesBrandFilter(blade.Blade_Name, answers.Brand)) {
      continue;
    }
    
    // Grip/Handle filter (STRICT - dealbreaker for Anatomic only)
    const bladeGrip = blade.Blade_Grip || '';
    if (answers.Grip.includes('Anatomic') && !bladeGrip.includes('Anatomic')) {
      continue;
    }
    
      for (const fhRubber of forehandRubbers) {
      // Brand filter for forehand rubber (STRICT - dealbreaker)
      if (!matchesBrandFilter(fhRubber.Rubber_Name, answers.Brand)) {
        continue;
      }
      
      for (const bhRubber of backhandRubbers) {
        // Brand filter for backhand rubber (STRICT - dealbreaker)
        if (!matchesBrandFilter(bhRubber.Rubber_Name, answers.Brand)) {
          continue;
        }
        
        // Price parity constraint: both rubbers should be within 30% price difference
        // Skip this constraint for special rubbers (pimples, anti)
        const isSpecialRubber = fhRubber.Rubber_Style !== 'Normal' || bhRubber.Rubber_Style !== 'Normal';
        if (!isSpecialRubber) {
          const maxRubberPrice = Math.max(fhRubber.Rubber_Price, bhRubber.Rubber_Price);
          const minRubberPrice = Math.min(fhRubber.Rubber_Price, bhRubber.Rubber_Price);
          if (minRubberPrice > 0 && maxRubberPrice / minRubberPrice > 1.3) {
            continue; // Skip if price difference exceeds 30%
          }
        }
        
        // For budgets over $160, allow blade to be much more expensive than rubbers
        // For budgets under $160, maintain balanced pricing constraints
        if (budgetRange.max <= 160) {
          // Constraint: no rubber should be more expensive than the blade
          if (fhRubber.Rubber_Price > blade.Blade_Price || bhRubber.Rubber_Price > blade.Blade_Price) {
            continue;
          }
          
          // Constraint: cheapest rubber should be at least 1/2 of blade price
          const cheapestRubber = Math.min(fhRubber.Rubber_Price, bhRubber.Rubber_Price);
          if (cheapestRubber < blade.Blade_Price / 2) {
            continue;
          }
        }
        
        const totalPrice = blade.Blade_Price + fhRubber.Rubber_Price + bhRubber.Rubber_Price;
        
        if (totalPrice <= budgetRange.max) {
          // Calculate combined score
          const bladeScore = calculateScore(answers, blade);
          const fhScore = calculateScore(answers, fhRubber);
          const bhScore = calculateScore(answers, bhRubber);
          
          // Weight: blade 50%, forehand rubber 30%, backhand rubber 20%
          let combinedScore = (bladeScore * 0.5) + (fhScore * 0.3) + (bhScore * 0.2);
          
          // Add diversity bonus: prefer different rubbers for FH and BH
          if (fhRubber.Rubber_Name !== bhRubber.Rubber_Name) {
            combinedScore += 2; // 2 point bonus for variety
          }
          
          // Budget split guidance bonus: prefer 40% blade, 60% rubbers (30% each)
          // This is a soft constraint to guide toward balanced setups
          const idealBladeRatio = 0.4;
          const actualBladeRatio = blade.Blade_Price / totalPrice;
          const ratioDeviation = Math.abs(actualBladeRatio - idealBladeRatio);
          
          // Add up to 3 bonus points for staying close to ideal ratio
          // (0.0 deviation = +3 points, 0.3+ deviation = 0 points)
          const ratioBonusPoints = Math.max(0, 3 * (1 - ratioDeviation / 0.3));
          combinedScore += ratioBonusPoints;
          
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

  // Sort by score and return top N
  bestCombinations.sort((a, b) => b.score - a.score);
  
  // Normalize scores more accurately to show real differences
  if (bestCombinations.length > 0) {
    const maxScoreInBudget = bestCombinations[0].score;
    const minScoreInBudget = bestCombinations[bestCombinations.length - 1].score;
    const scoreRange = maxScoreInBudget - minScoreInBudget;
    
    // Normalize scores for all top N setups with wider range
    const topSetups = bestCombinations.slice(0, topN).map((setup, index) => {
      let normalizedScore;
      if (scoreRange > 0) {
        // Scale from 65 to 99, but prefer raw score if it's already good
        const scaledScore = 65 + ((setup.score - minScoreInBudget) / scoreRange) * 34;
        // Use the higher of scaled or raw score (capped at 99)
        normalizedScore = Math.min(99, Math.max(scaledScore, setup.score));
      } else {
        // If all scores are the same, decrease slightly for each rank
        normalizedScore = Math.min(99, setup.score) - (index * 1);
      }
      
      // If both rubbers are Normal and prices differ, ensure more expensive one is on forehand
      if (answers.ForehandRubberStyle === "Normal" && 
          answers.BackhandRubberStyle === "Normal" &&
          setup.backhandRubber.Rubber_Price > setup.forehandRubber.Rubber_Price) {
        // Swap the rubbers
        const temp = setup.forehandRubber;
        setup.forehandRubber = setup.backhandRubber;
        setup.backhandRubber = temp;
      }
      
      return {
        ...setup,
        score: normalizedScore
      };
    });
    
    // Ensure second setup has lower score than first
    if (topSetups.length > 1 && topSetups[1].score >= topSetups[0].score) {
      topSetups[1].score = topSetups[0].score - 1;
    }
    
    return topSetups;
  }
  
  return [];
}

// Legacy function for backward compatibility
export function findBestCustomSetup(answers: QuizAnswers): CustomSetup | null {
  const setups = findBestCustomSetups(answers, 1);
  return setups.length > 0 ? setups[0] : null;
}

// Get complete recommendation
export function getRecommendation(answers: QuizAnswers): Recommendation {
  const { forehandThickness, forehandExplanation, backhandThickness, backhandExplanation } = calculateSpongeThickness(answers);
  const { handleType, explanation: handleTypeExplanation } = calculateHandleType(answers);
  
  // Safe check for AssemblyPreference
  const assemblyPref = answers.AssemblyPreference || '';
  
  if (assemblyPref.includes('Ready-to-play')) {
    // Return top 2 pre-assembled rackets
    const preAssembledRackets = findBestPreAssembledRackets(answers, 2);
    const preAssembled = preAssembledRackets[0] || undefined;
    const preAssembled2 = preAssembledRackets[1] || undefined;
    const totalScore = preAssembled?.score || 0;
    return { 
      preAssembled,
      preAssembled2,
      customSetup: undefined,
      customSetup2: undefined,
      totalScore,
      forehandThickness,
      forehandThicknessExplanation: forehandExplanation,
      backhandThickness,
      backhandThicknessExplanation: backhandExplanation,
      handleType,
      handleTypeExplanation
    };
  } else if (assemblyPref.includes('Custom setup')) {
    // Return top 2 custom setups
    const customSetups = findBestCustomSetups(answers, 2);
    const customSetup = customSetups[0] || undefined;
    const customSetup2 = customSetups[1] || undefined;
    const totalScore = customSetup?.score || 0;
    return { 
      preAssembled: undefined,
      preAssembled2: undefined,
      customSetup,
      customSetup2,
      totalScore,
      forehandThickness,
      forehandThicknessExplanation: forehandExplanation,
      backhandThickness,
      backhandThicknessExplanation: backhandExplanation,
      handleType,
      handleTypeExplanation
    };
  } else {
    // Return both pre-assembled and top 2 custom setups (for "Not sure")
    const preAssembledRackets = findBestPreAssembledRackets(answers, 2);
    const preAssembled = preAssembledRackets[0] || undefined;
    const preAssembled2 = preAssembledRackets[1] || undefined;
    const customSetups = findBestCustomSetups(answers, 2);
    const customSetup = customSetups[0] || undefined;
    const customSetup2 = customSetups[1] || undefined;
    const preScore = preAssembled?.score || 0;
    const customScore = customSetup?.score || 0;
    const totalScore = Math.max(preScore, customScore);
    return { 
      preAssembled,
      preAssembled2,
      customSetup,
      customSetup2,
      totalScore,
      forehandThickness,
      forehandThicknessExplanation: forehandExplanation,
      backhandThickness,
      backhandThicknessExplanation: backhandExplanation,
      handleType,
      handleTypeExplanation
    };
  }
}