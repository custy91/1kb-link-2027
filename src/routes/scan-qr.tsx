import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Page } from "@/components/Chrome";
import { InfoSections } from "@/components/InfoSections";
import { CONTENT } from "@/lib/pageContent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Camera,
  CameraOff,
  Copy,
  ExternalLink,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  History,
  Volume2,
  VolumeX,
  Link as LinkIcon,
  FileText,
  Download,
  FileSpreadsheet,
  FileCode,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/scan-qr")({
  head: () => ({
    meta: [
      { title: "Free In-Browser QR Code Scanner (Private & No App) — 1kb.link" },
      {
        name: "description",
        content:
          "Scan QR codes online with camera. Featuring continuous scan mode, scan history, green laser beam animation, and audio beep feedback with 100% on-device privacy.",
      },
      {
        name: "keywords",
        content:
          "QR code scanner, scan QR, web QR reader, online QR scanner, continuous QR scanner, QR code history, camera QR scanner",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/scan-qr" },
      { property: "og:title", content: "Free In-Browser QR Code Scanner (Private & No App) — 1kb.link" },
      {
        property: "og:description",
        content:
          "Scan QR codes online with camera. Featuring continuous scan mode, scan history, and audio feedback.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free In-Browser QR Code Scanner (Private & No App) — 1kb.link" },
      {
        name: "twitter:description",
        content:
          "Scan QR codes online with camera. Featuring continuous scan mode, scan history, and audio feedback.",
      },
    ],
  }),
  component: ScanQrPage,
});

type DetectorLike = { detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]> };

export interface ScannedItem {
  id: string;
  value: string;
  timestamp: number;
  isUrl: boolean;
}

const STORAGE_KEY = "1kb.scan.history.v1";

function playScanBeep() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Crisp ascending double-tone beep
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08); // A6
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.11);
  } catch {
    // Audio context may be restricted by browser policy before first interaction
  }
}

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

function exportAsCsv(items: ScannedItem[]) {
  if (items.length === 0) return;
  const headers = ["ID", "Scanned Value", "Type", "Timestamp", "Date"];
  const rows = items.map((item) => {
    const escapedValue = `"${item.value.replace(/"/g, '""')}"`;
    const type = item.isUrl ? "URL" : "Text";
    const date = `"${new Date(item.timestamp).toISOString()}"`;
    return [item.id, escapedValue, type, item.timestamp, date].join(",");
  });
  const csvContent = [headers.join(","), ...rows].join("\n");
  downloadFile(
    csvContent,
    `1kb-qr-scans-${new Date().toISOString().slice(0, 10)}.csv`,
    "text/csv;charset=utf-8;",
  );
}

function exportAsTxt(items: ScannedItem[]) {
  if (items.length === 0) return;
  const header = `# 1kb.link QR Scan History (${items.length} items)\n# Exported: ${new Date().toLocaleString()}\n\n`;
  const lines = items
    .map((item, index) => {
      const dateStr = new Date(item.timestamp).toLocaleString();
      return `[${index + 1}] (${dateStr}) ${item.isUrl ? "[URL] " : "[TEXT] "}${item.value}`;
    })
    .join("\n");
  downloadFile(
    header + lines,
    `1kb-qr-scans-${new Date().toISOString().slice(0, 10)}.txt`,
    "text/plain;charset=utf-8;",
  );
}

function exportAsJson(items: ScannedItem[]) {
  if (items.length === 0) return;
  const data = {
    source: "1kb.link QR Code Scanner",
    exportedAt: new Date().toISOString(),
    totalItems: items.length,
    items: items.map((item) => ({
      id: item.id,
      value: item.value,
      isUrl: item.isUrl,
      timestamp: item.timestamp,
      date: new Date(item.timestamp).toISOString(),
    })),
  };
  downloadFile(
    JSON.stringify(data, null, 2),
    `1kb-qr-scans-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json;charset=utf-8;",
  );
}

export function ScanQrPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [running, setRunning] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [flashSuccess, setFlashSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scan History State
  const [history, setHistory] = useState<ScannedItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage quota or disabled
    }
  }, [history]);

  // Ref to track last scan value and time to prevent duplicate spam in continuous mode
  const lastDetectedRef = useRef<{ value: string; time: number }>({ value: "", time: 0 });

  // Camera stream and barcode detector loop
  useEffect(() => {
    if (!running) return;
    let stream: MediaStream | null = null;
    let frame = 0;
    let stopped = false;

    (async () => {
      const Detector = (
        window as unknown as { BarcodeDetector?: new (o: object) => DetectorLike }
      ).BarcodeDetector;

      if (!Detector) {
        setError(
          "Your browser does not support the BarcodeDetector camera API. Chrome, Edge, or Android Chrome are recommended.",
        );
        setRunning(false);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      } catch (err) {
        setError("Camera permission denied. Please allow camera access and try again.");
        setRunning(false);
        return;
      }

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      const detector = new Detector({ formats: ["qr_code"] });

      const tick = async () => {
        if (stopped) return;
        try {
          if (video.readyState >= 2) {
            const found = await detector.detect(video);
            if (found && found.length > 0 && found[0]?.rawValue) {
              const code = found[0].rawValue;
              const now = Date.now();

              // In continuous mode, avoid re-detecting the same code within 2.5 seconds
              const isDuplicate =
                code === lastDetectedRef.current.value && now - lastDetectedRef.current.time < 2500;

              if (!isDuplicate) {
                lastDetectedRef.current = { value: code, time: now };
                const isUrl = /^https?:\/\//i.test(code.trim());

                // Trigger audio beep
                if (soundEnabled) {
                  playScanBeep();
                }

                // Trigger visual flash
                setFlashSuccess(true);
                setTimeout(() => setFlashSuccess(false), 500);

                setLastScanned(code);

                // Add to history
                setHistory((prev) => [
                  {
                    id: crypto.randomUUID(),
                    value: code,
                    timestamp: now,
                    isUrl,
                  },
                  ...prev.filter((item) => item.value !== code), // remove previous duplicate
                ]);

                // If NOT continuous mode, stop scanning
                if (!continuous) {
                  setRunning(false);
                  return;
                }
              }
            }
          }
        } catch {
          // ignore detection frame errors
        }
        frame = requestAnimationFrame(() => void tick());
      };

      void tick();
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [running, continuous, soundEnabled]);

  const copyItemText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm("Clear all scanned QR code history?")) {
      setHistory([]);
      setLastScanned(null);
    }
  };

  return (
    <Page>
      <div className="edge py-10 sm:py-14">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            In-Browser QR Reader
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-medium tracking-tight">
            Scan a QR Code
          </h1>
          <p className="mt-2 text-base text-muted-foreground leading-relaxed">
            Fast, privacy-safe QR code scanning right in your browser. All frames are processed locally on your device with continuous mode and scan history.
          </p>
        </div>

        {/* 2-COLUMN LAYOUT: CAMERA ON LEFT, SCAN HISTORY ON RIGHT */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* LEFT COLUMN: COMPACT CAMERA CONTAINER & CONTROLS               */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-4 w-full">
            {/* COMPACT CAMERA VIEWFINDER */}
            <div
              className={`relative w-full max-w-[340px] aspect-square rounded-2xl border-2 overflow-hidden bg-black/95 transition-all shadow-md ${
                flashSuccess
                  ? "border-emerald-500 ring-4 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : running
                    ? "border-foreground/40 shadow-lg"
                    : "border-border"
              }`}
            >
              {/* Video Feed */}
              <video
                ref={videoRef}
                playsInline
                muted
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  running ? "opacity-100" : "opacity-0 hidden"
                }`}
              />

              {/* CAMERA OFF STATE */}
              {!running && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground select-none">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/80 text-foreground mb-3">
                    <CameraOff className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Camera is offline</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click "Start Camera" to scan QR codes with your device.
                  </p>
                </div>
              )}

              {/* RETICLE CORNERS & GREEN SCANNING LASER (WHEN RUNNING) */}
              {running && (
                <>
                  {/* Viewfinder Target Guide */}
                  <div className="pointer-events-none absolute inset-8 rounded-xl border border-white/20 flex flex-col justify-between p-2">
                    {/* Corner Reticle Markers */}
                    <div className="flex justify-between">
                      <div className="h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="h-4 w-4 border-b-2 border-r-2 border-emerald-400" />
                    </div>
                  </div>

                  {/* GREEN LASER SCANNING BEAM ANIMATION */}
                  <div className="pointer-events-none absolute inset-x-0 animate-scan-laser">
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981]" />
                    <div className="h-4 w-full bg-gradient-to-b from-emerald-500/20 to-transparent" />
                  </div>

                  {/* Active Indicator Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Scanning</span>
                  </div>
                </>
              )}
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="w-full max-w-[340px] rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            {/* CAMERA BUTTON & CONTROLS */}
            <div className="w-full max-w-[340px] space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setRunning((r) => !r);
                  }}
                  className={`flex-1 h-11 rounded-full font-medium text-xs transition-all shadow-xs ${
                    running
                      ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {running ? (
                    <span className="flex items-center gap-1.5">
                      <CameraOff className="h-4 w-4" /> Stop Camera
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Camera className="h-4 w-4" /> Start Camera
                    </span>
                  )}
                </Button>

                {/* Sound toggle button */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSoundEnabled((v) => !v)}
                  title={soundEnabled ? "Mute scan beep" : "Enable scan beep"}
                  className="h-11 w-11 rounded-full shrink-0 border-border"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-foreground" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* CONTINUOUS MODE TOGGLE */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-2xs">
                <div>
                  <label htmlFor="continuous-mode" className="text-xs font-medium text-foreground cursor-pointer">
                    Continuous scan mode
                  </label>
                  <p className="text-[10px] text-muted-foreground">
                    Keep camera active to scan multiple codes
                  </p>
                </div>
                <Switch
                  id="continuous-mode"
                  checked={continuous}
                  onCheckedChange={setContinuous}
                />
              </div>
            </div>

            {/* LATEST SCAN RESULT CARD (IF NOT RUNNING OR RECENTLY SCANNED) */}
            {lastScanned && !running && (
              <div className="w-full max-w-[340px] rounded-xl border border-border bg-card p-4 shadow-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Latest Result
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" /> Scanned
                  </span>
                </div>

                <p className="break-all font-mono text-xs text-foreground bg-muted p-2.5 rounded-lg border border-border">
                  {lastScanned}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {/^https?:\/\//i.test(lastScanned.trim()) ? (
                    <Button asChild size="sm" className="flex-1 rounded-full h-8 text-xs font-medium bg-foreground text-background">
                      <a href={lastScanned.trim()} target="_blank" rel="noreferrer noopener">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open Link
                      </a>
                    </Button>
                  ) : null}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyItemText("latest", lastScanned)}
                    className="flex-1 rounded-full h-8 text-xs font-medium"
                  >
                    {copiedId === "latest" ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Check className="h-3.5 w-3.5" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: SCAN HISTORY                                     */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <History className="h-4 w-4 text-foreground" />
                <h2 className="text-base font-medium tracking-tight">Scan History</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {history.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={history.length === 0}
                      className="h-8 rounded-full px-3 text-xs font-medium gap-1.5 border-border hover:bg-secondary shadow-2xs disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  {history.length > 0 && (
                    <DropdownMenuContent align="end" className="w-52 rounded-xl p-1 bg-background border border-border shadow-md z-50">
                      <DropdownMenuItem
                        onClick={() => exportAsCsv(history)}
                        className="cursor-pointer text-xs flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="font-medium">Export as CSV (.csv)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => exportAsTxt(history)}
                        className="cursor-pointer text-xs flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary"
                      >
                        <FileText className="h-3.5 w-3.5 text-blue-500" />
                        <span className="font-medium">Export as Text (.txt)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => exportAsJson(history)}
                        className="cursor-pointer text-xs flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary"
                      >
                        <FileCode className="h-3.5 w-3.5 text-amber-500" />
                        <span className="font-medium">Export as JSON (.json)</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>

                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllHistory}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 ml-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* HISTORY LIST */}
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground/60 mb-2">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No QR codes scanned yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[28ch] mx-auto">
                    Start the camera and point it at any QR code to build your scan history.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3.5 text-xs transition-colors hover:border-foreground/20 hover:bg-muted/70"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-foreground shrink-0 mt-0.5">
                        {item.isUrl ? <LinkIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs font-medium text-foreground truncate break-all max-w-[280px] sm:max-w-[340px]">
                          {item.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })} ·{" "}
                          {new Date(item.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {item.isUrl && (
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px] rounded-full text-foreground hover:bg-background"
                          title="Open URL in new tab"
                        >
                          <a href={item.value} target="_blank" rel="noreferrer noopener">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyItemText(item.id, item.value)}
                        className="h-7 px-2 text-[11px] rounded-full text-foreground hover:bg-background"
                        title="Copy to clipboard"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHistoryItem(item.id)}
                        className="h-7 px-2 text-[11px] rounded-full text-muted-foreground hover:text-destructive hover:bg-background"
                        title="Delete from history"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Informational FAQ & Guidelines Section */}
        <InfoSections {...CONTENT.scan} />
      </div>
    </Page>
  );
}
