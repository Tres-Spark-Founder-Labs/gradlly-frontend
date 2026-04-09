export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface font-sans">
      <main className="flex w-full max-w-3xl flex-col items-start gap-10 px-16 py-32">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Gradlly
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-red-600">FlowPortal</h1>
          <p className="text-base text-text-secondary">
            Levy exchange · SME matching · AI programme delivery
          </p>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="grid grid-cols-3 gap-6 w-full">
          {[
            { label: 'Portal', value: 'P4 — FlowPortal' },
            { label: 'Domain', value: 'flow.gradlly.com' },
            { label: 'Environment', value: process.env.NODE_ENV },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="text-xs text-text-muted">{item.label}</span>
              <span className="text-sm font-medium text-text-primary">{item.value}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
