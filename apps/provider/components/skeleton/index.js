// Dashboard loading skeleton. Mirrors the real dashboard layout: dark sidebar
// (brand, org card, nav, user block), white header, and a content area that
// echoes the hero panel, metric cards, and the two-column card grid.

function Bar({ className = "", w }) {
  return (
    <div
      className={`animate-pulse rounded bg-white/10 ${className}`}
      style={w ? { width: w } : undefined}
    />
  );
}

function NavRow({ w }) {
  return (
    <div className="mx-2 flex items-center gap-3 rounded-md px-3 py-3">
      <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-white/10" />
      <div
        className="h-3 animate-pulse rounded bg-white/10"
        style={{ width: w }}
      />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="h-dvh overflow-hidden bg-neutral-50">
      {/* ── Fixed sidebar ──────────────────────────────────────────── */}
      <div
        className="fixed left-0 top-0 hidden h-dvh w-65 flex-col overflow-hidden lg:flex"
        style={{
          backgroundColor: "var(--color-primary-950)",
          borderRight:
            "1px solid color-mix(in srgb, var(--color-primary-400) 18%, transparent)",
        }}
      >
        {/* Brand lockup */}
        <div
          className="flex h-16 shrink-0 items-center gap-3 px-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="h-8 w-8 animate-pulse rounded-md bg-white/10" />
          <Bar className="h-3.5" w={70} />
        </div>

        {/* Org card */}
        <div className="shrink-0 px-4 py-3">
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-md bg-white/10" />
              <div className="flex-1 space-y-2">
                <Bar className="h-3" w={110} />
                <Bar className="h-2.5" w={64} />
              </div>
              <div className="h-4 w-12 shrink-0 animate-pulse rounded-full bg-white/10" />
            </div>
            <div
              className="mt-2 space-y-1.5 pt-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Bar className="h-2.5" w={130} />
              <Bar className="h-2.5" w={90} />
            </div>
          </div>
        </div>

        {/* Nav sections */}
        <div className="flex-1 overflow-hidden py-1">
          <div className="mb-1 ml-4 mt-3 h-2 w-14 animate-pulse rounded bg-white/8" />
          {[88].map((w, i) => (
            <NavRow key={`o${i}`} w={w} />
          ))}

          <div className="mb-1 ml-4 mt-3 h-2 w-16 animate-pulse rounded bg-white/8" />
          {[76, 100].map((w, i) => (
            <NavRow key={`a${i}`} w={w} />
          ))}
        </div>

        {/* User block */}
        <div
          className="shrink-0 px-3 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5">
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5">
              <Bar className="h-3" w={96} />
              <Bar className="h-2.5" w={64} />
            </div>
            <div className="h-7 w-7 shrink-0 animate-pulse rounded-md bg-white/10" />
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
            <div className="skeleton h-8 w-8 rounded-md" />
            <div className="space-y-1.5">
              <div className="skeleton hidden h-2 w-14 rounded sm:block" />
              <div className="skeleton h-4 w-32 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="skeleton mx-1.5 h-5 w-px rounded" />
            <div className="skeleton h-9 w-40 rounded-md" />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-360 space-y-6 px-8 py-8 sm:px-6 sm:py-6 max-sm:px-4 max-sm:py-4">
            {/* Hero panel */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-950 via-primary-900 to-primary-900 p-6 sm:p-8 lg:p-10">
              <div className="space-y-3">
                <div className="h-2.5 w-28 animate-pulse rounded bg-white/15" />
                <div className="h-9 w-64 animate-pulse rounded-md bg-white/15" />
                <div className="h-3.5 w-44 animate-pulse rounded bg-white/10" />
              </div>
              {/* Org panel strip */}
              <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-white/10 px-4 py-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-md bg-white/15" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-40 animate-pulse rounded bg-white/15" />
                    <div className="h-2.5 w-56 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
                <div className="hidden gap-1.5 sm:flex">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-white/15" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-white/15" />
                </div>
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-28 rounded-xl" />
              ))}
            </div>

            {/* Two-column grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="skeleton h-56 rounded-xl" />
                <div className="skeleton h-64 rounded-xl" />
              </div>
              <div className="space-y-6">
                <div className="skeleton h-72 rounded-xl" />
                <div className="skeleton h-64 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
