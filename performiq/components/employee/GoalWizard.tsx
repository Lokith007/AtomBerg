"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { Goal, ThrustArea, UoM, GoalStatus } from "@/types";
import { getStatusBadge, generateId } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Info,
} from "lucide-react";

const THRUST_AREAS: ThrustArea[] = [
  "Cloud Infrastructure Modernization",
  "Security & Compliance Excellence",
  "Operational Reliability & Uptime",
  "Engineering Velocity & Quality",
  "Cost Optimization & FinOps",
  "Talent Development & Knowledge Transfer",
  "Customer Experience & SLA Adherence",
  "Data Governance & Analytics",
];

const UOM_OPTIONS: UoM[] = [
  "Numeric (Higher-is-Better)",
  "Numeric (Lower-is-Better)",
  "Percentage (Higher-is-Better)",
  "Percentage (Lower-is-Better)",
  "Zero-Based Incident",
];

const STATUS_OPTIONS: GoalStatus[] = [
  "Not Started", "On Track", "Behind", "Completed",
];

const INPUT_CLS =
  "w-full bg-[#0b1329] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all";

const SELECT_CLS =
  "w-full bg-[#0b1329] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all";

export function GoalWizard() {
  const { state, dispatch } = useApp();

  const sheet = state.goalSheets.find((gs) => gs.employeeId === "emp-001");
  const isLocked = sheet?.status === "Approved & Locked";
  const canSubmit = sheet?.status === "Draft";

  const [toast, setToast] = useState<{ type: "error" | "success" | "info"; msg: string } | null>(null);

  function showToast(type: "error" | "success" | "info", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  if (!sheet) return <div className="text-slate-400 text-sm">No goal sheet found.</div>;

  const totalWeight = sheet.goals.reduce((s, g) => s + g.weightage, 0);
  const weightOk = totalWeight === 100;
  const weightPct = Math.min((totalWeight / 100) * 100, 100);
  const barColor = weightOk ? "bg-emerald-500" : totalWeight > 100 ? "bg-red-500" : "bg-indigo-500";

  function handleSubmit() {
    if (!weightOk) {
      showToast("error", `Total weightage is ${totalWeight}% — must equal exactly 100% before submission.`);
      return;
    }
    if (sheet!.goals.length === 0) {
      showToast("error", "Goal sheet must contain at least one strategic objective.");
      return;
    }
    const underweight = sheet!.goals.find((g) => g.weightage < 10);
    if (underweight) {
      showToast("error", `"${underweight.title}" has ${underweight.weightage}% — minimum individual goal weightage is 10%.`);
      return;
    }
    dispatch({
      type: "SUBMIT_GOAL_SHEET",
      payload: { sheetId: sheet!.id, initiator: "Sarah Jenkins" },
    });
    showToast("success", "Goal sheet successfully submitted for manager review and approval.");
  }

  function handleAddGoal() {
    if (sheet!.goals.length >= 8) {
      showToast("error", "Maximum of 8 strategic goals permitted per annual sheet.");
      return;
    }
    const newGoal: Goal = {
      id: `g-new-${generateId()}`,
      thrustArea: "Cloud Infrastructure Modernization",
      title: "",
      description: "",
      uom: "Numeric (Higher-is-Better)",
      targetValue: 0,
      weightage: 10,
      status: "Not Started",
      isSharedKPI: false,
      quarterlyActuals: {},
    };
    dispatch({ type: "ADD_GOAL", payload: { sheetId: sheet!.id, goal: newGoal } });
  }

  function handleFieldChange(goalId: string, field: keyof Goal, value: unknown) {
    if (field === "weightage") {
      const v = Number(value);
      if (v < 0 || v > 100) return;
    }
    dispatch({
      type: "UPDATE_GOAL_FIELD",
      payload: { sheetId: sheet!.id, goalId, field, value, initiator: "Sarah Jenkins" },
    });
  }

  function handleRemoveGoal(goalId: string) {
    const g = sheet!.goals.find((x) => x.id === goalId);
    if (g?.isSharedKPI) {
      showToast("error", "Inherited KPI goals cannot be removed from the sheet.");
      return;
    }
    dispatch({ type: "REMOVE_GOAL", payload: { sheetId: sheet!.id, goalId, initiator: "Sarah Jenkins" } });
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-sm animate-slide-up ${
            toast.type === "error"
              ? "bg-red-950/90 border-red-500/40 text-red-300"
              : toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
              : "bg-indigo-950/90 border-indigo-500/40 text-indigo-300"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <p className="text-sm leading-snug">{toast.msg}</p>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-white">FY-2025 Annual Goal Sheet</h3>
          <p className="text-xs text-slate-400 mt-0.5">Sarah Jenkins · Enterprise Infrastructure Division</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(sheet.status)}`}>
            {sheet.status}
          </span>
          {isLocked && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
              <Lock className="w-3 h-3" /> Immutably Locked
            </span>
          )}
        </div>
      </div>

      {/* Rejection notice */}
      {sheet.rejectionReason && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/25">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-300">Sheet Rejected by Manager</p>
            <p className="text-xs text-red-400/80 mt-0.5">{sheet.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Weightage progress bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Cumulative Weightage Allocation</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                weightOk
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : totalWeight > 100
                  ? "bg-red-500/15 text-red-300 border-red-500/30"
                  : "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
              }`}
            >
              {totalWeight}% / 100%
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="w-3 h-3" /> Min 10% per goal · Max 8 goals
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor} ${weightOk ? "shadow-glow-emerald" : ""}`}
            style={{ width: `${weightPct}%` }}
          />
        </div>
        {!weightOk && (
          <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {totalWeight < 100
              ? `${100 - totalWeight}% remaining — sheet cannot be submitted until total equals 100%.`
              : `Sheet is over-allocated by ${totalWeight - 100}% — reduce weightages before submission.`}
          </p>
        )}
        {weightOk && (
          <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Weightage perfectly balanced at 100% — ready to submit.
          </p>
        )}
      </div>

      {/* Goals list */}
      <div className="space-y-4">
        {sheet.goals.map((goal, idx) => {
          const locked = isLocked || goal.isSharedKPI;
          const titleLocked = isLocked || goal.isSharedKPI;
          const targetLocked = isLocked || goal.isSharedKPI;
          const weightOkGoal = goal.weightage >= 10;

          return (
            <div
              key={goal.id}
              className={`glass rounded-xl overflow-hidden border ${
                !weightOkGoal && !isLocked ? "border-amber-500/30" : "border-white/8"
              }`}
            >
              {/* Goal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-300">{idx + 1}</span>
                  </div>
                  {goal.isSharedKPI && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      <Lock className="w-2.5 h-2.5" /> Inherited KPI — Title & Target Locked
                    </span>
                  )}
                  {isLocked && !goal.isSharedKPI && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <Lock className="w-2.5 h-2.5" /> Approved & Locked Asset
                    </span>
                  )}
                </div>
                {!isLocked && !goal.isSharedKPI && (
                  <button
                    onClick={() => handleRemoveGoal(goal.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thrust Area */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Corporate Thrust Area</label>
                  {titleLocked ? (
                    <p className="text-sm text-slate-300 px-3 py-2 bg-white/4 rounded-lg border border-white/8">{goal.thrustArea}</p>
                  ) : (
                    <select
                      className={SELECT_CLS}
                      value={goal.thrustArea}
                      onChange={(e) => handleFieldChange(goal.id, "thrustArea", e.target.value)}
                    >
                      {THRUST_AREAS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                </div>

                {/* UoM */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Unit of Measurement (UoM)</label>
                  {locked ? (
                    <p className="text-sm text-slate-300 px-3 py-2 bg-white/4 rounded-lg border border-white/8">{goal.uom}</p>
                  ) : (
                    <select
                      className={SELECT_CLS}
                      value={goal.uom}
                      onChange={(e) => handleFieldChange(goal.id, "uom", e.target.value)}
                    >
                      {UOM_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  )}
                </div>

                {/* Title */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Strategic Goal Title {titleLocked && <span className="text-indigo-400 ml-1">(Read-Only)</span>}
                  </label>
                  {titleLocked ? (
                    <p className="text-sm text-slate-200 font-medium px-3 py-2 bg-white/4 rounded-lg border border-white/8">{goal.title}</p>
                  ) : (
                    <input
                      className={INPUT_CLS}
                      value={goal.title}
                      onChange={(e) => handleFieldChange(goal.id, "title", e.target.value)}
                      placeholder="e.g. Hybrid Cloud Migration to Multi-Region Architecture"
                    />
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Granular Description</label>
                  {locked ? (
                    <p className="text-sm text-slate-400 px-3 py-2 bg-white/4 rounded-lg border border-white/8 leading-relaxed">{goal.description}</p>
                  ) : (
                    <textarea
                      className={`${INPUT_CLS} resize-none`}
                      rows={2}
                      value={goal.description}
                      onChange={(e) => handleFieldChange(goal.id, "description", e.target.value)}
                      placeholder="Describe the strategic objective, key milestones, and success criteria in detail..."
                    />
                  )}
                </div>

                {/* Target value */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Target Value {targetLocked && <span className="text-indigo-400 ml-1">(Read-Only)</span>}
                  </label>
                  {targetLocked ? (
                    <p className="text-sm text-white font-bold px-3 py-2 bg-white/4 rounded-lg border border-white/8">{goal.targetValue}</p>
                  ) : (
                    <input
                      type="number"
                      className={INPUT_CLS}
                      value={goal.targetValue}
                      onChange={(e) => handleFieldChange(goal.id, "targetValue", parseFloat(e.target.value) || 0)}
                    />
                  )}
                </div>

                {/* Weightage */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] uppercase tracking-wider font-medium ${!weightOkGoal ? "text-amber-400" : "text-slate-500"}`}>
                    Allocated Weightage (%)
                  </label>
                  {isLocked ? (
                    <p className="text-sm text-white font-bold px-3 py-2 bg-white/4 rounded-lg border border-white/8">{goal.weightage}%</p>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className={`${INPUT_CLS} pr-8 ${!weightOkGoal ? "border-amber-500/50 focus:border-amber-500/80" : ""}`}
                        value={goal.weightage}
                        onChange={(e) => handleFieldChange(goal.id, "weightage", parseInt(e.target.value) || 0)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
                    </div>
                  )}
                  {!weightOkGoal && !isLocked && (
                    <p className="text-[10px] text-amber-400">Minimum weightage per goal is 10%</p>
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
                      className={SELECT_CLS}
                      value={goal.status}
                      onChange={(e) => handleFieldChange(goal.id, "status", e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action row */}
      {!isLocked && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleAddGoal}
            disabled={sheet.goals.length >= 8}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Strategic Goal
            <span className="text-slate-500 text-xs">({sheet.goals.length}/8)</span>
          </button>

          {canSubmit && (
            <button
              onClick={handleSubmit}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                weightOk
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo"
                  : "bg-indigo-600/30 text-indigo-300/60 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </button>
          )}

          {sheet.status === "Awaiting Approval" && (
            <div className="flex items-center gap-2 text-amber-300 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Sheet submitted — awaiting manager review
            </div>
          )}
        </div>
      )}
    </div>
  );
}
