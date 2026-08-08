"use client";
import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { LayoutDashboard, MessageCircle } from "lucide-react";

export default function ChatPage() {
  const [mode, setMode] = useState<"study"|"casual">("study");
  const [showDashboard, setShowDashboard] = useState(false);
  return (<div className="max-w-4xl mx-auto h-[calc(100vh-8rem)]"><div className="flex items-center gap-2 mb-4"><button onClick={()=>setShowDashboard(!showDashboard)} className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-3">{showDashboard?<><MessageCircle className="w-3.5 h-3.5"/>Chat</>:<><LayoutDashboard className="w-3.5 h-3.5"/>Dashboard</>}</button></div>{showDashboard?<div className="overflow-y-auto h-full"><DashboardOverview /></div>:<div className="card-glow h-full overflow-hidden flex flex-col"><ChatInterface mode={mode} onModeToggle={()=>setMode(mode==="study"?"casual":"study")} /></div>}</div>);
}
