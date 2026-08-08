import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import { speechToText, textToSpeech } from "@/lib/services/voice-service";
import { getAIResponse } from "@/lib/services/ai-service";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { audioData, mode = "study" } = await req.json();
  if (!audioData) return NextResponse.json({ error: "Audio data required" }, { status: 400 });
  let transcript: string;
  try { transcript = await speechToText(audioData) as string; } catch { return NextResponse.json({ error: "Speech recognition failed" }, { status: 500 }); }
  if (!transcript?.trim()) return NextResponse.json({ error: "Could not understand" }, { status: 400 });
  const progress = await db.userProgress.findUnique({ where: { userId: session.user.id } });
  let ctx: string|undefined;
  if (progress && mode === "study") ctx = JSON.stringify({ subjectProgress: progress.subjectProgress, studyStreak: progress.studyStreak });
  const aiResponse = await getAIResponse({ message: transcript, mode, context: { progress: ctx } });
  await db.chatMessage.createMany({ data: [{ userId: session.user.id, role: "user", content: transcript, mode }, { userId: session.user.id, role: "assistant", content: aiResponse.message, mode }] });
  let audioResponse: string|null = null;
  try { audioResponse = await textToSpeech(aiResponse.message); } catch {}
  return NextResponse.json({ success: true, data: { text: aiResponse.message, audioData: audioResponse, mode, transcript } });
}
