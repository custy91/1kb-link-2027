import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Link2, MousePointer2, Activity, Plus } from "lucide-react";
import { Page } from "@/components/Chrome";
import { LinkRow } from "@/components/LinkRow";
import { getLinks, updateLink, deleteLink, subscribeLinks, type DemoLink } from "@/lib/demo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — 1kb.link" }, { name: "description", content: "Preview your links, QR codes and click activity in one place." },
    { property: "og:title", content: "Dashboard — 1kb.link" }, { property: "og:description", content: "Preview your links and activity in 1kb.link." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Dashboard,
});
function Dashboard() {
  const [rows, setRows] = useState<DemoLink[]>([]);
  useEffect(() => { setRows(getLinks()); return subscribeLinks(() => setRows(getLinks())); }, []);
  const total = rows.reduce((sum, row) => sum + row.clicks, 0);
  return <Page><section className="edge pt-12">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase text-muted-foreground">Your workspace / Preview</p><h1 className="mt-2 text-4xl font-medium">Dashboard.</h1><p className="mt-3 text-muted-foreground">A clear view of every link and the activity behind it.</p></div><Link to="/" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"><Plus size={16}/> New link</Link></div>
    <p className="mt-8 border-l-2 border-foreground bg-muted px-4 py-3 text-sm text-muted-foreground">UI preview · Sample activity is illustrative. Changes are stored only on this device.</p>
    <div className="mt-10 grid grid-cols-1 gap-5 border-y border-border py-8 sm:grid-cols-3">{[["Total links", rows.length, Link2], ["All-time clicks", total, MousePointer2], ["Active links", rows.filter(r => r.is_active).length, Activity]].map(([label, value, Icon]) => <div key={label as string} className="border-l border-border pl-5 first:border-l-0 first:pl-0"><div className="flex items-center gap-2 text-sm text-muted-foreground">{typeof Icon === "object" && Icon && (() => { const I = Icon as typeof Link2; return <I size={16}/>; })()} {label as string}</div><p className="mt-3 text-4xl font-medium">{value as number}</p></div>)}</div>
    <div className="mt-14 flex items-center justify-between"><h2 className="text-2xl font-medium">Your links</h2><Link to="/links" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">View all <ArrowUpRight size={16}/></Link></div>
    <ul className="mt-6 space-y-3">{rows.map(row => <LinkRow key={row.id} row={row} onUpdate={async patch => { updateLink(row.id, patch); return null; }} onDelete={async () => deleteLink(row.id)} />)}</ul>
    {rows.length === 0 && <p className="mt-8 text-muted-foreground">No links yet. <Link to="/" className="underline">Create one</Link>.</p>}
  </section></Page>;
}
