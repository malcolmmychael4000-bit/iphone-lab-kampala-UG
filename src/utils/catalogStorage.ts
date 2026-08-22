import { PartProduct } from '../types';
import { INITIAL_PARTS } from '../data/seedData';

const LOCAL_STORAGE_KEY = 'iphone_lab_custom_parts_catalog_v4';
const LEGACY_STORAGE_KEYS = [
  'iphone_lab_custom_parts_catalog_v3',
  'iphone_lab_custom_parts_catalog_v2',
  'iphone_lab_parts_local_backup',
];

/**
 * Validates whether an image URL is a valid, existing static asset, a data URL, or external URL.
 * Automatically replaces broken /uploads/ URLs with canonical static assets.
 */
export function sanitizeImageUrl(url: string | undefined, fallbackPartId?: string, tier?: 'incell' | 'oled' | 'main'): string {
  if (!url || typeof url !== 'string') return '';
  
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If it's a data URL (PNG/WebP/JPEG/SVG upload) or external URL, it's valid and preserved
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a static asset in /images/ (custom or parts)
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }

  // If it is an old ephemeral /uploads/ URL that was lost, fall back to canonical static path
  if (trimmed.startsWith('/uploads/') && fallbackPartId) {
    const slug = fallbackPartId.replace('part-screen-', '');
    if (tier === 'incell') return `/images/parts/part-screen-${slug}-incell.jpg`;
    if (tier === 'oled') return `/images/parts/part-screen-${slug}-oled.jpg`;
    return `/images/parts/part-screen-${slug}-main.jpg`;
  }

  return trimmed;
}

/**
 * Retrieves custom parts overrides from browser localStorage.
 */
export function getStoredParts(): PartProduct[] | null {
  try {
    let raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    // Check previous keys if v4 is not yet populated
    if (!raw) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyData = localStorage.getItem(legacyKey);
        if (legacyData) {
          raw = legacyData;
          break;
        }
      }
    }

    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p: PartProduct) => {
        const img = p.imageUrl || p.image_url || '';
        const incell = p.incellImageUrl || p.incell_image_url || '';
        const oled = p.oledImageUrl || p.oled_image_url || '';
        return {
          ...p,
          imageUrl: sanitizeImageUrl(img, p.id, 'main'),
          image_url: sanitizeImageUrl(img, p.id, 'main'),
          incellImageUrl: sanitizeImageUrl(incell, p.id, 'incell'),
          incell_image_url: sanitizeImageUrl(incell, p.id, 'incell'),
          oledImageUrl: sanitizeImageUrl(oled, p.id, 'oled'),
          oled_image_url: sanitizeImageUrl(oled, p.id, 'oled'),
        };
      });
    }
  } catch (e) {
    console.warn('Could not read stored parts from localStorage:', e);
  }
  return null;
}

/**
 * Saves current custom parts catalog to browser localStorage safely.
 * Preserves custom PNG and data URL uploads and dispatches update event.
 */
export function saveStoredParts(parts: PartProduct[]): void {
  try {
    const safeParts = parts.map((p) => {
      const img = p.imageUrl || p.image_url || '';
      const incell = p.incellImageUrl || p.incell_image_url || '';
      const oled = p.oledImageUrl || p.oled_image_url || '';

      return {
        ...p,
        imageUrl: img,
        image_url: img,
        incellImageUrl: incell,
        incell_image_url: incell,
        oledImageUrl: oled,
        oled_image_url: oled,
      };
    });

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(safeParts));
      localStorage.setItem('iphone_lab_parts_last_saved', new Date().toISOString());
    } catch (quotaError) {
      console.warn('LocalStorage quota limit reached, saving optimized catalog:', quotaError);
      // If quota exceeded, save without extra keys
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(safeParts));
    }

    // Broadcast change event to all active React components in this window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('iphone_lab_catalog_updated', { detail: safeParts }));
    }
  } catch (e) {
    console.warn('Could not save parts to localStorage:', e);
  }
}

/**
 * Merges server parts with any locally preserved custom parts and newly added parts.
 */
export function mergeWithStoredParts(serverParts: PartProduct[]): PartProduct[] {
  const stored = getStoredParts();
  if (!stored || stored.length === 0) return serverParts;

  const storedMap = new Map(stored.map((p) => [p.id, p]));

  const merged = serverParts.map((sp) => {
    const custom = storedMap.get(sp.id);
    if (!custom) return sp;

    const finalImg = custom.imageUrl || custom.image_url || sp.imageUrl || sp.image_url;
    const finalIncell = custom.incellImageUrl || custom.incell_image_url || sp.incellImageUrl || sp.incell_image_url;
    const finalOled = custom.oledImageUrl || custom.oled_image_url || sp.oledImageUrl || sp.oled_image_url;

    return {
      ...sp,
      ...custom,
      imageUrl: finalImg,
      image_url: finalImg,
      incellImageUrl: finalIncell,
      incell_image_url: finalIncell,
      oledImageUrl: finalOled,
      oled_image_url: finalOled,
    };
  });

  // Preserve any new custom parts added via Admin that are not in default server list
  const serverIds = new Set(serverParts.map((p) => p.id));
  const additionalCustomParts = stored.filter((p) => !serverIds.has(p.id));

  return [...merged, ...additionalCustomParts];
}


