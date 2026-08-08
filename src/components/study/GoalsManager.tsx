"use client";
import { useEffect, useState } from "react";
import { Target, Plus, Trash2, Clock, Star, Circle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const GOAL_TYPES = [{v:"board_percentage",l:"Board Percentage"},{v:"syllabus_completion",l:"Syllabus"},{v:"daily_hours",l:"Daily Hours"},{v:"exam_prep",l:"Exam Prep"},{v:"custom",l:"Custom"}];
const getIcon = (t:string) => t==="board_percentage"?<Star className="w-4 h-4"/>:t==="daily_hours"?<Clock className="w-4 h-4"/>:t==="exam_prep"||t==="syllabus_completion"?<Target className="w-4 h-4"/>:<Circle className="w-4 h-4"/>;
const getPColor = (p:string) => p==="high"?"text-red-400 border-red-500/30 bg-red-500/10":p==="medium"?"text-yellow-400 border-yellow-500/30 bg-yellow-500/10":"text-green-400 border-green-500/30 bg-green-500/10";

export function GoalsManager() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({title:"",type:"custom",target:"",unit:"%",deadline:"",priority:"medium"});

  const fetchGoals = async () => { const res=await fetch("/api/goals?status=active"); const d=await res.json(); if(d.success)setGoals(d.data); setLoading(false); };
  useEffect(()=>{fetchGoals();},[]);

  const createGoal = async () => {
    if(!newGoal.title)return;
    const res=await fetch("/api/goals",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:newGoal.title,type:newGoal.type,target:newGoal.target?Number(newGoal.target):undefined,unit:newGoal.unit,deadline:newGoal.deadline||undefined,priority:newGoal.priority})});
    const d=await res.json(); if(d.success){setGoals(p=>[...p,d.data]);setShowForm(false);setNewGoal({title:"",type:"custom",target:"",unit:"%",deadline:"",priority:"medium"});}
  };

  const deleteGoal = async (id:string) => { await fetch(`/api/goals?id=${id}`,{method:"DELETE"}); setGoals(p=>p.filter(g=>g.id!==id)); };

  return (<div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-jarvis-text flex items-center gap-2"><Target className="w-5 h-5 text-jarvis-primary"/>Goals</h2><button onClick={()=>setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-1.5"><Plus className="w-4 h-4"/>New Goal</button></div>
    {showForm && (<div className="card-glow p-6 animate-slide-up space-y-4">
      <input type="text" value={newGoal.title} onChange={e=>setNewGoal({...newGoal,title:e.target.value})} placeholder="Goal title..." className="input-field"/>
      <select value={newGoal.type} onChange={e=>setNewGoal({...newGoal,type:e.target.value})} className="input-field">{GOAL_TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select>
      <div className="grid grid-cols-2 gap-3"><input type="number" value={newGoal.target} onChange={e=>setNewGoal({...newGoal,target:e.target.value})} placeholder="Target" className="input-field"/><select value={newGoal.unit} onChange={e=>setNewGoal({...newGoal,unit:e.target.value})} className="input-field"><option value="%">%</option><option value="hours">Hours</option><option value="chapters">Chapters</option></select></div>
      <div className="grid grid-cols-2 gap-3"><input type="date" value={newGoal.deadline} onChange={e=>setNewGoal({...newGoal,deadline:e.target.value})} className="input-field"/><select value={newGoal.priority} onChange={e=>setNewGoal({...newGoal,priority:e.target.value})} className="input-field"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
      <div className="flex gap-2"><button onClick={createGoal} className="btn-primary flex-1 text-sm">Create</button><button onClick={()=>setShowForm(false)} className="btn-secondary text-sm">Cancel</button></div>
    </div>)}
    {loading?<div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 bg-jarvis-card rounded-xl animate-pulse"/>)}</div>
    :goals.length===0?<div className="card-glow p-8 text-center"><Target className="w-10 h-10 text-jarvis-text-dim mx-auto mb-3"/><p className="text-sm text-jarvis-text-muted">No active goals. Set your first goal!</p></div>
    :<div className="space-y-3">{goals.map(g=>{const pct=g.target>0?Math.min(100,Math.round((g.current/g.target)*100)):0;return(<div key={g.id} className="card-glow p-4 group"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-2"><span className={cn("p-1 rounded-lg",getPColor(g.priority))}>{getIcon(g.type)}</span><div><h4 className="text-sm font-medium">{g.title}</h4></div></div><button onClick={()=>deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-jarvis-text-dim hover:text-red-400 transition-all"><Trash2 className="w-4 h-4"/></button></div>
      <div className="space-y-1"><div className="flex justify-between text-xs"><span className="text-jarvis-text-muted">{g.current}/{g.target} {g.unit}</span><span className="text-jarvis-primary font-medium">{pct}%</span></div><div className="w-full h-2 bg-jarvis-bg rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-jarvis-primary to-jarvis-accent" style={{width:`${pct}%`,boxShadow:"0 0 10px rgba(0,212,255,0.3)"}}/></div>{g.deadline&&<p className="text-xs text-jarvis-text-dim mt-1">Deadline: {formatDate(g.deadline)}</p>}</div>
    </div>)})}</div>}
  </div>);
}