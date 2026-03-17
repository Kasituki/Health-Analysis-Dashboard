interface Props {
  label: string;
  value: string | number | null;
  unit?: string;
  status?: "normal" | "warning" | "danger";
  subtext?: string;
}

const statusStyles = {
  normal: "bg-emerald-50 border-emerald-200 text-emerald-700",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  danger: "bg-red-50 border-red-200 text-red-700",
};

const statusBadge = {
  normal: "基準内",
  warning: "要注意",
  danger: "要改善",
};

export default function StatCard({ label, value, unit, status, subtext }: Props) {
  const style = status ? statusStyles[status] : "bg-gray-50 border-gray-200 text-gray-700";

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-1 ${style}`}>
      <span className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</span>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold">
          {value !== null && value !== undefined ? value : "—"}
        </span>
        {unit && <span className="text-sm mb-1 opacity-80">{unit}</span>}
      </div>
      {status && (
        <span className="text-xs font-semibold mt-1">{statusBadge[status]}</span>
      )}
      {subtext && <span className="text-xs opacity-60">{subtext}</span>}
    </div>
  );
}
