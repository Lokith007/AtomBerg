"use client";

import { useApp } from "@/lib/store";
import { getStatusBadge, calculatePerformanceScore } from "@/lib/utils";
import {
  Users,
  ChevronRight,
  FileCheck,
  FileClock,
  FileEdit,
  Lock,
  TrendingUp,
} from "lucide-react";

function MiniBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function LeadershipPanel() {
  const { state, dispatch } = useApp();

  const reports = state.employees.filter((e) => e.managerId === "mgr-001");

  const stats = {
    approved: 0, awaiting: 0, draft: 0, total: reports.length,
  };

  reports.forEach((r) => {
    const sheet = state.goalSheets.find((gs) => gs.employeeId === r.id);
    if (!sheet) return;
    if (sheet.status === "Approved & Locked") stats.approved++;
    else if (sheet.status === "Awaiting Approval") stats.awaiting++;
    else stats.draft++;
  });

  function getProgress(employeeId: string) {
    const sheet = state.goalSheets.find((gs) => gs.employeeId === employeeId);
    if (!sheet) return 0;
    const goals = sheet.goals.filter((g) => g.actualValue !== undefined);
    if (!goals.length) return 0;
    return goals.reduce((acc, g) => {
      const s = calculatePerformanceScore(g.uom, g.targetValue, g.actualValue!);
      return acc + (s * g.weightage) / 100;
    }, 0);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-base font-bold text-white">Engineering Division — Leadership Control Panel</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Marcus Vance · Director of Engineering · {reports.length} direct reports
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: stats.total, icon: Users, color: "text-slate-300", bg: "bg-slate-500/15" },
          { label: "Approved & Locked", value: stats.approved, icon: FileCheck, color: "text-emerald-400", bg: "bg-emerald-500/15" },
          { label: "Awaiting Approval", value: stats.awaiting, icon: FileClock, color: "text-amber-400", bg: "bg-amber-500/15" },
          { label: "In Draft", value: stats.draft, icon: FileEdit, color: "text-slate-400", bg: "bg-slate-500/15" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Shared KPI push notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
        <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-300/80 leading-relaxed">
          <strong className="text-indigo-300">Divisional KPIs Active:</strong> Three shared performance parameters (Infrastructure Availability 99.95%, Zero Critical Security Incidents, FinOps Efficiency ≥ 82%) have been pushed to all direct reports as inherited, immutably governed targets in their respective goal sheets.
        </div>
      </div>

      {/* Reports table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
          <Users className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-white">Direct Report Goal Sheet Status</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {["Employee", "Designation", "Sheet Status", "Goals", "Wtd. Progress", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((emp, i) => {
                const sheet = state.goalSheets.find((gs) => gs.employeeId === emp.id);
                const progress = getProgress(emp.id);
                const isLocked = sheet?.status === "Approved & Locked";

                return (
                  <tr
                    key={emp.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-indigo-300">{emp.avatarInitials}</span>
                        </div>
                        <span className="font-semibold text-white">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{emp.designation}</td>
                    <td className="px-4 py-3">
                      {sheet ? (
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium w-fit ${getStatusBadge(sheet.status)}`}>
                          {isLocked && <Lock className="w-2.5 h-2.5" />}
                          {sheet.status}
                        </span>
                      ) : (
                        <span className="text-slate-600">No Sheet</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {sheet ? `${sheet.goals.length} goals` : "—"}
                    </td>
                    <td className="px-4 py-3 w-40">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${progress >= 80 ? "text-emerald-400" : progress >= 60 ? "text-blue-400" : progress >= 40 ? "text-amber-400" : "text-slate-500"}`}>
                            {sheet?.goals.some((g) => g.actualValue !== undefined) ? `${Math.round(progress)}%` : "No actuals"}
                          </span>
                        </div>
                        {sheet?.goals.some((g) => g.actualValue !== undefined) && (
                          <MiniBar value={progress} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {sheet?.status === "Awaiting Approval" && (
                          <button
                            onClick={() => {
                              dispatch({ type: "SET_SELECTED_EMPLOYEE", payload: emp.id });
                              dispatch({ type: "SET_VIEW", payload: "approval-workspace" });
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[11px] font-medium hover:bg-amber-500/25 transition-all"
                          >
                            Review <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {sheet?.status === "Approved & Locked" && (
                          <button
                            onClick={() => {
                              dispatch({ type: "SET_SELECTED_EMPLOYEE", payload: emp.id });
                              dispatch({ type: "SET_VIEW", payload: "checkin-matrix" });
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[11px] font-medium hover:bg-emerald-500/25 transition-all"
                          >
                            Check-In <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {(!sheet || sheet.status === "Draft") && (
                          <span className="px-2.5 py-1.5 rounded-lg bg-white/4 text-slate-500 border border-white/8 text-[11px]">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
