import type { ShopifyProduct } from "@/lib/shopify";

/**
 * Smart Sponge Selection System
 * 
 * Implements a sophisticated sponge size selection algorithm that:
 * - Considers player level and playing style
 * - Always selects a valid Shopify variant
 * - Provides intelligent fallback logic
 * - Works independently for FH and BH sides
 */

export interface SpongeSelection {
  size: string;
  variantId: string;
  explanation: string;
  targetSize: number;
  actualSize: number;
}

/**
 * Parse sponge thickness string to numeric value
 */
function parseThickness(thickness: string): number {
  // Handle special cases
  if (thickness.toLowerCase().includes('ox')) return 0;
  if (thickness.toLowerCase().includes('max')) return 2.5;
  if (thickness.toLowerCase().includes('ultra')) return 2.5;
  
  // Extract first number from string (e.g., "2.1mm" -> 2.1, "2.1" -> 2.1)
  const match = thickness.match(/[\d.]+/);
  if (!match) return 2.0;
  return parseFloat(match[0]);
}

/**
 * Get base target sponge size based on player level
 */
function getBaseTargetSize(level: string, style: string): number {
  switch (level) {
    case 'Beginner':
      return 1.7;
    case 'Intermediate':
      return 1.8;
    case 'Advanced':
      // If aggressive style, start at 2.1 instead of 2.0
      if (isAggressiveStyle(style)) {
        return 2.1;
      }
      return 2.0;
    default:
      return 1.8; // Default to intermediate
  }
}

/**
 * Determine if a playing style is aggressive
 */
function isAggressiveStyle(style: string): boolean {
  const aggressiveKeywords = [
    'fast',
    'aggressive',
    'offensive',
    'power',
    'attack'
  ];
  const styleLower = style.toLowerCase();
  return aggressiveKeywords.some(keyword => styleLower.includes(keyword));
}

/**
 * Determine if a playing style is defensive
 */
function isDefensiveStyle(style: string): boolean {
  const defensiveKeywords = [
    'defensive',
    'controlled',
    'control',
    'calm',
    'allround',
    'all-round'
  ];
  const styleLower = style.toLowerCase();
  return defensiveKeywords.some(keyword => styleLower.includes(keyword));
}

/**
 * Apply style adjustment to target size
 */
function applyStyleAdjustment(baseTarget: number, style: string): number {
  if (isAggressiveStyle(style)) {
    // Shift one step higher (0.1mm)
    return baseTarget + 0.1;
  } else if (isDefensiveStyle(style)) {
    // Shift one step lower (0.1mm)
    return baseTarget - 0.1;
  }
  // Neutral - keep base target
  return baseTarget;
}

/**
 * Find the closest available sponge size to the target
 */
function findClosestAvailableSize(
  targetSize: number,
  availableSizes: Array<{ original: string; value: number }>
): { original: string; value: number } {
  if (availableSizes.length === 0) {
    throw new Error("No available sponge sizes");
  }

  let closestAbove: { original: string; value: number } | null = null;
  let closestBelow: { original: string; value: number } | null = null;

  for (const size of availableSizes) {
    if (size.value >= targetSize) {
      if (!closestAbove || size.value < closestAbove.value) {
        closestAbove = size;
      }
    }
    if (size.value <= targetSize) {
      if (!closestBelow || size.value > closestBelow.value) {
        closestBelow = size;
      }
    }
  }

  // If we have an exact match or closest above
  if (closestAbove) {
    const diffAbove = Math.abs(closestAbove.value - targetSize);
    const diffBelow = closestBelow ? Math.abs(targetSize - closestBelow.value) : Infinity;

    // If equally close, prefer thicker sponge (above)
    if (diffAbove <= diffBelow) {
      return closestAbove;
    }
  }

  // Return closest below if no above or below is closer
  if (closestBelow) {
    return closestBelow;
  }

  // Fallback to any available size (should never reach here)
  return availableSizes[0];
}

/**
 * Generate explanation for the selected sponge size
 */
function generateExplanation(
  level: string,
  style: string,
  targetSize: number,
  actualSize: number,
  side: 'FH' | 'BH'
): string {
  const baseExplanations: Record<string, string> = {
    'Beginner': '1.7mm for control and easier learning',
    'Intermediate': '1.8mm for balanced performance',
    'Advanced': '2.0mm for power and spin'
  };

  let explanation = baseExplanations[level] || 'Recommended size';

  // Add style adjustment note
  if (isAggressiveStyle(style)) {
    explanation += ', increased for aggressive play';
  } else if (isDefensiveStyle(style)) {
    explanation += ', reduced for controlled play';
  }

  // Add note if we had to adjust from target
  if (Math.abs(actualSize - targetSize) > 0.05) {
    const direction = actualSize > targetSize ? 'thicker' : 'thinner';
    explanation += ` (closest available: ${actualSize}mm ${direction} than ideal ${targetSize.toFixed(1)}mm)`;
  }

  return explanation;
}

/**
 * Select optimal sponge size for a rubber based on player profile
 * 
 * @param rubberProduct - The Shopify product for the rubber
 * @param level - Player skill level (Beginner, Intermediate, Advanced)
 * @param style - Playing style for this side (e.g., "Fast & aggressive")
 * @param side - Which side this is for (FH or BH)
 * @returns SpongeSelection with size, variant ID, and explanation
 */
export function selectSmartSpongeSize(
  rubberProduct: ShopifyProduct,
  level: string,
  style: string,
  side: 'FH' | 'BH'
): SpongeSelection {
  // Get all available variants with sponge thickness option
  const variants = rubberProduct.node.variants.edges;
  
  // Find the sponge thickness option
  const spongeOption = rubberProduct.node.options.find(
    opt => opt.name === "Sponge Thickness"
  );

  if (!spongeOption || !spongeOption.values || spongeOption.values.length === 0) {
    throw new Error(`No sponge thickness options available for ${rubberProduct.node.title}`);
  }

  // Parse and sort available thicknesses
  const availableSizes = spongeOption.values
    .map(value => ({
      original: value,
      value: parseThickness(value)
    }))
    .sort((a, b) => a.value - b.value);

  // Step 1: Get base target size for player level
  const baseTarget = getBaseTargetSize(level, style);

  // Step 2: Apply style adjustment
  const adjustedTarget = applyStyleAdjustment(baseTarget, style);

  // Step 3: Find closest available size
  const selectedSize = findClosestAvailableSize(adjustedTarget, availableSizes);

  // Step 4: Find the matching variant
  const matchingVariant = variants.find(variant =>
    variant.node.selectedOptions.some(
      opt => opt.name === "Sponge Thickness" && opt.value === selectedSize.original
    )
  );

  if (!matchingVariant) {
    throw new Error(`No variant found for sponge thickness ${selectedSize.original}`);
  }

  // Step 5: Generate explanation
  const explanation = generateExplanation(
    level,
    style,
    adjustedTarget,
    selectedSize.value,
    side
  );

  return {
    size: selectedSize.original,
    variantId: matchingVariant.node.id,
    explanation,
    targetSize: adjustedTarget,
    actualSize: selectedSize.value
  };
}
