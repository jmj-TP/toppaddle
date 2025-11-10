// Sponge thickness affects rubber performance
// Thicker sponge = more speed/power, less control
// Thinner sponge = less speed/power, more control

export interface SpongeMultipliers {
  speed: number;
  control: number;
  power: number;
  spin: number;
}

export const getSpongeMultipliers = (thickness: string): SpongeMultipliers => {
  // Parse thickness value
  const thicknessValue = thickness.toLowerCase();
  
  // OX (no sponge)
  if (thicknessValue === 'ox') {
    return {
      speed: 0.7,
      control: 1.3,
      power: 0.6,
      spin: 0.8,
    };
  }
  
  // Ultramax / Max
  if (thicknessValue.includes('max') || thicknessValue.includes('ultra')) {
    return {
      speed: 1.15,
      control: 0.85,
      power: 1.15,
      spin: 1.0,
    };
  }
  
  // Extract numeric value
  const numericValue = parseFloat(thickness);
  
  if (isNaN(numericValue)) {
    // Default/unknown - no change
    return { speed: 1.0, control: 1.0, power: 1.0, spin: 1.0 };
  }
  
  // Calculate multipliers based on thickness
  // Reference: 2.0mm is baseline (1.0x)
  if (numericValue <= 0.5) {
    return {
      speed: 0.75,
      control: 1.25,
      power: 0.7,
      spin: 0.85,
    };
  } else if (numericValue <= 1.1) {
    return {
      speed: 0.8,
      control: 1.2,
      power: 0.75,
      spin: 0.9,
    };
  } else if (numericValue <= 1.3) {
    return {
      speed: 0.85,
      control: 1.15,
      power: 0.8,
      spin: 0.95,
    };
  } else if (numericValue <= 1.5) {
    return {
      speed: 0.9,
      control: 1.1,
      power: 0.85,
      spin: 0.95,
    };
  } else if (numericValue <= 1.7) {
    return {
      speed: 0.95,
      control: 1.05,
      power: 0.9,
      spin: 0.98,
    };
  } else if (numericValue <= 1.9) {
    return {
      speed: 0.98,
      control: 1.02,
      power: 0.95,
      spin: 0.99,
    };
  } else if (numericValue <= 2.0) {
    // Baseline
    return {
      speed: 1.0,
      control: 1.0,
      power: 1.0,
      spin: 1.0,
    };
  } else if (numericValue <= 2.1) {
    return {
      speed: 1.05,
      control: 0.97,
      power: 1.05,
      spin: 1.0,
    };
  } else if (numericValue <= 2.2) {
    return {
      speed: 1.08,
      control: 0.94,
      power: 1.08,
      spin: 1.0,
    };
  } else if (numericValue <= 2.3) {
    return {
      speed: 1.1,
      control: 0.91,
      power: 1.1,
      spin: 1.0,
    };
  } else {
    // Very thick (2.4mm+)
    return {
      speed: 1.12,
      control: 0.88,
      power: 1.12,
      spin: 1.0,
    };
  }
};

export const applySpongeMultipliers = (
  baseStats: { speed: number; control: number; power: number; spin: number },
  thickness: string
): { speed: number; control: number; power: number; spin: number } => {
  const multipliers = getSpongeMultipliers(thickness);
  
  return {
    speed: Math.round(Math.min(100, baseStats.speed * multipliers.speed)),
    control: Math.round(Math.min(100, baseStats.control * multipliers.control)),
    power: Math.round(Math.min(100, baseStats.power * multipliers.power)),
    spin: Math.round(Math.min(100, baseStats.spin * multipliers.spin)),
  };
};
