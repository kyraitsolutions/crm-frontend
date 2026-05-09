export const FullChatSkeleton = () => {
  return (
    <div className="grid grid-cols-3 h-screen">
      <div className="p-3 space-y-3 border-r animate-pulse">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      <div className="p-3 space-y-3 animate-pulse">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-[70vh] bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>

      <div className="p-3 space-y-3 animate-pulse">
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
