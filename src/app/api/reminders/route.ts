import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reminders = await db.reminder.findMany({ where: { userId: session.user.id }, orderBy: { scheduledAt: "asc" } });
  return NextResponse.json({ success: true, data: reminders });
}
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, type, scheduledAt, isRecurring, recurrenceRule } = await req.json();
  if (!title || !scheduledAt) return NextResponse.json({ error: "Title and schedule required" }, { status: 400 });
  const reminder = await db.reminder.create({ data: { userId: session.user.id, title, description, type: type||"study", scheduledAt: new Date(scheduledAt), isRecurring: isRecurring||false, recurrenceRule } });
  return NextResponse.json({ success: true, data: reminder });
}
