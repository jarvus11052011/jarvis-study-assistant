"use client";
import { useEffect, useState } from "react";
import { Zap, Clock, Brain, Flame } from "lucide-react";
import { formatDuration, getMotivationalMessage, getSubjectLabel, getSubjectEmoji } from "@/lib/utils";

interface ProgressData { totalStudyHours: number; totalQuizzes: number; averageQuizScore: number; studyStreak: number; longestStreak: number; subjectProgress: Record<string,{completed:number;total:number;strongTopics:string[];weakTopics:string[]}> }

function StatCard({ icon, label, value, subtext, color }:{icon:React.ReactNode;label:string;value:string|number;subtext?:string;color?:string}) {
  return (<div className="card-glow p-4 flex items-center gap-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:`${color}15`}}><div style={{color:color||"#00d4ff"}}>{icon}</div></div><div><p className="text-xs text-jarvis-text-muted">{label}</p><p className="text-xl font-bold text-jarvis-text">{value}</p>{subtext&&<p className="text-xs text-jarvis-text-dim">{subtext}</p>}</div></div>);
}

export function DashboardOverview() {
  const [progress, setProgress] = useState<ProgressData|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/progress").then(r=>r.json()).then(d=>{if(d.success)setProgress(d.data);setLoading(false);}); }, []);
  if (loading) return (<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-jarvis-primary border-t-transparent"/></div>);
  if (!progress) return (<div className="text-center py-12"><Zap className="w-12 h-12 text-jarvis-text-dim mx-auto mb-3"/><p className="text-jarvis-text-muted">Start studying to see progress!</p></div>);
  const sc: Record<string,string> = {mathematics:"#00d4ff",science:"#10b981",socialScience:"#f59e0b",english:"#7c3aed",hindi:"#ef4444"};
  return (<div className="space-y-6">
    <div className="card-glow p-4 border-jarvis-primary/20"><p className="text-sm text-jarvis-text-muted">{getMotivationalMessage(progress.studyStreak)}</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <StatCard icon={<Clock className="w-5 h-5"/>} label="Study Hours" value={formatDuration(Math.round(progress.totalStudyHours*60))} color="#00d4ff"/>
      <StatCard icon={<Brain className="w-5 h-5"/>} label="Quizzes" value={progress.totalQuizzes} subtext={progress.totalQuizzes>0?`${progress.averageQuizScore}% avg`:undefined} color="#10b981"/>
      <StatCard icon={<Flame className="w-5 h-5"/>} label="Streak" value={`${progress.studyStreak} days`} subtext={`Best: ${progress.longestStreak} days`} color="#f59e0b"/>
    </div>
    <div><h3 className="text-sm font-semibold text-jarvis-text mb-3">Subject Progress</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(progress.subjectProgress).map(([subject,data])=>{const pct=data.total>0?Math.round((data.completed/data.total)*100):0;const color=sc[subject]||"#00d4ff";return(<div key={subject} className="card-glow p-4" style={{borderColor:`${color}20`}}><div className="flex items-center justify-between mb-3"><span className="text-sm font-medium">{getSubjectLabel(subject)}</span><span className="text-sm font-bold" style={{color}}>{pct}%</span></div><div className="w-full h-2 bg-jarvis-bg rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{width:`${pct}%`,backgroundColor:color,boxShadow:`0 0 10px ${color}40`}}/></div></div>)})}
      </div>
    </div>
  </div>);
}