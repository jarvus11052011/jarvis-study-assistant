"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatBubble } from "./ChatBubble";
import { VoiceButton } from "../voice/VoiceButton";

interface Message { id: string; role: "user"|"assistant"; content: string }
interface ChatInterfaceProps { mode: "study"|"casual"; onModeToggle: () => void }

export function ChatInterface({ mode, onModeToggle }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([{ id: "welcome", role: "assistant", content: mode==="study"?"Hello Sangeeta! I'm JARVIS, your personal study assistant. What would you like to study today?":"Hello Sangeeta! I'm JARVIS. How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]); setInput(""); setIsLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userMessage.content, mode }) });
      const data = await res.json();
      if (data.success) setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: "assistant", content: data.data.message }]);
    } catch {}
    finally { setIsLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleVoiceResult = (transcript: string) => { if (transcript.trim()) setInput(transcript); };

  return (<div className="flex flex-col h-full">
    <div className="flex items-center justify-between px-4 py-3 border-b border-jarvis-border">
      <button onClick={onModeToggle} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",mode==="study"?"bg-jarvis-primary/10 text-jarvis-primary":"bg-jarvis-accent/10 text-jarvis-accent")}><Sparkles className="w-3 h-3"/>{mode==="study"?"Study Mode":"Casual Mode"}</button>
      <div className="flex items-center gap-2"><div className={cn("w-2 h-2 rounded-full",isLoading?"bg-jarvis-warning animate-pulse":"bg-jarvis-success")}/><span className="text-xs text-jarvis-text-muted">{isLoading?"Thinking...":"Ready"}</span></div>
    </div>
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map(msg=><ChatBubble key={msg.id} message={msg}/>)}
      {isLoading && <div className="flex items-center gap-2 px-4 py-3 animate-fade-in"><div className="w-8 h-8 rounded-full bg-jarvis-primary/10 flex items-center justify-center"><Zap className="w-4 h-4 text-jarvis-primary"/></div><div className="thinking-dots flex gap-1.5"><span className="w-2 h-2 rounded-full bg-jarvis-primary/60"/><span className="w-2 h-2 rounded-full bg-jarvis-primary/60"/><span className="w-2 h-2 rounded-full bg-jarvis-primary/60"/></div></div>}
      <div ref={messagesEndRef}/>
    </div>
    <div className="border-t border-jarvis-border p-4">
      <div className="flex items-end gap-3">
        <VoiceButton isListening={isListening} onToggle={()=>setIsListening(!isListening)} onResult={handleVoiceResult} mode={mode}/>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={mode==="study"?"Ask me anything about your studies...":"Type a message..."} rows={1} className="input-field resize-none max-h-32" disabled={isLoading}/>
        <button onClick={handleSend} disabled={!input.trim()||isLoading} className="btn-primary p-3 rounded-xl !px-3"><Send className="w-5 h-5"/></button>
      </div>
    </div>
  </div>);
}