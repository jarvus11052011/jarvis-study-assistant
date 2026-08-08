"use client";
import { useState } from "react";
import { Play, CheckCircle2, BookOpen, Pencil } from "lucide-react";
import { cn, getSubjectLabel, getSubjectEmoji } from "@/lib/utils";

interface StudyTimerProps { onSessionStart?: () => void; onSessionEnd?: (sessionId: string) => void }

export function StudyTimer({ onSessionStart, onSessionEnd }: StudyTimerProps) {
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string|null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout|null>(null);
  const subjects = ["mathematics","science","socialScience","english","hindi"];

  const startSession = async () => {
    if (!subject) return;
    const res = await fetch("/api/sessions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject,chapter:chapter||undefined})});
    const data = await res.json();
    if (data.success) { setSessionId(data.data.id); setIsActive(true); setElapsed(0); const iv = setInterval(()=>setElapsed(p=>p+1),1000); setTimerInterval(iv); onSessionStart?.(); }
  };
  const endSession = async () => {
    if (!sessionId) return; if (timerInterval) clearInterval(timerInterval);
    await fetch("/api/sessions",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId,notes:notes||undefined})});
    setIsActive(false); setSessionId(null); setNotes(""); onSessionEnd?.(sessionId);
  };
  const formatElapsed = (s: number) => { const h=Math.floor(s/3600); const m=Math.floor((s%3600)/60); const sec=s%60; return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`; };

  return (<div className="card-glow p-6"><h2 className="text-lg font-semibold text-jarvis-text mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-jarvis-primary"/>Study Session</h2>
    {!isActive ? (<div className="space-y-4">
      <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Subject</label><div className="grid grid-cols-3 sm:grid-cols-5 gap-2">{subjects.map(s=><button key={s} onClick={()=>setSubject(s)} className={cn("p-2 rounded-xl text-xs font-medium transition-all border",subject===s?"bg-jarvis-primary/10 border-jarvis-primary/50 text-jarvis-primary":"bg-jarvis-surface border-jarvis-border text-jarvis-text-muted")}><span className="block text-center text-lg mb-0.5">{getSubjectEmoji(s)}</span>{getSubjectLabel(s)}</button>)}</div></div>
      <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Chapter/Topic</label><input type="text" value={chapter} onChange={e=>setChapter(e.target.value)} placeholder="e.g., Quadratic Equations" className="input-field"/></div>
      <button onClick={startSession} disabled={!subject} className="btn-primary w-full flex items-center justify-center gap-2"><Play className="w-4 h-4"/>Start Studying</button>
    </div>) : (<div className="space-y-4">
      <div className="text-center py-6"><div className="text-4xl font-mono font-bold text-jarvis-primary mb-2 tracking-wider">{formatElapsed(elapsed)}</div><p className="text-sm text-jarvis-text-muted">Studying {getSubjectLabel(subject)}{chapter&&` – ${chapter}`}</p></div>
      <div><label className="text-xs text-jarvis-text-muted mb-1.5 flex items-center gap-1"><Pencil className="w-3 h-3"/>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What did you learn?" rows={3} className="input-field resize-none"/></div>
      <button onClick={endSession} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all font-medium"><CheckCircle2 className="w-4 h-4"/>End Session & Save</button>
    </div>)}
  </div>);
}