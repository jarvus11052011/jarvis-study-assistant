"use client";
import { useEffect, useState } from "react";
import { Clock, BookOpen } from "lucide-react";
import { formatDateTime, formatDuration, getSubjectLabel, getSubjectEmoji } from "@/lib/utils";

export function SessionHistory() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/sessions?limit=10").then(r=>r.json()).then(d=>{if(d.success)setSessions(d.data);setLoading(false);}); }, []);
  if (loading) return (<div className="card-glow p-6"><div className="animate-pulse space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 bg-jarvis-surface rounded-xl"/>)}</div></div>);
  return (<div className="card-glow p-6"><h2 className="text-lg font-semibold text-jarvis-text mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-jarvis-primary"/>Recent Sessions</h2>
    {sessions.length===0?<div className="text-center py-8"><BookOpen className="w-10 h-10 text-jarvis-text-dim mx-auto mb-3"/><p className="text-sm text-jarvis-text-muted">No study sessions yet. Start one!</p></div>
    :<div className="space-y-2">{sessions.map((s:any)=><div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-jarvis-surface hover:bg-jarvis-card transition-colors"><span className="text-xl">{getSubjectEmoji(s.subject)}</span><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-medium truncate">{getSubjectLabel(s.subject)}</p>{s.completed?<span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">Done</span>:<span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">Active</span>}</div><div className="flex items-center gap-3 text-xs text-jarvis-text-dim mt-0.5">{s.chapter&&<span>{s.chapter}</span>}{s.duration&&<span>{formatDuration(s.duration)}</span>}<span>{formatDateTime(s.startTime)}</span></div></div></div>)}</div>}
  </div>);
}