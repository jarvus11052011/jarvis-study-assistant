import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
export default async function middleware(req: NextRequest) {
  const session = await auth();
  const isAuth = !!session?.user;
  const { pathname } = req.nextUrl;
  const publicPaths = ["/login", "/register", "/api/auth"];
  const isPublic = publicPaths.some(p => pathname.startsWith(p));
  if (!isAuth && !isPublic) return NextResponse.redirect(new URL("/login", req.url));
  if (isAuth && (pathname==="/login"||pathname==="/register")) return NextResponse.redirect(new URL("/chat", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)"] };
