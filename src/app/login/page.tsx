import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return <AppShell active="/login"><div className="mx-auto max-w-3xl py-8"><div className="mb-8 text-center"><p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-signal">Identity layer</p><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">Your account anchors research notes, experiments, personal intelligence, and future agent memory to one workspace.</p></div><AuthForm mode="login" /></div></AppShell>;
}
