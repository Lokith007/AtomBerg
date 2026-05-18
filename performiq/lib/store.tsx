"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";
import {
  AppState,
  AppRole,
  ActiveView,
  CyclePhase,
  Goal,
  GoalStatus,
  Employee,
  AuditEntry,
  GoalSheet,
} from "@/types";
import { generateId } from "@/lib/utils";

// ─── Initial Dataset ─────────────────────────────────────────────────────────

const initialEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "Sarah Jenkins",
    designation: "Senior Cloud Engineer",
    department: "Enterprise Infrastructure Division",
    managerId: "mgr-001",
    avatarInitials: "SJ",
    personaRole: "employee",
  },
  {
    id: "emp-002",
    name: "Alex Chen",
    designation: "Cloud Infrastructure Specialist",
    department: "Enterprise Infrastructure Division",
    managerId: "mgr-001",
    avatarInitials: "AC",
    personaRole: "employee",
  },
  {
    id: "emp-003",
    name: "Maya Patel",
    designation: "DevOps Engineering Lead",
    department: "Enterprise Infrastructure Division",
    managerId: "mgr-001",
    avatarInitials: "MP",
    personaRole: "employee",
  },
  {
    id: "emp-004",
    name: "Jordan Kim",
    designation: "Platform Reliability Engineer",
    department: "Enterprise Infrastructure Division",
    managerId: "mgr-001",
    avatarInitials: "JK",
    personaRole: "employee",
  },
  {
    id: "emp-005",
    name: "Chris Morgan",
    designation: "Solutions Architect",
    department: "Enterprise Infrastructure Division",
    managerId: "mgr-001",
    avatarInitials: "CM",
    personaRole: "employee",
  },
  {
    id: "mgr-001",
    name: "Marcus Vance",
    designation: "Director of Engineering",
    department: "Enterprise Infrastructure Division",
    avatarInitials: "MV",
    personaRole: "manager",
  },
  {
    id: "admin-001",
    name: "Elena Rostova",
    designation: "VP of People & Culture",
    department: "Human Resources & Organizational Development",
    avatarInitials: "ER",
    personaRole: "admin",
  },
];

const initialGoalSheets: GoalSheet[] = [
  // ── Sarah Jenkins — Awaiting Approval ──────────────────────────────────────
  {
    id: "gs-001",
    employeeId: "emp-001",
    fiscalYear: "FY-2025",
    status: "Awaiting Approval",
    submittedAt: "2025-02-01T14:35:22Z",
    goals: [
      {
        id: "g-001-1",
        thrustArea: "Cloud Infrastructure Modernization",
        title: "Hybrid Cloud Migration to Multi-Region Architecture",
        description:
          "Lead the migration of 85% of core enterprise workloads to a resilient multi-region cloud architecture, ensuring zero-downtime transition with automated failover capabilities and geo-redundant data replication.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 85,
        weightage: 30,
        status: "On Track",
        actualValue: 42,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 42 },
      },
      {
        id: "g-001-2",
        thrustArea: "Security & Compliance Excellence",
        title: "Enterprise Security Posture — Critical Incident Prevention",
        description:
          "Achieve zero critical security incidents by deploying advanced threat detection, automated vulnerability patching workflows, and continuous compliance monitoring across all Tier-1 infrastructure layers.",
        uom: "Zero-Based Incident",
        targetValue: 0,
        weightage: 20,
        status: "Behind",
        actualValue: 1,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 1 },
      },
      {
        id: "g-001-3",
        thrustArea: "Operational Reliability & Uptime",
        title: "Global Infrastructure Availability SLA Attainment",
        description:
          "Maintain enterprise infrastructure availability at or above the contractual SLA threshold of 99.95% across all production environments and critical service delivery tiers throughout the fiscal year.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 99.95,
        weightage: 15,
        status: "Behind",
        actualValue: 99.87,
        isSharedKPI: true,
        quarterlyActuals: { Q1: 99.87 },
      },
      {
        id: "g-001-4",
        thrustArea: "Cost Optimization & FinOps",
        title: "Cloud FinOps Cost Reduction Programme",
        description:
          "Drive an 18% year-over-year cloud infrastructure cost reduction through rightsizing initiatives, reserved instance optimisation, spot-instance strategies, and automated resource scheduling frameworks.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 18,
        weightage: 20,
        status: "On Track",
        actualValue: 8,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 8 },
      },
      {
        id: "g-001-5",
        thrustArea: "Talent Development & Knowledge Transfer",
        title: "Technical Knowledge Transfer & Documentation Programme",
        description:
          "Facilitate 12 structured knowledge-transfer sessions covering cloud architecture patterns, IaC best practices, and operational runbooks to measurably elevate division-wide engineering capability.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 12,
        weightage: 15,
        status: "On Track",
        actualValue: 4,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 4 },
      },
    ],
  },
  // ── Alex Chen — Draft ──────────────────────────────────────────────────────
  {
    id: "gs-002",
    employeeId: "emp-002",
    fiscalYear: "FY-2025",
    status: "Draft",
    goals: [
      {
        id: "g-002-1",
        thrustArea: "Cloud Infrastructure Modernization",
        title: "Kubernetes Cluster Fleet Optimisation & Hardening",
        description:
          "Optimise the enterprise Kubernetes fleet across all production clusters, achieving 90% resource utilisation efficiency through advanced scheduling policies, vertical pod autoscaling, and cluster-level hardening.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 90,
        weightage: 35,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-002-2",
        thrustArea: "Security & Compliance Excellence",
        title: "Automated Compliance Scanning Framework Implementation",
        description:
          "Deploy automated compliance scanning across 8 key regulatory domains (SOC 2, ISO 27001, PCI-DSS, GDPR, HIPAA, NIST, CIS Benchmarks, FedRAMP) using policy-as-code integrated into the enterprise CI/CD pipeline.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 8,
        weightage: 25,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-002-3",
        thrustArea: "Engineering Velocity & Quality",
        title: "Infrastructure-as-Code Coverage Expansion Initiative",
        description:
          "Achieve 95% IaC coverage across all enterprise infrastructure components, fully eliminating manual provisioning and ensuring complete audit-trail compliance for every environment change.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 95,
        weightage: 25,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-002-4",
        thrustArea: "Cost Optimization & FinOps",
        title: "Annual Cloud Budget Intelligence & Forecasting Framework",
        description:
          "Deliver a cloud cost forecasting framework with ML-assisted predictive analytics, enabling proactive budget management, variance alerting, and showback/chargeback reporting for divisional leadership.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 15,
        weightage: 15,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
    ],
  },
  // ── Maya Patel — Approved & Locked ────────────────────────────────────────
  {
    id: "gs-003",
    employeeId: "emp-003",
    fiscalYear: "FY-2025",
    status: "Approved & Locked",
    submittedAt: "2025-01-28T10:15:00Z",
    approvedAt: "2025-02-05T16:48:30Z",
    managerComments:
      "Exemplary goal alignment with divisional priorities. CI/CD deployment targets revised upward to reflect strategic pipeline acceleration commitments. Approved with full confidence in Maya's sustained execution capability and technical leadership.",
    goals: [
      {
        id: "g-003-1",
        thrustArea: "Engineering Velocity & Quality",
        title: "CI/CD Pipeline Deployment Frequency Enhancement",
        description:
          "Scale the enterprise CI/CD pipeline to sustain a minimum of 50 production deployments per week with zero quality regressions, enabling accelerated feature velocity and time-to-market improvements across all product delivery streams.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 50,
        weightage: 30,
        status: "Completed",
        actualValue: 52,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 38, Q2: 45, Q3: 52 },
      },
      {
        id: "g-003-2",
        thrustArea: "Engineering Velocity & Quality",
        title: "Infrastructure Automation Coverage Expansion",
        description:
          "Advance infrastructure automation coverage from 62% to 90% across all production and staging environments, proportionally reducing manual operational overhead and improving deployment consistency.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 90,
        weightage: 25,
        status: "On Track",
        actualValue: 81,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 65, Q2: 73, Q3: 81 },
      },
      {
        id: "g-003-3",
        thrustArea: "Operational Reliability & Uptime",
        title: "Mean Time to Recovery (MTTR) Engineering Excellence",
        description:
          "Reduce enterprise Mean Time to Recovery for platform incidents from 4.8 hours to under 2.5 hours through automated runbook execution, AI-assisted root-cause analysis, and on-call process redesign.",
        uom: "Numeric (Lower-is-Better)",
        targetValue: 2.5,
        weightage: 25,
        status: "On Track",
        actualValue: 3.2,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 4.5, Q2: 3.8, Q3: 3.2 },
      },
      {
        id: "g-003-4",
        thrustArea: "Operational Reliability & Uptime",
        title: "Platform Engineering Critical Incident Prevention",
        description:
          "Achieve zero P0/P1 critical platform incidents attributable to infrastructure defects through proactive capacity planning, chaos engineering practices, and automated anomaly detection with self-healing capabilities.",
        uom: "Zero-Based Incident",
        targetValue: 0,
        weightage: 20,
        status: "On Track",
        actualValue: 0,
        isSharedKPI: false,
        quarterlyActuals: { Q1: 2, Q2: 1, Q3: 0 },
      },
    ],
  },
  // ── Jordan Kim — Awaiting Approval ────────────────────────────────────────
  {
    id: "gs-004",
    employeeId: "emp-004",
    fiscalYear: "FY-2025",
    status: "Awaiting Approval",
    submittedAt: "2025-02-03T09:45:00Z",
    goals: [
      {
        id: "g-004-1",
        thrustArea: "Operational Reliability & Uptime",
        title: "Enterprise System Reliability Score Attainment",
        description:
          "Elevate the enterprise system reliability composite score to 99.9% across all Tier-1 production services, measured through synthetic transaction monitoring and real-user experience telemetry dashboards.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 99.9,
        weightage: 40,
        status: "Not Started",
        isSharedKPI: true,
        quarterlyActuals: {},
      },
      {
        id: "g-004-2",
        thrustArea: "Operational Reliability & Uptime",
        title: "Incident Response Mean Time to Acknowledge Reduction",
        description:
          "Reduce the mean time to acknowledgment and triage for production incidents to under 15 minutes through enhanced PagerDuty routing, AI-assisted root-cause analysis, and on-call rotation optimisation.",
        uom: "Numeric (Lower-is-Better)",
        targetValue: 15,
        weightage: 30,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-004-3",
        thrustArea: "Engineering Velocity & Quality",
        title: "Unified Monitoring & Full-Stack Observability Coverage",
        description:
          "Achieve 95% observability coverage across all microservices and infrastructure components through distributed tracing, structured logging, and custom SLI/SLO dashboards with automated alerting thresholds.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 95,
        weightage: 20,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-004-4",
        thrustArea: "Security & Compliance Excellence",
        title: "Annual Disaster Recovery Validation Exercise Programme",
        description:
          "Execute 4 comprehensive disaster recovery validation exercises encompassing full regional failover scenarios, data integrity verification, RTO/RPO compliance certification, and post-exercise remediation tracking.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 4,
        weightage: 10,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
    ],
  },
  // ── Chris Morgan — Draft ───────────────────────────────────────────────────
  {
    id: "gs-005",
    employeeId: "emp-005",
    fiscalYear: "FY-2025",
    status: "Draft",
    goals: [
      {
        id: "g-005-1",
        thrustArea: "Cloud Infrastructure Modernization",
        title: "Global Enterprise Architecture Blueprint Programme",
        description:
          "Deliver a comprehensive enterprise architecture blueprint covering the 3-year cloud roadmap, technology standards governance framework, and operating model for the Global Infrastructure Division — validated by C-suite stakeholders.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 100,
        weightage: 35,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-005-2",
        thrustArea: "Engineering Velocity & Quality",
        title: "Architectural Solution Design Documentation Library",
        description:
          "Author and publish 15 architectural solution design documents covering reference architectures for cloud-native applications, distributed data platforms, and security-by-design patterns aligned to enterprise standards.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 15,
        weightage: 30,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-005-3",
        thrustArea: "Customer Experience & SLA Adherence",
        title: "Technical Advisory Services First-Response Resolution Rate",
        description:
          "Achieve 80% first-response resolution for cross-functional architecture consultations within defined SLA windows, reducing repeat escalations and improving stakeholder confidence in the architecture practice.",
        uom: "Percentage (Higher-is-Better)",
        targetValue: 80,
        weightage: 25,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
      {
        id: "g-005-4",
        thrustArea: "Talent Development & Knowledge Transfer",
        title: "Cross-Functional Architecture Alignment Sessions",
        description:
          "Facilitate 12 structured cross-functional architecture alignment forums with Product, Engineering, and Operations leadership to maintain strategic coherence, reduce architectural drift, and standardise technology decisions.",
        uom: "Numeric (Higher-is-Better)",
        targetValue: 12,
        weightage: 10,
        status: "Not Started",
        isSharedKPI: false,
        quarterlyActuals: {},
      },
    ],
  },
];

const initialAuditLog: AuditEntry[] = [
  {
    id: "aud-001",
    timestamp: "2025-01-15T09:23:11Z",
    initiatingPrincipal: "Elena Rostova",
    operationalCode: "CYCLE_TRANSITION",
    entityType: "Performance Cycle",
    entityId: "FY-2025",
    priorState: "Locked",
    revisedValue: "Goal Setting Phase",
  },
  {
    id: "aud-002",
    timestamp: "2025-01-28T10:15:00Z",
    initiatingPrincipal: "Maya Patel",
    operationalCode: "SHEET_SUBMITTED",
    entityType: "Goal Sheet",
    entityId: "GS-MP-FY2025",
    priorState: "Draft",
    revisedValue: "Awaiting Approval",
  },
  {
    id: "aud-003",
    timestamp: "2025-02-01T14:35:22Z",
    initiatingPrincipal: "Sarah Jenkins",
    operationalCode: "SHEET_SUBMITTED",
    entityType: "Goal Sheet",
    entityId: "GS-SJ-FY2025",
    priorState: "Draft",
    revisedValue: "Awaiting Approval",
  },
  {
    id: "aud-004",
    timestamp: "2025-02-03T09:45:00Z",
    initiatingPrincipal: "Jordan Kim",
    operationalCode: "SHEET_SUBMITTED",
    entityType: "Goal Sheet",
    entityId: "GS-JK-FY2025",
    priorState: "Draft",
    revisedValue: "Awaiting Approval",
  },
  {
    id: "aud-005",
    timestamp: "2025-02-03T16:22:15Z",
    initiatingPrincipal: "Marcus Vance",
    operationalCode: "TARGET_MODIFIED",
    entityType: "Goal",
    entityId: "GS-MP-FY2025 / CI/CD Deployment Frequency",
    priorState: "targetValue: 45 deployments/week",
    revisedValue: "targetValue: 50 deployments/week",
  },
  {
    id: "aud-006",
    timestamp: "2025-02-05T16:48:30Z",
    initiatingPrincipal: "Marcus Vance",
    operationalCode: "SHEET_APPROVED",
    entityType: "Goal Sheet",
    entityId: "GS-MP-FY2025",
    priorState: "Awaiting Approval",
    revisedValue: "Approved & Locked",
  },
  {
    id: "aud-007",
    timestamp: "2025-03-01T08:30:00Z",
    initiatingPrincipal: "Elena Rostova",
    operationalCode: "CYCLE_TRANSITION",
    entityType: "Performance Cycle",
    entityId: "FY-2025",
    priorState: "Goal Setting Phase",
    revisedValue: "Q1 Window",
  },
  {
    id: "aud-008",
    timestamp: "2025-04-02T11:20:33Z",
    initiatingPrincipal: "Maya Patel",
    operationalCode: "ACHIEVEMENT_LOGGED",
    entityType: "Quarterly Achievement",
    entityId: "GS-MP-FY2025 / Q1 Submission",
    priorState: "Not Submitted",
    revisedValue: "Q1 Actuals Submitted — 4 of 4 Goals Recorded",
  },
];

const initialState: AppState = {
  currentRole: "employee",
  activeView: "dashboard",
  currentCycle: "Q1 Window",
  selectedEmployeeId: null,
  employees: initialEmployees,
  goalSheets: initialGoalSheets,
  auditLog: initialAuditLog,
};

// ─── Action Types ─────────────────────────────────────────────────────────────

type AppAction =
  | { type: "SET_ROLE"; payload: AppRole }
  | { type: "SET_VIEW"; payload: ActiveView }
  | { type: "SET_CYCLE"; payload: CyclePhase }
  | { type: "SET_SELECTED_EMPLOYEE"; payload: string | null }
  | { type: "SUBMIT_GOAL_SHEET"; payload: { sheetId: string; initiator: string } }
  | { type: "APPROVE_GOAL_SHEET"; payload: { sheetId: string; comments: string; initiator: string } }
  | { type: "REJECT_GOAL_SHEET"; payload: { sheetId: string; reason: string; initiator: string } }
  | { type: "FORCE_UNLOCK_SHEET"; payload: { sheetId: string; initiator: string } }
  | { type: "ADD_GOAL"; payload: { sheetId: string; goal: Goal } }
  | { type: "REMOVE_GOAL"; payload: { sheetId: string; goalId: string; initiator: string } }
  | { type: "UPDATE_GOAL_FIELD"; payload: { sheetId: string; goalId: string; field: keyof Goal; value: unknown; initiator: string } }
  | { type: "UPDATE_GOAL_ACTUAL"; payload: { sheetId: string; goalId: string; quarter: "Q1" | "Q2" | "Q3" | "Q4"; actual: number; status: GoalStatus; initiator: string } }
  | { type: "UPDATE_MANAGER_COMMENT"; payload: { sheetId: string; comment: string } }
  | { type: "ADD_AUDIT_ENTRY"; payload: Omit<AuditEntry, "id" | "timestamp"> };

// ─── Helper ───────────────────────────────────────────────────────────────────

function mkAudit(data: Omit<AuditEntry, "id" | "timestamp">): AuditEntry {
  return { id: `aud-${generateId()}`, timestamp: new Date().toISOString(), ...data };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_ROLE":
      return {
        ...state,
        currentRole: action.payload,
        activeView:
          action.payload === "employee"
            ? "dashboard"
            : action.payload === "manager"
            ? "leadership-panel"
            : "cycle-switchboard",
        selectedEmployeeId: null,
      };

    case "SET_VIEW":
      return { ...state, activeView: action.payload };

    case "SET_CYCLE": {
      const entry = mkAudit({
        initiatingPrincipal: "Elena Rostova",
        operationalCode: "CYCLE_TRANSITION",
        entityType: "Performance Cycle",
        entityId: "FY-2025",
        priorState: state.currentCycle,
        revisedValue: action.payload,
      });
      return { ...state, currentCycle: action.payload, auditLog: [entry, ...state.auditLog] };
    }

    case "SET_SELECTED_EMPLOYEE":
      return { ...state, selectedEmployeeId: action.payload };

    case "SUBMIT_GOAL_SHEET": {
      const entry = mkAudit({
        initiatingPrincipal: action.payload.initiator,
        operationalCode: "SHEET_SUBMITTED",
        entityType: "Goal Sheet",
        entityId: action.payload.sheetId,
        priorState: "Draft",
        revisedValue: "Awaiting Approval",
      });
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? { ...gs, status: "Awaiting Approval", submittedAt: new Date().toISOString(), rejectionReason: undefined }
            : gs
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }

    case "APPROVE_GOAL_SHEET": {
      const entry = mkAudit({
        initiatingPrincipal: action.payload.initiator,
        operationalCode: "SHEET_APPROVED",
        entityType: "Goal Sheet",
        entityId: action.payload.sheetId,
        priorState: "Awaiting Approval",
        revisedValue: "Approved & Locked",
      });
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? {
                ...gs,
                status: "Approved & Locked",
                approvedAt: new Date().toISOString(),
                managerComments: action.payload.comments,
              }
            : gs
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }

    case "REJECT_GOAL_SHEET": {
      const entry = mkAudit({
        initiatingPrincipal: action.payload.initiator,
        operationalCode: "SHEET_REJECTED",
        entityType: "Goal Sheet",
        entityId: action.payload.sheetId,
        priorState: "Awaiting Approval",
        revisedValue: `Draft — Rejection Reason: ${action.payload.reason}`,
      });
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? { ...gs, status: "Draft", rejectionReason: action.payload.reason }
            : gs
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }

    case "FORCE_UNLOCK_SHEET": {
      const entry = mkAudit({
        initiatingPrincipal: action.payload.initiator,
        operationalCode: "ADMINISTRATIVE_FORCE_UNLOCK",
        entityType: "Goal Sheet",
        entityId: action.payload.sheetId,
        priorState: "Approved & Locked",
        revisedValue: "Draft — HR Administrative Override",
      });
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? { ...gs, status: "Draft", approvedAt: undefined }
            : gs
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }

    case "ADD_GOAL": {
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? { ...gs, goals: [...gs.goals, action.payload.goal] }
            : gs
        ),
      };
    }

    case "REMOVE_GOAL": {
      const sheet = state.goalSheets.find((gs) => gs.id === action.payload.sheetId);
      const goal = sheet?.goals.find((g) => g.id === action.payload.goalId);
      const entry = mkAudit({
        initiatingPrincipal: action.payload.initiator,
        operationalCode: "GOAL_REMOVED",
        entityType: "Goal",
        entityId: `${action.payload.sheetId} / ${goal?.title ?? action.payload.goalId}`,
        priorState: `Weightage: ${goal?.weightage ?? "?"}%`,
        revisedValue: "Removed from Goal Sheet",
      });
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? { ...gs, goals: gs.goals.filter((g) => g.id !== action.payload.goalId) }
            : gs
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }

    case "UPDATE_GOAL_FIELD": {
      const sheet = state.goalSheets.find((gs) => gs.id === action.payload.sheetId);
      const goal = sheet?.goals.find((g) => g.id === action.payload.goalId);
      const prior = goal ? String(goal[action.payload.field]) : "Unknown";
      const opCode =
        action.payload.field === "targetValue"
          ? "TARGET_MODIFIED"
          : action.payload.field === "weightage"
          ? "WEIGHTAGE_MODIFIED"
          : "FIELD_MODIFIED";
      const entry = mkAudit({
        initiatingPrincipal: action.payload.initiator,
        operationalCode: opCode,
        entityType: "Goal",
        entityId: `${action.payload.sheetId} / ${goal?.title ?? action.payload.goalId}`,
        priorState: `${action.payload.field}: ${prior}`,
        revisedValue: `${action.payload.field}: ${action.payload.value}`,
      });
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? {
                ...gs,
                goals: gs.goals.map((g) =>
                  g.id === action.payload.goalId
                    ? { ...g, [action.payload.field]: action.payload.value }
                    : g
                ),
              }
            : gs
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }

    case "UPDATE_GOAL_ACTUAL": {
      const sheet = state.goalSheets.find((gs) => gs.id === action.payload.sheetId);
      const goal = sheet?.goals.find((g) => g.id === action.payload.goalId);
      const entry = mkAudit({
        initiatingPrincipal: action.payload.initiator,
        operationalCode: "ACHIEVEMENT_LOGGED",
        entityType: "Quarterly Achievement",
        entityId: `${action.payload.sheetId} / ${action.payload.quarter} / ${goal?.title ?? "Unknown"}`,
        priorState: `${action.payload.quarter} Actual: Not Submitted`,
        revisedValue: `${action.payload.quarter} Actual: ${action.payload.actual} — Status: ${action.payload.status}`,
      });
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? {
                ...gs,
                goals: gs.goals.map((g) =>
                  g.id === action.payload.goalId
                    ? {
                        ...g,
                        actualValue: action.payload.actual,
                        status: action.payload.status,
                        quarterlyActuals: {
                          ...g.quarterlyActuals,
                          [action.payload.quarter]: action.payload.actual,
                        },
                      }
                    : g
                ),
              }
            : gs
        ),
        auditLog: [entry, ...state.auditLog],
      };
    }

    case "UPDATE_MANAGER_COMMENT":
      return {
        ...state,
        goalSheets: state.goalSheets.map((gs) =>
          gs.id === action.payload.sheetId
            ? { ...gs, managerComments: action.payload.comment }
            : gs
        ),
      };

    case "ADD_AUDIT_ENTRY": {
      const entry = mkAudit(action.payload);
      return { ...state, auditLog: [entry, ...state.auditLog] };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
