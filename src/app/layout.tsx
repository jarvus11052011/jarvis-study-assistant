import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = { title: "JARVIS – Personal AI Study Assistant", description: "Your intelligent study companion for Class 10 CBSE." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="en" className="dark"><body className={`${inter.className} bg-jarvis-bg text-jarvis-text`}><Providers>{children}</Providers></body></html>); }
