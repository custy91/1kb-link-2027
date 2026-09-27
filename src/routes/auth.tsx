import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/Chrome";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Log in — 1kb.link" }, { name: "description", content: "Preview the email code sign-in experience for 1kb.link." },
    { property: "og:title", content: "Log in — 1kb.link" }, { property: "og:description", content: "Preview 1kb.link's email code sign-in experience." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: AuthPage,
});

function AuthPage() {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  return <Page><section className="edge py-20"><div className="mx-auto max-w-md">
    <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-secondary"><Mail size={22}/></div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">Your space on 1kb.link</p>
    <h1 className="mt-3 text-4xl font-medium">{step === "email" ? "Welcome back." : step === "code" ? "Check your inbox." : "You're all set."}</h1>
    <p className="mt-4 leading-7 text-muted-foreground">{step === "email" ? "Enter your email to continue. No password to remember." : step === "code" ? `Enter the 6-digit code for ${email}.` : "This is a preview of the sign-in flow."}</p>
    {step === "email" && <form className="mt-10 space-y-4" onSubmit={(e) => { e.preventDefault(); if (!z.string().email().safeParse(email.trim()).success || email.length > 255) return setError("Enter a valid email address."); setError(""); setStep("code"); }}><label className="block text-sm font-medium" htmlFor="email">Email address</label><input id="email" type="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-full border border-border bg-muted px-5 outline-none focus:ring-2 focus:ring-ring"/><Button className="h-12 w-full rounded-full">Continue with email</Button></form>}
    {step === "code" && <form className="mt-10 space-y-4" onSubmit={(e) => {e.preventDefault(); if (!/^\d{6}$/.test(code)) return setError("Enter all 6 digits."); setError(""); setStep("done");}}><label className="block text-sm font-medium" htmlFor="code">6-digit code</label><input id="code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0,6))} placeholder="000000" className="h-14 w-full rounded-full border border-border bg-muted px-5 text-center text-2xl tracking-widest outline-none focus:ring-2 focus:ring-ring"/><Button className="h-12 w-full rounded-full">Verify code</Button><Button variant="ghost" type="button" onClick={() => {setStep("email"); setCode("");}} className="gap-2"><ArrowLeft size={16}/> Change email</Button></form>}
    {step === "done" && <Button asChild className="mt-10 rounded-full"><a href="/dashboard">Explore dashboard</a></Button>}
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    <p className="mt-8 border-t border-border pt-6 text-xs leading-6 text-muted-foreground">UI preview only — no email or code is sent, and entering a code does not sign you in. The dashboard is open without an account.</p>
  </div></section></Page>;
}
