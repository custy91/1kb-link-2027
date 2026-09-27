import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, ToolHeader } from "@/components/Chrome";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  FileCheck,
  AlertTriangle,
  Mail,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — 1kb.link (Acceptable Use & 99.99% SLA)" },
      {
        name: "description",
        content:
          "Read the terms of service, acceptable use policies, and uptime commitments governing 1kb.link short links, dynamic vector QR codes, and API services.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/terms" },
      { property: "og:title", content: "Terms of Service — 1kb.link" },
      {
        property: "og:description",
        content:
          "Acceptable use policies, 99.99% edge uptime SLA, and guidelines governing 1kb.link services.",
      },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <Page>
      <ToolHeader
        title="Terms of Service"
        body="Clear, fair rules for using 1kb.link short links, dynamic vector QR codes, and global edge routing services."
      />

      <section className="edge pb-24">
        <div className="space-y-10">
          {/* Metadata & Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                99.99% Edge SLA
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-foreground">
                Fair Use Policy
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-muted-foreground">
                Version 2.1
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5" />
              <span>Effective Date: September 2026</span>
            </div>
          </div>

          {/* 4 Core Guarantees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">High-Speed Edge SLA</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Global edge redirection nodes are engineered for 99.99% uptime with sub-25ms latency.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <FileCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">You Own Your Links</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You retain full ownership of destination content and dynamic QR target destinations.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Zero-Tolerance Abuse</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Phishing, malware, and spam links are terminated immediately via automated threat telemetry.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">No Hidden Contracts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transparent services with no sneaky lock-ins, auto-renewal traps, or surprise charges.
              </p>
            </div>
          </div>

          {/* Section 1: Acceptable Use Policy */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[11px]">
                01
              </span>
              <span>Acceptable Use Policy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              Prohibited Activities & Content Restrictions
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To safeguard the global routing reputation of 1kb.link and ensure links resolve without browser security warnings, users agree never to configure short links or dynamic QR codes for any of the following activities:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">Phishing & Credential Theft:</strong>
                  <p className="text-muted-foreground mt-0.5">Fake login interfaces, identity cloning, or credential harvesting.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">Malware & Ransomware:</strong>
                  <p className="text-muted-foreground mt-0.5">Payload droppers, unverified executables, or exploit scripts.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">Unsolicited SMS & Email Spam:</strong>
                  <p className="text-muted-foreground mt-0.5">Mass blast spamming violating TCPA, CAN-SPAM, or GDPR directives.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-foreground">Illegal & Pirated Material:</strong>
                  <p className="text-muted-foreground mt-0.5">Unauthorized copyright infringement, illegal trade, or unlawful content.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Immediate Termination: </span>
              Any link flagged by automated threat feeds (Google Safe Browsing, PhishTank, Spamhaus) will be deactivated immediately with zero notice.
            </div>
          </div>

          {/* Section 2: Service Level Agreement & Reliability */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[11px]">
                02
              </span>
              <span>Reliability & Performance</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              99.99% Edge Availability & Infrastructure SLA
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We deploy 1kb.link redirection nodes across global edge facilities to achieve continuous 99.99% link routing uptime. Because destination websites are owned by external third parties, 1kb.link is not responsible for downtimes or outages occurring on target destination servers.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-foreground font-medium">Permanent Redirection:</strong> Links created on 1kb.link remain active without forced expiration unless you specify an expiration date.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-foreground font-medium">Dynamic Re-routing:</strong> You can modify the target destination URL of dynamic QR codes and user links at any time from your dashboard.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Intellectual Property & Emoji Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[10px]">
                  03
                </span>
                <span>User Content</span>
              </div>
              <h3 className="text-lg font-medium text-foreground">Dynamic QR Code Usage</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you generate dynamic vector QR codes with your custom logos or brand colors, you warrant that you hold appropriate trademark rights to any embedded imagery.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-mono text-foreground text-[10px]">
                  04
                </span>
                <span>Registry</span>
              </div>
              <h3 className="text-lg font-medium text-foreground">Single Emoji Link Registration</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Single emoji links are assigned on a first-come, first-served basis with lifetime ownership. Trademark disputes regarding trademark infringement are resolved via standard ICANN/UDRP procedures.
              </p>
            </div>
          </div>

          {/* Section 5: Abuse Reporting & Support Contact */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-foreground">Report Malicious Links or Contact Legal</h3>
              <p className="text-xs text-muted-foreground max-w-lg">
                If you encounter a phishing link, copyright infringement, or terms violation resolving through 1kb.link, report it immediately for 24/7 security takedown.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild variant="outline" className="rounded-full text-xs font-medium h-10 px-5 gap-2 border-border">
                <a href="mailto:abuse@1kb.link">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                  Report Abuse
                </a>
              </Button>
              <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-medium h-10 px-5 gap-2">
                <a href="mailto:support@1kb.link">
                  <Mail className="h-3.5 w-3.5" />
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
