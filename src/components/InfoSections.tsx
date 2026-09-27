import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

type Item = { title: string; body: string };
export function InfoSections({ heading, intro, benefits, steps, faqs }: { heading: string; intro: string; benefits: Item[]; steps: Item[]; faqs: Item[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.body,
      },
    })),
  };

  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <section className="edge mt-24 border-t border-border pt-16">
      <p className="text-xs font-semibold uppercase text-muted-foreground">Why 1kb.link</p>
      <h2 className="mt-3 max-w-[20ch] text-3xl font-medium sm:text-4xl">{heading}</h2>
      <p className="mt-5 max-w-[60ch] text-muted-foreground">{intro}</p>
      <div className="mt-12 grid gap-8 sm:grid-cols-3">{benefits.map((item, i) => <div key={item.title} className="border-t border-border pt-5"><span className="text-xs text-muted-foreground">0{i + 1} / BENEFIT</span><h3 className="mt-5 text-lg font-medium">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p></div>)}</div>
    </section>
    <section className="edge mt-24 bg-muted py-16">
      <p className="text-xs font-semibold uppercase text-muted-foreground">The process</p><h2 className="mt-3 text-3xl font-medium">How it works</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-3">{steps.map((item, i) => <div key={item.title}><span className="text-4xl font-medium text-muted-foreground">0{i + 1}</span><h3 className="mt-5 font-medium">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p></div>)}</div>
    </section>
    <section className="edge mt-24"><p className="text-xs font-semibold uppercase text-muted-foreground">Good to know</p><h2 className="mt-3 text-3xl font-medium">Frequently asked questions</h2><div className="mt-8 border-t border-border">{faqs.map((item) => <details key={item.title} className="group border-b border-border py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">{item.title}<span className="text-xl font-normal text-muted-foreground group-open:rotate-45">+</span></summary><p className="max-w-[65ch] pt-3 text-sm leading-7 text-muted-foreground">{item.body}</p></details>)}</div></section>
    <section className="edge mt-24 border-t border-border pt-12"><div className="flex flex-wrap items-center justify-between gap-5"><div><h2 className="text-2xl font-medium">See the bigger picture.</h2><p className="mt-2 text-muted-foreground">Explore your links and activity in one place.</p></div><Link to="/dashboard" className="inline-flex items-center gap-2 border-b border-foreground pb-1 font-medium">Explore dashboard <ArrowUpRight size={17}/></Link></div></section>
  </>;
}
