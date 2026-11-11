// Pure helpers shared by the website (render CMS content with fallbacks) and the admin editor.

export type PlainObject = Record<string, unknown>;

export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const ASSET_PATH = /\.(png|jpe?g|webp|gif|svg|avif|pdf|mp4|webm|glb)$/i;

/**
 * Only content that was never saved falls back to the original website content.
 * Text cleared or lists emptied on purpose stay empty, so removing something works.
 * Exception: a cleared image/file falls back, so pages never show a broken image.
 */
function isMissing(value: unknown, defaults: unknown): boolean {
  if (value === undefined || value === null) return true;
  return typeof value === 'string' && value.trim() === '' && typeof defaults === 'string' && ASSET_PATH.test(defaults);
}

/**
 * Returns CMS content shaped like `defaults`. Fields that were never saved (or have the wrong
 * type) use the live default; saved values, including deliberately empty text and lists, win.
 * Lists from the CMS replace the default list as a whole (admins add/remove/reorder items).
 */
export function withDefaults<T>(defaults: T, value: unknown): T {
  if (isMissing(value, defaults)) return defaults;
  if (isPlainObject(defaults)) {
    if (!isPlainObject(value)) return defaults;
    const out: PlainObject = {};
    for (const key of Object.keys(defaults)) out[key] = withDefaults(defaults[key], value[key]);
    return out as T;
  }
  if (Array.isArray(defaults)) {
    if (!Array.isArray(value)) return defaults;
    const template = defaults[0];
    if (template === undefined) return value as T;
    // Items keep their own values; only fill fields an item is missing from the item template's shape.
    return value.map((item) => (isPlainObject(template) ? fillShape(template, item) : item)) as T;
  }
  if (typeof defaults !== typeof value) return defaults;
  return value as T;
}

// For list items: missing fields become empty values of the right type (not another item's text).
function fillShape(template: PlainObject, item: unknown): PlainObject {
  if (!isPlainObject(item)) return emptyLike(template) as PlainObject;
  const out: PlainObject = { ...item };
  for (const key of Object.keys(template)) {
    if (!(key in item)) out[key] = emptyLike(template[key]);
  }
  return out;
}

/** A blank value with the same shape, used for "Add item" in the editor. */
export function emptyLike(value: unknown): unknown {
  if (typeof value === 'string') return '';
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  if (Array.isArray(value)) return [];
  if (isPlainObject(value)) {
    const out: PlainObject = {};
    for (const key of Object.keys(value)) out[key] = emptyLike(value[key]);
    return out;
  }
  return '';
}

/** Safely parse a stored JSON section body. */
export function parseContent(raw: unknown): unknown {
  if (typeof raw !== 'string') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/** True when any string inside is a script URL; such content is rejected by the admin APIs. */
export function hasUnsafeUrl(value: unknown): boolean {
  if (typeof value === 'string') return /^\s*(javascript|vbscript|data:text\/html)/i.test(value);
  if (Array.isArray(value)) return value.some(hasUnsafeUrl);
  if (isPlainObject(value)) return Object.values(value).some(hasUnsafeUrl);
  return false;
}
