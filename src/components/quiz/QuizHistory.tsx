"use client";
import { useEffect, useState } from "react";
import { Award, AlertTriangle } from "lucide-react";
import { formatDate, getSubjectLabel, getSubjectEmoji, getSubjectColor } from "@/lib/utils";

export function QuizHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/quiz").then(r=>r.json()).then(d=>{if(d.success)setHistory(d.data);setLoading(false);}); }, []);

  if(loading)return(<div className="card-glow p-6"><div className="animate-pulse space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 bg-jarvis-surface rounded-xl"/>)}</div></div>);
  if(!history.length)return(<div className="card-glow p-6 text-center"><Award className="w-10 h-10 text-jarvis-text-dim mx-auto mb-3"/><p className="text-sm text-jarvis-text-muted">No quizzes yet. Take your first quiz!</p></div>);

  return (<div className="space-y-6">
    <div className="card-glow p-6"><h3 className="text-sm font-semibold mb-3">Subject Performance</h3><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {(()=>{const ss:Record<string,{t:number;c:number}>={};history.forEach(q=>{if(!ss[q.subject])ss[q.subject]={t:0,c:0};ss[q.subject].t+=q.score;ss[q.subject].c++;});return Object.entries(ss).map(([s,d])=>{const avg=Math.round(d.t/d.c);const color=getSubjectColor(s);return(<div key={s} className="p-3 rounded-xl bg-jarvis-surface text-center"><span className="text-2xl">{getSubjectEmoji(s)}</span><p className="text-xl font-bold" style={{color}}>{avg}%</p><p className="text-xs text-jarvis-text-muted">{getSubjectLabel(s)}</p></div>)})})()}
    </div></div>
    <div className="card-glow p-6"><h3 className="text-sm font-semibold mb-3">Recent Quizzes</h3><div className="space-y-2">
      {history.map(q=>(<div key={q.id} className="flex items-center gap-3 p-3 rounded-xl bg-jarvis-surface"><span className="text-xl">{getSubjectEmoji(q.subject)}</span><div className="flex-1"><div className="flex items-center justify-between"><p className="text-sm font-medium">{getSubjectLabel(q.subject)}{q.chapter&&` – ${q.chapter}`}</p><span className={`text-sm font-bold ${q.score>=80?"text-green-400":q.score>=60?"text-yellow-400":"text-red-400"}`}>{q.score}%</span></div><div className="flex items-center gap-3 text-xs text-jarvis-text-dim mt-0.5"><span>{q.correctAnswers}/{q.totalQuestions}</span><span>{formatDate(q.takenAt)}</span>{q.weakTopics?.length>0&&<span className="flex items-center gap-1 text-yellow-400"><AlertTriangle className="w-3 h-3"/>{q.weakTopics.length}</span>}</div></div></div>))}
    </div></div>
  </div>);
}