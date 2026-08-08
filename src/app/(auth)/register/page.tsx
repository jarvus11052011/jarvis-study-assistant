"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (res.ok) { toast.success("Account created! Please sign in."); router.push("/login"); }
      else toast.error(data.error || "Registration failed");
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-jarvis-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 rounded-full orb-glow bg-gradient-to-br from-jarvis-primary/20 to-jarvis-accent/20 mb-4"><Zap className="w-8 h-8 text-jarvis-primary" /></div><h1 className="text-2xl font-bold text-gradient">JARVIS</h1><p className="text-sm text-jarvis-text-muted mt-1">Create your study assistant</p></div>
        <div className="card-glow p-6">
          <h2 className="text-lg font-semibold text-jarvis-text mb-6">Get Started</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jarvis-text-dim" /><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="input-field pl-10" required minLength={2} /></div></div>
            <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jarvis-text-dim" /><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" required /></div></div>
            <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jarvis-text-dim" /><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 8 characters" className="input-field pl-10 pr-10" required minLength={8} /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-jarvis-text-dim hover:text-jarvis-text">{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">{loading?<><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>Creating...</>:<>Create Account<ArrowRight className="w-4 h-4"/></>}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-sm text-jarvis-text-muted">Already have an account? <Link href="/login" className="text-jarvis-primary hover:underline font-medium">Sign in</Link></p></div>
        </div>
        <p className="text-center text-xs text-jarvis-text-dim mt-6">CBSE Class 10 • 2025-2026</p>
      </div>
    </div>
  );
}
