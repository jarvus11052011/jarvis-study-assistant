export interface ChatMessage { id:string; role:"user"|"assistant"|"system"; content:string; mode:"study"|"casual"; metadata?:{subject?:string;chapter?:string;topic?:string}; createdAt:string }
export interface ChatRequest { message:string; mode:"study"|"casual"; subject?:string; chapter?:string; history?:{role:"user"|"assistant";content:string}[] }
export interface ChatResponse { message:string; mode:"study"|"casual" }
export interface StudySession { id:string; subject:string; chapter?:string; topic?:string; startTime:string; endTime?:string; duration?:number; completed:boolean; notes?:string }
export interface QuizQuestion { id:string; type:"mcq"|"short"|"long"; marks:1|2|3|4|5; question:string; options?:string[]; correctAnswer:string; explanation:string }
export interface QuizResult { id:string; subject:string; chapter?:string; topic?:string; score:number; totalQuestions:number; correctAnswers:number; mistakes:{question:string;userAnswer:string;correctAnswer:string;explanation:string}[]; weakTopics:string[]; duration?:number; takenAt:string }
export interface QuizAnswer { questionId:string; answer:string }
export type GoalType = "board_percentage"|"syllabus_completion"|"daily_hours"|"exam_prep"|"custom";
export interface Goal { id:string; title:string; description?:string; type:GoalType; target?:number; current:number; unit?:string; deadline?:string; priority:"low"|"medium"|"high"; status:"active"|"completed"|"abandoned"; createdAt:string; updatedAt:string }
export interface Reminder { id:string; title:string; description?:string; type:"study"|"exam"|"revision"|"custom"; scheduledAt:string; isRecurring:boolean; recurrenceRule?:string; completed:boolean }
export type VoiceState = "idle"|"listening"|"processing"|"speaking";
export interface UserPreferences { dailyStudyTarget:number; preferredSubjects:string[]; voiceEnabled:boolean; voiceSpeed:number; theme:"dark"|"light"; fontSize:"small"|"medium"|"large"; aiMode:"study"|"casual"; aiTemperature:number }
export interface DailyPlanItem { subject:string; chapter:string; topic?:string; reason:string; estimatedTime:number; priority:"high"|"medium"|"low" }
export interface DailyPlan { date:string; totalEstimatedTime:number; items:DailyPlanItem[]; message:string }
export interface ApiResponse<T> { success:boolean; data?:T; error?:string; message?:string }
