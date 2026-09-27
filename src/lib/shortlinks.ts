const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

export const EMOJI_POOL = [
  "🚀",
  "🔥",
  "✨",
  "🌙",
  "🍀",
  "🎯",
  "🐙",
  "🦊",
  "🍕",
  "🎧",
  "🌈",
  "⚡",
  "🧊",
  "🪐",
  "🎲",
  "🐝",
  "🍋",
  "🧩",
  "📎",
  "🛰️",
];

export function randomSlug(length = 6): string {
  let out = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i += 1) out += ALPHABET[bytes[i]! % ALPHABET.length];
  return out;
}

export function randomEmojiSlug(length = 3): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => EMOJI_POOL[b % EMOJI_POOL.length]).join("");
}

export function randomKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function isValidUrl(raw: string): boolean {
  try {
    const u = new URL(normalizeUrl(raw));
    return Boolean(u.hostname) && u.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Slugs may contain letters, digits, dashes/underscores, or emoji. No spaces or slashes. */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > 40) return false;
  if (/[\s/?#%\\]/.test(slug)) return false;
  return !RESERVED.has(slug.toLowerCase());
}

export const RESERVED = new Set(["links", "scan", "stats", "emoji", "pdf", "qr", "auth", "dashboard", "shorten", "reset-password", "api", "assets", "favicon.ico"]);

export function shortUrl(slug: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/${encodeURI(slug)}`;
}

export function parseUserAgent(ua: string): { device: string; browser: string } {
  const device = /iPad|Tablet/i.test(ua)
    ? "Tablet"
    : /Mobi|Android|iPhone/i.test(ua)
      ? "Mobile"
      : "Desktop";
  const browser = /Edg\//i.test(ua)
    ? "Edge"
    : /OPR\//i.test(ua)
      ? "Opera"
      : /Chrome\//i.test(ua)
        ? "Chrome"
        : /Safari\//i.test(ua)
          ? "Safari"
          : /Firefox\//i.test(ua)
            ? "Firefox"
            : "Other";
  return { device, browser };
}

/* ---- local record of links created on this device ---- */
const STORE_KEY = "shortly.links.v1";

export type SavedLink = { slug: string; editKey: string; createdAt: string };

export function loadSaved(): SavedLink[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as SavedLink[]) : [];
  } catch {
    return [];
  }
}

export function saveLink(entry: SavedLink) {
  if (typeof window === "undefined") return;
  const next = [entry, ...loadSaved().filter((l) => l.slug !== entry.slug)];
  window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
}

export function forgetLink(slug: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(loadSaved().filter((l) => l.slug !== slug)));
}
