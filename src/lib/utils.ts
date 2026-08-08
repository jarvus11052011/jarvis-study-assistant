import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDuration(minutes: number): string { const h=Math.floor(minutes/60); const m=minutes%60; if(h===0)return `${m}m`; if(m===0)return `${h}h`; return `${h}h ${m}m`; }
export function formatDate(date: string|Date): string { return new Date(date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}); }
export function formatDateTime(date: string|Date): string { return new Date(date).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}); }
export function getMotivationalMessage(streak: number): string { if(streak>=30)return "🔥 Incredible dedication!"; if(streak>=14)return "🌟 Amazing consistency!"; if(streak>=7)return "💪 Great streak!"; if(streak>=3)return "👍 Nice work!"; if(streak>=1)return "🎯 Good start!"; return "🚀 Ready to start?"; }
export function getSubjectColor(subject: string): string { const c: Record<string,string>={mathematics:"#00d4ff",science:"#10b981",socialScience:"#f59e0b",english:"#7c3aed",hindi:"#ef4444"}; return c[subject]||"#94a3b8"; }
export function getSubjectEmoji(subject: string): string { const e: Record<string,string>={mathematics:"📐",science:"🔬",socialScience:"🌍",english:"📖",hindi:"📝"}; return e[subject]||"📚"; }
export function getSubjectLabel(subject: string): string { const l: Record<string,string>={mathematics:"Mathematics",science:"Science",socialScience:"Social Science",english:"English",hindi:"Hindi"}; return l[subject]||subject; }
