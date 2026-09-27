import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page, ToolHeader } from "@/components/Chrome";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Technical Guides: Short Links, QR Codes & Privacy — 1kb.link" },
      {
        name: "description",
        content:
          "Authoritative engineering and marketing guides on password-protected short links, dynamic vector QR codes, UTM campaign tracking, and cookie-free analytics.",
      },
      {
        name: "keywords",
        content:
          "URL shortener blog, QR code guides, password protected links, dynamic QR codes, UTM tracking, cookie-free analytics, 1kb.link blog",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://1kb.link/blog" },
      { property: "og:title", content: "Blog & Technical Guides — 1kb.link" },
      {
        property: "og:description",
        content:
          "Expert guides on password-protected short links, dynamic vector QR codes, UTM campaign tracking, and cookie-free analytics.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Blog & Technical Guides — 1kb.link" },
      {
        name: "twitter:description",
        content:
          "Expert guides on password-protected short links, dynamic vector QR codes, UTM campaign tracking, and cookie-free analytics.",
      },
    ],
  }),
  component: BlogPage,
});

export function BlogPage() {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  function handleShare(slug: string) {
    const url = `https://1kb.link/blog#${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  // Schema.org Blog & Articles JSON-LD for Search Engines & AI Citations
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "1kb.link Engineering & Marketing Knowledge Base",
    description:
      "Expert guides on password-protected short links, dynamic vector QR codes, UTM tracking, and privacy-preserving analytics.",
    url: "https://1kb.link/blog",
    publisher: {
      "@type": "Organization",
      name: "1kb.link",
      url: "https://1kb.link",
    },
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
      keywords: post.keywords.join(", "),
      url: `https://1kb.link/blog#${post.slug}`,
    })),
  };

  const featuredPost = BLOG_POSTS[0];
  const remainingPosts = BLOG_POSTS.slice(1);

  return (
    <Page>
      {/* Inject Structured Data for SEO / GEO / AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHeader
        title="Blog"
        body="In-depth technical guides and strategic blueprints for modern link infrastructure, vector QR design, privacy-first analytics, and password protection."
      />

      <section className="edge pb-24">
        {/* ============================================================== */}
        {/* ACTIVE FULL ARTICLE VIEW (IF SELECTED)                         */}
        {/* ============================================================== */}
        {activeArticle ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Back Button & Header */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                ← Back to all articles
              </button>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(activeArticle.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {activeArticle.readTime}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-tight">
                {activeArticle.title}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                {activeArticle.subtitle}
              </p>

              {/* Author & Share Bar */}
              <div className="mt-6 flex items-center justify-between border-y border-border py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-base">
                    {activeArticle.author.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{activeArticle.author.name}</p>
                    <p className="text-[11px] text-muted-foreground">{activeArticle.author.role}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(activeArticle.slug)}
                  className="rounded-full h-8 text-xs font-medium gap-1.5 border-border"
                >
                  {copiedSlug === activeArticle.slug ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied URL</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* AI CITABILITY KEY TAKEAWAY (AEO / GEO OPTIMIZED) */}
            <div className="rounded-2xl border-2 border-foreground/20 bg-secondary/30 p-5 sm:p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Quick Answer / Executive Summary
                </h3>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed font-serif sm:font-sans">
                {activeArticle.keyTakeaway}
              </p>
            </div>

            {/* MAIN ARTICLE BODY */}
            <div className="space-y-6 text-foreground leading-relaxed text-sm sm:text-base">
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                {activeArticle.content.intro}
              </p>

              {activeArticle.content.sections.map((section, idx) => (
                <div key={idx} className="space-y-3 pt-3">
                  <h2 className="text-xl font-medium tracking-tight text-foreground">
                    {section.heading}
                  </h2>
                  {section.body.map((p, pIdx) => (
                    <p key={pIdx} className="text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {section.callout && (
                    <div className="rounded-xl border-l-4 border-foreground bg-muted p-4 text-xs sm:text-sm text-foreground my-3">
                      {section.callout}
                    </div>
                  )}
                </div>
              ))}

              {/* COMPARISON TABLE */}
              {activeArticle.content.comparisonTable && (
                <div className="pt-4 space-y-3">
                  <h3 className="text-base font-semibold tracking-tight">Feature Comparison</h3>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-secondary/70 border-b border-border text-foreground font-semibold">
                        <tr>
                          {activeArticle.content.comparisonTable.headers.map((h, i) => (
                            <th key={i} className="px-4 py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {activeArticle.content.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/40 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-3 ${
                                  cIdx === 0 ? "font-medium text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FAQS ACCORDION (FOR VOICE & AI CRAWLER CITATIONS) */}
              {activeArticle.faqs && activeArticle.faqs.length > 0 && (
                <div className="pt-6 space-y-3 border-t border-border">
                  <h3 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-foreground" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-2">
                    {activeArticle.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        className="rounded-xl border border-border bg-card p-4 transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqIndex(expandedFaqIndex === fIdx ? null : fIdx)}
                          className="flex w-full items-center justify-between text-left text-xs sm:text-sm font-medium text-foreground gap-3"
                        >
                          <span>{faq.question}</span>
                          {expandedFaqIndex === fIdx ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </button>
                        {expandedFaqIndex === fIdx && (
                          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA TO TRY 1KB.LINK */}
              <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3 mt-10">
                <h4 className="text-base font-medium">Ready to experience private, ultra-fast links?</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Create password-protected short links, custom vector QR codes with your brand logo, and track clicks without cookies.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button asChild className="rounded-full text-xs font-medium bg-foreground text-background">
                    <Link to="/">Create Free Link</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full text-xs font-medium border-border">
                    <Link to="/qr-generator">Create Dynamic QR</Link>
                  </Button>
                </div>
              </div>

              {/* OTHER POSTS SECTION AT THE BOTTOM OF THE DETAIL PAGE */}
              <div className="pt-10 border-t border-border space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-foreground">
                      Other Articles & Guides
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Explore more engineering and marketing guides on short links & QR technology.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveArticle(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BLOG_POSTS.filter((p) => p.slug !== activeArticle.slug).map((post) => (
                    <div
                      key={post.slug}
                      onClick={() => {
                        setActiveArticle(post);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group flex flex-col justify-between cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-foreground/80 leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <span>{post.author.avatar}</span>
                          <span className="text-[11px] font-medium">{post.author.name}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:translate-x-0.5 transition-transform">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* ARTICLES DIRECTORY VIEW (NO CATEGORY PILLS OR SEARCH BAR)      */
          /* ============================================================== */
          <div className="space-y-8">
            {/* FEATURED STORY */}
            {featuredPost && (
              <div
                onClick={() => {
                  setActiveArticle(featuredPost);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-foreground/30 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="rounded-full bg-foreground text-background px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Featured Guide
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground group-hover:text-foreground/90">
                  {featuredPost.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {featuredPost.description}
                </p>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{featuredPost.author.avatar}</span>
                    <span>{featuredPost.author.name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            )}

            {/* REMAINING POSTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <div
                  key={post.slug}
                  id={post.slug}
                  onClick={() => {
                    setActiveArticle(post);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group flex flex-col justify-between cursor-pointer rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-foreground/30 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-foreground/80 leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span>{post.author.avatar}</span>
                      <span className="text-[11px] font-medium">{post.author.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:translate-x-0.5 transition-transform">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Page>
  );
}
