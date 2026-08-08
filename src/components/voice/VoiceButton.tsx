"use client";
import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps { isListening: boolean; onToggle: () => void; onResult: (transcript: string) => void; mode: "study"|"casual" }

export function VoiceButton({ isListening, onToggle, onResult, mode }: VoiceButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { return false; }
    const rec = new SR(); rec.continuous=false; rec.interimResults=false; rec.lang="en-IN";
    rec.onresult = (e:any)=>onResult(e.results[0][0].transcript);
    rec.onerror=()=>setIsProcessing(false); rec.onend=()=>setIsProcessing(false);
    recognitionRef.current=rec; rec.start(); return true;
  },[onResult]);

  const handleToggle = useCallback(()=>{
    if(isListening){if(recognitionRef.current)recognitionRef.current.stop();onToggle();}
    else{setIsProcessing(true);startRecognition();setIsProcessing(false);onToggle();}
  },[isListening,onToggle,startRecognition]);

  return (<button onClick={handleToggle} disabled={isProcessing} className={cn("relative p-3 rounded-xl transition-all duration-300 bg-jarvis-surface border border-jarvis-border",isListening&&"voice-btn-active border-jarvis-primary","hover:border-jarvis-primary/50 disabled:opacity-50")} title={isListening?"Stop":"Voice"}>
    {isProcessing?<Loader2 className="w-5 h-5 text-jarvis-warning animate-spin"/>:isListening?<MicOff className="w-5 h-5 text-jarvis-primary"/>:<Mic className="w-5 h-5 text-jarvis-text-muted"/>}
    {isListening&&<div className="absolute -inset-1 rounded-2xl border-2 border-jarvis-primary/50 animate-voice-pulse"/>}
  </button>);
}