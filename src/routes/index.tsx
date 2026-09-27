import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/Chrome";
import { ShortenForm } from "@/components/ShortenForm";
import { InfoSections } from "@/components/InfoSections";
import { CONTENT } from "@/lib/pageContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "1kb.link — Fast URL Shortener, Single Emoji Links & Dynamic QR Codes" },
      {
        name: "description",
        content:
          "Shorten URLs, claim single emoji links, host PDF menus, and create dynamic editable QR codes with real-time analytics. Fast, secure, and privacy-first.",
      },
      { name: "keywords", content: "URL shortener, emoji link, single emoji URL, dynamic QR code, QR code generator, PDF short link, password protected links, link analytics" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/" },
      { property: "og:title", content: "1kb.link — Fast URL Shortener, Single Emoji Links & Dynamic QR Codes" },
      {
        property: "og:description",
        content:
          "Shorten URLs, claim single emoji links, host PDF menus, and create dynamic editable QR codes with real-time analytics.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "1kb.link — Fast URL Shortener, Single Emoji Links & Dynamic QR Codes" },
      {
        name: "twitter:description",
        content:
          "Shorten URLs, claim single emoji links, host PDF menus, and create dynamic editable QR codes with real-time analytics.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    title: "Links that stay short & fast.",
    body: "Paste any long URL. Get an ultra-fast, memorable address (like 1kb.link/launch) with sub-25ms global redirection across edge nodes.",
  },
  {
    title: "Dynamic QR codes that remain editable.",
    body: "The QR code points to your short link. Change the target destination whenever you like — your printed packaging, menus, and signage keep working.",
  },
  {
    title: "Real-time traffic counts & analytics.",
    body: "Monitor total visits, 14-day trends, country and city geography, referrer platforms, and mobile vs desktop technology preferences instantly.",
  },
  {
    title: "Single emoji links.",
    body: "Claim iconic 1-character emoji addresses like 1kb.link/🚀 with multi-link cart checkout, real-time analytics, and dynamic vector QR codes.",
  },
  {
    title: "Instant PDF hosting with QR codes.",
    body: "Upload menus, whitepapers, or brochures up to 25 MB. We host the file and generate a permanent short link and printable QR code.",
  },
  {
    title: "Private in-browser QR scanner.",
    body: "Point your phone or laptop camera at any QR code to inspect destination safety, copy content, or open links with zero app installations.",
  },
];

function Index() {
  return (
    <Page>
      <section className="edge pt-14 pb-10 sm:pt-24">
        <h1 className="max-w-[18ch] rise text-4xl leading-[1.08] font-medium tracking-tight sm:text-6xl">
          One short link. Single emoji URLs & dynamic QR codes.
        </h1>
        <p
          className="rise mt-6 max-w-[62ch] text-lg text-muted-foreground leading-relaxed"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <b className="font-medium text-foreground">1kb.link</b> shortens links, registers memorable single-emoji web addresses, hosts PDF documents, prints customizable vector QR codes, and tracks real-time visitor analytics.
        </p>
      </section>

      <section className="edge">
        <div className="rise" style={{ "--i": 2 } as React.CSSProperties}>
          <ShortenForm mode="url" />
        </div>
      </section>

      <section className="edge mt-24">
        <h2 className="text-2xl font-medium tracking-tight">What it does</h2>
        <div className="mt-8 grid gap-x-10 gap-y-9 sm:grid-cols-2 ">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-1.5 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <InfoSections {...CONTENT.link} />

      <section className="edge mt-24">
        <div className="rounded-[var(--radius)] bg-foreground p-8 text-background sm:p-12">
          <h2 className="max-w-[20ch] text-2xl font-medium tracking-tight sm:text-3xl">
            Keep every link and its stats in one dashboard.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center rounded-full bg-background px-6 font-medium text-foreground transition-all hover:-translate-y-px"
            >
              Open dashboard
            </Link>
            <Link
              to="/scan-qr"
              className="inline-flex h-11 items-center rounded-full border border-background/30 px-6 font-medium transition-colors hover:bg-background/10"
            >
              Scan a QR code
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
