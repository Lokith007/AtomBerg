"use client";

import { useApp } from "@/lib/store";
import { AppRole } from "@/types";
import { User, Briefcase, ShieldCheck } from "lucide-react";

const personas: {
  role: AppRole;
  name: string;
  title: string;
  dept: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  ring: string;
  bg: string;
}[] = [
  {
    role: "employee",
    name: "Sarah Jenkins",
    title: "Senior Cloud Engineer",
    dept: "Enterprise Infrastructure Division",
    icon: User,
    accent: "text-indigo-400",
    ring: "ring-indigo-500/50",
    bg: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30",
  },
  {
    role: "manager",
    name: "Marcus Vance",
    title: "Director of Engineering",
    dept: "Enterprise Infrastructure Division",
    icon: Briefcase,
    accent: "text-amber-400",
    ring: "ring-amber-500/50",
    bg: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30",
  },
  {
    role: "admin",
    name: "Elena Rostova",
    title: "VP of People & Culture",
    dept: "HR & Organizational Development",
    icon: ShieldCheck,
    accent: "text-emerald-400",
    ring: "ring-emerald-500/50",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30",
  },
];

export function RoleSwitcher() {
  const { state, dispatch } = useApp();

  return (
    <div className="border-t border-white/8 bg-[#0f1a35]/80 backdrop-blur-sm px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 px-1 font-medium">
        Evaluation Persona Switcher
      </p>
      <div className="flex gap-2">
        {personas.map((p) => {
          const isActive = state.currentRole === p.role;
          const Icon = p.icon;
          return (
            <button
              key={p.role}
              onClick={() => dispatch({ type: "SET_ROLE", payload: p.role })}
              className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left ${p.bg} ${
                isActive
                  ? `ring-2 ${p.ring} border-transparent`
                  : "border-white/10"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isActive ? "bg-white/15" : "bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? p.accent : "text-slate-400"}`} />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold truncate ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {p.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{p.title}</p>
              </div>
              {isActive && (
                <div className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${p.accent.replace("text-", "bg-")}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
