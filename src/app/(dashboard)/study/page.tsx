"use client";
import { useState } from "react";
import { StudyTimer } from "@/components/study/StudyTimer";
import { SessionHistory } from "@/components/study/SessionHistory";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default function StudyPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleSessionChange = () => setRefreshKey(k => k + 1);
  return (<div className="max-w-4xl mx-auto space-y-6" key={refreshKey}><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><StudyTimer onSessionStart={handleSessionChange} onSessionEnd={handleSessionChange} /><SessionHistory /></div><DashboardOverview /></div>);
}
