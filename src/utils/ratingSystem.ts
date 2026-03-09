import { type Blade, type Rubber, type PreAssembledRacket } from '@/data/products';

export interface Inventory {
  blades: Blade[];
  rubbers: Rubber[];
  preAssembledRackets: PreAssembledRacket[];
}
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
  Vibration?: string; // High Feedback, Muted/Solid 
  Distance?: string; // At the table, Mid-distance
  MissTendency?: string; // Into the net, Off the end of the table, Not sure
}

// Helper functions to categorize playing styles across beginner and advanced options
export function isFastStyle(style: string | undefined): boolean {
  if (!style) return false;
  return style.includes('Fast & aggressive') ||
    style.includes('Offensive Drive/Punch') ||
    style.includes('Power Loop / Smash');
}

export function isSpinStyle(style: string | undefined): boolean {
  if (!style) return false;
  return style.includes('Spin & topspin') ||
    style.includes('Heavy Topspin') ||
    style.includes('Topspin Opening');
}

export function isControlStyle(style: string | undefined): boolean {
  if (!style) return false;
  return style.includes('Calm & controlled') ||
    style.includes('Directional Block') ||
    style.includes('Controlled Drive / Block') ||
    style.includes('Classic Push') ||
    style.includes('Defensive Chop');
}

export interface CustomSetup {
  blade: Blade;
  forehandRubber: Rubber;
  backhandRubber: Rubber;
  totalPrice: number;
  score: number;
  forehandThickness?: string;
  backhandThickness?: string;
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
function calculateScore(
  answers: QuizAnswers,
  product: any,
  productType: 'blade' | 'rubber' | 'racket' = 'racket',
  side?: 'forehand' | 'backhand'
): number {
  let score = 0;
  let maxScore = 0;

  // Level matching - MUCH more important for blades when user is beginner
  const isBladeForBeginner = productType === 'blade' && answers.Level === 'Beginner';
  const levelWeight = isBladeForBeginner ? 35 : 5; // 35% weight for beginner blades, 5% for others
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

  // BEGINNER RULE: Beginners ONLY get All-Wood blades
  if (productType === 'blade' && answers.Level === 'Beginner') {
    if (product.Blade_Material !== 'All-Wood') {
      return 0;
    }
  }

  // Style attribute matching for blades (30% weight)
  if (productType === 'blade' && product.Blade_Style) {
    const styleWeight = 30;
    maxScore += styleWeight;

    const bladeStyle = product.Blade_Style;
    if (answers.Playstyle.includes('Offensive') && bladeStyle === 'Offensive') {
      score += styleWeight;
    } else if (answers.Playstyle.includes('Defensive') && bladeStyle === 'Defensive') {
      score += styleWeight;
    } else if (answers.Playstyle.includes('Allround') && bladeStyle === 'All-Round') {
      score += styleWeight;
    } else if (answers.Playstyle.includes('Offensive') && bladeStyle === 'All-Round') {
      // Partial match: offensive players can use all-round blades
      score += styleWeight * 0.5;
    } else if (answers.Playstyle.includes('Defensive') && bladeStyle === 'All-Round') {
      // Partial match: defensive players can use all-round blades
      score += styleWeight * 0.5;
    }
  }

  // Playstyle matching (40% weight) - stats-based
  const playstyleWeight = 40;
  maxScore += playstyleWeight;

  const speed = product.Blade_Speed || product.Racket_Speed || product.Rubber_Speed || 0;
  const control = product.Blade_Control || product.Racket_Control || product.Rubber_Control || 0;
  const power = product.Blade_Power || product.Racket_Power || product.Rubber_Power || 0;
  const spin = product.Racket_Spin || product.Rubber_Spin || 0;

  // Check if the opposite side has a special rubber
  const hasSpecialRubberOnOppositeSide =
    (side === 'forehand' && (answers.BackhandRubberStyle === 'Long Pimples' || answers.BackhandRubberStyle === 'Anti')) ||
    (side === 'backhand' && (answers.ForehandRubberStyle === 'Long Pimples' || answers.ForehandRubberStyle === 'Anti'));

  // For rubbers: if opposite side has special rubber, use ONLY side-specific preferences
  // Otherwise, use overall Playstyle
  if (productType === 'rubber' && side && hasSpecialRubberOnOppositeSide) {
    // Use side-specific playing style ONLY
    const sideStyle = side === 'forehand' ? answers.Forehand : answers.Backhand;

    if (isFastStyle(sideStyle)) {
      score += (speed / 100) * playstyleWeight * 0.5;
      score += (power / 100) * playstyleWeight * 0.5;
      if (control > 88) {
        score -= playstyleWeight * 0.2;
      }
    } else if (isSpinStyle(sideStyle)) {
      score += (spin / 100) * playstyleWeight * 0.6;
      score += (control / 100) * playstyleWeight * 0.4;
    } else if (isControlStyle(sideStyle)) {
      score += (control / 100) * playstyleWeight;
    }
  } else {
    // Use overall Playstyle (original behavior)
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

  // Broad Metrics Matching: Blade Stiffness & Material (30% weight)
  if (productType === 'blade') {
    const structWeight = 30;
    maxScore += structWeight;

    // Stiffness mapping
    const stiffness = product.Blade_Stiffness || 50;
    if (answers.Playstyle.includes('Offensive') || answers.Power.includes('A lot of power')) {
      // Offensive players like stiffness for power and speed
      score += (stiffness / 100) * (structWeight * 0.5);
    } else if (answers.Playstyle.includes('Defensive') || answers.Power.includes('Control is more important')) {
      // Defensive/Control players want low stiffness (flexibility)
      score += ((100 - stiffness) / 100) * (structWeight * 0.5);
    } else {
      // Allround players like medium stiffness
      const diff = Math.abs(stiffness - 50);
      score += ((50 - diff) / 50) * (structWeight * 0.5);
    }

    // Material mapping
    const material = product.Blade_Material;
    if (answers.Level === 'Beginner') {
      if (material === 'All-Wood') score += structWeight * 0.5;
    } else if (answers.Level === 'Advanced') {
      if (answers.Playstyle.includes('Offensive') && (material === 'Outer-Carbon' || material === 'Inner-Carbon')) {
        score += structWeight * 0.5;
      } else if (material === 'Inner-Carbon' || material === 'All-Wood') {
        score += structWeight * 0.5;
      }
    } else { // Intermediate
      if (material === 'All-Wood' || material === 'Inner-Carbon') score += structWeight * 0.5;
      else if (material === 'Outer-Carbon') score += structWeight * 0.2;
    }
  }

  // Broad Metrics Matching: Rubber Hardness & Throw Angle (30% weight)
  if (productType === 'rubber' && side) {
    const rubberStructWeight = 30;
    maxScore += rubberStructWeight;

    const sideStyle = side === 'forehand' ? answers.Forehand : answers.Backhand;
    const hardness = product.Rubber_Hardness || 'Medium';
    const throwAngle = product.Rubber_ThrowAngle || 'Medium';

    // Hardness mapping (The "Gears" and Physics concept)
    // 1. Beginner/Control players need soft rubbers for margin of error and high base catapult. 
    //    Hard rubbers without fast swings feel "dead" to them.
    if (answers.Level === 'Beginner' || isControlStyle(sideStyle)) {
      if (hardness === 'Soft' || hardness === 'Mid-Soft') score += rubberStructWeight * 0.5;
      else if (hardness === 'Medium') score += rubberStructWeight * 0.2;
      else if (hardness === 'Hard' || hardness === 'Mid-Hard') score -= rubberStructWeight * 0.3; // Actively penalize "dead" feeling for slow swings
    }
    // 2. High Power / Aggressive attackers need Hard rubbers so they don't bottom out.
    //    They need the high top-end "gears" and direct energy transfer.
    else if (isFastStyle(sideStyle) || answers.Power.includes('A lot of power')) {
      if (hardness === 'Hard' || hardness === 'Mid-Hard') score += rubberStructWeight * 0.5;
      else if (hardness === 'Medium') score += rubberStructWeight * 0.25;
      else if (hardness === 'Soft' || hardness === 'Mid-Soft') score -= rubberStructWeight * 0.2; // Penalize bottoming-out
    }
    // 3. Spin/Topspin focused players who aren't purely aggressive need dwell time (Medium/Mid-Hard)
    //    They want precision but also the ability to sink the ball in for spin.
    else {
      if (hardness === 'Medium' || hardness === 'Mid-Hard') score += rubberStructWeight * 0.5;
      else if (hardness === 'Hard') score += rubberStructWeight * 0.2; // Usable but maybe too demanding
      else if (hardness === 'Mid-Soft' || hardness === 'Soft') score += rubberStructWeight * 0.2; // Easy spin, but lacks high gears
    }

    // Throw Angle mapping
    if (isSpinStyle(sideStyle)) {
      if (throwAngle === 'High') score += rubberStructWeight * 0.5;
      else if (throwAngle === 'Medium') score += rubberStructWeight * 0.25;
    } else if (isFastStyle(sideStyle) || sideStyle.includes('Flat hit')) {
      if (throwAngle === 'Low' || throwAngle === 'Medium') score += rubberStructWeight * 0.5;
    } else { // Control / blocking
      if (throwAngle === 'Medium') score += rubberStructWeight * 0.5;
    }
  }

  // Master Configurator Logic: Blade Feel & Physics
  if (productType === 'blade' && answers.Level !== 'Beginner') {
    // Vibration / Material matching (20 points)
    if (answers.Vibration) {
      maxScore += 20;
      const material = product.Blade_Material;
      if (answers.Vibration.includes('High Feedback')) {
        if (material === 'All-Wood' || material === 'Inner-Carbon' || !material) score += 20;
        else if (material === 'Outer-Carbon') score += 5; // Partial match
      } else if (answers.Vibration.includes('Solid')) {
        if (material === 'Outer-Carbon') score += 20;
        else if (material === 'Inner-Carbon') score += 10;
      }
    }

    // Distance / Stiffness matching (15 points)
    if (answers.Distance) {
      maxScore += 15;
      const stiffness = product.Blade_Stiffness || 50; // Default to medium stiffness
      if (answers.Distance.includes('At the table')) {
        if (stiffness >= 70) score += 15;
        else if (stiffness >= 60) score += 8;
      } else if (answers.Distance.includes('Mid-distance')) {
        if (stiffness < 70) score += 15;
        else if (stiffness < 80) score += 8;
      }
    }
  }

  // Master Configurator Logic: Rubber Tie-Breaker
  if (productType === 'rubber' && answers.MissTendency && side) {
    maxScore += 20;
    const throwAngle = product.Rubber_ThrowAngle || 'Medium';
    const hardness = product.Rubber_Hardness || 'Medium';

    if (answers.MissTendency === 'Into the net') {
      const sideStyle = side === 'forehand' ? answers.Forehand : answers.Backhand;

      // Throw Angle Synergy Override: Counter-Attackers (Flat Hits) need Medium throw, not High
      if (isFastStyle(sideStyle)) {
        if (throwAngle === 'Medium') score += 20;
        else if (throwAngle === 'High') score -= 10; // High throw inhibits effective flat hitting
      } else {
        // Normal net misses prefer High Throw and Softer sponges
        if (throwAngle === 'High') score += 10;
        else if (throwAngle === 'Medium') score += 5;

        if (hardness === 'Soft' || hardness === 'Mid-Soft') score += 10;
        else if (hardness === 'Medium') score += 5;
      }
    } else if (answers.MissTendency === 'Off the end of the table') {
      // Table misses favor Lower Throw and Harder sponges to keep the ball down
      if (throwAngle === 'Low' || throwAngle === 'Medium') score += 10;

      if (hardness === 'Hard' || hardness === 'Mid-Hard') score += 10;
      else if (hardness === 'Medium') score += 5;
    } else {
      // "Not sure" or safe option
      score += 20; // Default points to not penalize
    }
  }

  // Grip matching (100% weight) - STRICT filter for blades and rackets
  const gripWeight = 100;
  maxScore += gripWeight;

  // Both blades and rackets now use grip arrays
  const productGrips = product.Blade_Grip || product.Racket_Grip || [];

  // Determine what grip type the user wants
  const userWantsFlared = answers.Grip.includes('Shakehand Flared') || answers.Grip.includes('Small Hands Special');
  const userWantsStraight = answers.Grip.includes('Shakehand Straight') || answers.Grip.includes('Straight');
  const userWantsAnatomic = answers.Grip.includes('Anatomic');
  const userWantsPenhold = answers.Grip.includes('Penhold');

  // Check if product has the user's preferred grip
  let hasPreferredGrip = false;

  if (userWantsFlared && productGrips.some(grip => grip.includes('Flared') || grip.includes('FL'))) {
    hasPreferredGrip = true;
  } else if (userWantsStraight && productGrips.some(grip => grip.includes('Straight') || grip.includes('ST'))) {
    hasPreferredGrip = true;
  } else if (userWantsAnatomic && productGrips.some(grip => grip.includes('Anatomic') || grip.includes('AN'))) {
    hasPreferredGrip = true;
  } else if (userWantsPenhold && productGrips.some(grip => grip.includes('Penhold') || grip.includes('PEN') || grip.includes('CS') || grip.includes('CP'))) {
    hasPreferredGrip = true;
  } else if (answers.Grip.includes('Not sure')) {
    hasPreferredGrip = true; // Give benefit of doubt
  }

  // For blades and rackets, grip is a dealbreaker - filter out if not available
  if ((productType === 'blade' || productType === 'racket') && !hasPreferredGrip) {
    return 0; // Filter out completely if grip doesn't match
  }

  // Award points if grip matches
  if (hasPreferredGrip) {
    score += gripWeight;
  }

  // Forehand/Backhand style matching (15% weight)
  const styleWeight = 15;
  maxScore += styleWeight;

  // For rubbers with a specified side, use ONLY that side's preferences
  if (productType === 'rubber' && side) {
    const sideStyle = side === 'forehand' ? answers.Forehand : answers.Backhand;

    if (isFastStyle(sideStyle)) {
      score += (speed / 100) * styleWeight * 0.6;
      score += (power / 100) * styleWeight * 0.4;
    } else if (isSpinStyle(sideStyle)) {
      score += (spin / 100) * styleWeight * 0.6;
      score += (control / 100) * styleWeight * 0.4;
    } else if (isControlStyle(sideStyle)) {
      score += (control / 100) * styleWeight;
    }
  } else {
    // For non-rubbers or when side is not specified, use both sides
    if (isFastStyle(answers.Forehand) || isFastStyle(answers.Backhand)) {
      score += (speed / 100) * styleWeight * 0.6;
      score += (power / 100) * styleWeight * 0.4;
    } else if (isSpinStyle(answers.Forehand) || isSpinStyle(answers.Backhand)) {
      // Spin players need good spin AND control
      score += (spin / 100) * styleWeight * 0.6;
      score += (control / 100) * styleWeight * 0.4;
    } else if (isControlStyle(answers.Forehand) || isControlStyle(answers.Backhand)) {
      score += (control / 100) * styleWeight;
    }
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

  // Brand matching (15% weight)
  if (answers.Brand && answers.Brand.length > 0 && !answers.Brand.includes("All")) {
    const brandWeight = 15;
    maxScore += brandWeight;

    const productBrand = product.Blade_Brand || product.Rubber_Brand || product.Racket_Brand || "";

    // Check if the product's brand is in the user's selected brands
    if (productBrand && answers.Brand.some(b => productBrand.toLowerCase().includes(b.toLowerCase()))) {
      score += brandWeight;
    }
  }

  // Return true mathematical percentage
  const rawPercentage = maxScore === 0 ? 0 : (score / maxScore) * 100;

  // Cap at 100% just in case of float weirdness, and absolute floor of 0%
  // Use || 0 as a failsafe against NaN propagating through
  return Math.max(0, Math.min(100, rawPercentage)) || 0;
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

// Get budget range dynamically
function getBudgetRange(budget: string): { min: number; max: number } {
  if (!budget || budget === 'No limit') return { min: 0, max: 10000 };

  // Extract number from "<150$" format or "Under $100"
  const match1 = budget.match(/<(\d+)\$/);
  if (match1 && match1[1]) return { min: 0, max: parseInt(match1[1], 10) };

  const match2 = budget.match(/Under\s*\$(\d+)/i);
  if (match2 && match2[1]) return { min: 0, max: parseInt(match2[1], 10) };

  return { min: 0, max: 10000 };
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
  if ((Grip || '').includes('Anatomic')) {
    return {
      handleType: 'Anatomic',
      explanation: 'An Anatomic handle is contoured to fit your palm perfectly, providing secure and ergonomic grip that reduces hand fatigue during long play sessions. Great for players with really large hands.'
    };
  }

  // Penhold grip
  if ((Grip || '').includes('Penhold')) {
    return {
      handleType: 'Penhold',
      explanation: 'A Penhold handle is designed for the traditional Chinese grip style, offering excellent control and feel for penhold players.'
    };
  }

  // Straight grip preference
  if ((Grip || '').includes('Straight')) {
    return {
      handleType: 'Straight',
      explanation: 'A Straight handle offers uniform shape and versatility, perfect for players who like to adjust their grip position frequently.'
    };
  }

  // Shakehand or Not sure - recommend Flared (most popular)
  if ((Grip || '').includes('Shakehand') || (Grip || '').includes('Not sure')) {
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

// Calculate target thickness mathematically based on Master Configurator Logic
function getTargetThickness(answers: QuizAnswers, side: 'forehand' | 'backhand'): number {
  const { Level, ForehandRubberStyle, BackhandRubberStyle, Forehand, Backhand } = answers;
  const rubberStyle = side === 'forehand' ? ForehandRubberStyle : BackhandRubberStyle;

  if (rubberStyle === "Long Pimples" || rubberStyle === "Anti") return 0.5; // Thin/OX
  if (rubberStyle === "Short Pimples") return 1.6;

  // Base thickness depends on level
  let base = 1.9; // Intermediate
  if (Level === 'Beginner') base = 1.7;
  if (Level === 'Advanced') base = 2.1;

  // Forehand offset (Aggressive = +0.2mm, Tactician/Counter = +0.0mm)
  let fhOffset = 0;
  if ((Forehand || '').includes('Fast & aggressive') || (Forehand || '').includes('Spin & topspin')) {
    fhOffset = 0.2;
  }

  if (side === 'forehand') {
    return base + fhOffset;
  } else {
    // Backhand side (Active = matches FH, Passive = base - 0.2, Defense/Chop = base - 0.5)
    // Note: 'Calm & controlled' here maps to Passive Wall
    if ((Backhand || '').includes('Fast & aggressive') || (Backhand || '').includes('Spin & topspin')) {
      return base + fhOffset; // Active attack matches FH
    } else if ((Backhand || '').includes('Calm & controlled')) {
      return base - 0.2; // Passive wall
    }
    return base;
  }
}

// Select optimal sponge thickness from available options based on target thickness
function selectOptimalSpongeThickness(
  availableThicknesses: string[] | undefined,
  answers: QuizAnswers,
  side: 'forehand' | 'backhand'
): string {
  if (!availableThicknesses || availableThicknesses.length === 0) {
    return '2.0 mm'; // Fallback if no options
  }

  // Parse thickness strings to numbers
  const parseThickness = (thickness: string): number => {
    if (thickness.toLowerCase().includes('ox')) return 0;
    if (thickness.toLowerCase().includes('max') || thickness.toLowerCase().includes('ultra')) return 2.5;
    const match = thickness.match(/[\d.]+/);
    if (!match) return 2.0;
    return parseFloat(match[0]);
  };

  const sortedThicknesses = [...availableThicknesses]
    .map(t => ({ original: t, value: parseThickness(t) }))
    .sort((a, b) => a.value - b.value);

  const target = getTargetThickness(answers, side);

  let closest = sortedThicknesses[0];
  let minDiff = Math.abs(sortedThicknesses[0].value - target);

  for (const option of sortedThicknesses) {
    const diff = Math.abs(option.value - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = option;
    }
  }

  return closest.original;
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
export function findBestPreAssembledRackets(answers: QuizAnswers, inventory: Inventory, topN: number = 2): (PreAssembledRacket & { score: number })[] {
  const suitableRackets = inventory.preAssembledRackets
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

      // Grip/Handle filter - Check if racket has the recommended handle type
      const recommendedHandle = calculateHandleType(answers).handleType;
      const productGripStr = Array.isArray(racket.Racket_Grip) ? racket.Racket_Grip.join(',') : (racket.Racket_Grip || '');

      // Strict filter: racket must have the recommended grip type
      if (recommendedHandle.includes('Flared') && !productGripStr.includes('FL') && !productGripStr.includes('Flared')) return false;
      if (recommendedHandle.includes('Straight') && !productGripStr.includes('ST') && !productGripStr.includes('Straight')) return false;
      if (recommendedHandle.includes('Anatomic') && !productGripStr.includes('AN') && !productGripStr.includes('Anatomic')) return false;
      if (recommendedHandle.includes('Penhold') && !productGripStr.includes('PEN') && !productGripStr.includes('CS') && !productGripStr.includes('Penhold')) return false;

      return true;
    })
    .map(racket => ({
      ...racket,
      score: calculateScore(answers, racket, 'racket')
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  // Return top N rackets with realistic scores (no artificial inflation)
  if (suitableRackets.length > 0) {
    const topRackets = suitableRackets.slice(0, topN);

    // Ensure second racket has lower score than first if they're equal
    if (topRackets.length > 1 && topRackets[1].score >= topRackets[0].score) {
      topRackets[1].score = topRackets[0].score - 0.5;
    }

    return topRackets;
  }

  return [];
}

// Legacy function for backward compatibility
export function findBestPreAssembledRacket(answers: QuizAnswers, inventory: Inventory): (PreAssembledRacket & { score: number }) | null {
  const rackets = findBestPreAssembledRackets(answers, inventory, 1);
  return rackets.length > 0 ? rackets[0] : null;
}

// Find best custom setups (top 2)
export function findBestCustomSetups(answers: QuizAnswers, inventory: Inventory, topN: number = 2): CustomSetup[] {
  const budgetRange = getBudgetRange(answers.Budget);
  let bestCombinations: CustomSetup[] = [];

  // Filter rubbers by style preference for each side
  const forehandRubbers = inventory.rubbers.filter(rubber => rubber.Rubber_Style === answers.ForehandRubberStyle);
  const backhandRubbers = inventory.rubbers.filter(rubber => rubber.Rubber_Style === answers.BackhandRubberStyle);

  // We run two passes. Pass 1 strictly enforces the user's rule that a rubber cannot cost more
  // than the blade (as rubbers wear out). If no setups are found due to this, Pass 2 relaxes the rule.
  let isStrictPass = true;
  let passCompleted = false;

  while (!passCompleted) {
    for (const blade of inventory.blades) {
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

      // Grip/Handle filter - Check if blade has the recommended handle type
      const recommendedHandle = calculateHandleType(answers).handleType;
      const bladeGripStr = Array.isArray(blade.Blade_Grip) ? blade.Blade_Grip.join(',') : (blade.Blade_Grip || '');

      // Strict filter: blade must have the recommended grip type
      if (recommendedHandle.includes('Flared') && !bladeGripStr.includes('FL') && !bladeGripStr.includes('Flared')) continue;
      if (recommendedHandle.includes('Straight') && !bladeGripStr.includes('ST') && !bladeGripStr.includes('Straight')) continue;
      if (recommendedHandle.includes('Anatomic') && !bladeGripStr.includes('AN') && !bladeGripStr.includes('Anatomic')) continue;
      if (recommendedHandle.includes('Penhold') && !bladeGripStr.includes('PEN') && !bladeGripStr.includes('CS') && !bladeGripStr.includes('Penhold')) continue;

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

          // Strict constraint: Rubber wear vs Blade investment
          // As requested by user: rubbers last 4 months, blades last 2 years. Do not pair
          // extremely expensive rubbers with cheap blades.
          if (isStrictPass) {
            if (fhRubber.Rubber_Price > blade.Blade_Price || bhRubber.Rubber_Price > blade.Blade_Price) {
              continue; // Keep looping to find a cheaper rubber or a more premium blade
            }
          }

          const totalPrice = blade.Blade_Price + fhRubber.Rubber_Price + bhRubber.Rubber_Price;

          if (totalPrice <= budgetRange.max) {
            // Calculate combined score
            const bladeScore = calculateScore(answers, blade, 'blade');
            const fhScore = calculateScore(answers, fhRubber, 'rubber', 'forehand');
            const bhScore = calculateScore(answers, bhRubber, 'rubber', 'backhand');

            // Skip if any component is a total mismatch (score 0)
            if (bladeScore === 0 || fhScore === 0 || bhScore === 0) continue;

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

    // If strict pass found setups, or we already did the relaxed pass, we're done.
    if (bestCombinations.length > 0 || !isStrictPass) {
      passCompleted = true;
    } else {
      // If strict pass yielded nothing, run again without the rubber > blade block
      // as a fail-safe to guarantee a recommendation.
      isStrictPass = false;
    }
  }

  // Sort by score and return top N
  bestCombinations.sort((a, b) => b.score - a.score);

  // Normalize scores more accurately to show real differences
  if (bestCombinations.length > 0) {
    const maxScoreInBudget = bestCombinations[0].score;
    const minScoreInBudget = bestCombinations[bestCombinations.length - 1].score;
    const scoreRange = maxScoreInBudget - minScoreInBudget;

    // Apply realistic scoring - don't inflate artificially
    const topSetups = bestCombinations.slice(0, topN).map((setup, index) => {
      // If both rubbers are Normal and prices differ, ensure more expensive one is on forehand
      if (answers.ForehandRubberStyle === "Normal" &&
        answers.BackhandRubberStyle === "Normal" &&
        setup.backhandRubber.Rubber_Price > setup.forehandRubber.Rubber_Price) {
        // Swap the rubbers
        const temp = setup.forehandRubber;
        setup.forehandRubber = setup.backhandRubber;
        setup.backhandRubber = temp;
      }

      // Select optimal sponge thickness from available options for each rubber
      const availableFhThickness = selectOptimalSpongeThickness(
        setup.forehandRubber.Rubber_Sponge_Sizes,
        answers,
        'forehand'
      );
      const availableBhThickness = selectOptimalSpongeThickness(
        setup.backhandRubber.Rubber_Sponge_Sizes,
        answers,
        'backhand'
      );

      console.log('Setting sponge thicknesses:', {
        blade: setup.blade.Blade_Name,
        forehandRubber: setup.forehandRubber.Rubber_Name,
        backhandRubber: setup.backhandRubber.Rubber_Name,
        availableFhSizes: setup.forehandRubber.Rubber_Sponge_Sizes,
        availableBhSizes: setup.backhandRubber.Rubber_Sponge_Sizes,
        selectedFhThickness: availableFhThickness,
        selectedBhThickness: availableBhThickness
      });

      return {
        ...setup,
        forehandThickness: availableFhThickness,
        backhandThickness: availableBhThickness
      };
    });

    // Ensure second setup has lower score than first if they're equal
    if (topSetups.length > 1 && topSetups[1].score >= topSetups[0].score) {
      topSetups[1].score = topSetups[0].score - 0.5;
    }

    return topSetups;
  }

  return [];
}

// Legacy function for backward compatibility
export function findBestCustomSetup(answers: QuizAnswers, inventory: Inventory): CustomSetup | null {
  const setups = findBestCustomSetups(answers, inventory, 1);
  return setups.length > 0 ? setups[0] : null;
}

// Get complete recommendation
export function getRecommendation(answers: QuizAnswers, inventory: Inventory): Recommendation {
  const { forehandThickness, forehandExplanation, backhandThickness, backhandExplanation } = calculateSpongeThickness(answers);
  const { handleType, explanation: handleTypeExplanation } = calculateHandleType(answers);

  // Safe check for AssemblyPreference
  const assemblyPref = answers.AssemblyPreference || '';

  if (assemblyPref.includes('Ready-to-play')) {
    // Return top 2 pre-assembled rackets
    const preAssembledRackets = findBestPreAssembledRackets(answers, inventory, 2);
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
    // Return top 2 custom setups (already have validated sponge sizes)
    const customSetups = findBestCustomSetups(answers, inventory, 2);
    const customSetup = customSetups[0] || undefined;
    const customSetup2 = customSetups[1] || undefined;
    const totalScore = customSetup?.score || 0;

    return {
      preAssembled: undefined,
      preAssembled2: undefined,
      customSetup,
      customSetup2,
      totalScore,
      // Use setup-specific validated thicknesses
      forehandThickness: customSetup?.forehandThickness || forehandThickness,
      forehandThicknessExplanation: forehandExplanation,
      backhandThickness: customSetup?.backhandThickness || backhandThickness,
      backhandThicknessExplanation: backhandExplanation,
      handleType,
      handleTypeExplanation
    };
  } else {
    // Return both pre-assembled and custom setups (already have validated sponge sizes)
    const preAssembledRackets = findBestPreAssembledRackets(answers, inventory, 2);
    const preAssembled = preAssembledRackets[0] || undefined;
    const preAssembled2 = preAssembledRackets[1] || undefined;
    const customSetups = findBestCustomSetups(answers, inventory, 2);
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
      // Use setup-specific validated thicknesses
      forehandThickness: customSetup?.forehandThickness || forehandThickness,
      forehandThicknessExplanation: forehandExplanation,
      backhandThickness: customSetup?.backhandThickness || backhandThickness,
      backhandThicknessExplanation: backhandExplanation,
      handleType,
      handleTypeExplanation
    };
  }
}