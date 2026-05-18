"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { calculatePerformanceScore, getScoreBadge, getStatusBadge } from "@/lib/utils";
import { BarChart3, ChevronLeft, Lock, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function CheckInMatrix() {
  const { state, dispatch } = useApp();

  const reports = state.employees.filter((e) => e.managerId === "mgr-001");
  const approvedSheets = state.goalSheets.filter(
    (gs) => gs.status === "Approved & Locked" && reports.some((r) => r.id === gs.employeeId)
  );

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    state.selectedEmployeeId
  );

  const activeSheet = selectedEmployeeId
    ? state.goalSheets.find((gs) => gs.employeeId === selectedEmployeeId && gs.status === "Approved & Locked")
    : null;
  const activeEmployee = selectedEmployeeId
    ? state.employees.find((e) => e.id === selectedEmployeeId)
    : null;

  const quarters = ["Q1", "Q2", "Q3", "Q4"] as const;
  type Quarter = typeof quarters[number];

  const [selectedQ, setSelectedQ] = useState<Quarter>("Q1");

  if (!activeSheet || !activeEmployee) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h3 className="text-base font-bold text-white">Mid-Cycle Performance Check-In Matrix</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an approved team member to view planned vs. actual progress
          </p>
        </div>
        {approvedSheets.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <Lock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">No approved sheets available</p>
            <p className="text-slate-600 text-xs mt-1">Approve goal sheets to access performance data.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvedSheets.map((gs) => {
              const emp = state.employees.find((e) => e.id === gs.employeeId)!;
              const goalsWithActuals = gs.goals.filter((g) => g.actualValue !== undefined).length;
              const overallScore = gs.goals.reduce((acc, g) => {
                if (g.actualValue === undefined) return acc;
                return acc + (calculatePerformanceScore(g.uom, g.targetValue, g.actualValue) * g.weightage) / 100;
              }, 0);

              return (
                <div
                  key={gs.id}
                  onClick={() => {
                    setSelectedEmployeeId(emp.id);
                    dispatch({ type: "SET_SELECTED_EMPLOYEE", payload: emp.id });
                  }}
                  className="glass rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-all border border-emerald-500/15 hover:border-emerald-500/30 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-300">{emp.avatarInitials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.designation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{goalsWithActuals}/{gs.goals.length} actuals logged</p>
                        <p className={`text-lg font-bold mt-0.5 ${overallScore >= 80 ? "text-emerald-400" : overallScore >= 60 ? "text-amber-400" : "text-slate-500"}`}>
                          {goalsWithActuals > 0 ? `${Math.round(overallScore)}%` : "No data"}
                        </p>
                      </div>
                      <BarChart3 className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const overallScore = activeSheet.goals.reduce((acc, g) => {
    if (g.actualValue === undefined) return acc;
    return acc + (calculatePerformanceScore(g.uom, g.targetValue, g.actualValue) * g.weightage) / 100;
  }, 0);

  const scoreBadge = getScoreBadge(overallScore);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedEmployeeId(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> All Reports
        </button>
        <div>
          <h3 className="text-base font-bold text-white">{activeEmployee.name}</h3>
          <p className="text-xs text-slate-400">{activeEmployee.designation} · Performance Check-In</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${scoreBadge.className}`}>
            {Math.round(overallScore)}% — {scoreBadge.label}
          </span>
          <span className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusBadge(activeSheet.status)}`}>
            <Lock className="w-3 h-3 inline mr-1" />
            {activeSheet.status}
          </span>
        </div>
      </div>

      {/* Quarter selector */}
      <div className="flex gap-2">
        {quarters.map((q) => (
          <button
            key={q}
            onClick={() => setSelectedQ(q)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              selectedQ === q
                ? "bg-indigo-600/25 text-indigo-300 border-indigo-500/40"
                : "bg-white/5 text-slate-400 border-white/8 hover:bg-white/8"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Manager comment */}
      {activeSheet.managerComments && (
        <div className="glass rounded-xl p-4 border border-emerald-500/15">
          <p className="text-[11px] text-emerald-400 uppercase tracking-wider font-medium mb-1.5">Approval Commentary — Marcus Vance</p>
          <p className="text-xs text-slate-300 leading-relaxed">{activeSheet.managerComments}</p>
          {activeSheet.approvedAt && (
            <p className="text-[11px] text-slate-600 mt-2">
              Approved: {new Date(activeSheet.approvedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Check-in table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/8 bg-white/2">
          <p className="text-xs font-semibold text-slate-300">
            {selectedQ} Planned vs. Actual — Automated Score Engine
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {["Strategic Goal", "UoM", "Target", `${selectedQ} Actual`, "Score", "Trend", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeSheet.goals.map((goal, i) => {
                const qActual = goal.quarterlyActuals?.[selectedQ];
                const score = qActual !== undefined
                  ? calculatePerformanceScore(goal.uom, goal.targetValue, qActual)
                  : null;
                const badge = score !== null ? getScoreBadge(score) : null;

                // Trend: compare latest two quarters
                const qKeys = quarters.filter((q) => goal.quarterlyActuals[q] !== undefined);
                const lastTwo = qKeys.slice(-2);
                let trend: "up" | "down" | "flat" | "none" = "none";
                if (lastTwo.length === 2) {
                  const s1 = calculatePerformanceScore(goal.uom, goal.targetValue, goal.quarterlyActuals[lastTwo[0]]!);
                  const s2 = calculatePerformanceScore(goal.uom, goal.targetValue, goal.quarterlyActuals[lastTwo[1]]!);
                  trend = s2 > s1 + 2 ? "up" : s2 < s1 - 2 ? "down" : "flat";
                }

                return (
                  <tr key={goal.id} className={`border-b border-white/5 hover:bg-white/3 ${i % 2 === 0 ? "bg-white/1" : ""}`}>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="font-semibold text-white truncate">{goal.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{goal.thrustArea}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{goal.uom}</td>
                    <td className="px-4 py-3 text-white font-semibold">{goal.targetValue}</td>
                    <td className="px-4 py-3">
                      {qActual !== undefined ? (
                        <span className="text-white font-bold">{qActual}</span>
                      ) : (
                        <span className="text-slate-600">Not logged</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {score !== null && badge ? (
                        <div>
                          <span className={`font-bold text-sm ${score >= 100 ? "text-emerald-400" : score >= 80 ? "text-blue-400" : score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                            {Math.round(score)}%
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">{badge.label}</p>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                      {trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                      {trend === "flat" && <Minus className="w-4 h-4 text-slate-400" />}
                      {trend === "none" && <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getStatusBadge(goal.status)}`}>
                        {goal.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Weighted score footer */}
        <div className="px-5 py-3 border-t border-white/8 bg-white/2 flex items-center justify-between">
          <p className="text-xs text-slate-500">Composite weighted performance score</p>
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full ${overallScore >= 80 ? "bg-emerald-500" : overallScore >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(overallScore, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${overallScore >= 80 ? "text-emerald-400" : overallScore >= 60 ? "text-amber-400" : "text-red-400"}`}>
              {Math.round(overallScore)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
