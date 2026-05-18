"use client";

import { useApp } from "@/lib/store";
import { getStatusBadge, calculatePerformanceScore } from "@/lib/utils";
import {
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  ChevronRight,
} from "lucide-react";

function RadialProgress({ value, size = 120 }: { value: number; size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;
  const color = value >= 80 ? "#10b981" : value >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export function EmployeeDashboard() {
  const { state, dispatch } = useApp();

  const emp = state.employees.find((e) => e.id === "emp-001")!;
  const sheet = state.goalSheets.find((gs) => gs.employeeId === "emp-001");

  if (!sheet) return <div className="text-slate-400 text-sm">No goal sheet found.</div>;

  const totalWeight = sheet.goals.reduce((s, g) => s + g.weightage, 0);

  // Weighted completion score
  const weightedScore =
    sheet.goals.reduce((acc, g) => {
      if (g.actualValue === undefined) return acc;
      const score = calculatePerformanceScore(g.uom, g.targetValue, g.actualValue);
      return acc + (score * g.weightage) / 100;
    }, 0);

  const goalsWithActuals = sheet.goals.filter((g) => g.actualValue !== undefined).length;
  const onTrack = sheet.goals.filter((g) => g.status === "On Track").length;
  const completed = sheet.goals.filter((g) => g.status === "Completed").length;
  const behind = sheet.goals.filter((g) => g.status === "Behind").length;

  const nextCheckin = sheet.status === "Approved & Locked" ? "Q2 Window — April 15, 2025" : "Pending Approval";

  const isLocked = sheet.status === "Approved & Locked";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">
            Welcome back, {emp.name.split(" ")[0]}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            {emp.designation} · {emp.department}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(sheet.status)}`}>
          {sheet.status}
        </span>
      </div>

      {/* Metric cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Weighted completion dial */}
        <div className="glass rounded-xl p-5 flex items-center gap-4 col-span-1 sm:col-span-2 xl:col-span-1">
          <div className="relative shrink-0">
            <RadialProgress value={weightedScore} size={88} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{Math.round(weightedScore)}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Weighted Completion</p>
            <p className="text-xl font-bold text-white mt-0.5">{Math.round(weightedScore)}%</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {goalsWithActuals}/{sheet.goals.length} goals actuals logged
            </p>
          </div>
        </div>

        {/* Goal count */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Goal Portfolio</span>
          </div>
          <p className="text-2xl font-bold text-white">{sheet.goals.length}</p>
          <p className="text-xs text-slate-500 mt-1">Active strategic goals · {totalWeight}% allocated</p>
          <div className="flex gap-2 mt-3">
            {[
              { label: "On Track", val: onTrack, color: "text-blue-400" },
              { label: "Completed", val: completed, color: "text-emerald-400" },
              { label: "Behind", val: behind, color: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="flex-1 text-center">
                <p className={`text-sm font-bold ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in window */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Next Check-In</span>
          </div>
          <p className="text-sm font-semibold text-white leading-snug">{nextCheckin}</p>
          <p className="text-xs text-slate-500 mt-1">Current cycle: {state.currentCycle}</p>
          {sheet.status === "Approved & Locked" && (
            <div className="mt-3 flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Sheet approved & locked</span>
            </div>
          )}
        </div>

        {/* Lock status */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLocked ? "bg-emerald-500/15" : "bg-slate-500/15"}`}>
              {isLocked ? (
                <Lock className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Sheet Status</span>
          </div>
          <p className={`text-sm font-semibold ${isLocked ? "text-emerald-300" : "text-amber-300"}`}>
            {isLocked ? "Immutably Locked" : sheet.status}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isLocked
              ? `Approved ${sheet.approvedAt ? new Date(sheet.approvedAt).toLocaleDateString() : ""}`
              : "Awaiting manager review & approval"}
          </p>
          {sheet.rejectionReason && (
            <p className="mt-2 text-[11px] text-red-400 bg-red-500/10 rounded px-2 py-1 border border-red-500/20">
              Rejected: {sheet.rejectionReason}
            </p>
          )}
        </div>
      </div>

      {/* Goals table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-white">FY-2025 Goal Summary</h4>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_VIEW", payload: "goal-wizard" })}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View Full Sheet <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {["Goal Title", "Thrust Area", "Weight", "Target", "Actual", "Score", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.goals.map((g, i) => {
                const score =
                  g.actualValue !== undefined
                    ? calculatePerformanceScore(g.uom, g.targetValue, g.actualValue)
                    : null;
                return (
                  <tr
                    key={g.id}
                    className={`border-b border-white/5 transition-colors hover:bg-white/3 ${i % 2 === 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-4 py-3 text-slate-200 font-medium max-w-[180px]">
                      <p className="truncate">{g.title}</p>
                      {g.isSharedKPI && (
                        <span className="text-[9px] text-indigo-400 font-medium">Inherited KPI</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-[140px]">
                      <span className="truncate block">{g.thrustArea}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white">{g.weightage}%</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{g.targetValue}</td>
                    <td className="px-4 py-3">
                      {g.actualValue !== undefined ? (
                        <span className="text-white font-semibold">{g.actualValue}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {score !== null ? (
                        <span
                          className={`font-bold ${
                            score >= 100 ? "text-emerald-400" : score >= 80 ? "text-blue-400" : score >= 60 ? "text-amber-400" : "text-red-400"
                          }`}
                        >
                          {Math.round(score)}%
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getStatusBadge(g.status)}`}>
                        {g.status}
                      </span>
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
