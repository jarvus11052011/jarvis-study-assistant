import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, type, target, unit, deadline, priority } = await req.json();
  if (!title || !type) return NextResponse.json({ error: "Title and type required" }, { status: 400 });
  const goal = await db.goal.create({ data: { userId: session.user.id, title, description: description||null, type, target: target||null, unit: unit||null, deadline: deadline?new Date(deadline):null, priority: priority||"medium" } });
  return NextResponse.json({ success: true, data: goal });
}
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const where: Record<string,unknown> = { userId: session.user.id };
  const status = searchParams.get("status");
  if (status) where.status = status;
  const goals = await db.goal.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ success: true, data: goals });
}
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { goalId, current, status } = await req.json();
  const existing = await db.goal.findUnique({ where: { id: goalId } });
  if (!existing || existing.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updateData: Record<string,unknown> = {};
  if (current !== undefined) updateData.current = current;
  if (status) updateData.status = status;
  const goal = await db.goal.update({ where: { id: goalId }, data: updateData });
  return NextResponse.json({ success: true, data: goal });
}
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const goalId = searchParams.get("id");
  if (!goalId) return NextResponse.json({ error: "Goal ID required" }, { status: 400 });
  await db.goal.delete({ where: { id: goalId } });
  return NextResponse.json({ success: true, message: "Goal deleted" });
}
