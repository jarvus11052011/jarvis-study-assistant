"use client";
import { useState } from "react";
import { Brain, ArrowRight, RotateCcw, Trophy, X } from "lucide-react";
import { cn, getSubjectLabel, getSubjectEmoji } from "@/lib/utils";

const SUBJECTS = ["mathematics","science","socialScience","english","hindi"];

export function QuizInterface() {
  const [step, setStep] = useState<"setup"|"quiz"|"results">("setup");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("medium");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if(!subject||!chapter)return; setLoading(true);
    const res=await fetch("/api/quiz",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject,chapter,difficulty})});
    const d=await res.json(); if(d.success){setQuestions(d.data.questions);setCurrentQ(0);setAnswers({});setStep("quiz");} setLoading(false);
  };

  const submit = async () => {
    setLoading(true);
    const fa=Object.entries(answers).map(([qId,ans])=>({questionId:qId,answer:ans}));
    const res=await fetch("/api/quiz",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject,chapter,answers:fa,questions})});
    const d=await res.json(); if(d.success){setResult(d.data);setStep("results");} setLoading(false);
  };

  const reset=()=>{setStep("setup");setQuestions([]);setAnswers({});setResult(null);setCurrentQ(0);};

  if(step==="setup")return(<div className="card-glow p-6"><h2 className="text-lg font-semibold text-jarvis-text mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-jarvis-primary"/>Create Quiz</h2><div className="space-y-4">
    <div><label className="text-xs text-jarvis-text-muted mb-1.5 block">Subject</label><div className="grid grid-cols-3 sm:grid-cols-5 gap-2">{SUBJECTS.map(s=><button key={s} onClick={()=>setSubject(s)} className={cn("p-2 rounded-xl text-xs border",subject===s?"bg-jarvis-primary/10 border-jarvis-primary/50 text-jarvis-primary":"bg-jarvis-surface border-jarvis-border text-jarvis-text-muted")}><span className="block text-lg">{getSubjectEmoji(s)}</span>{getSubjectLabel(s)}</button>)}</div></div>
    <div><input type="text" value={chapter} onChange={e=>setChapter(e.target.value)} placeholder="Chapter name..." className="input-field"/></div>
    <div className="grid grid-cols-2 gap-3"><select value={difficulty} onChange={e=>setDifficulty(e.target.value as any)} className="input-field"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
    <button onClick={generate} disabled={!subject||!chapter||loading} className="btn-primary w-full flex items-center justify-center gap-2">{loading?"Generating...":<><Brain className="w-4 h-4"/>Generate Quiz</>}</button>
  </div></div>);

  if(step==="quiz"&&questions.length>0)return(<div className="space-y-4">
    <div className="card-glow p-3 flex items-center gap-3"><div className="flex-1 h-2 bg-jarvis-bg rounded-full overflow-hidden"><div className="h-full bg-jarvis-primary rounded-full" style={{width:`${((currentQ+1)/questions.length)*100}%`}}/></div><span className="text-xs text-jarvis-text-muted">{currentQ+1}/{questions.length}</span></div>
    <div className="card-glow p-6"><div className="flex items-center gap-2 mb-1"><span className="text-xs px-2 py-0.5 rounded bg-jarvis-primary/10 text-jarvis-primary">{questions[currentQ].type?.toUpperCase()}</span><span className="text-xs text-jarvis-text-dim">{questions[currentQ].marks} mark{questions[currentQ].marks>1?"s":""}</span></div><h3 className="text-lg font-medium text-jarvis-text mb-4">{questions[currentQ].question}</h3>
    {questions[currentQ].type==="mcq"&&questions[currentQ].options?.map((opt:string,i:number)=><button key={i} onClick={()=>{const o={...answers};o[questions[currentQ].id]=opt.charAt(0);setAnswers(o)}} className={cn("w-full text-left p-3 rounded-xl border mb-2 transition-all",answers[questions[currentQ].id]===opt.charAt(0)?"bg-jarvis-primary/10 border-jarvis-primary text-jarvis-primary":"bg-jarvis-surface border-jarvis-border text-jarvis-text-muted hover:border-jarvis-text-dim")}><span className="text-sm">{opt}</span></button>)}
    {questions[currentQ].type!=="mcq"&&<textarea value={answers[questions[currentQ].id]||""} onChange={e=>{const o={...answers};o[questions[currentQ].id]=e.target.value;setAnswers(o)}} placeholder="Type your answer..." rows={4} className="input-field resize-none"/>}</div>
    <div className="flex items-center justify-between"><button onClick={()=>setCurrentQ(p=>Math.max(0,p-1))} disabled={currentQ===0} className="btn-secondary text-sm">Previous</button>{currentQ<questions.length-1?<button onClick={()=>setCurrentQ(p=>p+1)} className="btn-primary text-sm">Next<ArrowRight className="w-4 h-4 inline ml-1"/></button>:<button onClick={submit} disabled={loading} className="btn-primary text-sm bg-green-500 hover:bg-green-600" style={{boxShadow:"0 0 20px rgba(16,185,129,0.3)"}}>{loading?"Submitting...":"Submit"}</button>}</div>
  </div>);

  if(step==="results"&&result)return(<div className="card-glow p-6 space-y-6 animate-fade-in"><div className="text-center"><Trophy className="w-16 h-16 text-jarvis-warning mx-auto mb-3"/><div className="text-5xl font-bold text-jarvis-text mb-2">{result.score}%</div><p className="text-sm text-jarvis-text-muted">{result.correctAnswers}/{result.totalQuestions} correct</p></div>
    {result.mistakes?.length>0&&<div><h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><X className="w-4 h-4 text-red-400"/>Mistakes ({result.mistakes.length})</h3><div className="space-y-3">{result.mistakes.map((m:any,i:number)=><div key={i} className="bg-jarvis-surface rounded-xl p-4 border border-red-500/10"><p className="text-sm mb-2">{m.question}</p><div className="grid grid-cols-2 gap-2 text-xs mb-2"><div><span className="text-red-400">You: </span>{m.userAnswer}</div><div><span className="text-green-400">Correct: </span>{m.correctAnswer}</div></div><p className="text-xs text-jarvis-text-dim">{m.explanation}</p></div>)}</div></div>}
    <button onClick={reset} className="btn-secondary w-full flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4"/>Another Quiz</button>
  </div>);

  return null;
}