import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, ToolHeader } from "@/components/Chrome";
import { ShortenForm } from "@/components/ShortenForm";
import { InfoSections } from "@/components/InfoSections";
import { CONTENT } from "@/lib/pageContent";
import { ArrowRight, QrCode } from "lucide-react";

export const Route = createFileRoute("/pdf")({
  head: () => ({
    meta: [
      { title: "Host PDF Behind Short Link & Dynamic QR Code — 1kb.link" },
      {
        name: "description",
        content:
          "Upload PDF menus, price lists, brochures, and documents up to 25 MB. Get an instant short link and printable dynamic QR code that can be updated anytime without reprinting.",
      },
      { name: "keywords", content: "PDF QR code, host PDF short link, restaurant menu QR code, PDF link shortener, share PDF link, contactless menu QR" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/pdf" },
      { property: "og:title", content: "Host PDF Behind Short Link & Dynamic QR Code — 1kb.link" },
      {
        property: "og:description",
        content:
          "Upload PDF menus, brochures, and documents up to 25 MB. Get an instant short link and printable dynamic QR code.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Host PDF Behind Short Link & Dynamic QR Code — 1kb.link" },
      {
        name: "twitter:description",
        content:
          "Upload PDF menus, brochures, and documents up to 25 MB. Get an instant short link and printable dynamic QR code.",
      },
    ],
  }),
  component: () => (
    <Page>
      <ToolHeader
        title="Host PDF documents with instant short links & QR codes."
        body="Drop in any restaurant menu, catalog, or brochure (up to 25 MB). 1kb.link hosts the document on global edge storage and provides a permanent short link and printable vector QR code."
      />
      <section className="edge">
        <ShortenForm mode="pdf" cta="Upload and shorten" />
      </section>
      <InfoSections {...CONTENT.pdf} />

      {/* Bottom Conversion Banner CTA */}
      <section className="edge mt-24">
        <div className="rounded-[var(--radius)] bg-foreground p-8 text-background sm:p-12">
          <h2 className="max-w-[20ch] text-2xl font-medium tracking-tight sm:text-3xl">
            Host menus, guides, and flyers with zero maintenance.
          </h2>
          <p className="mt-3 text-sm text-background/80 max-w-lg leading-relaxed">
            Update your PDF destination anytime without reprinting physical QR code table tents, menus, or promotional signage.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/qr-generator"
              className="inline-flex h-11 items-center rounded-full bg-background px-6 font-medium text-foreground transition-all hover:-translate-y-px gap-1.5 text-xs sm:text-sm"
            >
              <QrCode className="h-4 w-4" />
              Generate vector QR
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center rounded-full border border-background/30 px-6 font-medium transition-colors hover:bg-background/10 gap-1.5 text-xs sm:text-sm"
            >
              View links on this device <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Page>
  ),
});
