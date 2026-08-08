import OpenAI from "openai";
interface ZaroChatMessage { role: "user"|"assistant"|"system"; content: string }
async function callZaroAPI(messages: ZaroChatMessage[], temperature=0.7): Promise<string|null> {
  const apiKey=process.env.ZARO_API_KEY; const apiUrl=process.env.ZARO_API_URL;
  if(!apiKey||!apiUrl){console.log("[AI] Zaro not configured");return null}
  try{const r=await fetch(`${apiUrl}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${apiKey}`},body:JSON.stringify({messages,temperature,max_tokens:2048})});if(!r.ok)return null;const d=await r.json();return d.choices?.[0]?.message?.content||null}catch{return null}
}
let openaiClient: OpenAI|null = null;
function getOpenAIClient(): OpenAI|null {
  if(openaiClient)return openaiClient;const apiKey=process.env.OPENAI_API_KEY;if(!apiKey)return null;openaiClient=new OpenAI({apiKey});return openaiClient
}
async function callOpenAI(messages: ZaroChatMessage[], temperature=0.7): Promise<string|null> {
  const client=getOpenAIClient();if(!client)return null;
  try{const r=await client.chat.completions.create({model:"gpt-4o-mini",messages:messages.map(m=>({role:m.role as "user"|"assistant"|"system",content:m.content})),temperature,max_tokens:2048});return r.choices[0]?.message?.content||null}catch{return null}
}
const STUDY_PROMPT = `You are JARVIS, a personal AI study assistant for a Class 10 CBSE student named Sangeeta. You help with Mathematics, Science, Social Science, English, and Hindi. Use simple language, create practice questions, make study plans, check answers, and identify weak areas. Be encouraging. Reference NCERT textbooks. Do NOT hallucinate — if unsure, say so honestly.`;
const CASUAL_PROMPT = `You are JARVIS, a friendly personal AI assistant. You have a warm, witty personality. You help with casual conversation and daily assistance. The user is Sangeeta, a Class 10 student. In casual mode, don't bring up studies unless asked.`;
export interface AIChatRequest { message: string; mode: "study"|"casual"; history?: {role:"user"|"assistant";content:string}[]; context?: {subject?:string;chapter?:string;progress?:string} }
export interface AIChatResponse { message: string; mode: "study"|"casual" }
export async function getAIResponse(request: AIChatRequest): Promise<AIChatResponse> {
  const {message,mode,history=[],context}=request;
  let systemPrompt = mode==="study"?STUDY_PROMPT:CASUAL_PROMPT;
  if(context?.progress)systemPrompt+=`\n\nProgress: ${context.progress}`;
  const messages:ZaroChatMessage[]=[{role:"system",content:systemPrompt},...history.map(h=>({role:h.role,content:h.content})),{role:"user",content:message}];
  const response = (await callZaroAPI(messages,0.7)) || (await callOpenAI(messages,0.7));
  if(!response) return {message:"Sorry, I'm having trouble connecting to AI services. Please check your API keys.",mode};
  return {message:response,mode};
}
export async function generateDailyPlan(progressData: {subjectProgress:Record<string,unknown>;weakTopics:string[];studyStreak:number;dailyTargetHours:number;recentSessions:unknown[];upcomingExams:unknown[]}): Promise<string> {
  const prompt=`Create a daily study plan for Sangeeta. Progress: ${JSON.stringify(progressData.subjectProgress)}. Weak topics: ${progressData.weakTopics.join(", ")}. Streak: ${progressData.studyStreak} days. Target: ${progressData.dailyTargetHours}h. Format as a clear schedule with time slots.`;
  const messages:ZaroChatMessage[]=[{role:"system",content:STUDY_PROMPT},{role:"user",content:prompt}];
  return (await callZaroAPI(messages,0.5))||(await callOpenAI(messages,0.5))||"Unable to generate plan.";
}
export async function generateQuiz(subject:string,chapter:string,questionCount=10,difficulty:"easy"|"medium"|"hard"="medium"): Promise<string> {
  const prompt=`Create a ${difficulty} quiz for CBSE Class 10 ${subject}, chapter: ${chapter}. ${questionCount} questions: 4 MCQs (1 mark), 3 short (2-3 marks), 2 medium (3-4 marks), 1 long (5 marks). Return ONLY JSON array.`;
  const messages:ZaroChatMessage[]=[{role:"system",content:STUDY_PROMPT},{role:"user",content:prompt}];
  return (await callZaroAPI(messages,0.3))||(await callOpenAI(messages,0.3))||"[]";
}
export async function checkAnswer(question:string,correctAnswer:string,studentAnswer:string,marks:number): Promise<string> {
  const prompt=`Evaluate: Q(${marks}m): ${question}\nModel: ${correctAnswer}\nStudent: ${studentAnswer}\nAssign marks and explain.`;
  const messages:ZaroChatMessage[]=[{role:"system",content:STUDY_PROMPT},{role:"user",content:prompt}];
  return (await callZaroAPI(messages,0.5))||(await callOpenAI(messages,0.5))||"Unable to evaluate.";
}
