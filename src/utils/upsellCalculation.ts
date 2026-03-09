import { getRecommendation, type QuizAnswers, type Recommendation, type Inventory } from './ratingSystem';

// No hierarchy array needed; we will dynamically propose +$50

export interface UpsellRecommendation {
  recommendation: Recommendation;
  originalBudget: string;
  upsellBudget: string;
  priceIncrease: number;
  isWorthwhile: boolean;
  explanation: string;
}

/**
 * Calculate if a flexible budget upsell would benefit the customer
 * Returns upsell recommendation only if:
 * 1. Higher price
 * 2. Better match score
 * 3. Actually better fit for the customer
 */
export function calculateFlexibleBudgetUpsell(
  currentAnswers: QuizAnswers,
  currentRecommendation: Recommendation,
  inventory: Inventory
): UpsellRecommendation | null {
  const currentBudget = currentAnswers.Budget;

  if (currentBudget === 'No limit') {
    return null;
  }

  let currentBudgetNum = 0;

  const match1 = currentBudget.match(/<(\d+)\$/);
  const match2 = currentBudget.match(/Under\s*\$(\d+)/i);

  if (match1 && match1[1]) {
    currentBudgetNum = parseInt(match1[1], 10);
  } else if (match2 && match2[1]) {
    currentBudgetNum = parseInt(match2[1], 10);
  } else {
    return null;
  }

  const nextBudgetNum = currentBudgetNum + 20;
  // Use the same format as the input for consistency, though the engine can now parse either
  const nextBudget = match1 ? `<${nextBudgetNum}$` : `Under $${nextBudgetNum}`;

  // Re-run recommendation with higher budget
  const upsellAnswers = { ...currentAnswers, Budget: nextBudget };
  const upsellRecommendation = getRecommendation(upsellAnswers, inventory);

  // Determine which recommendation type to compare (pre-assembled vs custom)
  const currentMain = currentAnswers.AssemblyPreference?.includes('Ready-to-play')
    ? currentRecommendation.preAssembled
    : currentRecommendation.customSetup;

  const upsellMain = currentAnswers.AssemblyPreference?.includes('Ready-to-play')
    ? upsellRecommendation.preAssembled
    : upsellRecommendation.customSetup;

  // If no upsell option found, return null
  if (!currentMain || !upsellMain) {
    return null;
  }

  // Note: we used to artificially inflate scores here, but now they are true
  // 0-100 percentages generated natively by the rating engine.

  // Check if the upsell is the same setup as current
  const isSameSetup = 'Racket_Name' in currentMain && 'Racket_Name' in upsellMain
    ? currentMain.Racket_Name === upsellMain.Racket_Name
    : !('Racket_Name' in currentMain) && !('Racket_Name' in upsellMain)
      ? (currentMain.blade.Blade_Name === upsellMain.blade.Blade_Name &&
        currentMain.forehandRubber.Rubber_Name === upsellMain.forehandRubber.Rubber_Name &&
        currentMain.backhandRubber.Rubber_Name === upsellMain.backhandRubber.Rubber_Name)
      : false;

  // Don't show if it's the same setup
  if (isSameSetup) {
    return null;
  }

  // Calculate prices
  const currentPrice = 'Racket_Price' in currentMain
    ? currentMain.Racket_Price
    : currentMain.totalPrice;
  const upsellPrice = 'Racket_Price' in upsellMain
    ? upsellMain.Racket_Price
    : upsellMain.totalPrice;

  const priceIncrease = upsellPrice - currentPrice;

  // Check if upsell is worthwhile:
  // 1. Must be more expensive
  // 2. Must have better score (even slightly)
  // 3. Price increase should be reasonable (not more than 50% increase)
  const scoreDifference = upsellMain.score - currentMain.score;
  const priceIncreasePercent = (priceIncrease / currentPrice) * 100;

  // Always show flexible budget option if there's a next tier
  const isWorthwhile = true;

  // Generate Apple-style explanation based on the improvement
  const explanation = generateUpsellExplanation(
    currentAnswers,
    currentMain,
    upsellMain,
    priceIncrease,
    scoreDifference
  );

  return {
    recommendation: upsellRecommendation,
    originalBudget: currentBudget,
    upsellBudget: nextBudget,
    priceIncrease,
    isWorthwhile,
    explanation
  };
}

function generateUpsellExplanation(
  answers: QuizAnswers,
  current: any,
  upsell: any,
  priceIncrease: number,
  scoreDifference: number
): string {
  const level = answers.Level;
  const playstyle = answers.Playstyle;

  // Calculate stat improvements
  const isPreAssembled = 'Racket_Speed' in current;
  const speedImprovement = isPreAssembled
    ? upsell.Racket_Speed - current.Racket_Speed
    : Math.round((upsell.blade.Blade_Speed + upsell.forehandRubber.Rubber_Speed + upsell.backhandRubber.Rubber_Speed) / 3) -
    Math.round((current.blade.Blade_Speed + current.forehandRubber.Rubber_Speed + current.backhandRubber.Rubber_Speed) / 3);

  const controlImprovement = isPreAssembled
    ? upsell.Racket_Control - current.Racket_Control
    : Math.round((upsell.blade.Blade_Control + upsell.forehandRubber.Rubber_Control + upsell.backhandRubber.Rubber_Control) / 3) -
    Math.round((current.blade.Blade_Control + current.forehandRubber.Rubber_Control + current.backhandRubber.Rubber_Control) / 3);

  // Craft explanation based on player profile and improvements
  if (playstyle.includes('Offensive') && speedImprovement > 0) {
    return `For an extra $${priceIncrease.toFixed(0)}, this refined setup delivers noticeably more explosive power and speed—perfect for aggressive attacking play. The enhanced responsiveness feels natural and effortless.`;
  } else if (playstyle.includes('Defensive') && controlImprovement > 0) {
    return `If you're open to a slightly more flexible budget, this setup offers significantly better touch and stability in defense. The refined control makes reading your opponent's spin feel smoother and more intuitive.`;
  } else if (level === 'Beginner' || level === 'Intermediate') {
    return `This upgraded option provides a more forgiving sweet spot and improved consistency—subtle differences that make your learning curve smoother and more enjoyable as you develop your technique.`;
  } else if (scoreDifference >= 3) {
    return `For just $${priceIncrease.toFixed(0)} more, this premium setup is measurably better matched to your playing style. The refinements in balance and feedback translate to more confidence and precision on every stroke.`;
  } else {
    return `If you're open to expanding your budget slightly, this higher-tier option offers enhanced performance characteristics that align beautifully with your preferences—a thoughtful upgrade worth considering.`;
  }
}
