import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLinks, type DemoLink } from "@/lib/demo";
import { Page } from "@/components/Chrome";
import { QrCode, downloadQr } from "@/components/QrCode";
import { shortUrl } from "@/lib/shortlinks";

export const Route = createFileRoute("/stats/$slug")({
  head: () => ({
    meta: [
      { title: "Link stats — 1kb.link" },
      {
        name: "description",
        content: "Clicks over time, referrers, devices and browsers for your short link.",
      },
      { property: "og:title", content: "Link stats — 1kb.link" },
      {
        property: "og:description",
        content: "Clicks over time, referrers, devices and browsers for your short link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Stats,
});

type Click = {
  created_at: string;
  referrer: string | null;
  device: string | null;
  browser: string | null;
};

function Stats() {
  const { slug } = Route.useParams();
  const decoded = decodeURIComponent(slug);

  const [data, setData] = useState<{ link: DemoLink; clicks: Click[] } | null>(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const link = getLinks().find((l) => l.slug === decoded);
    setData(link ? { link, clicks: fakeClicks(link) } : null);
    setLoading(false);
  }, [decoded]);

  if (isLoading) {
    return (
      <Page>
        <div className="edge py-24 text-muted-foreground">Loading stats…</div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <div className="edge py-24">
          <h1 className="text-3xl font-medium tracking-tight">No link called /{decoded}</h1>
          <Link to="/" className="mt-4 inline-block text-muted-foreground hover:text-foreground">
            Back home
          </Link>
        </div>
      </Page>
    );
  }

  const { link, clicks } = data;
  const url = shortUrl(link.slug);
  const now = Date.now();
  const last7 = clicks.filter((c) => now - new Date(c.created_at).getTime() < 7 * 864e5);
  const last24 = clicks.filter((c) => now - new Date(c.created_at).getTime() < 864e5);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now - (13 - i) * 864e5);
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }), count: 0 };
  });
  for (const c of clicks) {
    const key = c.created_at.slice(0, 10);
    const bucket = days.find((d) => d.key === key);
    if (bucket) bucket.count += 1;
  }
  const peak = Math.max(1, ...days.map((d) => d.count));

  const tally = (get: (c: Click) => string | null) => {
    const map = new Map<string, number>();
    for (const c of clicks) {
      const raw = get(c);
      const key = raw && raw.trim() ? raw : "Direct / unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  };

  const referrers = tally((c) => (c.referrer ? safeHost(c.referrer) : null));
  const devices = tally((c) => c.device);
  const browsers = tally((c) => c.browser);

  return (
    <Page>
      <div className="edge py-12">
        <p className="text-sm text-muted-foreground">Stats for</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight break-all sm:text-4xl">{url}</h1>
        <p className="mt-2 break-all text-muted-foreground">
          {link.title ? `${link.title} · ` : ""}
          {link.kind === "pdf" ? "Hosted PDF" : link.target_url}
          {!link.is_active && " · paused"}
        </p>

        <p className="mt-6 border-l-2 border-foreground bg-muted px-4 py-3 text-sm text-muted-foreground">UI preview · Activity below is illustrative sample data.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="All-time clicks" value={clicks.length} />
          <Stat label="Last 7 days" value={last7.length} />
          <Stat label="Last 24 hours" value={last24.length} />
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto]">
          <div className="rounded-[var(--radius)] border border-border p-6">
            <h2 className="font-medium">Last 14 days</h2>
            <div className="mt-6 flex h-40 items-end gap-1.5">
              {days.map((d) => (
                <div key={d.key} className="group flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-sm bg-foreground/85 transition-colors group-hover:bg-foreground"
                    style={{ height: `${Math.max(2, (d.count / peak) * 100)}%` }}
                    title={`${d.count} clicks on ${d.label}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{days[0]!.label}</span>
              <span>{days[days.length - 1]!.label}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-border p-6">
            <QrCode value={url} size={160} />
            <button
              type="button"
              onClick={() => downloadQr(url, link.slug, { fg: "#171717", bg: "#ffffff", format: "png" })}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Download QR
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <Breakdown title="Where from" rows={referrers} total={clicks.length} />
          <Breakdown title="Devices" rows={devices} total={clicks.length} />
          <Breakdown title="Browsers" rows={browsers} total={clicks.length} />
        </div>

        {clicks.length === 0 && (
          <p className="mt-10 text-muted-foreground">
            No clicks yet. Share the link or print the code and come back.
          </p>
        )}
      </div>
    </Page>
  );
}

const REFS = ["https://instagram.com", "https://google.com", "", "https://linkedin.com", "https://x.com"];
const DEV = ["Mobile", "Mobile", "Desktop", "Tablet"];
const BR = ["Chrome", "Safari", "Safari", "Firefox", "Edge"];
function fakeClicks(link: DemoLink): Click[] {
  let seed = [...link.slug].reduce((a, c) => a + c.charCodeAt(0), 7);
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: link.clicks }, () => ({
    created_at: new Date(Date.now() - rnd() * rnd() * 14 * 864e5).toISOString(),
    referrer: REFS[Math.floor(rnd() * REFS.length)] || null,
    device: DEV[Math.floor(rnd() * DEV.length)]!,
    browser: BR[Math.floor(rnd() * BR.length)]!,
  }));
}

function safeHost(ref: string) {
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return ref;
  }
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius)] bg-muted p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-4xl font-medium tracking-tight">{value}</p>
    </div>
  );
}

function Breakdown({
  title,
  rows,
  total,
}: {
  title: string;
  rows: [string, number][];
  total: number;
}) {
  return (
    <div>
      <h2 className="font-medium">{title}</h2>
      <ul className="mt-3 space-y-2.5">
        {rows.length === 0 && <li className="text-sm text-muted-foreground">Nothing yet</li>}
        {rows.map(([name, count]) => (
          <li key={name}>
            <div className="flex justify-between gap-3 text-sm">
              <span className="truncate">{name}</span>
              <span className="text-muted-foreground">{count}</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-muted">
              <div
                className="h-1 rounded-full bg-foreground"
                style={{ width: `${total ? (count / total) * 100 : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
