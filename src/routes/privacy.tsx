import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, ToolHeader } from "@/components/Chrome";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Cookie,
  EyeOff,
  ScanLine,
  Lock,
  Server,
  Mail,
  ArrowRight,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — 1kb.link (Zero Cookies & GDPR Compliant)" },
      {
        name: "description",
        content:
          "Our privacy policy guarantees zero third-party tracking cookies, no cross-site user fingerprinting, and complete GDPR and CCPA compliance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/privacy" },
      { property: "og:title", content: "Privacy Policy — 1kb.link" },
      {
        property: "og:description",
        content: "Zero cookies, no cross-site surveillance, and complete GDPR/CCPA compliance.",
      },
    ],
  }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <Page>
      <ToolHeader
        title="Privacy Policy"
        body="We believe URL redirection and QR generation should be lightning fast, transparent, and respectful of human privacy. Here is how we protect you and your visitors."
      />

      <section className="edge pb-24">
        <div className="space-y-10">
          {/* Metadata & Trust Badges Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Zero-Cookie Architecture
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-foreground">
                GDPR & CCPA Compliant
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-muted-foreground">
                Version 2.4
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5" />
              <span>Effective Date: September 2026</span>
            </div>
          </div>

          {/* Core Guarantees 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <Cookie className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">0% Tracking Cookies</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No third-party tracking or advertising cookies are ever placed in visitors' browsers.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <EyeOff className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">No Fingerprinting</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We never harvest canvas hashes, device serials, or persistent identifiers.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <ScanLine className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Client-Side QR Scanner</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Camera frames never leave your computer or phone; zero image data is transmitted.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Hashed Passcodes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Password protected links verify credentials via one-way cryptographic edge hashing.
              </p>
            </div>
          </div>

          {/* Section 1: Information We Do Not Collect */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[11px]">
                01
              </span>
              <span>Data Minimization</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              Information We Do Not Collect
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unlike legacy link shorteners that monetize through cross-web consumer profiling, 1kb.link operates under a strict data minimization charter:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-secondary/30 p-3.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">No Raw IP Retention:</strong>
                  <p className="text-muted-foreground mt-0.5">We do not store individual IP addresses in analytics tables.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-secondary/30 p-3.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">No Cross-Site Surveillance:</strong>
                  <p className="text-muted-foreground mt-0.5">We do not track users across external third-party properties.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-secondary/30 p-3.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">Zero Broker Resale:</strong>
                  <p className="text-muted-foreground mt-0.5">We never sell, rent, or lease usage telemetry to advertising brokers.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-secondary/30 p-3.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">No Ad Pixels:</strong>
                  <p className="text-muted-foreground mt-0.5">Zero tracking scripts or Meta/Google remarketing beacons on links.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Analytical Measurements and Aggregation */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[11px]">
                02
              </span>
              <span>Telemetry & Aggregation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              Analytical Measurements and Privacy Aggregation
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When a visitor navigates through a 1kb.link short link or scans an associated vector QR code, our edge infrastructure processes only coarse, aggregated non-personal metrics:
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground pt-1">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0 mt-2"></span>
                <span><strong className="text-foreground font-medium">Referring Platform:</strong> Coarse HTTP referrer domain (e.g. twitter.com, linkedin.com, direct).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0 mt-2"></span>
                <span><strong className="text-foreground font-medium">Coarse Geography:</strong> Aggregated country and city derived in volatile memory via edge lookup without persistent IP logging.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0 mt-2"></span>
                <span><strong className="text-foreground font-medium">Device Category:</strong> High-level platform class (iOS, Android, macOS, Windows) to help link owners format destinations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0 mt-2"></span>
                <span><strong className="text-foreground font-medium">Timestamp:</strong> Coarse hourly timestamp bucket for trend graphs.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Password-Protected Links & QR Scanner Privacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[10px]">
                  03
                </span>
                <span>Link Security</span>
              </div>
              <h3 className="text-lg font-medium text-foreground">Password Protected Links</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you protect a short link with a passcode, secret keys are hashed cryptographically using modern one-way digest algorithms. Unhashed plaintext passcodes are never written to disk, database, or proxy logs.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[10px]">
                  04
                </span>
                <span>Device Isolation</span>
              </div>
              <h3 className="text-lg font-medium text-foreground">In-Browser QR Scanner</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our camera scanner (<Link to="/scan-qr" className="underline text-foreground">1kb.link/scan-qr</Link>) executes 100% locally in your browser memory using the WebRTC MediaDevices and Canvas APIs. Zero video or image buffers are sent to our cloud.
              </p>
            </div>
          </div>

          {/* Section 5: GDPR & CCPA Compliance Box */}
          <div className="rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-semibold text-foreground">GDPR & CCPA Rights</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Under GDPR Articles 15-22 and CCPA/CPRA, you maintain the right to access, rectify, and delete any personal credentials associated with your account. Because 1kb.link does not store identifying tracking dossiers on link visitors, no visitor personal data is retained or commercialized.
            </p>
          </div>

          {/* Section 6: Contact & DPO */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-foreground">Questions or Data Requests?</h3>
              <p className="text-xs text-muted-foreground max-w-lg">
                Our Data Protection Officer and security team are available to answer compliance, encryption, and audit inquiries.
              </p>
            </div>
            <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-medium shrink-0 h-10 px-5 gap-2">
              <a href="mailto:privacy@1kb.link">
                <Mail className="h-3.5 w-3.5" />
                Contact Privacy Team
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Page>
  );
}
