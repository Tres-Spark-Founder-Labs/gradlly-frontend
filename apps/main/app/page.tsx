import Link from "next/link";

export default function HomePage(): React.ReactNode {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-8 text-slate-900">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Gradlly Main</h1>
        <p className="text-slate-600">Internal portal for engineering workflows.</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/docs"
            className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
          >
            Open documentation
          </Link>
          <Link
            href="/login"
            className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-100"
          >
            Open login example
          </Link>
        </div>
      </div>
    </main>
  );
}
