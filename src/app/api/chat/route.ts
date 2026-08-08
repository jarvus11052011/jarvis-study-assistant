import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAIResponse, generateDailyPlan } from "@/lib/services/ai-service";
import { db } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { message, mode = "study", subject, chapter } = await req.json();
    if (!message || typeof message !== "string") return NextResponse.json({ error: "Message required" }, { status: 400 });
    const recentHistory = await db.chatMessage.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 20, select: { role: true, content: true } });
    const progress = await db.userProgress.findUnique({ where: { userId: session.user.id } });
    let progressContext: string | undefined;
    if (progress && mode === "study") { progressContext = JSON.stringify({ subjectProgress: progress.subjectProgress, studyStreak: progress.studyStreak, totalStudyHours: progress.totalStudyHours, averageQuizScore: progress.averageQuizScore }); }
    const aiResponse = await getAIResponse({ message, mode, history: recentHistory.reverse().map(h => ({ role: h.role as "user"|"assistant", content: h.content })), context: { subject, chapter, progress: progressContext } });
    await db.chatMessage.create({ data: { userId: session.user.id, role: "user", content: message, mode, metadata: subject || chapter ? { subject, chapter } : undefined } });
    await db.chatMessage.create({ data: { userId: session.user.id, role: "assistant", content: aiResponse.message, mode } });
    return NextResponse.json({ success: true, data: aiResponse });
  } catch (error) { console.error("Chat error:", error); return NextResponse.json({ error: "Failed to process message" }, { status: 500 }); }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    if (action === "daily-plan") {
      const progress = await db.userProgress.findUnique({ where: { userId: session.user.id } });
      const recentSessions = await db.studySession.findMany({ where: { userId: session.user.id }, orderBy: { startTime: "desc" }, take: 10 });
      const preferences = await db.userPreferences.findUnique({ where: { userId: session.user.id } });
      const plan = await generateDailyPlan({ subjectProgress: (progress?.subjectProgress as Record<string,unknown>) || {}, weakTopics: [], studyStreak: progress?.studyStreak || 0, dailyTargetHours: preferences?.dailyStudyTarget || 4, recentSessions: recentSessions.map(s => ({ subject: s.subject, chapter: s.chapter, duration: s.duration, date: s.startTime })), upcomingExams: [] });
      return NextResponse.json({ success: true, data: { plan } });
    }
    const messages = await db.chatMessage.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: parseInt(searchParams.get("limit") || "50") });
    return NextResponse.json({ success: true, data: messages.reverse() });
  } catch { return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 }); }
}
