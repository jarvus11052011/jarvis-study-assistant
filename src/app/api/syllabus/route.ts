import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

async function initSyllabus(userId: string) {
  const subjects = [
    ["mathematics",[["Real Numbers",["Euclid's Lemma","Fundamental Theorem"]],["Polynomials",["Zeros","Coefficients Relation"]],["Linear Equations",["Graphical","Substitution","Elimination"]],["Quadratic Equations",["Factorization","Quadratic Formula"]],["A.P.",["nth Term","Sum of n Terms"]],["Triangles",["BPT","Pythagoras"]],["Coordinate Geometry",["Distance Formula","Section Formula"]],["Trigonometry",["Ratios","Identities"]],["Circles",["Tangents"]],["Areas",["Sector","Segment"]],["Surface Areas",["Frustum"]],["Statistics",["Mean","Median","Mode"]],["Probability",["Theoretical","Complementary"]]]],
    ["science",[["Chemical Reactions",["Types","Balancing"]],["Acids Bases Salts",["pH Scale"]],["Metals Non-metals",["Properties","Reactivity"]],["Carbon",["Bonding","Functional Groups"]],["Life Processes",["Nutrition","Respiration"]],["Control",["Nervous","Hormones"]],["Reproduction",["Asexual","Sexual"]],["Heredity",["Mendel","Sex Determination"]],["Light",["Reflection","Refraction"]],["Human Eye",["Vision Defects"]],["Electricity",["Ohm's Law","Power"]],["Magnetic Effects",["Motor","Generator"]],["Environment",["Ecosystem","Ozone"]]]],
    ["socialScience",[["Nationalism in Europe",["French Rev","Unification"]],["Nationalism in India",["Non-cooperation","Civil Disobedience"]],["Global World",["Silk Routes","Depression"]],["Industrialisation",["Factories"]],["Print Culture",["Print in Europe"]],["Resources",["Types","Soil"]],["Forest Wildlife",["Conservation"]],["Water",["Scarcity","Harvesting"]],["Agriculture",["Types","Major Crops"]],["Minerals",["Types","Energy"]],["Manufacturing",["Agro-based","Mineral-based"]],["Lifelines",["Transport","Trade"]],["Power-sharing",["Belgium"]],["Federalism",["India"]],["Gender Religion Caste",["Social divisions"]],["Political Parties",["National/State"]],["Democracy",["Outcomes"]],["Development",["Goals"]],["Sectors",["Types"]],["Money Credit",["Banks"]],["Globalisation",["Trade"]],["Consumer Rights",["Courts"]]]],
    ["english",[["A Letter to God",["Summary","Theme"]],["Nelson Mandela",["Summary","Values"]],["Two Stories about Flying",["Fear & Courage"]],["Anne Frank",["Summary"]],["Glimpses of India",["Goa","Coorg","Assam"]],["Mijbil the Otter",["Summary"]],["Madam Rides the Bus",["Summary"]],["Sermon at Benares",["Summary"]],["The Proposal",["Summary"]],["Poems",["Dust of Snow","Fire and Ice"]],["Writing Skills",["Letter","Paragraph"]],["Grammar",["Tenses","Modals"]]]],
    ["hindi",[["पद (सूरदास)",["भावार्थ"]],["राम-लक्ष्मण-परशुराम",["भावार्थ"]],["सवैया और कवित्त",["भावार्थ"]],["आत्मकथ्य",["भावार्थ"]],["उत्साह अट नहीं रही",["भावार्थ"]],["दंतुरित मुस्कान",["भावार्थ"]],["छाया मत छूना",["भावार्थ"]],["कन्यादान",["भावार्थ"]],["संगतकार",["भावार्थ"]],["नेताजी का चश्मा",["सारांश"]],["बालगोबिन भगत",["सारांश"]],["लखनवी अंदाज़",["सारांश"]],["मानवीय करुणा",["सारांश"]],["एक कहानी",["सारांश"]],["नौबतखाने",["सारांश"]],["व्याकरण",["रस","अलंकार","वाच्य"]],["रचनात्मक लेखन",["निबंध","पत्र"]]]]
  ] as const;
  for (const [subj, chs] of subjects) {
    for (const [ch, tops] of chs) {
      await db.syllabusProgress.create({ data: { userId, subject: subj, chapter: ch as string, topics: (tops as string[]).map(t=>({name:t,completed:false,confidence:0})) } });
    }
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const where: Record<string,unknown> = { userId: session.user.id };
  if (subject) where.subject = subject;
  let syllabus = await db.syllabusProgress.findMany({ where, orderBy: { subject: "asc" } });
  if (syllabus.length === 0) { await initSyllabus(session.user.id); syllabus = await db.syllabusProgress.findMany({ where, orderBy: { subject: "asc" } }); }
  return NextResponse.json({ success: true, data: syllabus });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, completed, confidence, notes, topics } = await req.json();
  const existing = await db.syllabusProgress.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = await db.syllabusProgress.update({ where: { id }, data: { ...(completed!==undefined&&{completed,completedAt:completed?new Date():null}),...(confidence!==undefined&&{confidence}),...(notes!==undefined&&{notes}),...(topics!==undefined&&{topics}) } });
  return NextResponse.json({ success: true, data: updated });
}
