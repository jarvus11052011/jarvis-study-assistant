import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/prisma";
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({ data: { name, email, password: hashedPassword } });
    await db.userPreferences.create({ data: { userId: user.id } });
    await db.userProgress.create({ data: { userId: user.id } });
    return NextResponse.json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
  } catch { return NextResponse.json({ error: "Registration failed" }, { status: 500 }); }
}
