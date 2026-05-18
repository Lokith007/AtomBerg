export type CyclePhase =
  | "Goal Setting Phase"
  | "Q1 Window"
  | "Q2 Window"
  | "Q3 Window"
  | "Q4 Window"
  | "Locked";

export type GoalSheetStatus = "Draft" | "Awaiting Approval" | "Approved & Locked";

export type GoalStatus = "Not Started" | "On Track" | "Behind" | "Completed";

export type UoM =
  | "Numeric (Higher-is-Better)"
  | "Numeric (Lower-is-Better)"
  | "Percentage (Higher-is-Better)"
  | "Percentage (Lower-is-Better)"
  | "Zero-Based Incident";

export type ThrustArea =
  | "Cloud Infrastructure Modernization"
  | "Security & Compliance Excellence"
  | "Operational Reliability & Uptime"
  | "Engineering Velocity & Quality"
  | "Cost Optimization & FinOps"
  | "Talent Development & Knowledge Transfer"
  | "Customer Experience & SLA Adherence"
  | "Data Governance & Analytics";

export interface Goal {
  id: string;
  thrustArea: ThrustArea;
  title: string;
  description: string;
  uom: UoM;
  targetValue: number;
  weightage: number;
  status: GoalStatus;
  actualValue?: number;
  isSharedKPI: boolean;
  quarterlyActuals: {
    Q1?: number;
    Q2?: number;
    Q3?: number;
    Q4?: number;
  };
}

export interface GoalSheet {
  id: string;
  employeeId: string;
  fiscalYear: string;
  goals: Goal[];
  status: GoalSheetStatus;
  submittedAt?: string;
  approvedAt?: string;
  managerComments?: string;
  rejectionReason?: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  managerId?: string;
  avatarInitials: string;
  personaRole: "employee" | "manager" | "admin";
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  initiatingPrincipal: string;
  operationalCode: string;
  entityType: string;
  entityId: string;
  priorState: string;
  revisedValue: string;
}

export type AppRole = "employee" | "manager" | "admin";

export type ActiveView =
  | "dashboard"
  | "goal-wizard"
  | "shared-kpis"
  | "quarterly-logger"
  | "leadership-panel"
  | "approval-workspace"
  | "checkin-matrix"
  | "cycle-switchboard"
  | "analytics"
  | "audit-trail"
  | "data-exporter";

export interface AppState {
  currentRole: AppRole;
  activeView: ActiveView;
  currentCycle: CyclePhase;
  selectedEmployeeId: string | null;
  employees: Employee[];
  goalSheets: GoalSheet[];
  auditLog: AuditEntry[];
}
