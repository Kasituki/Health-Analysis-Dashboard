"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/types";

interface Props {
  data: ChartDataPoint[];
  metric: "bmi" | "systolic_bp" | "hba1c";
  title: string;
  unit: string;
  referenceLines?: { value: number; label: string; color: string }[];
}

const METRIC_LABELS: Record<Props["metric"], { personal: string; avg: string }> = {
  bmi: { personal: "あなたのBMI", avg: "組合平均BMI" },
  systolic_bp: { personal: "あなたの収縮期血圧", avg: "組合平均収縮期血圧" },
  hba1c: { personal: "あなたのHbA1c", avg: "組合平均HbA1c" },
};

const COLORS = {
  personal: "#3b82f6",
  avg: "#f97316",
};

export default function HealthChart({ data, metric, title, unit }: Props) {
  const avgKey = `avg_${metric}` as keyof ChartDataPoint;
  const labels = METRIC_LABELS[metric];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${v}年`}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${v}${unit}`}
            width={55}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}${unit}`,
              name,
            ]}
            labelFormatter={(label) => `${label}年`}
            contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />
          <Line
            type="monotone"
            dataKey={metric}
            name={labels.personal}
            stroke={COLORS.personal}
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey={avgKey as string}
            name={labels.avg}
            stroke={COLORS.avg}
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 3 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
