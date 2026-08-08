"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageCircle, BookOpen, Brain, BarChart3, Target, Settings, Menu, X, Zap } from "lucide-react";

const navigation = [
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Study", href: "/study", icon: BookOpen },
  { name: "Quiz", href: "/quiz", icon: Brain },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (<>
    <button onClick={()=>setMobileOpen(!mobileOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-jarvis-surface border border-jarvis-border">{mobileOpen?<X className="w-5 h-5 text-jarvis-text"/>:<Menu className="w-5 h-5 text-jarvis-text"/>}</button>
    {mobileOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={()=>setMobileOpen(false)}/>}
    <aside className={cn("fixed top-0 left-0 z-40 h-full w-64 bg-jarvis-surface border-r border-jarvis-border","transform transition-transform duration-300 ease-in-out","lg:translate-x-0",mobileOpen?"translate-x-0":"-translate-x-full")}>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-jarvis-border"><div className="relative"><div className="w-10 h-10 rounded-full orb-glow flex items-center justify-center bg-gradient-to-br from-jarvis-primary/20 to-jarvis-accent/20"><Zap className="w-5 h-5 text-jarvis-primary"/></div></div><div><h1 className="text-gradient font-bold text-lg">JARVIS</h1><p className="text-xs text-jarvis-text-muted">Study Assistant</p></div></div>
      <nav className="px-3 py-4 space-y-1">
        {navigation.map(item=>{const active=pathname.startsWith(item.href);return(<Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",active?"bg-jarvis-primary/10 text-jarvis-primary":"text-jarvis-text-muted hover:text-jarvis-text hover:bg-jarvis-card")}><item.icon className={cn("w-5 h-5",active?"text-jarvis-primary":"")}/>{item.name}</Link>)})}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-jarvis-border"><div className="text-xs text-jarvis-text-dim text-center">CBSE Class 10 • 2025-2026</div></div>
    </aside>
  </>);
}