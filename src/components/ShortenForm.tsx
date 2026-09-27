import { useRef, useState } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { createLink } from "@/lib/demo";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Shuffle,
  Download,
  Copy,
  Lock,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Shield,
  Calendar,
  Tag,
  Check,
  ArrowRight,
  Sparkles,
  FileText,
} from "lucide-react";
import {
  randomEmojiSlug,
  shortUrl,
} from "@/lib/shortlinks";
import { QrCode, downloadQr } from "@/components/QrCode";
import { EmojiPicker } from "@/components/EmojiPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Mode = "url" | "emoji" | "pdf";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "url", label: "Link", hint: "Shorten any web address." },
  { id: "emoji", label: "Emoji", hint: "A short link made of emoji. Yes, really." },
  { id: "pdf", label: "PDF", hint: "Upload a PDF and get a link plus a QR code for it." },
];

type Created = { slug: string; target: string; kind: string };

export function ShortenForm({ mode = "url", cta }: { mode?: Mode; cta?: string }) {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState(() => (mode === "emoji" ? randomEmojiSlug() : ""));
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Created | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Advanced link options toggle & signup modal
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "pdf") {
        if (!file) throw new Error("Choose a PDF first.");
        if (file.type !== "application/pdf" || file.size > 25 * 1024 * 1024) {
          throw new Error("Choose a PDF under 25 MB.");
        }
      }
      const row = createLink({
        slug: user ? slug : (mode === "emoji" ? slug : ""),
        target: url,
        title: user ? title : "",
        kind: mode,
        fileName: file?.name,
        password: user ? password : undefined,
        expiresAt: user ? expiresAt : undefined,
        utmSource: user ? utmSource : undefined,
        utmMedium: user ? utmMedium : undefined,
        utmCampaign: user ? utmCampaign : undefined,
      });
      setCreated({ slug: row.slug, target: row.target_url, kind: mode });
      setUrl("");
      setTitle("");
      setPassword("");
      setExpiresAt("");
      setUtmSource("");
      setUtmMedium("");
      setUtmCampaign("");
      setFile(null);
      setSlug(mode === "emoji" ? randomEmojiSlug() : "");
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function handleLockedFieldClick(e: React.MouseEvent) {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      setIsSignupModalOpen(true);
    }
  }

  return (
    <div id="make" className="rounded-[var(--radius)] border border-border bg-card p-5 sm:p-7 shadow-xs">
      <form onSubmit={submit} className="space-y-4">
        {mode === "pdf" ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                ref={fileInput}
                type="file"
                accept="application/pdf"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="h-14 min-h-[56px] w-full flex-1 rounded-full border border-border bg-muted px-4 py-3 text-sm outline-none transition-shadow file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-xs file:font-medium file:text-background focus:ring-2 focus:ring-ring min-w-0 shrink-0 cursor-pointer flex items-center"
              />
              <Button
                type="submit"
                disabled={busy}
                className="inline-flex h-14 min-h-[56px] items-center justify-center rounded-full bg-foreground px-7 font-medium text-background transition-all duration-200 hover:-translate-y-px hover:shadow-lift disabled:opacity-50 shrink-0 text-sm gap-2"
              >
                {busy ? "Uploading PDF…" : (cta ?? "Upload PDF & Create Link")}
              </Button>
            </div>
            {file && (
              <p className="text-xs text-muted-foreground pl-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-foreground" />
                Selected file: <span className="font-medium text-foreground">{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a long link (e.g. https://yourbrand.com/products/launch-page)..."
              inputMode="url"
              required
              className="h-14 min-h-[56px] w-full flex-1 rounded-full border border-border bg-muted px-5 py-3 text-base outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring min-w-0 shrink-0"
            />
            <Button
              type="submit"
              disabled={busy}
              className="inline-flex h-14 min-h-[56px] items-center justify-center rounded-full bg-foreground px-7 font-medium text-background transition-all duration-200 hover:-translate-y-px hover:shadow-lift disabled:opacity-50 shrink-0 text-sm"
            >
              {busy ? "Working…" : (cta ?? "Create short link")}
            </Button>
          </div>
        )}

        {/* Emoji specific input */}
        {mode === "emoji" && (
          <div className="flex items-center gap-3">
            <div className="flex h-14 min-h-[56px] min-w-0 flex-1 items-center rounded-full border border-border bg-muted px-5 shrink-0">
              <span className="shrink-0 text-sm text-muted-foreground">1kb.link/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="🚀🔥✨"
                className="ml-1 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                title="Shuffle emoji"
                aria-label="Shuffle emoji"
                onClick={() => setSlug(randomEmojiSlug())}
                className="ml-2 shrink-0"
              >
                <Shuffle size={17} />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={busy}
              className="h-12 rounded-full bg-foreground px-6 font-medium text-background hover:bg-foreground/90 shrink-0"
            >
              {busy ? "Working…" : "Make Emoji Link"}
            </Button>
          </div>
        )}

        {/* ADVANCED LINK SECTION (Home page / URL mode) */}
        {mode === "url" && (
          <div className="mt-4 pt-3 border-t border-border">
            {/* Toggle header */}
            <button
              type="button"
              id="advanced-options-toggle"
              onClick={() => setIsAdvancedOpen((prev) => !prev)}
              className="flex w-full cursor-pointer items-center justify-between py-1 text-left text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group select-none"
              aria-expanded={isAdvancedOpen}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>Advanced options</span>
                {isAdvancedOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>

              <span className="hidden sm:inline-block text-[11px] font-normal text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Custom endings · Passwords · Expiry · UTMs
              </span>
            </button>

            {/* Collapsible Content */}
            {isAdvancedOpen && (
              <div className="mt-3.5 space-y-4 rounded-2xl border border-border bg-muted/40 p-4 sm:p-5">
                {/* SIGNUP CALLOUT BANNER */}
                {!user ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-background p-3.5 sm:p-4 shadow-2xs">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-medium text-foreground">
                            Advanced features require a free account
                          </h4>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            Sign up only
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Unlock custom endings, password protection, expiration dates, link labels, and UTM tracking tags with a free 1kb.link account.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <RouterLink
                        to="/auth"
                        className="inline-flex h-8 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background hover:bg-foreground/90 transition-all shadow-xs"
                      >
                        Sign up free <ArrowRight className="h-3 w-3 ml-1" />
                      </RouterLink>
                      <RouterLink
                        to="/auth"
                        className="inline-flex h-8 items-center justify-center rounded-full bg-secondary px-3 text-xs font-medium text-foreground hover:bg-accent transition-all"
                      >
                        Log in
                      </RouterLink>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-foreground" />
                    <span>
                      Advanced link features are <b className="text-foreground">unlocked</b> for{" "}
                      <span className="text-foreground font-mono">{user.email}</span>
                    </span>
                  </div>
                )}

                {/* ADVANCED FIELDS GRID */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                    !user ? "cursor-pointer" : ""
                  }`}
                  onClickCapture={!user ? handleLockedFieldClick : undefined}
                >
                  {/* 1. Custom Ending */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Custom ending</span>
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        {!user && <Lock className="h-2.5 w-2.5" />}
                        {!user ? "Signup only" : "Optional"}
                      </span>
                    </div>
                    <div className="relative flex h-10 items-center rounded-full border border-border bg-background px-3.5 focus-within:ring-2 focus-within:ring-ring">
                      <span className="text-xs font-mono text-muted-foreground shrink-0 select-none">
                        1kb.link/
                      </span>
                      <input
                        type="text"
                        value={slug}
                        disabled={!user}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="custom-slug (e.g. launch2026)"
                        className="ml-1 w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-pointer"
                      />
                      {!user && (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Brand your address with a memorable back-half.
                    </p>
                  </div>

                  {/* 2. Link Label */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Link label</span>
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        {!user && <Lock className="h-2.5 w-2.5" />}
                        {!user ? "Signup only" : "Optional"}
                      </span>
                    </div>
                    <div className="relative flex h-10 items-center rounded-full border border-border bg-background px-3.5 focus-within:ring-2 focus-within:ring-ring">
                      <input
                        type="text"
                        value={title}
                        disabled={!user}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Campaign or link title (e.g. Twitter Bio)"
                        className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-pointer"
                      />
                      {!user && (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Organize and search links inside your dashboard.
                    </p>
                  </div>

                  {/* 3. Password Protected Links */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Password protection</span>
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        {!user && <Lock className="h-2.5 w-2.5" />}
                        {!user ? "Signup only" : "Optional"}
                      </span>
                    </div>
                    <div className="relative flex h-10 items-center rounded-full border border-border bg-background px-3.5 focus-within:ring-2 focus-within:ring-ring">
                      <input
                        type="password"
                        value={password}
                        disabled={!user}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Set link passcode (e.g. ••••••••)"
                        className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-pointer"
                      />
                      {!user && (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Visitors must enter this passcode before being redirected.
                    </p>
                  </div>

                  {/* 4. Link Expiration */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Link expiration</span>
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        {!user && <Lock className="h-2.5 w-2.5" />}
                        {!user ? "Signup only" : "Optional"}
                      </span>
                    </div>
                    <div className="relative flex h-10 items-center rounded-full border border-border bg-background px-3.5 focus-within:ring-2 focus-within:ring-ring">
                      <input
                        type="date"
                        value={expiresAt}
                        disabled={!user}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground disabled:cursor-pointer"
                      />
                      {!user && (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Automatically deactivates redirect after this date.
                    </p>
                  </div>

                  {/* 5. UTM Campaign Builder (Full Width) */}
                  <div className="md:col-span-2 space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>UTM Campaign Builder</span>
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        {!user && <Lock className="h-2.5 w-2.5" />}
                        {!user ? "Signup only" : "Optional"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="relative flex h-9 items-center rounded-full border border-border bg-background px-3">
                        <input
                          type="text"
                          value={utmSource}
                          disabled={!user}
                          onChange={(e) => setUtmSource(e.target.value)}
                          placeholder="utm_source (e.g. twitter)"
                          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-pointer"
                        />
                      </div>
                      <div className="relative flex h-9 items-center rounded-full border border-border bg-background px-3">
                        <input
                          type="text"
                          value={utmMedium}
                          disabled={!user}
                          onChange={(e) => setUtmMedium(e.target.value)}
                          placeholder="utm_medium (e.g. social)"
                          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-pointer"
                        />
                      </div>
                      <div className="relative flex h-9 items-center rounded-full border border-border bg-background px-3">
                        <input
                          type="text"
                          value={utmCampaign}
                          disabled={!user}
                          onChange={(e) => setUtmCampaign(e.target.value)}
                          placeholder="utm_campaign (e.g. summer_promo)"
                          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-pointer"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Appends UTM tracking tags to your target URL for analytics attribution.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </form>

      {mode === "emoji" && (
        <EmojiPicker onPick={(e) => setSlug((s) => (Array.from(s).length >= 8 ? s : s + e))} />
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        UI preview: links and PDFs are saved locally in this browser. Uploaded files are not hosted yet.
      </p>

      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      {created && <Result created={created} />}

      {/* SIGNUP CALLOUT MODAL / DIALOG */}
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-background border border-border">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground mb-2">
              <Lock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tight">
              Unlock Advanced Link Features
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Custom endings, password protection, labels, expiration dates, and UTM builder are available on sign up.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 py-3 text-xs">
            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
              <Sparkles className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
              <div>
                <b className="text-foreground">Custom Endings:</b>
                <span className="text-muted-foreground ml-1">
                  Brand your links with short aliases like 1kb.link/summer-sale.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
              <Shield className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
              <div>
                <b className="text-foreground">Password Protected Links:</b>
                <span className="text-muted-foreground ml-1">
                  Require a secret passcode before opening sensitive destinations.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
              <Tag className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
              <div>
                <b className="text-foreground">Link Labels:</b>
                <span className="text-muted-foreground ml-1">
                  Keep your links organized with descriptive campaign labels.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
              <Calendar className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
              <div>
                <b className="text-foreground">Link Expiration:</b>
                <span className="text-muted-foreground ml-1">
                  Set target dates to automatically deactivate limited-time offers.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
              <SlidersHorizontal className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
              <div>
                <b className="text-foreground">UTM Campaign Builder:</b>
                <span className="text-muted-foreground ml-1">
                  Seamlessly track marketing channels and conversions.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <RouterLink
              to="/auth"
              onClick={() => setIsSignupModalOpen(false)}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-background font-medium text-xs hover:bg-foreground/90 transition-all shadow-xs"
            >
              Sign up for free <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </RouterLink>

            <RouterLink
              to="/auth"
              onClick={() => setIsSignupModalOpen(false)}
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-secondary text-foreground font-medium text-xs hover:bg-accent transition-all"
            >
              Already have an account? Log in
            </RouterLink>

            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsSignupModalOpen(false)}
              className="rounded-full h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Maybe later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Result({ created }: { created: Created }) {
  const [fg, setFg] = useState("#171717");
  const [bg, setBg] = useState("#ffffff");
  const [copied, setCopied] = useState(false);
  const link = shortUrl(created.slug);

  return (
    <div className="mt-6 grid gap-6 rounded-[var(--radius)] bg-muted p-5 sm:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-xl bg-background p-3">
          <QrCode value={link} fg={fg} bg={bg} size={176} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <label className="flex items-center gap-1">
            Ink
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="h-6 w-6 cursor-pointer rounded border border-border bg-transparent"
            />
          </label>
          <label className="flex items-center gap-1">
            Paper
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-6 w-6 cursor-pointer rounded border border-border bg-transparent"
            />
          </label>
        </div>
        <div className="flex gap-2 text-xs">
          <Button
            type="button"
            onClick={() => downloadQr(link, created.slug, { fg, bg, format: "png" })}
            className="rounded-full bg-secondary px-3 py-1.5 font-medium hover:bg-accent"
            title="Download PNG"
            aria-label="Download PNG"
          >
            <Download size={14} /> PNG
          </Button>
          <Button
            type="button"
            onClick={() => downloadQr(link, created.slug, { fg, bg, format: "svg" })}
            className="rounded-full bg-secondary px-3 py-1.5 font-medium hover:bg-accent"
            title="Download SVG"
            aria-label="Download SVG"
          >
            <Download size={14} /> SVG
          </Button>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Your short link</p>
        <p className="mt-1 truncate text-xl font-medium">{link}</p>
        <p className="mt-2 truncate text-sm text-muted-foreground">
          {created.kind === "pdf" ? "Points to your uploaded PDF" : `Points to ${created.target}`}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-all hover:-translate-y-px hover:shadow-lift"
          >
            <Copy size={15} /> {copied ? "Copied" : "Copy link"}
          </Button>
          <RouterLink
            to="/stats/$slug"
            params={{ slug: created.slug }}
            className="inline-flex h-10 items-center rounded-full bg-secondary px-5 text-sm font-medium hover:bg-accent"
          >
            View stats
          </RouterLink>
          <RouterLink
            to="/links"
            className="inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            My links
          </RouterLink>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          This is a local preview. Link destinations and PDFs are not publicly hosted yet.
        </p>
      </div>
    </div>
  );
}
