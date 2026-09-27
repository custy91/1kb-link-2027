import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Link2,
  Smile,
  FileText,
  QrCode,
  ScanLine,
  LayoutGrid,
  BookOpen,
  ShieldCheck,
  Lock,
  Sparkles,
} from "lucide-react";

export function Mark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-foreground text-background ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[55%] w-[55%]" aria-hidden="true">
        <path
          d="M10 14a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 5.34l-1.2 1.2M14 10a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 18.66l1.2-1.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const TOOLS = [
  { to: "/", label: "Link", icon: Link2 },
  { to: "/emoji", label: "Emoji", icon: Smile },
  { to: "/pdf", label: "PDF", icon: FileText },
  { to: "/qr-generator", label: "QR Generator", icon: QrCode },
  { to: "/scan-qr", label: "Scan QR", icon: ScanLine },
  { to: "/blog", label: "Blog", icon: BookOpen },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-transparent bg-background/80 edge backdrop-blur-xl backdrop-saturate-150">
      <Link to="/" className="flex items-center gap-2.5 font-medium">
        <Mark className="h-7 w-7" />
        1kb.link
      </Link>
      <nav className="hidden items-center gap-1 rounded-full bg-secondary p-1 text-sm md:flex">
        {TOOLS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: true }}
            className="rounded-full px-3.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "bg-background !text-foreground shadow-sm font-medium" }}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4 text-sm">
        <Link
          to="/links"
          className="hidden text-muted-foreground hover:text-foreground lg:inline"
          activeProps={{ className: "!text-foreground" }}
        >
          This device
        </Link>
        <Link
          to="/dashboard"
          className="hidden text-muted-foreground hover:text-foreground sm:inline"
          activeProps={{ className: "!text-foreground" }}
        >
          Dashboard
        </Link>
        <Link
          to="/auth"
          className="inline-flex h-9 items-center rounded-full bg-foreground px-4 font-medium text-background transition-all hover:-translate-y-px hover:shadow-lift"
        >
          Log in
        </Link>
      </div>
    </header>
  );
}

function BottomTabs() {
  const items = [
    { to: "/", label: "Link", icon: Link2 },
    { to: "/qr-generator", label: "QR", icon: QrCode },
    { to: "/scan-qr", label: "Scan", icon: ScanLine },
    { to: "/pdf", label: "PDF", icon: FileText },
    { to: "/dashboard", label: "Me", icon: LayoutGrid },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {items.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              className="flex flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground"
              activeProps={{ className: "!text-foreground font-semibold" }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-28 border-t border-border bg-card/30 pt-16 pb-12 edge text-sm text-muted-foreground">
      {/* 4-COLUMN FOOTER GRID FOR COMPREHENSIVE SEO, AEO & GEO VISIBILITY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-border/60">
        {/* BRAND & ENTITY VALUE PROPOSITION */}
        <div className="sm:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5 font-medium text-foreground text-base">
            <Mark className="h-6 w-6" />
            <span>1kb.link</span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            High-performance link infrastructure built for speed, privacy, and precision. Generate password-protected short links, custom vector QR codes with embedded brand logos, and track campaign engagement without cookies.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Edge Network Active
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-muted-foreground">
              Zero-Cookie Architecture
            </span>
          </div>
        </div>

        {/* COLUMN 1: CORE TOOLS & GENERATORS */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Tools & Generators
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Free URL Shortener
              </Link>
            </li>
            <li>
              <Link to="/qr-generator" className="hover:text-foreground transition-colors">
                Dynamic QR Generator
              </Link>
            </li>
            <li>
              <Link to="/scan-qr" className="hover:text-foreground transition-colors">
                In-Browser QR Scanner
              </Link>
            </li>
            <li>
              <Link to="/emoji" className="hover:text-foreground transition-colors">
                Emoji Short Links
              </Link>
            </li>
            <li>
              <Link to="/pdf" className="hover:text-foreground transition-colors">
                PDF to Link & QR Code
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 2: KEY CAPABILITIES (HIGH INTENT SEO / AEO TARGETS) */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Capabilities
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Password Protected Links
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Expiring Links & Self-Destruct
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                UTM Campaign Builder
              </Link>
            </li>
            <li>
              <Link to="/qr-generator" className="hover:text-foreground transition-colors">
                QR Codes with Custom Logo
              </Link>
            </li>
            <li>
              <Link to="/links" className="hover:text-foreground transition-colors">
                Links on This Device
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: GUIDES, KNOWLEDGE & LEGAL */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Resources & Legal
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/blog" className="hover:text-foreground transition-colors font-medium">
                Engineering & SEO Blog
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <a href="/llms.txt" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                LLMs.txt Directory
              </a>
            </li>
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                XML Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM LEGAL & COMPLIANCE BAR */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} 1kb.link. Fast, private, and cookie-free link infrastructure.</p>
        <p className="flex items-center gap-3">
          <span>100% Client-Side Privacy</span>
          <span>·</span>
          <span>GDPR / CCPA Compliant</span>
          <span>·</span>
          <span>Edge Accelerated</span>
        </p>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomTabs />
    </div>
  );
}

export function ToolHeader({ title, body }: { title: string; body: string }) {
  return (
    <section className="edge pt-12 pb-8 sm:pt-20">
      <h1 className="max-w-[20ch] rise text-4xl leading-[1.08] font-medium tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p
        className="rise mt-5 max-w-[58ch] text-lg text-muted-foreground"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {body}
      </p>
    </section>
  );
}
