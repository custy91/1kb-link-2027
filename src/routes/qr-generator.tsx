import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Page, ToolHeader } from "@/components/Chrome";
import { InfoSections } from "@/components/InfoSections";
import { CONTENT } from "@/lib/pageContent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import {
  QrCode,
  downloadQr,
  renderQrToCanvas,
  type ErrorCorrectionLevel,
  type LogoBgShape,
} from "@/components/QrCode";
import { createLink } from "@/lib/demo";
import { shortUrl, isValidUrl } from "@/lib/shortlinks";
import {
  Globe,
  Wifi,
  FileText,
  Mail,
  Phone,
  User,
  Upload,
  Trash2,
  Copy,
  Download,
  Printer,
  Check,
  Palette,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sliders,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/qr-generator")({
  head: () => ({
    meta: [
      { title: "Free Custom QR Code Generator with Logo & Colors — 1kb.link" },
      {
        name: "description",
        content:
          "Create custom QR codes with your logo, brand colors, and quiet zone control. Export print-ready high-res PNG or infinite-resolution vector SVG with zero expiration.",
      },
      {
        name: "keywords",
        content:
          "QR code generator with logo, custom QR code, vector QR SVG, high resolution QR PNG, wifi QR code, dynamic QR code, free QR generator",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/qr-generator" },
      { property: "og:title", content: "Free Custom QR Code Generator with Logo & Colors — 1kb.link" },
      {
        property: "og:description",
        content:
          "Create custom QR codes with your logo, brand colors, and quiet zone control. Export print-ready PNG or vector SVG.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free Custom QR Code Generator with Logo & Colors — 1kb.link" },
      {
        name: "twitter:description",
        content:
          "Create custom QR codes with your logo, brand colors, and quiet zone control. Export print-ready PNG or vector SVG.",
      },
    ],
  }),
  component: QrGeneratorPage,
});

type ContentType = "url" | "wifi" | "text" | "vcard" | "email" | "phone";

const PRESET_LOGOS = [
  {
    id: "globe",
    label: "Web",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.201.3-.778.978-.954 1.179-.176.2-.351.226-.652.075s-1.272-.469-2.424-1.496c-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.245-.586-.494-.506-.677-.515-.176-.009-.376-.011-.577-.011s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.122 3.24 5.14 4.544.718.31 1.279.495 1.716.634.721.229 1.377.197 1.895.12.578-.087 1.78-.727 2.03-1.429.251-.702.251-1.304.176-1.429-.076-.126-.276-.201-.577-.351zM12 2C6.477 2 2 6.477 2 12c0 1.96.565 3.79 1.545 5.337L2 22l4.823-1.506A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>`,
  },
  {
    id: "instagram",
    label: "Instagram",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  },
  {
    id: "x",
    label: "X",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  {
    id: "youtube",
    label: "YouTube",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>`,
  },
  {
    id: "mail",
    label: "Email",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  },
  {
    id: "phone",
    label: "Phone",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  },
  {
    id: "star",
    label: "Star",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
];

const COLOR_PRESETS_FG = [
  { label: "Midnight", value: "#171717" },
  { label: "Royal Blue", value: "#2563eb" },
  { label: "Emerald", value: "#059669" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Crimson", value: "#dc2626" },
  { label: "Amber", value: "#d97706" },
];

const COLOR_PRESETS_BG = [
  { label: "Pure White", value: "#ffffff" },
  { label: "Off-White", value: "#f8fafc" },
  { label: "Warm Sand", value: "#fef3c7" },
  { label: "Dark", value: "#0a0a0a" },
  { label: "Transparent", value: "transparent" },
];

export function QrGeneratorPage() {
  const { user } = useAuth();

  // Content Type & Inputs
  const [contentType, setContentType] = useState<ContentType>("url");
  const [url, setUrl] = useState("https://1kb.link");
  const [text, setText] = useState("Scan to discover 1kb.link");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiAuth, setWifiAuth] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Dynamic Link creation
  const [isDynamic, setIsDynamic] = useState(false);
  const [dynamicSlug, setDynamicSlug] = useState<string | null>(null);

  // Advanced QR Styling (collapsed by default)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [fgColor, setFgColor] = useState("#171717");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState<number>(1);
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");

  // Logo States
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(0.22);
  const [logoBgShape, setLogoBgShape] = useState<LogoBgShape>("circle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Signup Modal State
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [modalFeature, setModalFeature] = useState<"dynamic" | "advanced">("dynamic");

  // Export & Action States
  const [pngResolution, setPngResolution] = useState<number>(1024);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Generation & Active Payload States
  const [isGenerating, setIsGenerating] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);
  const previewCardRef = useRef<HTMLDivElement>(null);

  // Compute draft QR payload
  const qrValue = (() => {
    if (isDynamic && dynamicSlug) {
      return shortUrl(dynamicSlug);
    }
    switch (contentType) {
      case "url":
        return url.trim() || "https://1kb.link";
      case "wifi":
        if (!wifiSsid) return "WIFI:S:MyNetwork;T:WPA;P:password;;";
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden};;`;
      case "text":
        return text || "1kb.link";
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName || "John Doe"}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNumber || "+1234567890"}`;
      default:
        return url || "https://1kb.link";
    }
  })();

  // Active Committed Config (displayed on preview and exported)
  const [activeConfig, setActiveConfig] = useState({
    value: "https://1kb.link",
    fg: "#171717",
    bg: "#ffffff",
    margin: 1,
    ecLevel: "M" as ErrorCorrectionLevel,
    logo: null as string | null,
    logoSize: 0.22,
    logoBgShape: "circle" as LogoBgShape,
    contentType: "url" as ContentType,
  });

  // Handle Generate QR Code
  function handleGenerate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setActiveConfig({
        value: qrValue,
        fg: fgColor,
        bg: bgColor,
        margin,
        ecLevel: user && logo ? "H" : ecLevel,
        logo: user ? logo : null,
        logoSize,
        logoBgShape,
        contentType,
      });
      setIsGenerating(false);
      setJustGenerated(true);
      setTimeout(() => setJustGenerated(false), 2500);

      // Scroll preview into view on mobile
      if (typeof window !== "undefined" && window.innerWidth < 1024 && previewCardRef.current) {
        previewCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 280);
  }

  // Require auth guard
  function requireAuth(feature: "dynamic" | "advanced", callback: () => void) {
    if (!user) {
      setModalFeature(feature);
      setIsSignupModalOpen(true);
      return;
    }
    callback();
  }

  // Handle Logo Upload
  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) {
      setModalFeature("advanced");
      setIsSignupModalOpen(true);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogo(reader.result);
        setSelectedPresetId(null);
        setEcLevel("H"); // Automatically set High error correction for logo readability
      }
    };
    reader.readAsDataURL(file);
  }

  // Handle Preset Logo selection
  function handlePresetSelect(preset: (typeof PRESET_LOGOS)[number]) {
    if (!user) {
      setModalFeature("advanced");
      setIsSignupModalOpen(true);
      return;
    }
    if (selectedPresetId === preset.id) {
      setLogo(null);
      setSelectedPresetId(null);
    } else {
      const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(preset.svg)}`;
      setLogo(dataUri);
      setSelectedPresetId(preset.id);
      setEcLevel("H");
    }
  }

  function removeLogo() {
    setLogo(null);
    setSelectedPresetId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Handle Dynamic Link toggle
  function handleToggleDynamic(checked: boolean) {
    if (!user) {
      setModalFeature("dynamic");
      setIsSignupModalOpen(true);
      return;
    }
    setIsDynamic(checked);
    if (checked && !dynamicSlug && contentType === "url" && isValidUrl(url)) {
      try {
        const link = createLink({
          slug: "",
          target: url,
          title: "Dynamic QR Code Destination",
          kind: "url",
        });
        setDynamicSlug(link.slug);
      } catch {
        // Fallback
      }
    }
  }

  // Handle Copy Image
  async function handleCopyImage() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      await renderQrToCanvas(canvas, activeConfig.value, {
        size: 1024,
        fg: activeConfig.fg,
        bg: activeConfig.bg,
        margin: activeConfig.margin,
        errorCorrectionLevel: activeConfig.ecLevel,
        logo: activeConfig.logo,
        logoSize: activeConfig.logoSize,
        logoBgShape: activeConfig.logoBgShape,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2000);
        } catch {
          alert("Clipboard image write permission denied by browser.");
        }
      });
    } catch {
      // Error
    }
  }

  // Handle Copy Raw Value
  function handleCopyValue() {
    navigator.clipboard.writeText(activeConfig.value);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  // Handle Print
  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    renderQrToCanvas(canvas, activeConfig.value, {
      size: 1024,
      fg: activeConfig.fg,
      bg: activeConfig.bg,
      margin: activeConfig.margin,
      errorCorrectionLevel: activeConfig.ecLevel,
      logo: activeConfig.logo,
      logoSize: activeConfig.logoSize,
      logoBgShape: activeConfig.logoBgShape,
    }).then(() => {
      const imgData = canvas.toDataURL("image/png");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Code - 1kb.link</title>
            <style>
              body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; }
              img { max-width: 480px; width: 100%; height: auto; }
              .payload { margin-top: 16px; font-size: 13px; color: #555; word-break: break-all; max-width: 480px; text-align: center; }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
            <div class="payload">${activeConfig.value}</div>
            <script>window.onload = () => { window.print(); window.close(); };</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  }

  return (
    <Page>
      <ToolHeader
        title="Custom QR Code Generator with Logo & Colors."
        body="Create high-resolution, print-ready QR codes for websites, Wi-Fi networks, and contact cards. Add your custom brand logo, fine-tune error correction and quiet zones, and export scalable SVG or ultra-HD PNG."
      />

      <section className="edge pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* LEFT COLUMN: CONTENT SELECTOR & ADVANCED QR CUSTOMIZATION      */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* CONTENT TYPE TABS */}
            <form onSubmit={handleGenerate} className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  1. QR Code Content
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {qrValue.length} characters
                </span>
              </div>

              {/* TABS */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-secondary/50 rounded-xl border border-border/60">
                {[
                  { id: "url" as const, label: "URL", icon: Globe },
                  { id: "wifi" as const, label: "Wi-Fi", icon: Wifi },
                  { id: "text" as const, label: "Text", icon: FileText },
                  { id: "vcard" as const, label: "Contact", icon: User },
                  { id: "email" as const, label: "Email", icon: Mail },
                  { id: "phone" as const, label: "Phone", icon: Phone },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setContentType(id);
                      setIsDynamic(false);
                      setDynamicSlug(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                      contentType === id
                        ? "bg-background text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* TAB CONTENT INPUTS */}
              <div className="pt-2 space-y-3">
                {contentType === "url" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Website or Destination URL
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/menu"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    {/* Dynamic QR Toggle */}
                    <div
                      onClick={() => {
                        if (!user) {
                          setModalFeature("dynamic");
                          setIsSignupModalOpen(true);
                        }
                      }}
                      className="flex items-center justify-between rounded-xl border border-border/80 bg-secondary/30 p-3.5 cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs font-medium text-foreground">
                            Dynamic Editable QR Link
                          </span>
                          {!user && <Lock className="h-3 w-3 text-muted-foreground ml-0.5" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          Routes through 1kb.link so you can change the target URL anytime without reprinting.
                        </p>
                      </div>
                      <Switch
                        checked={user ? isDynamic : false}
                        onCheckedChange={handleToggleDynamic}
                      />
                    </div>
                  </div>
                )}

                {contentType === "wifi" && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Scanning this QR automatically connects smartphones to your Wi-Fi without typing passwords.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Network SSID (Name)</label>
                        <input
                          type="text"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="e.g. CafeGuest_5G"
                          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Password</label>
                        <input
                          type="text"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="Network password"
                          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs pt-1">
                      <label className="flex items-center gap-1.5 text-muted-foreground">
                        <input
                          type="radio"
                          name="wifiAuth"
                          checked={wifiAuth === "WPA"}
                          onChange={() => setWifiAuth("WPA")}
                        />
                        WPA / WPA2 / WPA3
                      </label>
                      <label className="flex items-center gap-1.5 text-muted-foreground">
                        <input
                          type="radio"
                          name="wifiAuth"
                          checked={wifiAuth === "WEP"}
                          onChange={() => setWifiAuth("WEP")}
                        />
                        WEP
                      </label>
                      <label className="flex items-center gap-1.5 text-muted-foreground">
                        <input
                          type="radio"
                          name="wifiAuth"
                          checked={wifiAuth === "nopass"}
                          onChange={() => setWifiAuth("nopass")}
                        />
                        No Password
                      </label>
                    </div>
                  </div>
                )}

                {contentType === "text" && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Plain Text / Note</label>
                    <textarea
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type any message, instructions, or snippet..."
                      className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    />
                  </div>
                )}

                {contentType === "vcard" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                      <input
                        type="text"
                        value={vcardName}
                        onChange={(e) => setVcardName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Phone</label>
                      <input
                        type="tel"
                        value={vcardPhone}
                        onChange={(e) => setVcardPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Email</label>
                      <input
                        type="email"
                        value={vcardEmail}
                        onChange={(e) => setVcardEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Company / Organization</label>
                      <input
                        type="text"
                        value={vcardOrg}
                        onChange={(e) => setVcardOrg(e.target.value)}
                        placeholder="Acme Studio"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                )}

                {contentType === "email" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Recipient Email</label>
                      <input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="hello@company.com"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Subject Line</label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Customer Inquiry"
                          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Message Body</label>
                        <input
                          type="text"
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="Pre-filled email message..."
                          className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {contentType === "phone" && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Telephone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (800) 123-4567"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                )}

                {/* BIG GENERATE QR CODE BUTTON */}
                <div className="pt-3 border-t border-border/60">
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full h-12 rounded-xl text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
                  >
                    {isGenerating ? "Generating QR Code..." : "Generate QR Code"}
                  </Button>
                </div>
              </div>
            </form>

            {/* ============================================================== */}
            {/* ADVANCED QR OPTIONS ACCORDION: LOGO, COLORS, ERROR CORRECTION  */}
            {/* ============================================================== */}
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
                    <Sliders className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold tracking-tight">Advanced QR Options</h3>
                      {!user && <Lock className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Custom logo upload, brand colors, quiet zones, and error correction
                    </p>
                  </div>
                </div>
                {isAdvancedOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isAdvancedOpen && (
                <div className="p-5 pt-0 space-y-6 border-t border-border/60">
                  {/* SIGNUP CALLOUT BANNER (WHEN LOGGED OUT) */}
                  {!user ? (
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-secondary/30 p-4 shadow-2xs">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background border border-border text-foreground">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-medium text-foreground">
                              Advanced options require a free account
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            Upload your company logo, choose custom brand colors, badge shapes, and error recovery with a free account.
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
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        Custom logo & advanced QR styling <b className="text-foreground">unlocked</b> for{" "}
                        <span className="text-foreground font-mono">{user.email}</span>
                      </span>
                    </div>
                  )}

                  {/* 1. CUSTOM LOGO / BRAND ICON */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Custom Center Logo
                        </span>
                      </div>
                      {user && logo && (
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="flex items-center gap-1 text-xs text-destructive hover:underline"
                        >
                          <Trash2 className="h-3 w-3" /> Remove Logo
                        </button>
                      )}
                    </div>

                    {/* Upload File Button */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="qr-logo-upload"
                      />
                      <label
                        htmlFor={user ? "qr-logo-upload" : undefined}
                        onClick={() => {
                          if (!user) {
                            setModalFeature("advanced");
                            setIsSignupModalOpen(true);
                          }
                        }}
                        className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-border hover:border-foreground/50 bg-secondary/30 hover:bg-secondary/60 p-3.5 text-xs font-medium cursor-pointer transition-all text-center"
                      >
                        <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {user && logo && !selectedPresetId ? "Change Logo File" : "Upload Brand Logo (PNG, SVG, JPG, WebP)"}
                        </span>
                        {!user && <Lock className="h-3 w-3 text-muted-foreground ml-1" />}
                      </label>
                    </div>

                    {/* NON-OVERLAPPING BADGE SHAPE STRIP */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-border/40">
                      <span className="text-xs font-medium text-muted-foreground">Logo Badge Shape:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: "circle" as const, label: "Circle" },
                          { id: "rounded" as const, label: "Rounded" },
                          { id: "square" as const, label: "Square" },
                          { id: "none" as const, label: "None" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              requireAuth("advanced", () => setLogoBgShape(s.id));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              logoBgShape === s.id
                                ? "bg-foreground text-background border-foreground font-semibold shadow-2xs"
                                : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preset Brand Icons */}
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <span className="text-[11px] text-muted-foreground">Or choose an instant brand icon:</span>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_LOGOS.map((preset) => {
                          const isSelected = user && selectedPresetId === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handlePresetSelect(preset)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                isSelected
                                  ? "bg-foreground text-background border-foreground shadow-xs font-semibold"
                                  : "bg-background border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <span
                                className="h-3.5 w-3.5 inline-block shrink-0"
                                dangerouslySetInnerHTML={{ __html: preset.svg }}
                              />
                              <span>{preset.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Logo Size Slider */}
                    {user && logo && (
                      <div className="pt-2 flex items-center justify-between gap-4 text-xs">
                        <label className="text-muted-foreground whitespace-nowrap">
                          Logo Size: <b className="text-foreground">{Math.round(logoSize * 100)}%</b>
                        </label>
                        <input
                          type="range"
                          min="0.15"
                          max="0.30"
                          step="0.01"
                          value={logoSize}
                          onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                          className="w-full max-w-xs accent-foreground cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. COLORS & THEME */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-foreground" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Brand Colors
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Foreground Ink */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-muted-foreground">Ink (QR Dots)</span>
                          <span className="font-mono text-[11px] text-muted-foreground">{fgColor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={fgColor}
                            onChange={(e) => {
                              requireAuth("advanced", () => setFgColor(e.target.value));
                            }}
                            className="h-8 w-8 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                          />
                          <div className="flex flex-wrap gap-1.5">
                            {COLOR_PRESETS_FG.map((p) => (
                              <button
                                key={p.value}
                                type="button"
                                title={p.label}
                                onClick={() => {
                                  requireAuth("advanced", () => setFgColor(p.value));
                                }}
                                style={{ backgroundColor: p.value }}
                                className={`h-6 w-6 rounded-full border transition-transform ${
                                  fgColor === p.value
                                    ? "ring-2 ring-foreground ring-offset-2 scale-110 border-white"
                                    : "border-border/60 hover:scale-105"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Background Paper */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-muted-foreground">Paper (Background)</span>
                          <span className="font-mono text-[11px] text-muted-foreground">{bgColor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgColor === "transparent" ? "#ffffff" : bgColor}
                            onChange={(e) => {
                              requireAuth("advanced", () => setBgColor(e.target.value));
                            }}
                            className="h-8 w-8 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                          />
                          <div className="flex flex-wrap gap-1.5">
                            {COLOR_PRESETS_BG.map((p) => (
                              <button
                                key={p.value}
                                type="button"
                                title={p.label}
                                onClick={() => {
                                  requireAuth("advanced", () => setBgColor(p.value));
                                }}
                                className={`h-6 w-6 rounded-full border text-[9px] font-bold flex items-center justify-center transition-transform ${
                                  bgColor === p.value
                                    ? "ring-2 ring-foreground ring-offset-2 scale-110"
                                    : "border-border hover:scale-105"
                                } ${
                                  p.value === "transparent"
                                    ? "bg-muted text-foreground border-dashed"
                                    : ""
                                }`}
                                style={p.value !== "transparent" ? { backgroundColor: p.value } : {}}
                              >
                                {p.value === "transparent" ? "∅" : ""}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. PRECISION & ERROR CORRECTION */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-foreground" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Error Recovery & Quiet Zone
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Quiet Zone Margin */}
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground font-medium">Margin / Quiet Zone</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { val: 0, label: "0 (Flush)" },
                            { val: 1, label: "1 (Tight)" },
                            { val: 2, label: "2 (Default)" },
                            { val: 4, label: "4 (Wide)" },
                          ].map((m) => (
                            <button
                              key={m.val}
                              type="button"
                              onClick={() => {
                                requireAuth("advanced", () => setMargin(m.val));
                              }}
                              className={`py-1.5 px-1 rounded-lg text-center font-medium border text-[11px] transition-all ${
                                margin === m.val
                                  ? "bg-foreground text-background border-foreground font-semibold"
                                  : "border-border bg-background text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Error Correction Level */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-muted-foreground font-medium">Error Correction</label>
                          {user && logo && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              Auto High (30%)
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { level: "L" as const, label: "L (7%)" },
                            { level: "M" as const, label: "M (15%)" },
                            { level: "Q" as const, label: "Q (25%)" },
                            { level: "H" as const, label: "H (30%)" },
                          ].map((ec) => (
                            <button
                              key={ec.level}
                              type="button"
                              disabled={Boolean(user && logo)}
                              onClick={() => {
                                requireAuth("advanced", () => setEcLevel(ec.level));
                              }}
                              className={`py-1.5 px-1 rounded-lg text-center font-medium border text-[11px] transition-all disabled:opacity-60 ${
                                (user && logo ? "H" : ecLevel) === ec.level
                                  ? "bg-foreground text-background border-foreground font-semibold"
                                  : "border-border bg-background text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {ec.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground bg-secondary/30 p-2.5 rounded-xl border border-border/60">
                      💡 <b>Pro Tip:</b> Higher error correction allows the QR code to be scanned even when partially obscured, dirtied on printed menus, or customized with a center logo.
                    </p>

                    {/* APPLY & REGENERATE BUTTON */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full h-11 rounded-xl text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin text-amber-500" : ""}`} />
                        <span>Apply Customizations & Regenerate</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: REAL-TIME LIVE QR PREVIEW & EXPORT ACTIONS       */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div
              ref={previewCardRef}
              className={`rounded-2xl border bg-card p-6 shadow-xs space-y-5 flex flex-col items-center text-center transition-all duration-300 ${
                justGenerated
                  ? "border-emerald-500 ring-4 ring-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live Preview
                </span>
                {justGenerated ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 animate-in fade-in zoom-in-95 duration-200">
                    <Check className="h-3.5 w-3.5" /> Generated Successfully!
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" /> Scannable
                  </span>
                )}
              </div>

              {/* QR CODE CANVAS CONTAINER WITH GENERATION LOADER */}
              <div
                className="relative p-4 rounded-2xl border border-border shadow-inner max-w-full overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: activeConfig.bg === "transparent" ? "#ffffff" : activeConfig.bg,
                }}
              >
                {/* Generation Loading Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center rounded-2xl z-10 animate-in fade-in duration-150">
                    <RefreshCw className="h-8 w-8 animate-spin text-foreground mb-2" />
                    <span className="text-xs font-semibold text-foreground">Rendering QR Code...</span>
                  </div>
                )}

                <QrCode
                  value={activeConfig.value}
                  size={240}
                  fg={activeConfig.fg}
                  bg={activeConfig.bg}
                  margin={activeConfig.margin}
                  errorCorrectionLevel={activeConfig.ecLevel}
                  logo={activeConfig.logo}
                  logoSize={activeConfig.logoSize}
                  logoBgShape={activeConfig.logoBgShape}
                  className="rounded-lg max-w-full h-auto"
                />
              </div>

              {/* RESOLUTION SELECTOR FOR HIGH-RES PRINT EXPORT */}
              <div className="w-full flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">PNG Download Size:</span>
                <div className="flex items-center gap-1">
                  {[
                    { sz: 512, lbl: "512px" },
                    { sz: 1024, lbl: "1024px" },
                    { sz: 2048, lbl: "2048px (HD)" },
                  ].map((res) => (
                    <button
                      key={res.sz}
                      type="button"
                      onClick={() => setPngResolution(res.sz)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                        pngResolution === res.sz
                          ? "bg-foreground text-background border-foreground font-semibold"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {res.lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* MAIN DOWNLOAD BUTTONS */}
              <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  type="button"
                  onClick={async () => {
                    setDownloading(true);
                    try {
                      await downloadQr(activeConfig.value, `1kb-qr-${Date.now()}`, {
                        fg: activeConfig.fg,
                        bg: activeConfig.bg,
                        format: "png",
                        size: pngResolution,
                        margin: activeConfig.margin,
                        errorCorrectionLevel: activeConfig.ecLevel,
                        logo: activeConfig.logo,
                        logoSize: activeConfig.logoSize,
                        logoBgShape: activeConfig.logoBgShape,
                      });
                    } finally {
                      setDownloading(false);
                    }
                  }}
                  disabled={downloading}
                  className="rounded-full h-10 font-medium text-xs bg-foreground text-background shadow-xs hover:bg-foreground/90 gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    setDownloading(true);
                    try {
                      await downloadQr(activeConfig.value, `1kb-qr-vector-${Date.now()}`, {
                        fg: activeConfig.fg,
                        bg: activeConfig.bg,
                        format: "svg",
                        size: 1024,
                        margin: activeConfig.margin,
                        errorCorrectionLevel: activeConfig.ecLevel,
                        logo: activeConfig.logo,
                        logoSize: activeConfig.logoSize,
                        logoBgShape: activeConfig.logoBgShape,
                      });
                    } finally {
                      setDownloading(false);
                    }
                  }}
                  disabled={downloading}
                  className="rounded-full h-10 font-medium text-xs border-border hover:bg-secondary gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-blue-500" />
                  <span>Vector SVG</span>
                </Button>
              </div>

              {/* SECONDARY UTILITY ACTIONS: COPY IMAGE, COPY VALUE, PRINT */}
              <div className="w-full grid grid-cols-3 gap-2 pt-1 border-t border-border/50">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyImage}
                  className="rounded-xl h-8 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                >
                  {copiedImage ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedImage ? "Copied!" : "Copy Img"}</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyValue}
                  className="rounded-xl h-8 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                >
                  {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLink ? "Copied!" : "Copy Data"}</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="rounded-xl h-8 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                >
                  <Printer className="h-3 w-3" />
                  <span>Print</span>
                </Button>
              </div>

              {/* CURRENT CONTENT PREVIEW TAG */}
              <div className="w-full pt-2 text-left">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">
                  Encoded Payload
                </span>
                <p className="font-mono text-[11px] text-muted-foreground bg-muted p-2.5 rounded-lg border border-border break-all select-all">
                  {activeConfig.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNUP MODAL (TAKES 10 SECONDS) */}
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-background border border-border">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground mb-2">
              <Lock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tight">
              {modalFeature === "dynamic"
                ? "Unlock Dynamic Editable QR Codes"
                : "Unlock Custom Logo & Advanced Styling"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Takes only 10 seconds to create your free account. No credit card required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 py-3 text-xs">
            {modalFeature === "dynamic" ? (
              <>
                <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <b className="text-foreground">Editable Destination Forever:</b>
                    <span className="text-muted-foreground ml-1">
                      Change the destination URL of your printed QR code anytime without reprinting packaging or flyers.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <b className="text-foreground">Scan Analytics & Tracking:</b>
                    <span className="text-muted-foreground ml-1">
                      Monitor scan counts, visitor devices, and engagement in real-time.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
                  <ImageIcon className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <b className="text-foreground">Custom Brand Logos:</b>
                    <span className="text-muted-foreground ml-1">
                      Upload your logo or pick instant brand icons with Circle, Rounded, or Square badges.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
                  <Palette className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <b className="text-foreground">Custom Color Themes:</b>
                    <span className="text-muted-foreground ml-1">
                      Personalize ink and background paper colors, including transparent paper support.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-2.5">
                  <ShieldCheck className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <b className="text-foreground">Quiet Zone & Error Recovery:</b>
                    <span className="text-muted-foreground ml-1">
                      Fine-tune margins and error correction up to 30% for guaranteed scannability.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <RouterLink
              to="/auth"
              onClick={() => setIsSignupModalOpen(false)}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-background font-medium text-xs hover:bg-foreground/90 transition-all shadow-xs"
            >
              Sign up for free (takes 10 seconds) <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
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

      {/* SEO & EDUCATIONAL SECTION */}
      <InfoSections {...CONTENT.qr} />
    </Page>
  );
}
