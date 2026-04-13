const DataRow = ({ label, value, isLink = false }: any) => (
  <div className="grid grid-cols-[160px_20px_1fr] text-sm py-1.5">
    <span className="text-slate-600 font-medium">{label}</span>
    <span className="text-slate-400">:</span>

    {value ? (
      <span
        className={
          isLink
            ? "text-blue-500 hover:underline cursor-pointer"
            : "text-slate-800"
        }
      >
        {value}
      </span>
    ) : (
      <span className="text-slate-400">-</span>
    )}
  </div>
);

export default DataRow;
