import Skeleton from "@/components/skeleton";

export default function LoadingDashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="mt-10">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-40 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
