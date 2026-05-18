"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { CyclePhase } from "@/types";
import { getStatusBadge } from "@/lib/utils";
import {
  RefreshCcw,
  CheckCircle2,
  Lock,
  AlertTriangle,
  ChevronRight,
  Info,
} from "lucide-react";

const PHASES: { phase: CyclePhase; label: string; description: string; icon: string }[] = [
  {
    phase: "Goal Setting Phase",
    label: "Goal Setting Phase",
    description:
      "All employees can create, edit, and submit annual goal sheets. Managers may review and adjust submissions. No performance actuals are recorded during this phase.",
    icon: "📋",
  },
  {
    phase: "Q1 Window",
    label: "Q1 Achievement Window",
    description:
      "Q1 actuals can be logged by employees against approved goals. Manager check-in matrix is activated. Goal sheets remain locked post-approval.",
    icon: "📊",
  },
  {
    phase: "Q2 Window",
    label: "Q2 Achievement Window",
    description:
      "Q1 & Q2 actuals are accessible for logging. Mid-year performance reviews can be initiated. Administrative adjustments require force-unlock with audit trail.",
    icon: "📈",
  },
  {
    phase: "Q3 Window",
    label: "Q3 Achievement Window",
    description:
      "Three-quarter actuals are open for logging. Year-end trajectory forecasting is enabled. Focus on performance course-correction dialogues.",
    icon: "🎯",
  },
  {
    phase: "Q4 Window",
    label: "Q4 Final Achievement Window",
    description:
      "Year-end actuals are logged and finalized. Manager ratings are submitted. System prepares for annual performance calibration and appraisal cycle.",
    icon: "🏆",
  },
  {
    phase: "Locked",
    label: "Performance Cycle Locked",
    description:
      "All inputs are frozen. The system is in read-only mode. Data is preserved for calibration, audit, and archival. No modifications permitted without administrative override.",
    icon: "🔒",
  },
];

const PHASE_EFFECTS: Record<CyclePhase, string[]> = {
  "Goal Setting Phase": [
    "Employees: Goal sheet creation wizard is fully active",
    "Employees: Submit button enabled for all draft sheets",
    "Managers: Approval workspace open for incoming submissions",
    "Managers: Inline target & weightage adjustments permitted",
    "Achievement Logger: Disabled (not yet active)",
  ],
  "Q1 Window": [
    "Employees: Q1 actual values can be logged",
    "Employees: Goal sheet modifications blocked (post-submission)",
    "Managers: Q1 check-in matrix activated",
    "Admin: Q1 aggregate analytics available",
    "Goal Setting Phase: Closed for new submissions",
  ],
  "Q2 Window": [
    "Employees: Q1 & Q2 actuals logging enabled",
    "Managers: Mid-cycle performance review interface active",
    "Managers: Can initiate structured mid-year commentary",
    "Admin: Cross-quarter trend analytics refreshed",
  ],
  "Q3 Window": [
    "Employees: Q1, Q2 & Q3 actuals logging enabled",
    "Managers: Three-quarter performance trajectory visible",
    "Admin: Year-end forecast models activated",
    "All: Read access to full historical achievement log",
  ],
  "Q4 Window": [
    "Employees: All four quarters of actuals logging enabled",
    "Managers: Annual performance ratings submission open",
    "Admin: Calibration and normalization tools active",
    "System: Full-year performance data export available",
  ],
  Locked: [
    "All users: System in read-only mode — no input modifications",
    "All: Historical data fully accessible for reference",
    "Admin only: Force-unlock available with mandatory audit entry",
    "System: Audit trail frozen and immutable",
    "Archival: Data export for HR records enabled",
  ],
};

export function CycleSwitchboard() {
  const { state, dispatch } = useApp();
  const [pendingPhase, setPendingPhase] = useState<CyclePhase | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function handleTransition(phase: CyclePhase) {
    if (phase === state.currentCycle) return;
    setPendingPhase(phase);
    setShowConfirm(true);
  }

  function confirmTransition() {
    if (!pendingPhase) return;
    dispatch({ type: "SET_CYCLE", payload: pendingPhase });
    setShowConfirm(false);
    setToast(`Performance cycle successfully transitioned to: ${pendingPhase}`);
    setTimeout(() => setToast(null), 3500);
  }

  const effects = PHASE_EFFECTS[state.currentCycle] ?? [];

  // Stats
  const totalEmployees = state.employees.filter((e) => e.personaRole === "employee").length;
  const approvedCount = state.goalSheets.filter((gs) => gs.status === "Approved & Locked").length;
  const awaitingCount = state.goalSheets.filter((gs) => gs.status === "Awaiting Approval").length;
  const draftCount = state.goalSheets.filter((gs) => gs.status === "Draft").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-sm animate-slide-up shadow-xl">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && pendingPhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 w-full max-w-md border border-amber-500/25 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Confirm Cycle Transition</h4>
                <p className="text-xs text-slate-400">This action is audit-logged and affects all users</p>
              </div>
            </div>
            <div className="bg-white/4 rounded-xl p-3 mb-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 w-16 shrink-0">From:</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getStatusBadge(state.currentCycle)}`}>
                  {state.currentCycle}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 ml-14" />
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 w-16 shrink-0">To:</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getStatusBadge(pendingPhase)}`}>
                  {pendingPhase}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This transition will immediately alter the active user interfaces for all employees, managers, and administrators. An immutable audit entry will be created under your credentials.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm border border-white/10 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransition}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600/25 text-indigo-300 text-sm border border-indigo-500/40 hover:bg-indigo-600/40 font-semibold"
              >
                Confirm Transition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Global Performance Cycle Switchboard</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Elena Rostova · VP of People & Culture · FY-2025 Governance Control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-xs text-slate-400">Live enterprise state</span>
        </div>
      </div>

      {/* Current state summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Current Phase", value: state.currentCycle, sub: "FY-2025", color: "text-indigo-300" },
          { label: "Approved Sheets", value: `${approvedCount}/${totalEmployees}`, sub: "Goal sheets locked", color: "text-emerald-400" },
          { label: "Awaiting Review", value: awaitingCount, sub: "Pending manager action", color: "text-amber-400" },
          { label: "Draft Sheets", value: draftCount, sub: "In progress", color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-lg font-bold leading-tight ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Active phase effects */}
      <div className="glass rounded-xl p-4 border border-indigo-500/15">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-indigo-400" />
          <p className="text-xs font-semibold text-indigo-300">Active Phase System Behaviour: {state.currentCycle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {effects.map((effect, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 mt-1.5 shrink-0" />
              {effect}
            </div>
          ))}
        </div>
      </div>

      {/* Phase selector */}
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3 px-1">
          Available Cycle Transitions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {PHASES.map((p) => {
            const isCurrent = state.currentCycle === p.phase;
            return (
              <button
                key={p.phase}
                onClick={() => handleTransition(p.phase)}
                disabled={isCurrent}
                className={`text-left p-4 rounded-xl border transition-all duration-200 group ${
                  isCurrent
                    ? "border-indigo-500/40 bg-indigo-600/15 cursor-default"
                    : "border-white/8 glass hover:border-indigo-500/30 hover:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{p.icon}</span>
                    <span className={`text-sm font-semibold ${isCurrent ? "text-indigo-300" : "text-slate-200"}`}>
                      {p.label}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{p.description}</p>
                {!isCurrent && (
                  <div className="flex items-center gap-1 mt-2.5 text-indigo-400 text-[11px] font-medium group-hover:text-indigo-300 transition-colors">
                    <RefreshCcw className="w-3 h-3" />
                    Transition to this phase
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cycle lock warning */}
      {state.currentCycle === "Locked" && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-950/30 border border-red-500/25">
          <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-red-300/80 leading-relaxed">
            <strong className="text-red-300">System Locked State Active.</strong> All employee and manager inputs are frozen. Use the Data Exporter to generate the final performance matrix. To reopen the system for a new cycle, transition to the Goal Setting Phase.
          </div>
        </div>
      )}
    </div>
  );
}
