"use client";

import { useApp } from "@/lib/store";
import { ActiveView } from "@/types";
import {
  LayoutDashboard,
  Target,
  Share2,
  ClipboardList,
  Users,
  CheckSquare,
  BarChart3,
  RefreshCcw,
  TrendingUp,
  Shield,
  Download,
  Zap,
} from "lucide-react";

type NavItem = {
  view: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  role: "employee" | "manager" | "admin";
};

const NAV_ITEMS: NavItem[] = [
  // Employee
  { view: "dashboard",        label: "Executive Dashboard",   icon: LayoutDashboard, role: "employee" },
  { view: "goal-wizard",      label: "Annual Goal Sheet",     icon: Target,          role: "employee" },
  { view: "shared-kpis",      label: "Inherited KPI Core",    icon: Share2,          role: "employee" },
  { view: "quarterly-logger", label: "Achievement Logger",    icon: ClipboardList,   role: "employee" },
  // Manager
  { view: "leadership-panel",   label: "Leadership Panel",     icon: Users,       role: "manager" },
  { view: "approval-workspace", label: "Approval Workspace",   icon: CheckSquare, role: "manager" },
  { view: "checkin-matrix",     label: "Check-In Matrix",      icon: BarChart3,   role: "manager" },
  // Admin
  { view: "cycle-switchboard", label: "Cycle Switchboard",    icon: RefreshCcw,  role: "admin" },
  { view: "analytics",         label: "Analytics Suite",      icon: TrendingUp,  role: "admin" },
  { view: "audit-trail",       label: "Immutability Log",     icon: Shield,      role: "admin" },
  { view: "data-exporter",     label: "Data Exporter",        icon: Download,    role: "admin" },
];

const ROLE_LABELS = {
  employee: { label: "Employee Workspace", color: "text-indigo-400", dot: "bg-indigo-400" },
  manager:  { label: "Manager Control Panel", color: "text-amber-400", dot: "bg-amber-400" },
  admin:    { label: "Admin Command Centre", color: "text-emerald-400", dot: "bg-emerald-400" },
};

export function Sidebar() {
  const { state, dispatch } = useApp();
  const items = NAV_ITEMS.filter((n) => n.role === state.currentRole);
  const rl = ROLE_LABELS[state.currentRole];

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-white/8 bg-[#1c2541]/60 backdrop-blur-sm">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-glow-indigo">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">PerformIQ</h1>
            <p className="text-[10px] text-slate-500 tracking-wide">Enterprise Edition</p>
          </div>
        </div>
      </div>

      {/* Role indicator */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse-slow ${rl.dot}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${rl.color}`}>
            {rl.label}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-0.5">
          {items.map((item) => {
            const isActive = state.activeView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => dispatch({ type: "SET_VIEW", payload: item.view })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left group ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/25"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span className="truncate font-medium text-xs">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-4 rounded-full bg-indigo-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Cycle indicator */}
      <div className="px-4 pb-3">
        <div className="px-3 py-2.5 rounded-lg bg-[#0b1329] border border-white/8">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Active Cycle</p>
          <p className="text-xs font-semibold text-indigo-300">{state.currentCycle}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">FY-2025 Performance Year</p>
        </div>
      </div>
    </aside>
  );
}
