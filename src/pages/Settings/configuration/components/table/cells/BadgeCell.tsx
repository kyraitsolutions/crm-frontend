interface BadgeCellProps {
  label: string;
  variant?: "success" | "danger" | "warning" | "purple";
}

const variantClasses = {
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  purple: "bg-purple-100 text-purple-700",
};

const BadgeCell = ({ label, variant = "success" }: BadgeCellProps) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
};

export default BadgeCell;
