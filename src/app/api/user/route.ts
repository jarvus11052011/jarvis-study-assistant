import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let prefs = await db.userPreferences.findUnique({ where: { userId: session.user.id } });
  if (!prefs) { prefs = await db.userPreferences.create({ data: { userId: session.user.id } }); }
  return NextResponse.json({ success: true, data: prefs });
}
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const allowed = ["dailyStudyTarget","preferredSubjects","voiceEnabled","voiceSpeed","theme","fontSize","aiMode","aiTemperature"];
  const updateData: Record<string,unknown> = {};
  for (const [k,v] of Object.entries(body)) { if (allowed.includes(k)) updateData[k] = v; }
  if (!Object.keys(updateData).length) return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  const prefs = await db.userPreferences.upsert({ where: { userId: session.user.id }, update: updateData, create: { userId: session.user.id, ...updateData } });
  return NextResponse.json({ success: true, data: prefs });
}
