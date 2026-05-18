"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { formatTimestamp } from "@/lib/utils";
import { Shield, Search, Filter, Lock, ChevronDown } from "lucide-react";

const OP_CODE_COLORS: Record<string, string> = {
  CYCLE_TRANSITION:          "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
  SHEET_SUBMITTED:           "bg-blue-500/15 text-blue-300 border-blue-500/25",
  SHEET_APPROVED:            "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  SHEET_REJECTED:            "bg-red-500/15 text-red-300 border-red-500/25",
  TARGET_MODIFIED:           "bg-amber-500/15 text-amber-300 border-amber-500/25",
  WEIGHTAGE_MODIFIED:        "bg-amber-500/15 text-amber-300 border-amber-500/25",
  FIELD_MODIFIED:            "bg-orange-500/15 text-orange-300 border-orange-500/25",
  GOAL_ADDED:                "bg-teal-500/15 text-teal-300 border-teal-500/25",
  GOAL_REMOVED:              "bg-rose-500/15 text-rose-300 border-rose-500/25",
  ACHIEVEMENT_LOGGED:        "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  ADMINISTRATIVE_FORCE_UNLOCK: "bg-red-500/15 text-red-300 border-red-500/30",
};

const OP_CODE_LABELS: Record<string, string> = {
  CYCLE_TRANSITION:          "Cycle Transition",
  SHEET_SUBMITTED:           "Sheet Submitted",
  SHEET_APPROVED:            "Sheet Approved",
  SHEET_REJECTED:            "Sheet Rejected",
  TARGET_MODIFIED:           "Target Modified",
  WEIGHTAGE_MODIFIED:        "Weightage Modified",
  FIELD_MODIFIED:            "Field Modified",
  GOAL_ADDED:                "Goal Added",
  GOAL_REMOVED:              "Goal Removed",
  ACHIEVEMENT_LOGGED:        "Achievement Logged",
  ADMINISTRATIVE_FORCE_UNLOCK: "Admin Force Unlock",
};

export function AuditTrail() {
  const { state } = useApp();
  const [search, setSearch] = useState("");
  const [filterCode, setFilterCode] = useState("ALL");

  const allCodes = ["ALL", ...Array.from(new Set(state.auditLog.map((e) => e.operationalCode)))];

  const filtered = state.auditLog.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.initiatingPrincipal.toLowerCase().includes(search.toLowerCase()) ||
      entry.operationalCode.toLowerCase().includes(search.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(search.toLowerCase()) ||
      entry.priorState.toLowerCase().includes(search.toLowerCase()) ||
      entry.revisedValue.toLowerCase().includes(search.toLowerCase());
    const matchesCode = filterCode === "ALL" || entry.operationalCode === filterCode;
    return matchesSearch && matchesCode;
  });

  const principalCounts: Record<string, number> = {};
  state.auditLog.forEach((e) => {
    principalCounts[e.initiatingPrincipal] = (principalCounts[e.initiatingPrincipal] ?? 0) + 1;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Immutability Verification Log</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic audit trail · Every state change is permanently recorded
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">{state.auditLog.length} immutable entries</span>
        </div>
      </div>

      {/* Stats by principal */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(principalCounts).map(([principal, count]) => {
          const initials = principal.split(" ").map((w) => w[0]).join("").slice(0, 2);
          return (
            <div key={principal} className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/8">
              <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-indigo-300">{initials}</span>
              </div>
              <span className="text-xs text-slate-300">{principal}</span>
              <span className="text-xs font-bold text-white ml-1">{count}</span>
              <span className="text-[10px] text-slate-600">entries</span>
            </div>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit log..."
            className="w-full bg-[#0b1329] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <select
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
            className="bg-[#0b1329] border border-white/10 rounded-lg pl-8 pr-8 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
          >
            {allCodes.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Op Codes" : (OP_CODE_LABELS[c] ?? c)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/8 bg-white/2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">
            Immutable Ledger — {filtered.length} of {state.auditLog.length} entries displayed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {["Timestamp", "Initiating Principal", "Op Code", "Entity", "Prior State", "Revised Value"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const codeStyle = OP_CODE_COLORS[entry.operationalCode] ?? "bg-slate-500/15 text-slate-300 border-slate-500/25";
                return (
                  <tr key={entry.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "bg-white/1" : ""}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] text-slate-400">{formatTimestamp(entry.timestamp)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-600/25 border border-indigo-500/25 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-indigo-300">
                            {entry.initiatingPrincipal.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-slate-300 text-[11px] whitespace-nowrap">{entry.initiatingPrincipal}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold whitespace-nowrap ${codeStyle}`}>
                        {OP_CODE_LABELS[entry.operationalCode] ?? entry.operationalCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase tracking-wider">{entry.entityType}</p>
                        <p className="text-slate-300 text-[11px] font-medium truncate">{entry.entityId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="text-slate-500 text-[11px] leading-snug line-clamp-2">{entry.priorState}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-slate-300 text-[11px] leading-snug line-clamp-2">{entry.revisedValue}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-slate-500 text-sm">No audit entries match the current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Immutability notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-slate-900/60 border border-white/6">
        <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          All entries in this ledger are written once and never modified. Each record captures a deterministic system state transition, creating a tamper-evident chronological chain of enterprise performance data governance events for FY-2025.
        </p>
      </div>
    </div>
  );
}
