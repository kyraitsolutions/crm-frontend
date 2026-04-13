const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

export default StatusBadge;
