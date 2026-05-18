"use client";

import { useApp } from "@/lib/store";
import { Lock, Share2, Info } from "lucide-react";

export function SharedKPIs() {
  const { state } = useApp();

  const sheet = state.goalSheets.find((gs) => gs.employeeId === "emp-001");
  if (!sheet) return null;

  const sharedGoals = sheet.goals.filter((g) => g.isSharedKPI);

  const divisionKPIs = [
    {
      id: "dkpi-001",
      title: "Global Infrastructure Availability SLA Compliance",
      pushedBy: "Marcus Vance",
      target: "99.95%",
      uom: "Percentage (Higher-is-Better)",
      description:
        "Mandatory divisional target mandated by the Enterprise Reliability Council. All infrastructure owners must track and report actuals against this SLA each quarter. Title and Target are immutably governed by leadership.",
      thrustArea: "Operational Reliability & Uptime",
    },
    {
      id: "dkpi-002",
      title: "Critical Security Vulnerability Zero-Day Response",
      pushedBy: "Marcus Vance",
      target: "0 incidents",
      uom: "Zero-Based Incident",
      description:
        "Divisional mandate aligned to the Global Data Compliance Framework. All senior engineers must maintain a zero-incident record for P0 security vulnerabilities. Target is fixed at zero — no exceptions or variances permitted.",
      thrustArea: "Security & Compliance Excellence",
    },
    {
      id: "dkpi-003",
      title: "Engineering FinOps Cloud Spend Efficiency Ratio",
      pushedBy: "Marcus Vance",
      target: "≥ 82% utilisation efficiency",
      uom: "Percentage (Higher-is-Better)",
      description:
        "Quarterly FinOps reporting commitment linked to the Q3 Strategic OKRs approved by the VP of Engineering. Tracks cloud resource utilisation against provisioned capacity across all owned infrastructure components.",
      thrustArea: "Cost Optimization & FinOps",
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Inherited KPI Core</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Top-down performance parameters pushed by Marcus Vance, Director of Engineering
          </p>
        </div>
      </div>

      {/* Governance notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-indigo-950/40 border border-indigo-500/25">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-300/80 leading-relaxed">
          <strong className="text-indigo-300">Governance Constraint:</strong> Shared KPIs inherit their Title and Target Value directly from divisional leadership and are rendered as immutable read-only parameters. You may adapt the Weightage allocation within your goal sheet, but may not modify the strategic objective or performance threshold.
        </div>
      </div>

      {/* Active inherited KPIs from Sarah's goal sheet */}
      {sharedGoals.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium px-1">
            Your Active Inherited KPIs ({sharedGoals.length})
          </p>
          {sharedGoals.map((g) => (
            <div key={g.id} className="glass rounded-xl p-4 border border-indigo-500/15">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{g.title}</p>
                    <p className="text-[11px] text-indigo-400 mt-0.5">{g.thrustArea}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
                  Inherited KPI
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white/4 rounded-lg px-3 py-2">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Target (Locked)</p>
                  <p className="text-white font-bold">{g.targetValue}</p>
                </div>
                <div className="bg-white/4 rounded-lg px-3 py-2">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">UoM (Locked)</p>
                  <p className="text-slate-300 font-medium leading-tight">{g.uom}</p>
                </div>
                <div className="bg-white/4 rounded-lg px-3 py-2">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Your Weightage</p>
                  <p className="text-indigo-300 font-bold">{g.weightage}%</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">{g.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Full divisional KPI library */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-medium px-1">
          Divisional KPI Library (FY-2025 · Engineering Division)
        </p>
        {divisionKPIs.map((kpi) => (
          <div key={kpi.id} className="glass rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{kpi.title}</p>
                  <p className="text-[11px] text-amber-400/80 mt-0.5">Pushed by: {kpi.pushedBy}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
                {kpi.thrustArea}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/4 rounded-lg px-3 py-2">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Governed Target</p>
                <p className="text-white font-bold text-sm">{kpi.target}</p>
              </div>
              <div className="bg-white/4 rounded-lg px-3 py-2">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Measurement Method</p>
                <p className="text-slate-300 font-medium text-xs leading-tight">{kpi.uom}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">{kpi.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
