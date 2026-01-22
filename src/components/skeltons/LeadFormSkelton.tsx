import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadFormSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 animate-pulse">
      {/* LEFT: Builder Skeleton */}
      <div>
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 space-y-3">
            <Skeleton className="h-7 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </CardHeader>

          <CardContent className="px-0 space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>

            {/* Header Image */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))}
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>

              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              ))}
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Form Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: Preview Skeleton */}
      <div className="py-8">
        <Card className="border-none shadow-none bg-[#FBFAF9] rounded-2xl">
          <CardContent className="space-y-4">
            <Skeleton className="h-44 w-full rounded-t-2xl" />

            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}

            <Skeleton className="h-12 w-full rounded-full mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
