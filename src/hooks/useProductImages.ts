'use client';

import { useState, useEffect } from 'react';
import type { ProductOverrides } from '@/lib/googleSheets';

let cache: ProductOverrides | null = null;
let cachePromise: Promise<ProductOverrides> | null = null;

/** Fetches product image/price overrides from the Google Sheet (via API route).
 *  Results are module-level cached so multiple components share one fetch. */
export function useProductImages(): ProductOverrides {
    const empty: ProductOverrides = { blades: {}, rubbers: {}, rackets: {} };
    const [overrides, setOverrides] = useState<ProductOverrides>(cache ?? empty);

    useEffect(() => {
        if (cache) { setOverrides(cache); return; }

        if (!cachePromise) {
            cachePromise = fetch('/api/product-images')
                .then(r => r.json())
                .then(data => { cache = data; return data; })
                .catch(() => empty);
        }

        cachePromise.then(data => setOverrides(data));
    }, []);

    return overrides;
}

/** Merges sheet imageUrl into a blade object's Blade_Image field */
export function applyBladeImage<T extends { Blade_Name: string; Blade_Image?: string }>(
    blade: T,
    overrides: ProductOverrides,
): T {
    const o = overrides.blades[blade.Blade_Name];
    if (o?.imageUrl && !blade.Blade_Image) {
        return { ...blade, Blade_Image: o.imageUrl };
    }
    return blade;
}

/** Merges sheet imageUrl into a rubber object's Rubber_Image field */
export function applyRubberImage<T extends { Rubber_Name: string; Rubber_Image?: string }>(
    rubber: T,
    overrides: ProductOverrides,
): T {
    const o = overrides.rubbers[rubber.Rubber_Name];
    if (o?.imageUrl && !rubber.Rubber_Image) {
        return { ...rubber, Rubber_Image: o.imageUrl };
    }
    return rubber;
}
