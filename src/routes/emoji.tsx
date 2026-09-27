import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Page } from "@/components/Chrome";
import { getLinks, createLink, subscribeLinks, type DemoLink } from "@/lib/demo";
import { isValidUrl, normalizeUrl } from "@/lib/shortlinks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, downloadQr } from "@/components/QrCode";
import {
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  BarChart3,
  Globe2,
  Smartphone,
  Users,
  TrendingUp,
  MapPin,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Plus,
} from "lucide-react";
import { InfoSections } from "@/components/InfoSections";
import { CONTENT } from "@/lib/pageContent";
import billboardPlaceholder from "@/assets/emoji-editorial.jpg";

export const Route = createFileRoute("/emoji")({
  head: () => ({
    meta: [
      { title: "Single Emoji Short Links ($10 Lifetime) — 1kb.link" },
      {
        name: "description",
        content:
          "Claim your single emoji URL like 1kb.link/🚀 for $10 lifetime (originally $25). Exactly 1 emoji per link with dynamic QR codes, city-level analytics, and multi-link cart checkout.",
      },
      { name: "keywords", content: "emoji link, single emoji URL, emoji domain, emoji short link, buy emoji URL, 1 emoji link, emoji URL shortener" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/emoji" },
      { property: "og:title", content: "Single Emoji Short Links ($10 Lifetime) — 1kb.link" },
      {
        property: "og:description",
        content:
          "Claim your single emoji URL like 1kb.link/🚀 for $10 lifetime. 1 emoji per link with dynamic QR codes, city-level analytics, and multi-link cart checkout.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Single Emoji Short Links ($10 Lifetime) — 1kb.link" },
      {
        name: "twitter:description",
        content:
          "Claim your single emoji URL like 1kb.link/🚀 for $10 lifetime. 1 emoji per link with dynamic QR codes, city-level analytics, and multi-link cart checkout.",
      },
    ],
  }),
  component: EmojiLinksPage,
});

const EMOJI_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "Single Emoji Short Links",
      "description": "Claim exclusive 1-character single emoji URLs (e.g. 1kb.link/🚀) with dynamic QR codes and analytics.",
      "image": "https://1kb.link/favicon.ico",
      "brand": {
        "@type": "Brand",
        "name": "1kb.link",
      },
      "offers": {
        "@type": "Offer",
        "price": "10.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "url": "https://1kb.link/emoji",
      },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://1kb.link/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Single Emoji Links",
          "item": "https://1kb.link/emoji",
        },
      ],
    },
  ],
};

export interface EmojiItem {
  id: string;
  emoji: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
}

export interface CartItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  originalPrice: number;
  targetUrl: string;
}

const EMOJI_CATALOG: EmojiItem[] = [
  { id: "rocket", emoji: "🚀", name: "Rocket Launch", category: "Business", price: 10, originalPrice: 25 },
  { id: "diamond", emoji: "💎", name: "Diamond", category: "Premium", price: 10, originalPrice: 25 },
  { id: "fire", emoji: "🔥", name: "Fire", category: "Trending", price: 10, originalPrice: 25 },
  { id: "lightning", emoji: "⚡", name: "Lightning", category: "Tech", price: 10, originalPrice: 25 },
  { id: "target", emoji: "🎯", name: "Target", category: "Marketing", price: 10, originalPrice: 25 },
  { id: "star", emoji: "⭐", name: "Star", category: "Trending", price: 10, originalPrice: 25 },
  { id: "money-bag", emoji: "💰", name: "Money Bag", category: "Finance", price: 10, originalPrice: 25 },
  { id: "party", emoji: "🎉", name: "Party", category: "Events", price: 10, originalPrice: 25 },
  { id: "light-bulb", emoji: "💡", name: "Light Bulb", category: "Tech", price: 10, originalPrice: 25 },
  { id: "trophy", emoji: "🏆", name: "Trophy", category: "Business", price: 10, originalPrice: 25 },
  { id: "artist-palette", emoji: "🎨", name: "Artist Palette", category: "Creative", price: 10, originalPrice: 25 },
  { id: "mobile-phone", emoji: "📱", name: "Mobile Phone", category: "Tech", price: 10, originalPrice: 25 },
  { id: "earth-globe", emoji: "🌍", name: "Earth Globe", category: "Business", price: 10, originalPrice: 25 },
  { id: "lock", emoji: "🔒", name: "Lock", category: "Security", price: 10, originalPrice: 25 },
  { id: "car", emoji: "🚗", name: "Car", category: "Lifestyle", price: 10, originalPrice: 25 },
  { id: "house", emoji: "🏠", name: "House", category: "Finance", price: 10, originalPrice: 25 },
  { id: "soccer-ball", emoji: "⚽", name: "Soccer Ball", category: "Sports", price: 10, originalPrice: 25 },
  { id: "musical-note", emoji: "🎵", name: "Musical Note", category: "Creative", price: 10, originalPrice: 25 },
  { id: "coffee", emoji: "☕", name: "Coffee Cup", category: "Lifestyle", price: 10, originalPrice: 25 },
  { id: "crown", emoji: "👑", name: "Crown", category: "Trending", price: 10, originalPrice: 25 },
  { id: "shopping-cart", emoji: "🛒", name: "Shopping Cart", category: "Marketing", price: 10, originalPrice: 25 },
  { id: "airplane", emoji: "✈️", name: "Airplane", category: "Lifestyle", price: 10, originalPrice: 25 },
  { id: "brain", emoji: "🧠", name: "Brain", category: "Tech", price: 10, originalPrice: 25 },
  { id: "camera", emoji: "📸", name: "Camera", category: "Creative", price: 10, originalPrice: 25 },
  { id: "pizza", emoji: "🍕", name: "Pizza", category: "Lifestyle", price: 10, originalPrice: 25 },
  { id: "video-game", emoji: "🎮", name: "Video Game", category: "Events", price: 10, originalPrice: 25 },
  { id: "red-heart", emoji: "❤️", name: "Red Heart", category: "Trending", price: 10, originalPrice: 25 },
  { id: "sparkles", emoji: "✨", name: "Sparkles", category: "Creative", price: 10, originalPrice: 25 },
  { id: "sunglasses", emoji: "😎", name: "Sunglasses", category: "Lifestyle", price: 10, originalPrice: 25 },
  { id: "handshake", emoji: "🤝", name: "Handshake", category: "Business", price: 10, originalPrice: 25 },
  { id: "bell", emoji: "🔔", name: "Bell", category: "Marketing", price: 10, originalPrice: 25 },
  { id: "key", emoji: "🔑", name: "Key", category: "Security", price: 10, originalPrice: 25 },
  { id: "megaphone", emoji: "📣", name: "Megaphone", category: "Marketing", price: 10, originalPrice: 25 },
  { id: "rainbow", emoji: "🌈", name: "Rainbow", category: "Creative", price: 10, originalPrice: 25 },
  { id: "books", emoji: "📚", name: "Books", category: "Tech", price: 10, originalPrice: 25 },
  { id: "watch", emoji: "⌚", name: "Watch", category: "Lifestyle", price: 10, originalPrice: 25 },
];

const CATEGORIES = [
  "All",
  "Trending",
  "Business",
  "Tech",
  "Marketing",
  "Finance",
  "Events",
  "Creative",
  "Lifestyle",
  "Sports",
  "Security",
];

// Helper to determine if input is strictly 1 single emoji grapheme
function isStrictSingleEmoji(str: string): boolean {
  const trimmed = str.trim();
  if (!trimmed) return false;
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    const segments = Array.from(segmenter.segment(trimmed));
    if (segments.length !== 1) return false;
  } else {
    if (Array.from(trimmed).length > 2) return false;
  }
  return /\p{Extended_Pictographic}/u.test(trimmed);
}

function EmojiLinksPage() {
  const [links, setLinks] = useState<DemoLink[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterAvailability, setFilterAvailability] = useState<"all" | "available" | "claimed">("all");

  // Custom emoji input
  const [customEmoji, setCustomEmoji] = useState("");
  const [customError, setCustomError] = useState("");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartError, setCartError] = useState("");
  const [isCartCheckingOut, setIsCartCheckingOut] = useState(false);
  const [cartSuccessLinks, setCartSuccessLinks] = useState<DemoLink[] | null>(null);

  // Single modal claim state
  const [activeItem, setActiveItem] = useState<EmojiItem | null>(null);
  const [targetUrl, setTargetUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");
  const [claimedLink, setClaimedLink] = useState<DemoLink | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync links
  useEffect(() => {
    setLinks(getLinks());
    return subscribeLinks(() => setLinks(getLinks()));
  }, []);

  // Map of claimed slugs for fast check
  const claimedMap = useMemo(() => {
    const map = new Map<string, DemoLink>();
    for (const l of links) {
      if (l.kind === "emoji") {
        map.set(l.slug, l);
      }
    }
    return map;
  }, [links]);

  // Cart helper functions
  const isInCart = (emoji: string) => cart.some((c) => c.emoji === emoji);

  const addToCart = (item: EmojiItem) => {
    if (claimedMap.has(item.emoji)) return;
    if (isInCart(item.emoji)) return;
    setCart((prev) => [
      ...prev,
      {
        id: item.id,
        emoji: item.emoji,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        targetUrl: "",
      },
    ]);
  };

  const removeFromCart = (emoji: string) => {
    setCart((prev) => prev.filter((c) => c.emoji !== emoji));
  };

  const toggleCart = (item: EmojiItem) => {
    if (isInCart(item.emoji)) {
      removeFromCart(item.emoji);
    } else {
      addToCart(item);
    }
  };

  const updateCartUrl = (emoji: string, url: string) => {
    setCart((prev) =>
      prev.map((c) => (c.emoji === emoji ? { ...c, targetUrl: url } : c))
    );
  };

  // Filtered catalog
  const filteredEmojis = useMemo(() => {
    return EMOJI_CATALOG.filter((item) => {
      const isClaimed = claimedMap.has(item.emoji);
      if (filterAvailability === "available" && isClaimed) return false;
      if (filterAvailability === "claimed" && !isClaimed) return false;

      if (selectedCategory !== "All") {
        if (selectedCategory === "Trending" && item.category !== "Trending") {
          return false;
        } else if (selectedCategory !== "Trending" && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [filterAvailability, selectedCategory, claimedMap]);

  // Open single claim modal for an item
  const handleOpenClaim = (item: EmojiItem) => {
    setActiveItem(item);
    setTargetUrl("");
    setLinkTitle(item.name);
    setFormError("");
    setClaimedLink(null);
  };

  // Submit custom emoji from input
  const handleCheckCustomEmoji = (e: React.FormEvent) => {
    e.preventDefault();
    const emoji = customEmoji.trim();
    if (!emoji) {
      setCustomError("Enter or paste a single emoji.");
      return;
    }
    if (!isStrictSingleEmoji(emoji)) {
      setCustomError("Only 1 single emoji is allowed per link.");
      return;
    }

    setCustomError("");
    const existing = EMOJI_CATALOG.find((x) => x.emoji === emoji);
    if (existing) {
      handleOpenClaim(existing);
    } else {
      handleOpenClaim({
        id: `custom-${Date.now()}`,
        emoji,
        name: `Emoji ${emoji}`,
        category: "Custom",
        price: 10,
        originalPrice: 25,
      });
    }
  };

  // Complete single item checkout & claim
  const handleProcessClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    if (!isValidUrl(targetUrl)) {
      setFormError("Please enter a valid destination URL (e.g. https://yourwebsite.com)");
      return;
    }

    if (claimedMap.has(activeItem.emoji)) {
      setFormError(`1kb.link/${activeItem.emoji} is already claimed.`);
      return;
    }

    setIsProcessing(true);
    setFormError("");

    setTimeout(() => {
      try {
        const newLink = createLink({
          slug: activeItem.emoji,
          target: normalizeUrl(targetUrl),
          title: linkTitle.trim() || activeItem.name,
          kind: "emoji",
        });
        setClaimedLink(newLink);
        // Also remove from cart if it was there
        removeFromCart(activeItem.emoji);
        setIsProcessing(false);
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "Failed to claim link");
        setIsProcessing(false);
      }
    }, 600);
  };

  // Complete multi-item cart checkout
  const handleCheckoutCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Validate that each item has a valid URL
    const invalidItem = cart.find((item) => !isValidUrl(item.targetUrl));
    if (invalidItem) {
      setCartError(`Please enter a valid destination URL for ${invalidItem.emoji} (${invalidItem.name}).`);
      return;
    }

    setCartError("");
    setIsCartCheckingOut(true);

    setTimeout(() => {
      try {
        const created: DemoLink[] = [];
        for (const item of cart) {
          const newLink = createLink({
            slug: item.emoji,
            target: normalizeUrl(item.targetUrl),
            title: item.name,
            kind: "emoji",
          });
          created.push(newLink);
        }
        setCartSuccessLinks(created);
        setCart([]); // Clear cart
        setIsCartCheckingOut(false);
      } catch (err: unknown) {
        setCartError(err instanceof Error ? err.message : "Failed to claim links");
        setIsCartCheckingOut(false);
      }
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Page>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(EMOJI_PAGE_SCHEMA) }}
      />
      {/* ============================================================== */}
      {/* HERO SECTION: 2-COLUMN LAYOUT (FEATURED IMG ON RIGHT SIDE)      */}
      {/* ============================================================== */}
      <section className="hair">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Heading, description, and claim bar */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Single Emoji Short Links
              </p>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08]">
                One emoji. One link. Total brand impact.
              </h1>

              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-[54ch]">
                Make your address impossible to forget. Claim a single emoji URL like{" "}
                <span className="font-medium text-foreground">1kb.link/🚀</span> for{" "}
                <b className="font-semibold text-foreground">$10 lifetime</b>{" "}
                <span className="text-sm text-muted-foreground line-through">($25)</span> with dynamic QR
                codes and comprehensive analytics.
              </p>

              {/* QUICK CLAIM / SEARCH INPUT */}
              <form onSubmit={handleCheckCustomEmoji} className="mt-8 max-w-lg">
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted p-1.5 focus-within:ring-2 focus-within:ring-ring">
                  <div className="flex pl-3 text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => {
                      setCustomEmoji(e.target.value);
                      setCustomError("");
                    }}
                    placeholder="Enter or paste any 1 emoji (e.g. 🦁, 🥑, 🚀)..."
                    className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground min-w-0"
                  />
                  <Button type="submit" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 shrink-0 h-10 font-medium">
                    Claim for $10
                  </Button>
                </div>
                {customError && <p className="mt-2 text-xs text-destructive font-medium pl-3">{customError}</p>}
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-foreground" />
                  <span>1 emoji per long link</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-foreground" />
                  <span>$10 lifetime access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-foreground" />
                  <span>Dynamic QR code included</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Image / Billboard Slot */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                id="emoji-billboard-slot"
                className="relative w-full max-w-md overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-sm group"
              >
                {/* 
                  BILLBOARD FEATURE IMAGE SLOT:
                  You can replace this img with your custom billboard image whenever you're ready.
                */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={billboardPlaceholder}
                    alt="Featured billboard slot"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-left text-white">
                    <span className="inline-block self-start rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md border border-white/20 mb-2">
                      Featured Billboard Space
                    </span>
                    <p className="text-sm font-medium leading-snug">
                      Point your single emoji link directly to your product or community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* EMOJI CARDS GRID SECTION                                       */}
      {/* Views count removed, Hover 'Add to Cart' option added          */}
      {/* ============================================================== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Pick your address</p>
              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Available emoji links</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {filteredEmojis.length}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                $10 lifetime (originally $25). 1 emoji per long link.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-full bg-secondary p-1 text-xs">
                {(["all", "available", "claimed"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilterAvailability(mode)}
                    className={`rounded-full px-3 py-1 font-medium capitalize transition-all ${
                      filterAvailability === mode
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Cart Trigger button in toolbar */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                  cart.length > 0
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-background border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="rounded-full bg-background text-foreground px-1.5 py-0.2 text-[10px] font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category Filter Pills (Clean design system) */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* EMOJI CARDS: No views count + Hover Add-to-Cart */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
            {filteredEmojis.map((item) => {
              const isClaimed = claimedMap.has(item.emoji);
              const linkData = claimedMap.get(item.emoji);
              const inCart = isInCart(item.emoji);

              return (
                <div
                  key={item.emoji}
                  onClick={() => {
                    if (isClaimed && linkData) {
                      window.open(`/${encodeURIComponent(item.emoji)}`, "_blank");
                    } else {
                      handleOpenClaim(item);
                    }
                  }}
                  className={`group relative flex flex-col items-center justify-between rounded-xl border p-3.5 sm:p-4 text-center transition-all cursor-pointer min-w-0 overflow-hidden ${
                    isClaimed
                      ? "border-border bg-secondary/30"
                      : inCart
                        ? "border-foreground/50 bg-card shadow-xs ring-1 ring-foreground/20"
                        : "border-border bg-card shadow-xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
                  }`}
                >
                  {/* Status Indicator */}
                  {isClaimed ? (
                    <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-foreground">
                      <Check className="h-2.5 w-2.5" /> Claimed
                    </span>
                  ) : inCart ? (
                    <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-foreground text-background px-1.5 py-0.5 text-[9px] font-medium">
                      <Check className="h-2.5 w-2.5" /> In Cart
                    </span>
                  ) : null}

                  {/* Big Emoji icon */}
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-3xl sm:text-4xl my-1 select-none shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {item.emoji}
                  </div>

                  {/* Title Name */}
                  <h3 className="mt-1.5 text-xs sm:text-sm font-medium text-foreground tracking-tight truncate w-full">
                    {item.name}
                  </h3>

                  {/* Short URL */}
                  <p className="mt-0.5 text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors truncate w-full">
                    1kb.link/{item.emoji}
                  </p>

                  {/* Price & Hover Add-to-Cart Row (Views count removed!) */}
                  <div className="mt-3 relative w-full border-t border-border pt-2 text-xs min-h-[32px] flex items-center justify-center">
                    {/* Normal Price Display */}
                    <div
                      className={`flex items-baseline justify-center gap-1 transition-opacity duration-150 ${
                        !isClaimed ? "group-hover:opacity-0" : ""
                      }`}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        ${item.price}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal"> lifetime</span>
                      <span className="text-[10px] text-muted-foreground/60 line-through ml-1">
                        ${item.originalPrice}
                      </span>
                    </div>

                    {/* Add to Cart button revealed on hover */}
                    {!isClaimed && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150">
                        {inCart ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.emoji);
                            }}
                            className="w-full h-7 px-2 rounded-full bg-secondary text-foreground hover:bg-destructive/10 hover:text-destructive text-[11px] font-medium flex items-center justify-center gap-1 transition-colors shadow-xs"
                          >
                            <Check className="h-3 w-3" /> In Cart
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                            className="w-full h-7 px-2 rounded-full bg-foreground text-background hover:bg-foreground/90 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors shadow-xs"
                          >
                            <Plus className="h-3 w-3" /> Add to cart
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEmojis.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-base font-medium">No emoji found in this category.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can claim any single emoji from your keyboard using the bar above.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("All");
                  setFilterAvailability("all");
                }}
                className="mt-4 rounded-full"
              >
                Reset filter
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* FLOATING CART BAR (WHEN ITEMS ARE IN CART)                      */}
      {/* ============================================================== */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
          <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-foreground text-background px-5 py-3 shadow-xl border border-background/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShoppingCart className="h-4 w-4" />
              <span>{cart.length} {cart.length === 1 ? "link" : "links"} in cart</span>
              <span className="text-background/50">·</span>
              <span className="font-semibold">${cart.length * 10} lifetime</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="rounded-full bg-background text-foreground hover:bg-background/90 px-4 py-1.5 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              Review & Checkout <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MULTI-LINK CART DRAWER / SHEET                                  */}
      {/* ============================================================== */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6 sm:p-7">
          <SheetHeader className="text-left border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <SheetTitle className="text-xl font-medium tracking-tight">Your Cart</SheetTitle>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            </div>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              $10 lifetime per emoji link · 1 emoji per destination URL
            </SheetDescription>
          </SheetHeader>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {cart.length === 0 && !cartSuccessLinks && (
              <div className="py-16 text-center text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-foreground">Your cart is empty</p>
                <p className="text-xs mt-1">Hover over any emoji card and click "Add to cart".</p>
              </div>
            )}

            {/* Cart Items Form */}
            {cart.map((item) => (
              <div key={item.emoji} className="rounded-xl border border-border p-4 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                      <p className="text-xs font-mono text-muted-foreground">1kb.link/{item.emoji}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">$10 lifetime</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.emoji)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-muted transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    Destination Web Address
                  </label>
                  <Input
                    type="url"
                    required
                    value={item.targetUrl}
                    onChange={(e) => updateCartUrl(item.emoji, e.target.value)}
                    placeholder="https://yourbrand.com/destination"
                    className="h-9 rounded-full bg-muted border-border text-xs px-3.5"
                  />
                </div>
              </div>
            ))}

            {/* Cart Multi-Link Success View */}
            {cartSuccessLinks && (
              <div className="space-y-4 py-2">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground mb-2">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Links Activated!</h3>
                  <p className="text-xs text-muted-foreground">
                    All {cartSuccessLinks.length} single-emoji links are live and ready to share.
                  </p>
                </div>

                <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
                  {cartSuccessLinks.map((link) => (
                    <div
                      key={link.slug}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{link.slug}</span>
                        <div>
                          <p className="font-mono font-medium text-foreground">1kb.link/{link.slug}</p>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                            {link.target_url}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(`https://1kb.link/${link.slug}`)}
                          className="h-7 px-2 text-[11px] rounded-full"
                        >
                          <Copy className="h-3 w-3 mr-1" /> Copy
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px] rounded-full"
                        >
                          <a href={`/${encodeURIComponent(link.slug)}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    setCartSuccessLinks(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium text-xs mt-4"
                >
                  Done
                </Button>
              </div>
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {cart.length > 0 && !cartSuccessLinks && (
            <div className="border-t border-border pt-4 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Registration ({cart.length} links)</span>
                  <span>${cart.length * 10}.00 lifetime</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>Launch savings</span>
                  <span className="text-foreground">Save ${cart.length * 15}.00</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-foreground pt-1 border-t border-border">
                  <span>Total Due Today</span>
                  <span>${cart.length * 10}.00 lifetime</span>
                </div>
              </div>

              {cartError && <p className="text-xs font-medium text-destructive">{cartError}</p>}

              <Button
                onClick={handleCheckoutCart}
                disabled={isCartCheckingOut}
                className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium text-sm transition-all"
              >
                {isCartCheckingOut ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Activating {cart.length} links…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pay ${cart.length * 10} & Claim {cart.length} {cart.length === 1 ? "Link" : "Links"}
                  </span>
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ============================================================== */}
      {/* POWERFUL ANALYTICS & INSIGHTS SECTION                          */}
      {/* Follows app's design system & requested copy                   */}
      {/* ============================================================== */}
      <section className="edge mt-12 border-t border-border pt-16 pb-20">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Analytics & Tracking</p>
        <h2 className="mt-3 max-w-[20ch] text-3xl font-medium sm:text-4xl">
          Powerful Analytics & Insights
        </h2>
        <p className="mt-4 max-w-[60ch] text-muted-foreground">
          Every emoji link comes with comprehensive tracking and analytics to help you understand your audience better.
        </p>

        {/* 6 Feature Items */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. Advanced Analytics */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">Advanced Analytics</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Track clicks, conversions, and engagement metrics in real-time
            </p>
          </div>

          {/* 2. Geographic Insights */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
              <Globe2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">Geographic Insights</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              See where your audience is clicking from around the world
            </p>
          </div>

          {/* 3. Device & Browser Data */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">Device & Browser Data</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Understand your audience's technology preferences
            </p>
          </div>

          {/* 4. Audience Demographics */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">Audience Demographics</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Get detailed insights about your link visitors
            </p>
          </div>

          {/* 5. Performance Trends */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">Performance Trends</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Monitor link performance over time with detailed graphs
            </p>
          </div>

          {/* 6. Location Tracking */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">Location Tracking</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              City-level geographic data for targeted marketing
            </p>
          </div>
        </div>

        {/* Live Metrics Showcase Box */}
        <div className="mt-12 rounded-[var(--radius)] bg-secondary/50 border border-border p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <h4 className="font-medium text-foreground">1kb.link/🚀</h4>
                <p className="text-xs text-muted-foreground">Points to https://myproduct.com/launch</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-medium text-foreground">15,482</span>
                <p className="text-[11px] text-muted-foreground">Total visits counted</p>
              </div>
              <Link
                to="/stats/$slug"
                params={{ slug: "sample-2" }}
                className="rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-medium hover:bg-foreground/90 transition-colors"
              >
                View demo stats
              </Link>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-border bg-background p-3.5">
              <p className="text-muted-foreground">Top Country</p>
              <p className="mt-1 font-medium text-foreground text-sm">United States (44%)</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5">
              <p className="text-muted-foreground">Primary Device</p>
              <p className="mt-1 font-medium text-foreground text-sm">Mobile (68%)</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5">
              <p className="text-muted-foreground">QR Scans</p>
              <p className="mt-1 font-medium text-foreground text-sm">4,219 Scans (27%)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* EMOJI FAQ & BENEFITS (AEO/GEO KNOWLEDGE BASE)                 */}
      {/* ============================================================== */}
      <InfoSections {...CONTENT.emoji} />

      {/* ============================================================== */}
      {/* SINGLE-ITEM CLAIM DIALOG                                      */}
      {/* ============================================================== */}
      <Dialog open={Boolean(activeItem)} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 sm:p-7 bg-background border border-border">
          {activeItem && !claimedLink && (
            <>
              <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-4xl mb-2 select-none">
                  {activeItem.emoji}
                </div>
                <DialogTitle className="text-2xl font-medium tracking-tight">
                  Claim 1kb.link/{activeItem.emoji}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Single emoji short link · 1 emoji per long link
                </DialogDescription>
              </DialogHeader>

              {/* Price Display */}
              <div className="mt-4 rounded-xl border border-border bg-secondary/60 p-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-2xl font-bold text-foreground">
                    ${activeItem.price}
                  </span>
                  <span className="text-xs text-muted-foreground">lifetime</span>
                  <span className="text-xs text-muted-foreground line-through ml-1">
                    ${activeItem.originalPrice}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Special launch offer · Lifetime ownership with zero recurring renewal fees
                </p>
              </div>

              <form onSubmit={handleProcessClaim} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Destination web address (Long URL)
                  </label>
                  <Input
                    type="url"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://yourbrand.com/special-page"
                    className="h-11 rounded-full bg-muted border-border text-sm px-4"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Link label (Optional)
                  </label>
                  <Input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder={activeItem.name}
                    className="h-11 rounded-full bg-muted border-border text-sm px-4"
                  />
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1.5 text-muted-foreground">
                  <div className="flex items-center justify-between font-medium">
                    <span>Lifetime Registration</span>
                    <span className="text-foreground">$10.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Real-time Analytics & QR Code</span>
                    <span className="text-foreground">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Global Fast Redirects</span>
                    <span className="text-foreground">Included</span>
                  </div>
                </div>

                {formError && (
                  <p className="text-xs font-medium text-destructive">{formError}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toggleCart(activeItem);
                      setActiveItem(null);
                    }}
                    className="flex-1 h-11 rounded-full text-xs font-medium"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    {isInCart(activeItem.emoji) ? "Remove from Cart" : "Add to Cart"}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium text-xs transition-all"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Activating…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5" />
                        Buy Now ($10 Lifetime)
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* SUCCESS CONFIRMATION STATE */}
          {activeItem && claimedLink && (
            <div className="text-center py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground mb-3">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <DialogTitle className="text-2xl font-medium tracking-tight">
                Your emoji link is live!
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs text-muted-foreground">
                1kb.link/{activeItem.emoji} is now active and pointing to your destination.
              </DialogDescription>

              <div className="mt-5 flex items-center justify-between gap-2 rounded-full border border-border bg-muted px-4 py-2">
                <span className="font-mono text-sm font-semibold truncate text-foreground">
                  1kb.link/{activeItem.emoji}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(`https://1kb.link/${activeItem.emoji}`)}
                  className="rounded-full h-7 text-xs shrink-0"
                >
                  {copied ? (
                    <span className="flex items-center gap-1 font-medium">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </span>
                  )}
                </Button>
              </div>

              {/* QR Code */}
              <div className="mt-6 flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/40 border border-border">
                <QrCode value={`https://1kb.link/${encodeURIComponent(activeItem.emoji)}`} size={120} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    downloadQr(
                      `https://1kb.link/${encodeURIComponent(activeItem.emoji)}`,
                      `1kb-link-${activeItem.emoji}`,
                      { fg: "#000000", bg: "#ffffff", format: "png" },
                    )
                  }
                  className="mt-3 text-xs rounded-full h-7 text-muted-foreground hover:text-foreground"
                >
                  Download QR Code (.png)
                </Button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <Button
                  asChild
                  className="flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium"
                >
                  <a href={`/${encodeURIComponent(activeItem.emoji)}`} target="_blank" rel="noreferrer">
                    Test link <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  <Link to="/stats/$slug" params={{ slug: encodeURIComponent(activeItem.emoji) }}>
                    View stats <BarChart3 className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
}
