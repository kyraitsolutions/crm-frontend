type ChatListSkeletonProps = {
  length?: number;
};

export const ChatListSkeleton = ({ length = 10 }: ChatListSkeletonProps) => {
  return (
    <div className="space-y-3 p-3 animate-pulse">
      {Array.from({ length }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
