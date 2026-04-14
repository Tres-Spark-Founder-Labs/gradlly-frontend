export default function HomePage(): React.ReactNode {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-8 text-slate-900">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Gradlly Main</h1>
        <p className="text-slate-600">
          Internal portal for engineering workflows.
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="main-card">
            <p className="main-stat-label main-font">Available Levy</p>
            <p className="main-font">£124,850</p>
            <span className="main-badge main-badge--success">Live</span>
          </div>
        </div>
      </div>
    </main>
  );
}
