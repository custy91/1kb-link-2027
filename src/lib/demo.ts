import { isValidSlug, isValidUrl, normalizeUrl, randomSlug } from "@/lib/shortlinks";

export type DemoLink = {
  id: string;
  slug: string;
  target_url: string;
  title: string | null;
  kind: string;
  is_active: boolean;
  clicks: number;
  created_at: string;
  file_name?: string | undefined;
  password?: string | undefined;
  expires_at?: string | undefined;
  utm_source?: string | undefined;
  utm_medium?: string | undefined;
  utm_campaign?: string | undefined;
};

const KEY = "1kb.demo.links.v1";
const EVENT = "1kb-links-change";

export const samples: DemoLink[] = [
  { id: "sample-1", slug: "summer-menu", target_url: "https://example.com/menu", title: "Summer menu", kind: "url", is_active: true, clicks: 284, created_at: "2026-09-01T12:00:00Z" },
  { id: "sample-2", slug: "✨🍋✨", target_url: "https://example.com/launch", title: "Product launch", kind: "emoji", is_active: true, clicks: 126, created_at: "2026-09-08T12:00:00Z" },
  { id: "sample-3", slug: "brand-guide", target_url: "", title: "Brand guide.pdf", kind: "pdf", is_active: true, clicks: 73, created_at: "2026-09-14T12:00:00Z", file_name: "Brand guide.pdf" },
];

export function getLinks(): DemoLink[] {
  if (typeof window === "undefined") return samples;
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem("kort.demo.links.v1");
    return raw ? JSON.parse(raw) as DemoLink[] : samples;
  } catch { return samples; }
}

function persist(rows: DemoLink[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeLinks(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function createLink(input: {
  slug: string;
  target: string;
  title: string;
  kind: string;
  fileName?: string | undefined;
  password?: string | undefined;
  expiresAt?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
}): DemoLink {
  const rows = getLinks();
  const slug = input.slug.trim() || randomSlug();
  if (!isValidSlug(slug)) throw new Error("Use an ending without spaces, slashes or reserved words.");
  if (rows.some((row) => row.slug.toLowerCase() === slug.toLowerCase())) throw new Error("That ending is already taken. Try another.");
  if (input.kind !== "pdf" && !isValidUrl(input.target)) throw new Error("Enter a valid web address.");

  let finalTarget = input.kind === "pdf" ? "" : normalizeUrl(input.target);
  if (finalTarget && (input.utmSource || input.utmMedium || input.utmCampaign)) {
    try {
      const u = new URL(finalTarget);
      if (input.utmSource?.trim()) u.searchParams.set("utm_source", input.utmSource.trim());
      if (input.utmMedium?.trim()) u.searchParams.set("utm_medium", input.utmMedium.trim());
      if (input.utmCampaign?.trim()) u.searchParams.set("utm_campaign", input.utmCampaign.trim());
      finalTarget = u.toString();
    } catch {
      // Keep original target if parsing fails
    }
  }

  const row: DemoLink = {
    id: crypto.randomUUID(),
    slug,
    target_url: finalTarget,
    title: input.title.trim() || input.fileName || null,
    kind: input.kind,
    is_active: true,
    clicks: 0,
    created_at: new Date().toISOString(),
    file_name: input.fileName,
    password: input.password?.trim() || undefined,
    expires_at: input.expiresAt?.trim() || undefined,
    utm_source: input.utmSource?.trim() || undefined,
    utm_medium: input.utmMedium?.trim() || undefined,
    utm_campaign: input.utmCampaign?.trim() || undefined,
  };
  persist([row, ...rows]);
  return row;
}

export function updateLink(id: string, patch: Partial<DemoLink>) {
  persist(getLinks().map((row) => row.id === id ? { ...row, ...patch } : row));
}

export function deleteLink(id: string) { persist(getLinks().filter((row) => row.id !== id)); }
export function recordClick(id: string) { updateLink(id, { clicks: (getLinks().find((row) => row.id === id)?.clicks ?? 0) + 1 }); }
