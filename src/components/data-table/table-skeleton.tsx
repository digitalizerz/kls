export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="h-12 animate-pulse rounded-[1.25rem] bg-white motion-reduce:animate-none" />
      <div className="overflow-hidden rounded-[1.25rem] border border-dash-line bg-white">
        <div className="h-11 bg-dash-bg" />
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="h-14 border-t border-dash-line">
            <div className="mx-4 mt-4 h-4 w-1/3 animate-pulse rounded bg-dash-bg motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
