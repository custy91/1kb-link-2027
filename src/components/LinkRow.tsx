import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { downloadQr } from "@/components/QrCode";
import { isValidUrl, normalizeUrl, shortUrl } from "@/lib/shortlinks";

export type Row = {
  id: string;
  slug: string;
  target_url: string;
  title: string | null;
  kind: string;
  is_active: boolean;
  clicks?: number;
};

export function LinkRow({
  row,
  onUpdate,
  onDelete,
}: {
  row: Row;
  onUpdate: (patch: { target_url?: string; is_active?: boolean }) => Promise<string | null>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState(row.target_url);
  const [err, setErr] = useState<string | null>(null);
  const link = shortUrl(row.slug);
  const btn = "rounded-full bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-accent";

  async function save() {
    if (!isValidUrl(target)) return setErr("Not a valid web address.");
    const e = await onUpdate({ target_url: normalizeUrl(target) });
    if (e) setErr(e);
    else setEditing(false);
  }

  return (
    <li className="rounded-[var(--radius)] border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">
            {link}
            {!row.is_active && <span className="ml-2 text-xs text-muted-foreground">Paused</span>}
          </p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {row.title ? `${row.title} · ` : ""}
            {row.kind === "pdf" ? "PDF file" : row.target_url}
          </p>
        </div>
        {row.clicks !== undefined && (
          <span className="text-sm text-muted-foreground">
            <b className="text-lg font-medium text-foreground">{row.clicks}</b> clicks
          </span>
        )}
      </div>
      {editing && (
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="h-10 min-w-0 flex-1 rounded-full border border-border bg-muted px-4 text-sm outline-none"
          />
          <button onClick={save} className="rounded-full bg-foreground px-4 text-sm font-medium text-background">
            Save
          </button>
        </div>
      )}
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className={btn} onClick={() => navigator.clipboard.writeText(link)}>Copy</button>
        <Link to="/stats/$slug" params={{ slug: row.slug }} className={btn}>Stats</Link>
        <button className={btn} onClick={() => downloadQr(link, row.slug, { fg: "#171717", bg: "#ffffff", format: "png" })}>QR</button>
        {row.kind !== "pdf" && (
          <button className={btn} onClick={() => setEditing(!editing)}>Change destination</button>
        )}
        <button className={btn} onClick={() => onUpdate({ is_active: !row.is_active })}>
          {row.is_active ? "Pause" : "Resume"}
        </button>
        <button
          className="rounded-full px-3 py-1.5 text-xs font-medium text-destructive hover:bg-secondary"
          onClick={() => confirm("Delete this link?") && onDelete()}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
