"use client";
import { Zap, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ChatBubbleProps { message: { id: string; role: "user"|"assistant"; content: string } }

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  return (<div className={cn("flex gap-3 animate-slide-up",isUser?"flex-row-reverse":"")}>
    <div className={cn("w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",isUser?"bg-gradient-to-br from-jarvis-accent/30 to-jarvis-accent/10 border border-jarvis-accent/20":"bg-gradient-to-br from-jarvis-primary/20 to-jarvis-primary/5 border border-jarvis-primary/20")}>{isUser?<User className="w-4 h-4 text-jarvis-accent"/>:<Zap className="w-4 h-4 text-jarvis-primary"/>}</div>
    <div className={cn("max-w-[80%] rounded-2xl px-4 py-3",isUser?"bg-jarvis-accent/10 border border-jarvis-accent/20 rounded-tr-md":"bg-jarvis-surface border border-jarvis-border rounded-tl-md")}><div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"><ReactMarkdown>{message.content}</ReactMarkdown></div></div>
  </div>);
}