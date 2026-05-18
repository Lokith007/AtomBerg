"use client";

import { useApp } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

// Employee Views
import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";
import { GoalWizard } from "@/components/employee/GoalWizard";
import { SharedKPIs } from "@/components/employee/SharedKPIs";
import { QuarterlyLogger } from "@/components/employee/QuarterlyLogger";

// Manager Views
import { LeadershipPanel } from "@/components/manager/LeadershipPanel";
import { ApprovalWorkspace } from "@/components/manager/ApprovalWorkspace";
import { CheckInMatrix } from "@/components/manager/CheckInMatrix";

// Admin Views
import { CycleSwitchboard } from "@/components/admin/CycleSwitchboard";
import { AnalyticsSuite } from "@/components/admin/AnalyticsSuite";
import { AuditTrail } from "@/components/admin/AuditTrail";
import { DataExporter } from "@/components/admin/DataExporter";

function ActiveView() {
  const { state } = useApp();

  switch (state.activeView) {
    // Employee
    case "dashboard":         return <EmployeeDashboard />;
    case "goal-wizard":       return <GoalWizard />;
    case "shared-kpis":       return <SharedKPIs />;
    case "quarterly-logger":  return <QuarterlyLogger />;
    // Manager
    case "leadership-panel":  return <LeadershipPanel />;
    case "approval-workspace":return <ApprovalWorkspace />;
    case "checkin-matrix":    return <CheckInMatrix />;
    // Admin
    case "cycle-switchboard": return <CycleSwitchboard />;
    case "analytics":         return <AnalyticsSuite />;
    case "audit-trail":       return <AuditTrail />;
    case "data-exporter":     return <DataExporter />;
    default:                  return <EmployeeDashboard />;
  }
}

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1329]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        {/* Scrollable view area */}
        <main className="flex-1 overflow-y-auto p-6">
          <ActiveView />
        </main>

        {/* Role Switcher — persistent bottom bar */}
        <RoleSwitcher />
      </div>
    </div>
  );
}
