"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Moon, Bell, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const handleSignOut = async () => { await signOut({ redirect: true, callbackUrl: "/login" }); };
  return (<header className="sticky top-0 z-20 h-16 bg-jarvis-bg/80 backdrop-blur-xl border-b border-jarvis-border"><div className="flex items-center justify-between h-full px-4 lg:px-8"><div className="flex items-center gap-3"><span className="text-sm text-jarvis-text-muted hidden sm:block">Welcome back,</span><span className="text-sm font-semibold text-jarvis-text">{session?.user?.name||"Student"}</span></div><div className="flex items-center gap-2"><button className="p-2 rounded-xl hover:bg-jarvis-card transition-colors"><Bell className="w-5 h-5 text-jarvis-text-muted"/></button><button className="p-2 rounded-xl hover:bg-jarvis-card transition-colors"><Moon className="w-5 h-5 text-jarvis-text-muted"/></button><div className="relative"><button onClick={()=>setShowMenu(!showMenu)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-jarvis-card transition-colors"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-jarvis-primary/30 to-jarvis-accent/30 flex items-center justify-center border border-jarvis-border"><User className="w-4 h-4 text-jarvis-primary"/></div></button>{showMenu && <><div className="fixed inset-0 z-10" onClick={()=>setShowMenu(false)}/><div className="absolute right-0 top-12 z-20 w-48 py-2 bg-jarvis-surface border border-jarvis-border rounded-xl shadow-xl animate-fade-in"><button onClick={()=>{setShowMenu(false);router.push("/settings");}} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-jarvis-text-muted hover:text-jarvis-text hover:bg-jarvis-card transition-colors"><Settings className="w-4 h-4"/>Settings</button><hr className="my-1 border-jarvis-border"/><button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-jarvis-card transition-colors"><LogOut className="w-4 h-4"/>Sign out</button></div></>}</div></div></div></header>);
}