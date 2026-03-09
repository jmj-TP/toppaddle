// Table Tennis Product Database

export interface Blade {
  Blade_Name: string;
  Blade_Speed: number; // 1-100
  Blade_Spin: number; // 1-100
  Blade_Control: number; // 1-100
  Blade_Power: number; // 1-100
  Blade_Grip: string[]; // Array of available grips: e.g., ["FL", "ST", "AN"]
  Blade_Price: number; // USD, manually added, for sorting only
  Blade_Level: "Beginner" | "Intermediate" | "Advanced";
  Blade_Weight?: number; // grams (optional - will be estimated if not provided)
  Blade_Description: string; // Detailed product description
  Blade_Style?: "Offensive" | "Defensive" | "All-Round" | "Allround"; // Playing style of the blade
  Blade_Image?: string; // Product image URL
  Blade_Stiffness?: number; // 1-100
  Blade_Material?: "All-Wood" | "Inner-Carbon" | "Outer-Carbon";
  Blade_Brand?: string;
}

// Estimate blade weight based on characteristics
export function estimateBladeWeight(blade: Blade): number {
  if (blade.Blade_Weight) return blade.Blade_Weight;

  // Base weight ranges by level and style
  let baseWeight = 88;

  // Level adjustment
  if (blade.Blade_Level === "Beginner") baseWeight = 86;
  else if (blade.Blade_Level === "Advanced") baseWeight = 91;

  // Speed/Power adjustment (fast offensive blades are heavier)
  const offensiveScore = (blade.Blade_Speed + blade.Blade_Power) / 2;
  if (offensiveScore > 85) baseWeight += 3;
  else if (offensiveScore < 60) baseWeight -= 4; // Defensive blades lighter

  return Math.round(baseWeight);
}

export interface Rubber {
  Rubber_Name: string;
  Rubber_Speed: number; // 1-100
  Rubber_Spin: number; // 1-100
  Rubber_Control: number; // 1-100
  Rubber_Power: number; // 1-100
  Rubber_Price: number; // USD
  Rubber_Level: "Beginner" | "Intermediate" | "Advanced";
  Rubber_Style: "Normal" | "Short Pimples" | "Long Pimples" | "Anti";
  Rubber_Weight?: number; // grams (when applied to blade - optional, will be estimated)
  Rubber_Sponge_Sizes?: string[]; // Available sponge thickness options
  Rubber_Description: string; // Detailed product description
  Rubber_Image?: string; // Product image URL
  Rubber_Hardness?: "Soft" | "Mid-Soft" | "Medium" | "Mid-Hard" | "Hard";
  Rubber_ThrowAngle?: "Low" | "Medium" | "High";
  Rubber_Surface?: "Tacky" | "Grippy" | "Short Pips" | "Long Pips" | "Anti";
  Rubber_Brand?: string;
}

// Estimate rubber weight when applied to blade
export function estimateRubberWeight(rubber: Rubber): number {
  if (rubber.Rubber_Weight) return rubber.Rubber_Weight;

  // Weight varies by rubber style
  switch (rubber.Rubber_Style) {
    case "Normal": {
      // Thicker, power rubbers are heavier
      const powerScore = (rubber.Rubber_Speed + rubber.Rubber_Power) / 2;
      return Math.round(48 + (powerScore / 100) * 5); // 48-53g
    }
    case "Short Pimples":
      return 46;
    case "Long Pimples":
      return 43;
    case "Anti":
      return 41;
    default:
      return 50;
  }
}

export interface PreAssembledRacket {
  Racket_Name: string;
  Racket_Blade: string;
  Racket_FH_Rubber: string;
  Racket_BH_Rubber: string;
  Racket_FH_Rubber_Style: "Normal" | "Short Pimples" | "Long Pimples" | "Anti";
  Racket_BH_Rubber_Style: "Normal" | "Short Pimples" | "Long Pimples" | "Anti";
  Racket_Speed: number; // 1-100
  Racket_Spin: number; // 1-100
  Racket_Control: number; // 1-100
  Racket_Power: number; // 1-100
  Racket_Grip: string[]; // Array of available grips: e.g., ["FL", "ST"]
  Racket_Price: number; // USD
  Racket_Level: "Beginner" | "Intermediate" | "Advanced";
  Racket_Description: string; // Detailed product description
  Racket_Image?: string; // Product image URL
  Racket_Brand?: string;
}

// We no longer export static arrays here. They are dynamically fetched from Google Sheets.
// export const blades: Blade[] = [];
// export const rubbers: Rubber[] = [];
// export const preAssembledRackets: PreAssembledRacket[] = [];
