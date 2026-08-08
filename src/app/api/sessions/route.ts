import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { subject, chapter, topic } = await req.json();
  if (!subject) return NextResponse.json({ error: "Subject required" }, { status: 400 });
  const s = await db.studySession.create({ data: { userId: session.user.id, subject, chapter: chapter||null, topic: topic||null, startTime: new Date(), completed: false } });
  return NextResponse.json({ success: true, data: s });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { sessionId, notes } = await req.json();
  const existing = await db.studySession.findUnique({ where: { id: sessionId } });
  if (!existing || existing.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const endTime = new Date();
  const duration = Math.round((endTime.getTime() - existing.startTime.getTime()) / 60000);
  const updated = await db.studySession.update({ where: { id: sessionId }, data: { endTime, duration, completed: true, notes: notes||null } });
  const progress = await db.userProgress.findUnique({ where: { userId: session.user.id } });
  if (progress) {
    const dailyKey = endTime.toISOString().split("T")[0];
    const dt = (progress.dailyTracking as Record<string,unknown>) || {};
    const td = (dt[dailyKey] || { hours: 0, subjects: [], quizzes: 0, sessions: 0 }) as {hours:number;subjects:string[];quizzes:number;sessions:number};
    td.hours += (duration||0)/60; if(!td.subjects.includes(existing.subject)) td.subjects.push(existing.subject); td.sessions++;
    dt[dailyKey] = td;
    let streak = progress.studyStreak;
    if (!progress.lastStudyDate) streak = 1;
    else {
      const ld = new Date(progress.lastStudyDate);
      const y = new Date(); y.setDate(y.getDate()-1);
      if (ld.toISOString().split("T")[0] === y.toISOString().split("T")[0]) streak++;
      else if (ld.toISOString().split("T")[0] !== endTime.toISOString().split("T")[0]) streak = 1;
    }
    await db.userProgress.update({ where: { userId: session.user.id }, data: { totalStudyHours: { increment: (duration||0)/60 }, totalSessions: { increment: 1 }, studyStreak: streak, longestStreak: Math.max(streak, progress.longestStreak), lastStudyDate: endTime, dailyTracking: dt } });
  }
  return NextResponse.json({ success: true, data: { ...updated, duration } });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const where: Record<string,unknown> = { userId: session.user.id };
  const subject = searchParams.get("subject");
  if (subject) where.subject = subject;
  const sessions = await db.studySession.findMany({ where, orderBy: { startTime: "desc" }, take: parseInt(searchParams.get("limit")||"20") });
  return NextResponse.json({ success: true, data: sessions });
}
