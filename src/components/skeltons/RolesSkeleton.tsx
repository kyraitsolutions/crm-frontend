import { Skeleton } from "@/components/ui/skeleton";

const RolesSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Role List */}
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-5 bg-white border rounded-xl"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <Skeleton className="h-10 w-10 rounded-lg" />

              {/* Text */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>

            {/* Right actions (hidden but keep spacing realistic) */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesSkeleton;
