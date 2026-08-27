"use client";

import { FormEvent, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export function FeedbackForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Unable to send feedback.");
      setStatus("sent");
      setMessage("Thank you. Your signal has been added to the product research queue.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send feedback.");
    }
  }
  return <Panel><form onSubmit={submit} className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-300">Signal type<select name="category" className="mt-2 h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-signal/70"><option>Product</option><option>Research</option><option>Bug</option><option>Idea</option></select></label><label className="text-sm text-slate-300">Experience rating<select name="rating" defaultValue="5" className="mt-2 h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-signal/70"><option value="5">5 · Excellent</option><option value="4">4 · Strong</option><option value="3">3 · Mixed</option><option value="2">2 · Friction</option><option value="1">1 · Blocked</option></select></label></div>
    <label className="block text-sm text-slate-300">What should we learn from your experience?<textarea required minLength={10} name="message" className="mt-2 min-h-36 w-full rounded-md border border-white/10 bg-slate-950 p-3 text-sm leading-6 text-white outline-none focus:border-cyan-signal/70" placeholder="Tell us what helped, confused, or slowed you down." /></label>
    <label className="block text-sm text-slate-300">Contact email <span className="text-slate-500">(optional)</span><input name="email" type="email" className="mt-2 h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-signal/70" placeholder="you@example.com" /></label>
    {message && <p className={`text-sm ${status === "error" ? "text-rose-200" : "text-lime-200"}`} role="status">{status === "sent" && <Check className="mr-2 inline size-4" />}{message}</p>}
    <Button type="submit" disabled={status === "loading"}>{status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Send feedback</Button>
  </form></Panel>;
}
