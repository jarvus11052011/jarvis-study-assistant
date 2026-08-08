import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";
import { generateQuiz } from "@/lib/services/ai-service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const where: Record<string,unknown> = { userId: session.user.id };
  if (searchParams.get("subject")) where.subject = searchParams.get("subject");
  const results = await db.quizResult.findMany({ where, orderBy: { takenAt: "desc" }, take: 30 });
  return NextResponse.json({ success: true, data: results });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { subject, chapter, questionCount = 10, difficulty = "medium" } = await req.json();
  if (!subject || !chapter) return NextResponse.json({ error: "Subject and chapter required" }, { status: 400 });
  const quizJson = await generateQuiz(subject, chapter, questionCount, difficulty);
  let questions;
  try { questions = JSON.parse(quizJson); } catch { return NextResponse.json({ error: "Quiz generation failed" }, { status: 500 }); }
  return NextResponse.json({ success: true, data: { subject, chapter, questions } });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { subject, chapter, topic, answers, questions, duration } = await req.json();
  if (!answers || !questions) return NextResponse.json({ error: "Answers and questions required" }, { status: 400 });
  let correctAnswers = 0;
  const mistakes: {question:string;userAnswer:string;correctAnswer:string;explanation:string}[] = [];
  const weakTopics: string[] = [];
  for (const q of questions) {
    const ua = answers.find((a:{questionId:string})=>a.questionId===q.id);
    const isCorrect = ua?.answer?.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim();
    if (isCorrect) correctAnswers++;
    else { mistakes.push({ question: q.question, userAnswer: ua?.answer||"(no answer)", correctAnswer: q.correctAnswer, explanation: q.explanation }); if (chapter && !weakTopics.includes(chapter)) weakTopics.push(chapter); }
  }
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const result = await db.quizResult.create({ data: { userId: session.user.id, subject, chapter: chapter||null, topic: topic||null, score, totalQuestions, correctAnswers, mistakes: mistakes.length>0?mistakes:undefined, weakTopics: weakTopics.length>0?weakTopics:undefined, duration: duration||null } });
  const allQuizzes = await db.quizResult.findMany({ where: { userId: session.user.id } });
  const avgScore = allQuizzes.reduce((s,q)=>s+q.score,0)/allQuizzes.length;
  await db.userProgress.upsert({ where: { userId: session.user.id }, create: { userId, totalQuizzes: allQuizzes.length, averageQuizScore: avgScore }, update: { totalQuizzes: allQuizzes.length, averageQuizScore: avgScore } });
  return NextResponse.json({ success: true, data: { id: result.id, score, totalQuestions, correctAnswers, mistakes, weakTopics, duration } });
}
