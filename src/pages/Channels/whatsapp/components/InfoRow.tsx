interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

export function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex items-center gap-2.5 text-slate-400">
        <Icon size={14} className="shrink-0" />
        <span className="text-[13px]">{label}</span>
      </div>
      <span className="max-w-[55%] truncate text-right text-[13px] font-medium text-gray-600">
        {value || "—"}
      </span>
    </div>
  );
}
