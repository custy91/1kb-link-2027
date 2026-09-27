import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page, ToolHeader } from "@/components/Chrome";
import { LinkRow } from "@/components/LinkRow";
import { getLinks, updateLink, deleteLink, subscribeLinks, type DemoLink } from "@/lib/demo";
import { shortUrl } from "@/lib/shortlinks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Links on this device — 1kb.link" },
      { name: "description", content: "Short links you made on this device, ready to edit, pause, delete, or export." },
      { property: "og:title", content: "Links on this device — 1kb.link" },
      { property: "og:description", content: "Manage and export short links made on this device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LinksPage,
});

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportLinksCsv(links: DemoLink[]) {
  if (links.length === 0) return;
  const headers = ["ID", "Short URL", "Destination URL", "Title", "Type", "Clicks", "Status", "Created Date"];
  const rows = links.map((link) => {
    const sUrl = shortUrl(link.slug);
    const dest = (link.target_url || link.file_name || "").replace(/"/g, '""');
    const title = (link.title || "").replace(/"/g, '""');
    const status = link.is_active ? "Active" : "Paused";
    const date = link.created_at;
    return [`"${link.id}"`, `"${sUrl}"`, `"${dest}"`, `"${title}"`, `"${link.kind}"`, link.clicks, `"${status}"`, `"${date}"`].join(",");
  });
  const csvContent = [headers.join(","), ...rows].join("\n");
  downloadFile(csvContent, `1kb-links-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8;");
}

function exportLinksTxt(links: DemoLink[]) {
  if (links.length === 0) return;
  const header = `# 1kb.link - Exported Links (${links.length} total)\n# Date: ${new Date().toLocaleString()}\n\n`;
  const body = links
    .map((l, i) => {
      const sUrl = shortUrl(l.slug);
      return `[${i + 1}] ${l.title || "Untitled"}\n    Short Link:   ${sUrl}\n    Destination:  ${l.target_url || l.file_name || "N/A"}\n    Type:         ${l.kind}\n    Clicks:       ${l.clicks}\n    Status:       ${l.is_active ? "Active" : "Paused"}\n    Created:      ${l.created_at}\n`;
    })
    .join("\n");
  downloadFile(header + body, `1kb-links-${new Date().toISOString().slice(0, 10)}.txt`, "text/plain;charset=utf-8;");
}

function exportLinksJson(links: DemoLink[]) {
  if (links.length === 0) return;
  const data = {
    source: "1kb.link",
    exportedAt: new Date().toISOString(),
    totalLinks: links.length,
    links: links.map((l) => ({
      id: l.id,
      slug: l.slug,
      shortUrl: shortUrl(l.slug),
      targetUrl: l.target_url || null,
      title: l.title || null,
      kind: l.kind,
      clicks: l.clicks,
      isActive: l.is_active,
      createdAt: l.created_at,
      fileName: l.file_name || null,
    })),
  };
  downloadFile(JSON.stringify(data, null, 2), `1kb-links-${new Date().toISOString().slice(0, 10)}.json`, "application/json;charset=utf-8;");
}

function LinksPage() {
  const [rows, setRows] = useState<DemoLink[]>([]);
  useEffect(() => { setRows(getLinks()); return subscribeLinks(() => setRows(getLinks())); }, []);

  return (
    <Page>
      <ToolHeader title="Links on this device." body="Everything you've made in this browser. Change a destination, pause a link, remove it, or export your links." />
      <section className="edge">
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {rows.length} {rows.length === 1 ? "Link" : "Links"} saved
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={rows.length === 0}
                className="h-8 rounded-full px-3 text-xs font-medium gap-1.5 border-border hover:bg-secondary shadow-2xs disabled:opacity-40 disabled:pointer-events-none"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            {rows.length > 0 && (
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1 bg-background border border-border shadow-md z-50">
                <DropdownMenuItem
                  onClick={() => exportLinksCsv(rows)}
                  className="cursor-pointer text-xs flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-medium">Export as CSV (.csv)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportLinksTxt(rows)}
                  className="cursor-pointer text-xs flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary"
                >
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium">Export as Text (.txt)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportLinksJson(rows)}
                  className="cursor-pointer text-xs flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary"
                >
                  <FileCode className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-medium">Export as JSON (.json)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>

        {rows.length === 0 ? (
          <p className="text-muted-foreground mt-2">None yet. <Link to="/" className="text-foreground underline">Make one</Link>.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <LinkRow key={r.id} row={r} onUpdate={async (p) => { updateLink(r.id, p); return null; }} onDelete={async () => deleteLink(r.id)} />
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}
