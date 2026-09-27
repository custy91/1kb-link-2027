import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/Chrome";
import { getLinks, recordClick, type DemoLink } from "@/lib/demo";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "Opening link — 1kb.link" },
      { name: "description", content: "Following a 1kb.link short link." },
      { property: "og:title", content: "Opening link — 1kb.link" },
      { property: "og:description", content: "Following a 1kb.link short link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Redirect,
});

function Redirect() {
  const { slug } = Route.useParams();
  const [state, setState] = useState<"loading" | "missing" | "paused" | "expired" | "password" | "pdf" | "go">("loading");
  const [row, setRow] = useState<DemoLink | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const decoded = decodeURIComponent(slug);
    const r = getLinks().find((x) => x.slug === decoded) ?? null;
    setRow(r);
    if (!r) return setState("missing");
    if (!r.is_active) return setState("paused");
    if (r.expires_at && new Date(r.expires_at).getTime() < Date.now()) {
      return setState("expired");
    }
    if (r.password) {
      return setState("password");
    }
    recordClick(r.id);
    setState(r.kind === "pdf" ? "pdf" : "go");
  }, [slug]);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!row) return;
    if (passwordInput === row.password) {
      recordClick(row.id);
      setState(row.kind === "pdf" ? "pdf" : "go");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  }

  const msg: Record<string, [string, string]> = {
    loading: ["Opening…", ""],
    missing: ["This link doesn't exist.", "It may have been deleted, or the address was typed incorrectly."],
    paused: ["This link is paused.", "Its owner has turned it off for now."],
    expired: ["This link has expired.", "The link owner set an expiration date which has now passed."],
    password: ["Password Protected Link", "This short link is protected with a password. Enter the passcode to proceed."],
    pdf: ["PDF preview.", `In the full version, ${row?.file_name ?? "the PDF"} would open here.`],
    go: ["Ready to go.", `This link points to ${row?.target_url}.`],
  };

  const currentMsg = msg[state] || ["", ""];

  return (
    <Page>
      <section className="edge py-24 text-center">
        <h1 className="text-4xl font-medium">{currentMsg[0]}</h1>
        <p className="mt-4 text-muted-foreground">{currentMsg[1]}</p>

        {state === "password" && (
          <form onSubmit={handlePasswordSubmit} className="mt-8 max-w-sm mx-auto space-y-3">
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter passcode…"
              className="h-12 w-full rounded-full border border-border bg-muted px-5 text-center text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {passwordError && <p className="text-xs text-destructive font-medium">{passwordError}</p>}
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-foreground font-medium text-background hover:bg-foreground/90 transition-all text-sm"
            >
              Unlock Link
            </button>
          </form>
        )}

        <div className="mt-8 flex justify-center gap-3">
          {state === "go" && row && <a href={row.target_url} className="rounded-full bg-foreground px-6 py-2.5 font-medium text-background">Continue</a>}
          {state !== "password" && <Link to="/" className="rounded-full bg-secondary px-6 py-2.5 font-medium">Make a link</Link>}
        </div>
        <p className="mt-10 text-xs text-muted-foreground">UI preview: only links made in this browser can be opened.</p>
      </section>
    </Page>
  );
}
