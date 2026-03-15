"use client";

export function TodoListSkeleton() {
  // number of placeholder rows while loading
  const rows = 8

  return (
    <ul className="space-y-2" aria-hidden="true">
      {Array(rows)
        .fill(null)
        .map((_, index) => (
          <li
            key={index}
            className="h-16 rounded-lg border border-border bg-card animate-pulse"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4 p-3">
              <div className="h-4 w-4 rounded bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>

              <div className="h-5 w-14 rounded bg-muted" />
            </div>
          </li>
        ))}
    </ul>
  )
}