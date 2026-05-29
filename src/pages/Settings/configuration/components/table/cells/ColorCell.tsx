interface ColorCellProps {
  color: string;
}

const ColorCell = ({ color }: ColorCellProps) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-3 w-3 rounded-full border"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="text-sm text-[#6B7280]">{color}</span>
    </div>
  );
};

export default ColorCell;
