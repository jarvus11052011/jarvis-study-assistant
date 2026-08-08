"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) toast.error("Invalid email or password");
      else { toast.success("Welcome back!"); router.push("/chat"); router.refresh(); }
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-jarvis-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 rounded-full orb-glow bg-gradient-to-br from-jarvis-primary/20 to-jarvis-accent/20 mb-4"><Zap className="w-8 h-8 text-jarvis-primary" /></div><h1 className="text-2xl font-bold text-gradient">JARVIS</h1><p className="text-sm text-jarvis-text-muted mt-1">Personal AI Study Assistant</p></div>
        <div className="card-glow p-6">
          <h2 className="text-lg font-semibold text-jarvis-text mb-6">Welcome back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jarvis-text-dim" /><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" required /></div></div>
            <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jarvis-text-dim" /><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-10 pr-10" required /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-jarvis-text-dim hover:text-jarvis-text">{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">{loading?<><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>Signing in...</>:<>Sign In<ArrowRight className="w-4 h-4"/></>}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-sm text-jarvis-text-muted">Don&apos;t have an account? <Link href="/register" className="text-jarvis-primary hover:underline font-medium">Create one</Link></p></div>
        </div>
        <p className="text-center text-xs text-jarvis-text-dim mt-6">CBSE Class 10 • 2025-2026</p>
      </div>
    </div>
  );
}
