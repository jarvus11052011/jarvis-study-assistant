import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const progress = await db.userProgress.findUnique({ where: { userId: session.user.id } });
  if (!progress) return NextResponse.json({ success: true, data: { totalStudyHours: 0, totalSessions: 0, totalQuizzes: 0, averageQuizScore: 0, studyStreak: 0, longestStreak: 0, subjectProgress: {}, dailyTracking: {}, weeklySummaries: [] } });
  return NextResponse.json({ success: true, data: progress });
}
