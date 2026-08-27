import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <AppShell active="/register"><div className="mx-auto max-w-3xl py-8"><div className="mb-8 text-center"><p className="font-mono text-xs uppercase tracking-[0.22em] text-lime-signal">Begin the loop</p><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">Start with one question. Build a system that remembers what you learn and helps you decide what to explore next.</p></div><AuthForm mode="register" /></div></AppShell>;
}
