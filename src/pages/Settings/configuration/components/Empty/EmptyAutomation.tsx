const EmptyAutomation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mb-3">
        <svg
          className="w-6 h-6 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600">No automations yet</p>
      <p className="text-xs text-gray-400 mt-1">
        Create your first automation to get started
      </p>
    </div>
  );
};

export default EmptyAutomation;
