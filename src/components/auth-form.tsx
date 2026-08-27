"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, Kicker } from "@/components/ui/panel";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Unable to complete request.");
      setStatus("success");
      setMessage(isRegister ? "Account created. Your research workspace is ready." : "You are signed in. Welcome back to the lab.");
      window.setTimeout(() => { window.location.href = "/"; }, 700);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to complete request.");
    }
  }

  return (
    <Panel className="mx-auto w-full max-w-md p-6 sm:p-8">
      <Kicker>{isRegister ? "Create identity" : "Research identity"}</Kicker>
      <h1 className="mt-3 text-2xl font-semibold text-white">{isRegister ? "Start your AGI OS workspace" : "Return to your workspace"}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-400">{isRegister ? "Save experiments, compare ideas, and build a personal intelligence system over time." : "Continue your research across the AGI OS command surface."}</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm text-slate-300">Email
          <span className="relative mt-2 block"><Mail className="pointer-events-none absolute left-3 top-3 size-4 text-slate-500" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 w-full rounded-md border border-white/10 bg-slate-950 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-signal/70" placeholder="you@example.com" /></span>
        </label>
        <label className="block text-sm text-slate-300">Password
          <span className="relative mt-2 block"><LockKeyhole className="pointer-events-none absolute left-3 top-3 size-4 text-slate-500" /><input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-md border border-white/10 bg-slate-950 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-signal/70" placeholder="At least 8 characters" /></span>
        </label>
        {message && <div className={`rounded-md border p-3 text-sm ${status === "error" ? "border-rose-signal/30 bg-rose-signal/10 text-rose-100" : "border-lime-signal/30 bg-lime-signal/10 text-lime-100"}`} role="status">{status === "success" && <CheckCircle2 className="mr-2 inline size-4" />}{message}</div>}
        <Button type="submit" className="w-full" disabled={status === "loading"}>{status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}{isRegister ? "Create account" : "Sign in"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">{isRegister ? "Already have an account?" : "New to AGI OS?"} <Link className="text-cyan-signal hover:underline" href={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create one"}</Link></p>
    </Panel>
  );
}
