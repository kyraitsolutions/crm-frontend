import { Skeleton } from "@/components/ui/skeleton";

type TTableSkeletonProps = {
  rows?: number;
  columns?: number;
};

const BasicTableSkeleton = ({ rows = 5, columns = 6 }: TTableSkeletonProps) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      {/* TABLE HEADER */}
      <div className="grid border-b bg-muted/40 px-6 py-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({
            length: columns,
          }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-24" />
          ))}
        </div>
      </div>

      {/* TABLE BODY */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid px-6 py-5">
            <div
              className="grid items-center gap-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({
                length: columns,
              }).map((_, columnIndex) => (
                <Skeleton
                  key={columnIndex}
                  className={`h-5 ${columnIndex === 0 ? "w-40" : "w-20"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicTableSkeleton;
