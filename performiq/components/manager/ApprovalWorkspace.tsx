"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { getStatusBadge } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Lock,
  Edit3,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

export function ApprovalWorkspace() {
  const { state, dispatch } = useApp();

  const reports = state.employees.filter((e) => e.managerId === "mgr-001");
  const pendingSheets = state.goalSheets.filter(
    (gs) => gs.status === "Awaiting Approval" && reports.some((r) => r.id === gs.employeeId)
  );

  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(
    state.selectedEmployeeId
      ? (state.goalSheets.find((gs) => gs.employeeId === state.selectedEmployeeId)?.id ?? null)
      : null
  );
  const [managerComment, setManagerComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  const activeSheet = selectedSheetId
    ? state.goalSheets.find((gs) => gs.id === selectedSheetId)
    : null;
  const activeEmployee = activeSheet
    ? state.employees.find((e) => e.id === activeSheet.employeeId)
    : null;

  function handleApprove() {
    if (!activeSheet) return;
    if (!managerComment.trim()) {
      showToast("error", "A managerial commentary is required before approving the goal sheet.");
      return;
    }
    dispatch({
      type: "APPROVE_GOAL_SHEET",
      payload: { sheetId: activeSheet.id, comments: managerComment, initiator: "Marcus Vance" },
    });
    showToast("success", `Goal sheet for ${activeEmployee?.name} approved and locked successfully.`);
    setSelectedSheetId(null);
    setManagerComment("");
  }

  function handleReject() {
    if (!activeSheet || !rejectionReason.trim()) return;
    dispatch({
      type: "REJECT_GOAL_SHEET",
      payload: { sheetId: activeSheet.id, reason: rejectionReason, initiator: "Marcus Vance" },
    });
    showToast("success", `Sheet rejected and returned to draft. ${activeEmployee?.name} will be notified.`);
    setShowRejectDialog(false);
    setSelectedSheetId(null);
    setRejectionReason("");
  }

  function handleInlineUpdate(goalId: string, field: "targetValue" | "weightage", value: number) {
    if (!activeSheet) return;
    dispatch({
      type: "UPDATE_GOAL_FIELD",
      payload: {
        sheetId: activeSheet.id,
        goalId,
        field,
        value,
        initiator: "Marcus Vance",
      },
    });
  }

  if (!activeSheet) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h3 className="text-base font-bold text-white">Approval Workspace</h3>
          <p className="text-xs text-slate-400 mt-0.5">Select a pending submission to begin evaluation</p>
        </div>

        {pendingSheets.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400 text-sm font-medium">No pending submissions</p>
            <p className="text-slate-600 text-xs mt-1">All goal sheets have been actioned.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingSheets.map((gs) => {
              const emp = state.employees.find((e) => e.id === gs.employeeId);
              const totalWeight = gs.goals.reduce((s, g) => s + g.weightage, 0);
              return (
                <div
                  key={gs.id}
                  onClick={() => setSelectedSheetId(gs.id)}
                  className="glass rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-all border border-amber-500/15 hover:border-amber-500/30 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-300">{emp?.avatarInitials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{emp?.name}</p>
                        <p className="text-xs text-slate-500">{emp?.designation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{gs.goals.length} goals · {totalWeight}% allocated</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Submitted: {gs.submittedAt ? new Date(gs.submittedAt).toLocaleDateString() : "—"}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full border text-[10px] font-medium ${getStatusBadge(gs.status)}`}>
                        {gs.status}
                      </span>
                      <ChevronLeft className="w-4 h-4 text-slate-500 rotate-180 group-hover:text-amber-400 transition-colors" />
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

  const totalWeight = activeSheet.goals.reduce((s, g) => s + g.weightage, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm animate-slide-up ${
          toast.type === "success"
            ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
            : "bg-red-950/90 border-red-500/40 text-red-300"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Reject dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 w-full max-w-md border border-red-500/25 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-1">Reject Goal Sheet</h4>
            <p className="text-xs text-slate-400 mb-4">
              Provide a structured rejection rationale. The sheet will be returned to Draft status.
            </p>
            <textarea
              className="w-full bg-[#0b1329] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 resize-none"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Weightage distribution does not align with Q3 Strategic OKRs. Cloud Migration goal requires a more granular milestone breakdown. Please revise and resubmit."
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm border border-white/10 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600/20 text-red-300 text-sm border border-red-500/30 hover:bg-red-600/30 disabled:opacity-40"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedSheetId(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> All Submissions
        </button>
        <div>
          <h3 className="text-base font-bold text-white">
            Reviewing: {activeEmployee?.name}
          </h3>
          <p className="text-xs text-slate-400">{activeEmployee?.designation} · FY-2025 Goal Sheet</p>
        </div>
        <span className={`ml-auto px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusBadge(activeSheet.status)}`}>
          {activeSheet.status}
        </span>
      </div>

      {/* Weight summary */}
      <div className="glass rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Total Goals</p>
            <p className="text-xl font-bold text-white">{activeSheet.goals.length}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Total Weightage</p>
            <p className={`text-xl font-bold ${totalWeight === 100 ? "text-emerald-400" : "text-red-400"}`}>
              {totalWeight}%
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Submitted</p>
            <p className="text-sm font-semibold text-white">
              {activeSheet.submittedAt ? new Date(activeSheet.submittedAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] text-indigo-300">Inline editing enabled — changes are audit-logged</span>
        </div>
      </div>

      {/* Goals review table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/8 bg-white/2">
          <p className="text-xs font-semibold text-slate-300">Goal Sheet Evaluation — Inline Adjustment Mode</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {["#", "Strategic Goal", "Thrust Area", "UoM", "Target Value", "Weightage", "Inherited KPI"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeSheet.goals.map((goal, i) => (
                <tr key={goal.id} className={`border-b border-white/5 hover:bg-white/3 ${i % 2 === 0 ? "bg-white/1" : ""}`}>
                  <td className="px-4 py-3 text-slate-500 font-mono">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="font-semibold text-white leading-tight truncate">{goal.title}</p>
                    <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed line-clamp-2">{goal.description}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-[130px]">
                    <span className="truncate block">{goal.thrustArea}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{goal.uom}</td>
                  <td className="px-4 py-3">
                    {goal.isSharedKPI ? (
                      <span className="flex items-center gap-1 text-indigo-300 font-bold">
                        <Lock className="w-3 h-3" /> {goal.targetValue}
                      </span>
                    ) : (
                      <input
                        type="number"
                        className="w-20 bg-[#0b1329] border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500/50 transition-all"
                        value={goal.targetValue}
                        onChange={(e) => handleInlineUpdate(goal.id, "targetValue", parseFloat(e.target.value) || 0)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="w-16 bg-[#0b1329] border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500/50 transition-all"
                        value={goal.weightage}
                        onChange={(e) => handleInlineUpdate(goal.id, "weightage", parseInt(e.target.value) || 0)}
                      />
                      <span className="text-slate-500">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {goal.isSharedKPI ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Yes</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manager commentary */}
      <div className="glass rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-white">Structured Managerial Commentary</h4>
          <span className="text-[10px] text-red-400 ml-1">* Required for approval</span>
        </div>
        <textarea
          className="w-full bg-[#0b1329] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
          rows={4}
          value={managerComment}
          onChange={(e) => setManagerComment(e.target.value)}
          placeholder="Provide structured commentary on goal alignment, target calibration rationale, and any conditions or expectations attached to this approval..."
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setShowRejectDialog(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600/10 text-red-300 border border-red-500/25 text-sm font-semibold hover:bg-red-600/20 transition-all"
        >
          <XCircle className="w-4 h-4" />
          Reject & Return to Draft
        </button>
        <button
          onClick={handleApprove}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-sm font-semibold hover:bg-emerald-600/30 transition-all shadow-glow-emerald"
        >
          <CheckCircle2 className="w-4 h-4" />
          Approve & Lock Sheet
        </button>
      </div>
    </div>
  );
}
