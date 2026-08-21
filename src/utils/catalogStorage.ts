import { PartProduct } from '../types';
import { INITIAL_PARTS } from '../data/seedData';

const LOCAL_STORAGE_KEY = 'iphone_lab_custom_parts_catalog_v3';

/**
 * Validates whether an image URL is a valid, existing static asset, a data URL, or external URL.
 * Automatically replaces broken /uploads/ URLs with canonical static assets.
 */
export function sanitizeImageUrl(url: string | undefined, fallbackPartId?: string, tier?: 'incell' | 'oled' | 'main'): string {
  if (!url || typeof url !== 'string') return '';
  
  // If it's a data URL or external URL, it's valid
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a static asset in /images/ (custom or parts)
  if (url.startsWith('/images/')) {
    return url;
  }

  // If it is an old ephemeral /uploads/ URL that was lost, fall back to canonical static path
  if (url.startsWith('/uploads/') && fallbackPartId) {
    const slug = fallbackPartId.replace('part-screen-', '');
    if (tier === 'incell') return `/images/parts/part-screen-${slug}-incell.jpg`;
    if (tier === 'oled') return `/images/parts/part-screen-${slug}-oled.jpg`;
    return `/images/parts/part-screen-${slug}-main.jpg`;
  }

  return url;
}

/**
 * Retrieves custom parts overrides from browser localStorage.
 */
export function getStoredParts(): PartProduct[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p: PartProduct) => ({
        ...p,
        imageUrl: sanitizeImageUrl(p.imageUrl, p.id, 'main'),
        incellImageUrl: sanitizeImageUrl(p.incellImageUrl, p.id, 'incell'),
        oledImageUrl: sanitizeImageUrl(p.oledImageUrl, p.id, 'oled'),
      }));
    }
  } catch (e) {
    console.warn('Could not read stored parts from localStorage:', e);
  }
  return null;
}

/**
 * Saves current custom parts catalog to browser localStorage safely.
 * Strips huge base64 strings (>50KB) to ensure localStorage quota is never exceeded.
 */
export function saveStoredParts(parts: PartProduct[]): void {
  try {
    const safeParts = parts.map((p) => {
      const isHugeImg = p.imageUrl && p.imageUrl.startsWith('data:') && p.imageUrl.length > 20000;
      const isHugeIncell = p.incellImageUrl && p.incellImageUrl.startsWith('data:') && p.incellImageUrl.length > 20000;
      const isHugeOled = p.oledImageUrl && p.oledImageUrl.startsWith('data:') && p.oledImageUrl.length > 20000;

      return {
        ...p,
        imageUrl: isHugeImg ? '' : p.imageUrl,
        incellImageUrl: isHugeIncell ? '' : p.incellImageUrl,
        oledImageUrl: isHugeOled ? '' : p.oledImageUrl,
      };
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(safeParts));
    localStorage.setItem('iphone_lab_parts_last_saved', new Date().toISOString());

    // Clean up older legacy storage keys to reclaim browser storage
    try {
      localStorage.removeItem('iphone_lab_custom_parts_catalog_v2');
      localStorage.removeItem('iphone_lab_parts_local_backup');
    } catch {
      // ignore
    }
  } catch (e) {
    console.warn('Could not save parts to localStorage:', e);
  }
}

/**
 * Merges server parts with any locally preserved custom parts.
 */
export function mergeWithStoredParts(serverParts: PartProduct[]): PartProduct[] {
  const stored = getStoredParts();
  if (!stored || stored.length === 0) return serverParts;

  const storedMap = new Map(stored.map((p) => [p.id, p]));

  return serverParts.map((sp) => {
    const custom = storedMap.get(sp.id);
    if (!custom) return sp;

    // Prefer custom uploaded images if valid
    const hasCustomImg = custom.imageUrl && custom.imageUrl !== sp.imageUrl;
    const hasCustomIncell = custom.incellImageUrl && custom.incellImageUrl !== sp.incellImageUrl;
    const hasCustomOled = custom.oledImageUrl && custom.oledImageUrl !== sp.oledImageUrl;

    return {
      ...sp,
      ...custom,
      imageUrl: hasCustomImg ? custom.imageUrl : sp.imageUrl,
      incellImageUrl: hasCustomIncell ? custom.incellImageUrl : sp.incellImageUrl,
      oledImageUrl: hasCustomOled ? custom.oledImageUrl : sp.oledImageUrl,
    };
  });
}

