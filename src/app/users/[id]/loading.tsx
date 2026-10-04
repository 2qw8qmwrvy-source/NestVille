import Skeleton from "@/components/skeleton";

export default function LoadingProfile() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="h-5 w-40" />
        <div className="mt-3 flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
