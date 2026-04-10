import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage(): React.ReactNode {
  return (
    <main className="mx-auto min-h-screen w-full max-w-xl space-y-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Login</h1>
        <p className="text-sm text-slate-600">
          Example auth form using <code>useAppForm</code>, Zod, and shared toast hooks.
        </p>
      </header>

      <LoginForm />

      <Link href="/docs" className="inline-flex text-sm text-slate-700 underline">
        View implementation docs
      </Link>
    </main>
  );
}
