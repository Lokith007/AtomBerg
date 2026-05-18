"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, BarChart3, PieChart as PieIcon } from "lucide-react";

// ─── Static analytics datasets ──────────────────────────────────────────────

const crossQuarterTrends = [
  { quarter: "Q1 FY-25", Engineering: 68, Product: 72, Operations: 58, Finance: 81 },
  { quarter: "Q2 FY-25", Engineering: 74, Product: 68, Operations: 65, Finance: 76 },
  { quarter: "Q3 FY-25", Engineering: 81, Product: 75, Operations: 71, Finance: 83 },
  { quarter: "Q4 FY-25", Engineering: 88, Product: 82, Operations: 78, Finance: 89 },
];

const buCompletionData = [
  { unit: "Engineering", rate: 76, target: 85 },
  { unit: "Product", rate: 74, target: 80 },
  { unit: "Operations", rate: 68, target: 75 },
  { unit: "Finance", rate: 82, target: 85 },
  { unit: "HR & Culture", rate: 71, target: 78 },
  { unit: "Legal & Compliance", rate: 65, target: 80 },
];

const thrustAreaDistribution = [
  { name: "Cloud Infrastructure Modernization", value: 28, color: "#6366f1" },
  { name: "Operational Reliability & Uptime", value: 22, color: "#10b981" },
  { name: "Security & Compliance Excellence", value: 18, color: "#f59e0b" },
  { name: "Engineering Velocity & Quality", value: 15, color: "#3b82f6" },
  { name: "Cost Optimization & FinOps", value: 10, color: "#8b5cf6" },
  { name: "Talent Development", value: 7, color: "#ec4899" },
];

const AREA_COLORS = {
  Engineering: "#6366f1",
  Product: "#10b981",
  Operations: "#f59e0b",
  Finance: "#3b82f6",
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2.5 border border-white/10 shadow-xl">
      <p className="text-[11px] text-slate-400 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-bold text-white">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-xs text-white font-semibold">{payload[0].name}</p>
      <p className="text-[11px] text-slate-400">{payload[0].value}% allocation</p>
    </div>
  );
};

export function AnalyticsSuite() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-base font-bold text-white">Enterprise Performance Analytics Suite</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          FY-2025 · Cross-divisional performance intelligence · Elena Rostova
        </p>
      </div>

      {/* KPI summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Org-Wide Completion", value: "76%", sub: "Weighted average score", color: "text-indigo-400", glow: "shadow-glow-indigo" },
          { label: "On-Track Goals", value: "68%", sub: "Of all active objectives", color: "text-emerald-400", glow: "shadow-glow-emerald" },
          { label: "Sheets Approved", value: "1 / 5", sub: "Engineering Division", color: "text-blue-400", glow: "" },
          { label: "Sheets Awaiting", value: "2", sub: "Pending manager action", color: "text-amber-400", glow: "shadow-glow-amber" },
        ].map((s) => (
          <div key={s.label} className={`glass rounded-xl p-4 ${s.glow}`}>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Area chart — cross-quarter trends */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-white">Cross-Quarter Progress Trends by Business Unit</h4>
          <span className="ml-auto text-[11px] text-slate-500">FY-2025 · Q1–Q4</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={crossQuarterTrends} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
            <defs>
              {Object.entries(AREA_COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.03} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="quarter"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[50, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "16px", fontSize: "11px" }}
              formatter={(value) => <span style={{ color: "#94a3b8" }}>{value}</span>}
            />
            {Object.entries(AREA_COLORS).map(([key, color]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${key})`}
                dot={{ fill: color, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: bar chart + pie chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* BU completion bar chart */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Completion Rate by Business Unit</h4>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={buCompletionData}
              margin={{ top: 4, right: 10, left: -15, bottom: 0 }}
              barGap={4}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="unit"
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="glass rounded-lg px-3 py-2 border border-white/10 shadow-xl">
                      <p className="text-xs text-white font-semibold mb-1">{label}</p>
                      {payload.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ background: String(p.color ?? "") }} />
                          <span className="text-slate-300">{String(p.name ?? "")}:</span>
                          <span className="font-bold text-white">{Number(p.value ?? 0)}%</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Bar dataKey="target" name="Target" fill="rgba(255,255,255,0.06)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="rate" name="Achieved" fill="#6366f1" radius={[3, 3, 0, 0]}>
                {buCompletionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rate >= entry.target ? "#10b981" : entry.rate >= 70 ? "#6366f1" : "#f59e0b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            {[
              { color: "#10b981", label: "On or Above Target" },
              { color: "#6366f1", label: "Within 15% of Target" },
              { color: "#f59e0b", label: "Needs Acceleration" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Thrust area pie chart */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <PieIcon className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">Strategic Thrust Area Allocation</h4>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie
                  data={thrustAreaDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {thrustAreaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.88} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {thrustAreaDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-300 leading-tight truncate">{item.name}</p>
                  </div>
                  <span className="text-xs font-bold text-white shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BU performance heatmap-style grid */}
      <div className="glass rounded-xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4">Division Performance Heat Matrix — FY-2025</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-3 py-2 text-left text-[10px] text-slate-500 uppercase tracking-wider font-medium">Business Unit</th>
                {["Q1", "Q2", "Q3", "Q4", "YTD Avg"].map((h) => (
                  <th key={h} className="px-3 py-2 text-center text-[10px] text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { unit: "Engineering", scores: [68, 74, 81, 88] },
                { unit: "Product", scores: [72, 68, 75, 82] },
                { unit: "Operations", scores: [58, 65, 71, 78] },
                { unit: "Finance", scores: [81, 76, 83, 89] },
                { unit: "HR & Culture", scores: [74, 71, 77, 83] },
                { unit: "Legal & Compliance", scores: [62, 65, 68, 72] },
              ].map((row) => {
                const avg = Math.round(row.scores.reduce((a, b) => a + b, 0) / row.scores.length);
                return (
                  <tr key={row.unit} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-3 py-2.5 font-semibold text-slate-300">{row.unit}</td>
                    {row.scores.map((s, i) => (
                      <td key={i} className="px-3 py-2.5 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-md font-bold text-xs ${
                            s >= 80
                              ? "bg-emerald-500/15 text-emerald-300"
                              : s >= 70
                              ? "bg-blue-500/15 text-blue-300"
                              : s >= 60
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-red-500/15 text-red-300"
                          }`}
                        >
                          {s}%
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-bold ${avg >= 80 ? "text-emerald-400" : avg >= 70 ? "text-blue-400" : "text-amber-400"}`}>
                        {avg}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
