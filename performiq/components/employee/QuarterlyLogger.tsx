"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { GoalStatus } from "@/types";
import { calculatePerformanceScore, getStatusBadge } from "@/lib/utils";
import { ClipboardList, CheckCircle2, AlertTriangle, Lock, Save } from "lucide-react";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

const STATUS_OPTIONS: GoalStatus[] = ["Not Started", "On Track", "Behind", "Completed"];

export function QuarterlyLogger() {
  const { state, dispatch } = useApp();

  const sheet = state.goalSheets.find((gs) => gs.employeeId === "emp-001");
  const isLocked = sheet?.status === "Approved & Locked";

  const [selectedQ, setSelectedQ] = useState<Quarter>("Q1");
  const [localActuals, setLocalActuals] = useState<Record<string, { actual: string; status: GoalStatus }>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!sheet) return null;

  function initLocals(goalId: string) {
    const g = sheet!.goals.find((x) => x.id === goalId);
    if (!localActuals[goalId]) {
      const existing = g?.quarterlyActuals?.[selectedQ];
      setLocalActuals((prev) => ({
        ...prev,
        [goalId]: {
          actual: existing !== undefined ? String(existing) : "",
          status: g?.status ?? "Not Started",
        },
      }));
    }
  }

  function getLocal(goalId: string) {
    initLocals(goalId);
    return localActuals[goalId] ?? { actual: "", status: "Not Started" as GoalStatus };
  }

  function handleActualChange(goalId: string, actual: string) {
    setLocalActuals((prev) => ({
      ...prev,
      [goalId]: { ...(prev[goalId] ?? getLocal(goalId)), actual },
    }));
  }

  function handleStatusChange(goalId: string, status: GoalStatus) {
    setLocalActuals((prev) => ({
      ...prev,
      [goalId]: { ...(prev[goalId] ?? getLocal(goalId)), status },
    }));
  }

  function handleSave(goalId: string) {
    const local = localActuals[goalId];
    if (!local || local.actual === "") {
      setToast("Enter an actual value before saving.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    const actualNum = parseFloat(local.actual);
    if (isNaN(actualNum)) {
      setToast("Actual value must be a valid number.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    dispatch({
      type: "UPDATE_GOAL_ACTUAL",
      payload: {
        sheetId: sheet!.id,
        goalId,
        quarter: selectedQ,
        actual: actualNum,
        status: local.status,
        initiator: "Sarah Jenkins",
      },
    });
    setSaved(goalId);
    setTimeout(() => setSaved(null), 2000);
  }

  // Determine which quarters are available based on cycle
  const cycleQuarterMap: Record<string, Quarter[]> = {
    "Goal Setting Phase": [],
    "Q1 Window": ["Q1"],
    "Q2 Window": ["Q1", "Q2"],
    "Q3 Window": ["Q1", "Q2", "Q3"],
    "Q4 Window": ["Q1", "Q2", "Q3", "Q4"],
    Locked: ["Q1", "Q2", "Q3", "Q4"],
  };
  const availableQs = cycleQuarterMap[state.currentCycle] ?? [];

  return (
    <div className="space-y-5 animate-fade-in">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-950/90 border border-amber-500/40 text-amber-300 text-sm animate-slide-up">
          <AlertTriangle className="w-4 h-4" />
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Quarterly Achievement Logger</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Record quantitative actuals · Current cycle: {state.currentCycle}
          </p>
        </div>
        {isLocked && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            <Lock className="w-3 h-3" /> Sheet Locked
          </span>
        )}
      </div>

      {availableQs.length === 0 && (
        <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-slate-900/60 border border-white/8 text-slate-400 text-sm">
          <ClipboardList className="w-4 h-4 mt-0.5 shrink-0" />
          Achievement logging is not available during the Goal Setting Phase. Switch to Q1 Window or later to record actuals.
        </div>
      )}

      {/* Quarter tabs */}
      {availableQs.length > 0 && (
        <>
          <div className="flex gap-2">
            {availableQs.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setSelectedQ(q);
                  setLocalActuals({});
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  selectedQ === q
                    ? "bg-indigo-600/25 text-indigo-300 border-indigo-500/40"
                    : "bg-white/5 text-slate-400 border-white/8 hover:bg-white/8 hover:text-slate-300"
                }`}
              >
                {q} Actuals
              </button>
            ))}
          </div>

          {/* Logger grid */}
          <div className="space-y-3">
            {sheet.goals.map((goal) => {
              const existingActual = goal.quarterlyActuals?.[selectedQ];
              const local = localActuals[goal.id];
              const displayActual = local?.actual ?? (existingActual !== undefined ? String(existingActual) : "");
              const displayStatus = local?.status ?? goal.status;
              const score =
                existingActual !== undefined
                  ? calculatePerformanceScore(goal.uom, goal.targetValue, existingActual)
                  : null;

              return (
                <div key={goal.id} className="glass rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/2">
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-md">{goal.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-slate-500">{goal.thrustArea}</span>
                        <span className="text-[11px] text-slate-600">·</span>
                        <span className="text-[11px] text-slate-500">{goal.uom}</span>
                        <span className="text-[11px] text-slate-600">·</span>
                        <span className="text-[11px] text-slate-500">Target: <strong className="text-slate-300">{goal.targetValue}</strong></span>
                        <span className="text-[11px] text-slate-600">·</span>
                        <span className="text-[11px] text-slate-500">Weight: <strong className="text-indigo-300">{goal.weightage}%</strong></span>
                      </div>
                    </div>
                    {score !== null && (
                      <div className="text-right shrink-0 ml-3">
                        <p className={`text-lg font-bold ${score >= 100 ? "text-emerald-400" : score >= 80 ? "text-blue-400" : score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                          {Math.round(score)}%
                        </p>
                        <p className="text-[10px] text-slate-500">{selectedQ} Score</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    {/* Actual input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                        {selectedQ} Actual Value
                      </label>
                      {isLocked ? (
                        <p className="text-sm font-bold text-white px-3 py-2 bg-white/4 rounded-lg border border-white/8">
                          {existingActual !== undefined ? existingActual : "—"}
                        </p>
                      ) : (
                        <input
                          type="number"
                          className="w-full bg-[#0b1329] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                          value={displayActual}
                          placeholder={`Enter ${selectedQ} actual...`}
                          onChange={(e) => handleActualChange(goal.id, e.target.value)}
                        />
                      )}
                    </div>

                    {/* Status selector */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Progress Status</label>
                      {isLocked ? (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs border font-medium ${getStatusBadge(goal.status)}`}>
                          {goal.status}
                        </span>
                      ) : (
                        <select
                          className="w-full bg-[#0b1329] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                          value={displayStatus}
                          onChange={(e) => handleStatusChange(goal.id, e.target.value as GoalStatus)}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </div>

                    {/* Save button */}
                    {!isLocked && (
                      <div>
                        <button
                          onClick={() => handleSave(goal.id)}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            saved === goal.id
                              ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30"
                          }`}
                        >
                          {saved === goal.id ? (
                            <><CheckCircle2 className="w-4 h-4" /> Saved</>
                          ) : (
                            <><Save className="w-4 h-4" /> Log Actual</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Historical actuals */}
                  {Object.keys(goal.quarterlyActuals).length > 0 && (
                    <div className="px-4 pb-3">
                      <div className="flex gap-2 flex-wrap">
                        {(["Q1", "Q2", "Q3", "Q4"] as Quarter[]).map((q) => {
                          const val = goal.quarterlyActuals[q];
                          if (val === undefined) return null;
                          const s = calculatePerformanceScore(goal.uom, goal.targetValue, val);
                          return (
                            <div key={q} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-xs">
                              <span className="text-slate-500 font-medium">{q}:</span>
                              <span className="text-white font-semibold">{val}</span>
                              <span className={`font-bold ${s >= 100 ? "text-emerald-400" : s >= 80 ? "text-blue-400" : s >= 60 ? "text-amber-400" : "text-red-400"}`}>
                                ({Math.round(s)}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
