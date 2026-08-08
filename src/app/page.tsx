import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Zap, BookOpen, Brain, MessageCircle, Mic, BarChart3 } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/chat");

  const features = [
    { icon: <MessageCircle className="w-5 h-5"/>, title: "AI Chat Tutor", desc: "Get instant help with any CBSE subject", color: "#00d4ff" },
    { icon: <Mic className="w-5 h-5"/>, title: "Voice Conversation", desc: "Talk naturally with JARVIS", color: "#7c3aed" },
    { icon: <Brain className="w-5 h-5"/>, title: "Smart Quizzes", desc: "AI-generated quizzes tailored to you", color: "#10b981" },
    { icon: <BookOpen className="w-5 h-5"/>, title: "Study Sessions", desc: "Track every study session", color: "#f59e0b" },
    { icon: <BarChart3 className="w-5 h-5"/>, title: "Progress Tracking", desc: "Visualize your growth over time", color: "#ef4444" },
    { icon: <Zap className="w-5 h-5"/>, title: "Daily Planning", desc: "AI-powered daily study plans", color: "#00d4ff" },
  ];

  return (<div className="min-h-screen bg-jarvis-bg flex flex-col items-center justify-center p-4">
    <div className="text-center max-w-2xl">
      <div className="relative inline-block mb-8"><div className="w-24 h-24 rounded-full orb-glow flex items-center justify-center bg-gradient-to-br from-jarvis-primary/20 to-jarvis-accent/20 animate-pulse-glow"><Zap className="w-12 h-12 text-jarvis-primary"/></div><div className="absolute inset-0 rounded-full border border-jarvis-primary/20 animate-orb-rotate"/><div className="absolute -inset-4 rounded-full border border-jarvis-accent/10 animate-orb-rotate" style={{animationDuration:"12s",animationDirection:"reverse"}}/></div>
      <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">JARVIS</h1>
      <p className="text-lg text-jarvis-text-muted mb-2">Your Personal AI Study Assistant</p>
      <p className="text-sm text-jarvis-text-dim mb-8">Voice-enabled AI tutoring, progress tracking, and study planning for Class 10 CBSE</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center"><Link href="/register" className="btn-primary text-center">Get Started</Link><Link href="/login" className="btn-secondary text-center">Sign In</Link></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mt-16">{features.map((f,i)=>(<div key={i} className="card-glow p-5" style={{borderColor:`${f.color}20`}}><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{backgroundColor:`${f.color}15`}}><div style={{color:f.color}}>{f.icon}</div></div><h3 className="text-sm font-semibold text-jarvis-text mb-1">{f.title}</h3><p className="text-xs text-jarvis-text-dim">{f.desc}</p></div>))}</div>
    <p className="text-xs text-jarvis-text-dim mt-16">CBSE Class 10 • 2025-2026 • Made for Sangeeta</p>
  </div>);
}