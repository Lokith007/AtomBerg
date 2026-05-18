"use client";

import { useApp } from "@/lib/store";
import { Bell, HelpCircle, Calendar } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:          { title: "Executive Dashboard",          subtitle: "Real-time performance metrics and goal alignment overview" },
  "goal-wizard":      { title: "Annual Goal Sheet",            subtitle: "Construct and submit your FY-2025 strategic goal commitments" },
  "shared-kpis":      { title: "Inherited KPI Core",           subtitle: "Leadership-pushed divisional targets and shared performance parameters" },
  "quarterly-logger": { title: "Quarterly Achievement Logger", subtitle: "Record quantitative actuals and update goal progression status" },
  "leadership-panel": { title: "Leadership Control Panel",     subtitle: "Direct report overview, sheet statuses, and aggregate progress" },
  "approval-workspace": { title: "Approval Workspace",          subtitle: "Review, annotate, and action pending goal sheet submissions" },
  "checkin-matrix":   { title: "Performance Check-In Matrix",  subtitle: "Planned vs. Actual progress with automated score calculation" },
  "cycle-switchboard":{ title: "Performance Cycle Switchboard",subtitle: "Govern the enterprise-wide operating phase and cycle transitions" },
  analytics:          { title: "High-Impact Analytics Suite",  subtitle: "Cross-quarter trends, BU completion rates, and thrust-area distribution" },
  "audit-trail":      { title: "Immutability Verification Log",subtitle: "Cryptographic audit ledger — every state change immutably recorded" },
  "data-exporter":    { title: "Corporate Data Exporter",      subtitle: "Generate and download complete performance data matrices as CSV" },
};

const PERSONA_MAP: Record<string, { name: string; initials: string; color: string }> = {
  employee: { name: "Sarah Jenkins", initials: "SJ", color: "bg-indigo-600" },
  manager:  { name: "Marcus Vance",  initials: "MV", color: "bg-amber-600" },
  admin:    { name: "Elena Rostova", initials: "ER", color: "bg-emerald-600" },
};

export function Header() {
  const { state } = useApp();
  const meta = VIEW_TITLES[state.activeView] ?? VIEW_TITLES["dashboard"];
  const persona = PERSONA_MAP[state.currentRole];
  const now = formatTimestamp(new Date().toISOString());

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#1c2541]/40 backdrop-blur-sm shrink-0">
      {/* Page identity */}
      <div>
        <h2 className="text-base font-bold text-white leading-tight">{meta.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{meta.subtitle}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-400 font-mono">{now}</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell className="w-3.5 h-3.5 text-slate-400" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full ${persona.color} flex items-center justify-center`}>
            <span className="text-[10px] font-bold text-white">{persona.initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-tight">{persona.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{state.currentRole} Persona</p>
          </div>
        </div>
      </div>
    </header>
  );
}
