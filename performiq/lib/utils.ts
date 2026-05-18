import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UoM, GoalStatus, GoalSheetStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function calculatePerformanceScore(
  uom: UoM,
  target: number,
  actual: number
): number {
  if (target === 0 && actual === 0) return 100;
  switch (uom) {
    case "Zero-Based Incident":
      return actual === 0 ? 100 : 0;
    case "Numeric (Lower-is-Better)":
    case "Percentage (Lower-is-Better)":
      if (actual === 0) return 100;
      return Math.min(Math.round((target / actual) * 100), 150);
    case "Numeric (Higher-is-Better)":
    case "Percentage (Higher-is-Better)":
    default:
      if (target === 0) return 0;
      return Math.min(Math.round((actual / target) * 100), 150);
  }
}

export function getScoreBadge(score: number): {
  label: string;
  className: string;
} {
  if (score >= 100)
    return {
      label: "Exceeds Target",
      className:
        "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    };
  if (score >= 80)
    return {
      label: "On Track",
      className: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    };
  if (score >= 60)
    return {
      label: "Needs Attention",
      className: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    };
  return {
    label: "At Risk",
    className: "bg-red-500/15 text-red-300 border border-red-500/30",
  };
}

export function getStatusBadge(status: GoalStatus | GoalSheetStatus | string): string {
  switch (status) {
    case "Completed":
    case "Approved & Locked":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25";
    case "On Track":
    case "Goal Setting Phase":
      return "bg-blue-500/15 text-blue-300 border border-blue-500/25";
    case "Behind":
    case "Locked":
      return "bg-red-500/15 text-red-300 border border-red-500/25";
    case "Awaiting Approval":
      return "bg-amber-500/15 text-amber-300 border border-amber-500/25";
    case "Not Started":
    case "Draft":
      return "bg-slate-500/15 text-slate-300 border border-slate-500/25";
    case "Q1 Window":
    case "Q2 Window":
    case "Q3 Window":
    case "Q4 Window":
      return "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25";
    default:
      return "bg-slate-500/15 text-slate-300 border border-slate-500/25";
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? "" : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
