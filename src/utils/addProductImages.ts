// Utility to add default placeholder images to products
export const BLADE_PLACEHOLDER = "https://placehold.co/400x400/1a2333/ff8c32?text=Blade";
export const RUBBER_PLACEHOLDER = "https://placehold.co/400x400/1a2333/ff8c32?text=Rubber";
export const RACKET_PLACEHOLDER = "https://placehold.co/400x400/1a2333/ff8c32?text=Racket";

import { slugify } from "@/lib/googleSheets";

export function getProductImage(product: any, type: 'blade' | 'rubber' | 'racket'): string {
  // 1. Check if product already has live imageUrl
  if (product.imageUrl) return product.imageUrl;

  // 2. Identify name for lookup
  const name = product.Blade_Name || product.Rubber_Name || product.Racket_Name || "";
  const slug = slugify(name);

  // 4. Fallback to existing static image fields
  if (type === 'blade' && product.Blade_Image && !product.Blade_Image.includes('placehold.co')) return product.Blade_Image;
  if (type === 'rubber' && product.Rubber_Image && !product.Rubber_Image.includes('placehold.co')) return product.Rubber_Image;
  if (type === 'racket' && product.Racket_Image && !product.Racket_Image.includes('placehold.co')) return product.Racket_Image;

  // 5. Final fallback to placeholder
  if (type === 'blade') return BLADE_PLACEHOLDER;
  if (type === 'rubber') return RUBBER_PLACEHOLDER;
  return RACKET_PLACEHOLDER;
}
