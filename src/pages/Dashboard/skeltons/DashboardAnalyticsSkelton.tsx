const DashboardAnalyticsSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-4 h-2 w-24 rounded bg-gray-200" />
            <div className="mb-3 h-5 w-20 rounded bg-gray-300" />
            <div className="h-4 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* CONTENT BLOCKS */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="h-5 w-40 rounded bg-gray-200" />

              <div className="h-8 w-20 rounded bg-gray-100" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div key={rowIndex} className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-100" />

                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-gray-200" />

          <div className="h-8 w-20 rounded bg-gray-100" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-100" />

              <div className="h-4 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalyticsSkeleton;
