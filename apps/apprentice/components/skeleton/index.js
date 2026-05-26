export function DashboardSkeleton() {
  return (
    <div className="h-dvh overflow-hidden bg-neutral-50">
      {/* ── Fixed sidebar ──────────────────────────────────────────── */}
      <div
        className="fixed left-0 top-0 hidden h-dvh w-65 flex-col overflow-hidden lg:flex"
        style={{
          backgroundColor: "#06170d",
          borderRight: "1px solid rgba(94,164,120,0.18)",
        }}
      >
        {/* Brand lockup */}
        <div
          className="flex h-16 shrink-0 items-center gap-3 px-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
          <div className="h-3.5 w-20 animate-pulse rounded bg-white/10" />
        </div>

        {/* Org block */}
        <div className="shrink-0 px-4 py-3">
          <div
            className="rounded-xl p-3.5"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-md bg-white/10" />
              <div className="flex-1 space-y-2 pt-0.5">
                <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mx-4 shrink-0"
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}
        />

        {/* Primary nav */}
        <div className="flex-1 overflow-hidden py-1">
          <div className="mb-1 ml-4 mt-3 h-2 w-14 animate-pulse rounded bg-white/8" />
          {[88, 72, 96].map((w, i) => (
            <div
              key={i}
              className="mx-2 flex items-center gap-3 rounded-lg px-3 py-3"
            >
              <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-white/10" />
              <div
                className="h-3 animate-pulse rounded bg-white/10"
                style={{ width: w }}
              />
            </div>
          ))}

          <div className="mb-1 ml-4 mt-3 h-2 w-20 animate-pulse rounded bg-white/8" />
          {[76, 100, 64, 84].map((w, i) => (
            <div
              key={i}
              className="mx-2 flex items-center gap-3 rounded-lg px-3 py-3"
            >
              <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-white/10" />
              <div
                className="h-3 animate-pulse rounded bg-white/10"
                style={{ width: w }}
              />
            </div>
          ))}

          <div className="mb-1 ml-4 mt-3 h-2 w-16 animate-pulse rounded bg-white/8" />
          {[90, 68].map((w, i) => (
            <div
              key={i}
              className="mx-2 flex items-center gap-3 rounded-lg px-3 py-3"
            >
              <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-white/10" />
              <div
                className="h-3 animate-pulse rounded bg-white/10"
                style={{ width: w }}
              />
            </div>
          ))}
        </div>

        {/* User block */}
        <div
          className="shrink-0 px-3 py-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-white/10" />
            </div>
            <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-white/10" />
          </div>
        </div>
      </div>

      {/* ── Main content area ──────────────────────────────────────── */}
      <div className="main-content-area sidebar-open flex h-dvh flex-col overflow-hidden">
        {/* Header */}
        <div
          className="sticky top-0 z-200 flex h-16 shrink-0 items-center justify-between px-4 sm:px-6"
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #f1f5f9",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="skeleton h-9 w-9 rounded-lg" />
            <div className="space-y-1.5">
              <div className="skeleton hidden h-2 w-14 rounded sm:block" />
              <div className="skeleton h-4 w-32 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="skeleton h-9 w-9 rounded-lg" />
            <div className="skeleton h-9 w-9 rounded-lg" />
            <div className="skeleton h-9 w-9 rounded-lg" />
            <div className="skeleton mx-1.5 h-5 w-px rounded" />
            <div className="skeleton h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Page content — extra bottom padding on mobile for BottomNav */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="mx-auto w-full max-w-360 px-8 py-8 sm:px-6 sm:py-6 max-sm:px-4 max-sm:py-4">
            <div className="mb-7 flex items-end justify-between">
              <div className="space-y-2">
                <div className="skeleton h-6 w-40 rounded-lg" />
                <div className="skeleton h-4 w-64 rounded" />
              </div>
              <div className="skeleton h-9 w-28 rounded-lg" />
            </div>

            <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-28 rounded-xl" />
              ))}
            </div>

            <div className="mb-4 grid gap-4 lg:grid-cols-3">
              <div className="skeleton h-64 rounded-xl lg:col-span-2" />
              <div className="skeleton h-64 rounded-xl" />
            </div>

            <div className="skeleton h-56 rounded-xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
