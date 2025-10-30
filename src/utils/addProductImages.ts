// Utility to add default placeholder images to products
export const BLADE_PLACEHOLDER = "https://placehold.co/400x400/1a2333/ff8c32?text=Blade";
export const RUBBER_PLACEHOLDER = "https://placehold.co/400x400/1a2333/ff8c32?text=Rubber";
export const RACKET_PLACEHOLDER = "https://placehold.co/400x400/1a2333/ff8c32?text=Racket";

export function getProductImage(product: any, type: 'blade' | 'rubber' | 'racket'): string {
  if (type === 'blade' && product.Blade_Image) return product.Blade_Image;
  if (type === 'rubber' && product.Rubber_Image) return product.Rubber_Image;
  if (type === 'racket' && product.Racket_Image) return product.Racket_Image;
  
  // Return placeholder based on type
  if (type === 'blade') return BLADE_PLACEHOLDER;
  if (type === 'rubber') return RUBBER_PLACEHOLDER;
  return RACKET_PLACEHOLDER;
}
