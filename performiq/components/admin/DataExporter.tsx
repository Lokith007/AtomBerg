"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { exportToCSV, calculatePerformanceScore, formatTimestamp } from "@/lib/utils";
import { Download, FileText, Shield, Users, CheckCircle2 } from "lucide-react";

const EXPORTS = [
  {
    id: "goal-sheets",
    label: "Complete Goal Sheet Matrix",
    description:
      "Full export of all employee goal sheets including goal titles, thrust areas, UoM, targets, weightages, actual values, quarterly actuals, and performance scores.",
    icon: FileText,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    filename: "PerformIQ_GoalSheets_FY2025.csv",
  },
  {
    id: "audit-log",
    label: "Immutable Audit Trail",
    description:
      "Complete chronological ledger of all state-change events including timestamps, initiating principals, operational codes, prior states, and revised values.",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    filename: "PerformIQ_AuditTrail_FY2025.csv",
  },
  {
    id: "employee-roster",
    label: "Employee Performance Roster",
    description:
      "High-level employee roster with sheet approval status, weighted performance scores, and goal completion statistics.",
    icon: Users,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    filename: "PerformIQ_EmployeeRoster_FY2025.csv",
  },
];

export function DataExporter() {
  const { state, dispatch } = useApp();
  const [exported, setExported] = useState<string | null>(null);

  function handleExport(exportId: string, filename: string) {
    let data: Record<string, unknown>[] = [];

    if (exportId === "goal-sheets") {
      state.goalSheets.forEach((sheet) => {
        const emp = state.employees.find((e) => e.id === sheet.employeeId);
        sheet.goals.forEach((goal) => {
          const score =
            goal.actualValue !== undefined
              ? calculatePerformanceScore(goal.uom, goal.targetValue, goal.actualValue)
              : null;
          data.push({
            "Employee ID": emp?.id ?? "",
            "Employee Name": emp?.name ?? "",
            Designation: emp?.designation ?? "",
            Department: emp?.department ?? "",
            "Fiscal Year": sheet.fiscalYear,
            "Sheet Status": sheet.status,
            "Submitted At": sheet.submittedAt ? formatTimestamp(sheet.submittedAt) : "",
            "Approved At": sheet.approvedAt ? formatTimestamp(sheet.approvedAt) : "",
            "Goal ID": goal.id,
            "Goal Title": goal.title,
            "Thrust Area": goal.thrustArea,
            "Unit of Measurement": goal.uom,
            "Target Value": goal.targetValue,
            "Weightage (%)": goal.weightage,
            "Actual Value": goal.actualValue ?? "",
            "Q1 Actual": goal.quarterlyActuals?.Q1 ?? "",
            "Q2 Actual": goal.quarterlyActuals?.Q2 ?? "",
            "Q3 Actual": goal.quarterlyActuals?.Q3 ?? "",
            "Q4 Actual": goal.quarterlyActuals?.Q4 ?? "",
            "Performance Score (%)": score !== null ? Math.round(score) : "",
            "Goal Status": goal.status,
            "Inherited KPI": goal.isSharedKPI ? "Yes" : "No",
            "Manager Comments": sheet.managerComments ?? "",
          });
        });
      });
    } else if (exportId === "audit-log") {
      data = state.auditLog.map((entry) => ({
        "Entry ID": entry.id,
        Timestamp: formatTimestamp(entry.timestamp),
        "Initiating Principal": entry.initiatingPrincipal,
        "Operational Code": entry.operationalCode,
        "Entity Type": entry.entityType,
        "Entity ID": entry.entityId,
        "Prior State": entry.priorState,
        "Revised Value": entry.revisedValue,
      }));
    } else if (exportId === "employee-roster") {
      state.employees
        .filter((e) => e.personaRole === "employee")
        .forEach((emp) => {
          const sheet = state.goalSheets.find((gs) => gs.employeeId === emp.id);
          const score = sheet
            ? sheet.goals.reduce((acc, g) => {
                if (g.actualValue === undefined) return acc;
                return acc + (calculatePerformanceScore(g.uom, g.targetValue, g.actualValue) * g.weightage) / 100;
              }, 0)
            : null;
          const goalsWithActuals = sheet?.goals.filter((g) => g.actualValue !== undefined).length ?? 0;
          data.push({
            "Employee ID": emp.id,
            "Employee Name": emp.name,
            Designation: emp.designation,
            Department: emp.department,
            "Manager ID": emp.managerId ?? "",
            "Fiscal Year": "FY-2025",
            "Sheet Status": sheet?.status ?? "No Sheet",
            "Total Goals": sheet?.goals.length ?? 0,
            "Goals with Actuals": goalsWithActuals,
            "Weighted Performance Score (%)": score !== null && goalsWithActuals > 0 ? Math.round(score) : "N/A",
            "Sheet Submitted": sheet?.submittedAt ? formatTimestamp(sheet.submittedAt) : "",
            "Sheet Approved": sheet?.approvedAt ? formatTimestamp(sheet.approvedAt) : "",
          });
        });
    }

    exportToCSV(data, filename);

    // Log to audit trail
    dispatch({
      type: "ADD_AUDIT_ENTRY",
      payload: {
        initiatingPrincipal: "Elena Rostova",
        operationalCode: "DATA_EXPORT_INITIATED",
        entityType: "Data Export",
        entityId: filename,
        priorState: "In-System Dataset",
        revisedValue: `CSV Export — ${data.length} records — ${filename}`,
      },
    });

    setExported(exportId);
    setTimeout(() => setExported(null), 2500);
  }

  const exportStats = {
    totalGoals: state.goalSheets.reduce((s, gs) => s + gs.goals.length, 0),
    totalAudit: state.auditLog.length,
    totalEmployees: state.employees.filter((e) => e.personaRole === "employee").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-base font-bold text-white">Corporate Data Exporter</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Generate and download complete performance data matrices as operational spreadsheets
        </p>
      </div>

      {/* Dataset overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Goal Records", value: exportStats.totalGoals, sub: "Across all employees" },
          { label: "Audit Entries", value: exportStats.totalAudit, sub: "Immutable log entries" },
          { label: "Employees Tracked", value: exportStats.totalEmployees, sub: "Direct report roster" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">{s.label}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Export cards */}
      <div className="space-y-4">
        {EXPORTS.map((exp) => {
          const Icon = exp.icon;
          const isExported = exported === exp.id;
          const recordCount =
            exp.id === "goal-sheets"
              ? exportStats.totalGoals
              : exp.id === "audit-log"
              ? exportStats.totalAudit
              : exportStats.totalEmployees;

          return (
            <div
              key={exp.id}
              className={`glass rounded-xl p-5 border transition-all ${exp.bg}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${exp.bg}`}>
                    <Icon className={`w-5 h-5 ${exp.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white">{exp.label}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-slate-400 border border-white/8">
                        {recordCount} records
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <FileText className="w-3 h-3 text-slate-600" />
                      <span className="text-[11px] text-slate-600 font-mono">{exp.filename}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleExport(exp.id, exp.filename)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                    isExported
                      ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                      : `bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white`
                  }`}
                >
                  {isExported ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-slate-900/50 border border-white/6">
        <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          All data export operations are automatically logged as immutable entries in the Audit Trail under the credentials of the initiating HR principal. CSV files are generated client-side from the in-memory data engine and do not traverse any external network endpoint.
        </p>
      </div>

      {/* Force unlock section */}
      <div className="glass rounded-xl p-5 border border-red-500/15">
        <h4 className="text-sm font-semibold text-white mb-1">Administrative Exception Controls</h4>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Force-unlock approved goal sheets for exceptional correction scenarios. Each unlock is permanently recorded in the audit trail with the HR principal&apos;s credentials. Use only for documented business exceptions.
        </p>
        <div className="space-y-2">
          {state.goalSheets
            .filter((gs) => gs.status === "Approved & Locked")
            .map((gs) => {
              const emp = state.employees.find((e) => e.id === gs.employeeId);
              return (
                <div key={gs.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/3 border border-white/6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600/20 border border-emerald-500/25 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-emerald-300">{emp?.avatarInitials}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{emp?.name}</p>
                      <p className="text-[10px] text-slate-500">{emp?.designation} · Approved & Locked</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      dispatch({
                        type: "FORCE_UNLOCK_SHEET",
                        payload: { sheetId: gs.id, initiator: "Elena Rostova" },
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/25 text-xs font-semibold hover:bg-red-500/20 transition-all"
                  >
                    Force Unlock
                  </button>
                </div>
              );
            })}
          {state.goalSheets.filter((gs) => gs.status === "Approved & Locked").length === 0 && (
            <p className="text-xs text-slate-600 text-center py-2">No approved sheets currently available for force-unlock.</p>
          )}
        </div>
      </div>
    </div>
  );
}
