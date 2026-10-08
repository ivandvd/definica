import { cn } from "@/lib/utils";

/** A placeholder block while data loads. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

/** A card-shaped placeholder: a title line and a few rows. */
export function SkeletonCard({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("rounded-card bg-card p-5 sm:p-6", className)} aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-9 w-48" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
