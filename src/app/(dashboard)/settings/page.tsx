"use client";
import { useEffect, useState } from "react";
import { Settings, Save, Volume2, Brain, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [prefs, setPrefs] = useState({ dailyStudyTarget: 4, voiceEnabled: true, voiceSpeed: 1.0, theme: "dark", aiMode: "study", aiTemperature: 0.7 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/user").then(r=>r.json()).then(d=>{ if(d.success) setPrefs({ dailyStudyTarget: d.data.dailyStudyTarget, voiceEnabled: d.data.voiceEnabled, voiceSpeed: d.data.voiceSpeed, theme: d.data.theme, aiMode: d.data.aiMode, aiTemperature: d.data.aiTemperature }); setLoading(false); }); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(prefs) });
      const data = await res.json();
      if (data.success) toast.success("Settings saved!"); else toast.error("Failed");
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  if (loading) return (<div className="max-w-2xl mx-auto"><div className="animate-pulse space-y-4">{[1,2,3,4].map(i=><div key={i} className="h-20 bg-jarvis-card rounded-xl"/>)}</div></div>);

  return (<div className="max-w-2xl mx-auto space-y-6">
    <h1 className="text-xl font-bold text-jarvis-text flex items-center gap-2"><Settings className="w-6 h-6 text-jarvis-primary"/>Settings</h1>
    <div className="card-glow p-6 space-y-4">
      <h2 className="text-sm font-semibold flex items-center gap-2"><Brain className="w-4 h-4 text-jarvis-primary"/>Study</h2>
      <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Daily Target (hours)</label><input type="range" min="1" max="12" value={prefs.dailyStudyTarget} onChange={e=>setPrefs({...prefs,dailyStudyTarget:Number(e.target.value)})} className="w-full accent-jarvis-primary"/><div className="flex justify-between text-xs text-jarvis-text-dim"><span>1h</span><span className="text-jarvis-primary">{prefs.dailyStudyTarget}h</span><span>12h</span></div></div>
      <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">AI Mode</label><div className="flex gap-2"><button onClick={()=>setPrefs({...prefs,aiMode:"study"})} className={cn("flex-1 p-3 rounded-xl text-sm border transition-all",prefs.aiMode==="study"?"bg-jarvis-primary/10 border-jarvis-primary/50 text-jarvis-primary":"bg-jarvis-surface border-jarvis-border text-jarvis-text-muted")}>📚 Study</button><button onClick={()=>setPrefs({...prefs,aiMode:"casual"})} className={cn("flex-1 p-3 rounded-xl text-sm border transition-all",prefs.aiMode==="casual"?"bg-jarvis-accent/10 border-jarvis-accent/50 text-jarvis-accent":"bg-jarvis-surface border-jarvis-border text-jarvis-text-muted")}>💬 Casual</button></div></div>
    </div>
    <div className="card-glow p-6 space-y-4">
      <h2 className="text-sm font-semibold flex items-center gap-2"><Volume2 className="w-4 h-4 text-jarvis-primary"/>Voice</h2>
      <div className="flex items-center justify-between"><div><p className="text-sm">Voice Input</p><p className="text-xs text-jarvis-text-dim">Enable mic for voice chat</p></div><button onClick={()=>setPrefs({...prefs,voiceEnabled:!prefs.voiceEnabled})} className={cn("p-2 rounded-xl border",prefs.voiceEnabled?"bg-jarvis-primary/10 border-jarvis-primary/50 text-jarvis-primary":"bg-jarvis-surface border-jarvis-border text-jarvis-text-dim")}>{prefs.voiceEnabled?<Mic className="w-5 h-5"/>:<MicOff className="w-5 h-5"/>}</button></div>
      <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Speed: {prefs.voiceSpeed}x</label><input type="range" min="0.5" max="2.0" step="0.1" value={prefs.voiceSpeed} onChange={e=>setPrefs({...prefs,voiceSpeed:Number(e.target.value)})} className="w-full accent-jarvis-primary"/></div>
    </div>
    <button onClick={save} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">{saving?<>Saving...</>:<><Save className="w-4 h-4"/>Save Settings</>}</button>
  </div>);
}
