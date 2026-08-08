import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (<div className="flex min-h-screen"><Sidebar /><div className="flex-1 lg:ml-64"><TopBar /><main className="p-4 lg:p-8 pb-24 lg:pb-8">{children}</main></div></div>);
}
