import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradlly Main | Developer Docs",
};

export default function HomePage(): React.ReactNode {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold">Gradlly Main — Developer Documentation</h1>
          <p className="text-gray-600">Internal reference for API and query architecture across all Gradlly portals.</p>
          <nav className="flex flex-wrap gap-3 text-sm">
            {[
              ["Overview", "overview"],
              ["Architecture", "architecture"],
              ["Global vs Local", "global-vs-local"],
              ["Hook Types", "hook-types"],
              ["Adding Global Resource", "adding-global-resource"],
              ["Adding Local Resource", "adding-local-resource"],
              ["$api Client", "api-client"],
              ["Stale Time Guide", "stale-time-guide"],
              ["JSONPlaceholder Test", "jsonplaceholder-test"],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200">
                {label}
              </a>
            ))}
          </nav>
        </header>

        <section id="overview" className="space-y-3">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p>packages/api contains the base $api fetch client, and it is the only place where fetch() is called directly.</p>
          <p>packages/features/[feature] contains globally shared feature modules including services, types, query keys, TanStack queries, and convenience hooks.</p>
          <p>packages/lib/react-query contains the shared QueryClient factory and browser/server getter utilities used by all portals.</p>
          <p>Local features with services, types, keys, and queries stay inside apps/[portal]/features/[feature] for portal-specific concerns.</p>
          <p>This separation ensures portability, testability, and clear ownership across the monorepo.</p>
        </section>

        <section id="architecture" className="space-y-3">
          <h2 className="text-2xl font-semibold">Architecture Diagram</h2>
          <pre className="rounded-lg bg-gray-900 p-4 overflow-x-auto text-sm text-gray-100"><code>{`Component (apps/[portal]/features/*/components)
   -> Feature Query Hook (queries/[feature].query.ts)
      -> Service (services/[feature].service.ts)
         -> $api (packages/api/client/$api.ts)
            -> API Server (NEXT_PUBLIC_API_URL backend)`}</code></pre>
        </section>

        <section id="global-vs-local" className="space-y-3">
          <h2 className="text-2xl font-semibold">Global vs Local — Decision Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Resource</th><th className="border p-2">Global Path</th><th className="border p-2">Local Path</th><th className="border p-2">When to use global</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">$api client</td><td className="border p-2">packages/api/client/$api.ts</td><td className="border p-2">Never local</td><td className="border p-2">Always global</td></tr>
                <tr><td className="border p-2">Service</td><td className="border p-2">packages/features/[f]/services/</td><td className="border p-2">apps/[p]/features/[f]/services/</td><td className="border p-2">2+ portals need it</td></tr>
                <tr><td className="border p-2">Types</td><td className="border p-2">packages/features/[f]/types/</td><td className="border p-2">apps/[p]/features/[f]/types/</td><td className="border p-2">2+ portals need it</td></tr>
                <tr><td className="border p-2">Query Keys</td><td className="border p-2">packages/features/[f]/querykeys/</td><td className="border p-2">apps/[p]/features/[f]/querykeys/</td><td className="border p-2">Mirrors the service</td></tr>
                <tr><td className="border p-2">TanStack Queries</td><td className="border p-2">packages/features/[f]/queries/</td><td className="border p-2">apps/[p]/features/[f]/queries/</td><td className="border p-2">Mirrors the service</td></tr>
                <tr><td className="border p-2">App Hooks</td><td className="border p-2">Not applicable</td><td className="border p-2">apps/[p]/hooks/</td><td className="border p-2">Always local</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="hook-types" className="space-y-3">
          <h2 className="text-2xl font-semibold">Hook Types — TanStack vs App hooks</h2>
          <p>TanStack Query hooks live in features/[feature]/queries/[feature].query.ts and wrap useQuery or useMutation for server state and caching.</p>
          <p>App hooks live in hooks/ at app root level and manage UI state with useState, useEffect, or useRef patterns.</p>
          <p>If the hook fetches data, it lives in queries/. If it manages UI state, it lives in hooks/.</p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`apps/main/features/todo/queries/todo.query.ts  // useTodos
apps/main/hooks/use-modal.ts                    // useModal`}</code></pre>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`const { todos } = useTodos({ completed: false });
const { isOpen, toggle } = useModal(false);`}</code></pre>
          <h3 className="text-xl font-semibold">One query file per feature</h3>
          <p>All useQuery and useMutation hooks for a feature live in one [feature].query.ts file, not one file per hook.</p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`todo.query.ts
- useTodos
- useTodo
- useCreateTodo
- useUpdateTodo
- useDeleteTodo`}</code></pre>
        </section>

        <section id="adding-global-resource" className="space-y-3">
          <h2 className="text-2xl font-semibold">Adding a Global Resource (step-by-step)</h2>
          <ol className="list-decimal space-y-3 pl-5">
            {[
              "Create packages/features/[feature]/types/[feature].types.ts",
              "Create packages/features/[feature]/querykeys/[feature].keys.ts",
              "Create packages/features/[feature]/constants/[feature].constants.ts",
              "Create packages/features/[feature]/services/[feature].service.ts importing $api",
              "Create packages/features/[feature]/queries/[feature].query.ts with all useQuery and useMutation hooks",
              "Create packages/features/[feature]/hooks/use-[feature].ts only when a non-TanStack convenience hook is needed",
              "Create packages/features/[feature]/index.ts re-exporting all modules",
              "Add exports in packages/features/[feature]/package.json",
              "Import from any portal with package import syntax",
              "TypeScript resolves shared types and hooks across portals",
            ].map((step, index) => (
              <li key={step}>
                <p className="font-medium">{index + 1}. {step}</p>
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`// Notification example for step ${index + 1}
// Auth follows the same pattern at packages/features/auth/`}</code></pre>
              </li>
            ))}
          </ol>
        </section>

        <section id="adding-local-resource" className="space-y-3">
          <h2 className="text-2xl font-semibold">Adding a Local Resource (step-by-step)</h2>
          <ol className="list-decimal space-y-3 pl-5">
            {[
              "Create apps/[portal]/features/[feature]/types/[feature].types.ts with local-only comment",
              "Create apps/[portal]/features/[feature]/querykeys/[feature].keys.ts with local-only comment",
              "Create apps/[portal]/features/[feature]/services/[feature].service.ts and import $api",
              "Create apps/[portal]/features/[feature]/queries/[feature].query.ts with all queries/mutations",
              "Create apps/[portal]/features/[feature]/components/ UI layer",
              "Create apps/[portal]/features/[feature]/index.ts public API",
              "Import from page modules using alias paths",
              "Confirm feature is not exported from packages/",
            ].map((step, index) => (
              <li key={step}>
                <p className="font-medium">{index + 1}. {step}</p>
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`// Todo example step ${index + 1}
// apps/main/features/todo/...`}</code></pre>
              </li>
            ))}
          </ol>
        </section>

        <section id="api-client" className="space-y-3">
          <h2 className="text-2xl font-semibold">The $api Client</h2>
          <p>The $api helper wraps fetch with typed generics, JSON body serialization, URL query construction, and consistent ApiRequestError handling.</p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`$api<TResponse>(config: ApiConfig): Promise<TResponse>`}</code></pre>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`export const getMe = (): Promise<AuthUser> =>
  $api<AuthUser>({ endpoint: "/auth/me", method: "GET" });`}</code></pre>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`onError: (error) => {
  if (error instanceof ApiRequestError) {
    console.error(error.statusCode, error.errors);
  }
}`}</code></pre>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{`fetchTodos({ completed: false })
// uses baseUrl override:
$api<Todo[]>({ endpoint: "/todos", baseUrl: "https://jsonplaceholder.typicode.com" })`}</code></pre>
        </section>

        <section id="stale-time-guide" className="space-y-3">
          <h2 className="text-2xl font-semibold">Stale Time Reference Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead><tr className="bg-gray-100"><th className="border p-2">Data type</th><th className="border p-2">staleTime</th><th className="border p-2">Reason</th></tr></thead>
              <tbody>
                <tr><td className="border p-2">Live levy balance (DAS sync)</td><td className="border p-2">15 min</td><td className="border p-2">Matches ESFA sync interval</td></tr>
                <tr><td className="border p-2">Cohort / apprentice lists</td><td className="border p-2">2 min</td><td className="border p-2">Moderate change frequency</td></tr>
                <tr><td className="border p-2">Current user profile</td><td className="border p-2">10 min</td><td className="border p-2">Low change frequency</td></tr>
                <tr><td className="border p-2">Auth sessions list</td><td className="border p-2">2 min</td><td className="border p-2">Security-sensitive</td></tr>
                <tr><td className="border p-2">Notification counts</td><td className="border p-2">30 sec</td><td className="border p-2">Near-real-time required</td></tr>
                <tr><td className="border p-2">Static config / enums</td><td className="border p-2">60 min</td><td className="border p-2">Almost never changes</td></tr>
                <tr><td className="border p-2">Todo list (test only)</td><td className="border p-2">2 min</td><td className="border p-2">Test data via JSONPlaceholder</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="jsonplaceholder-test" className="space-y-3">
          <h2 className="text-2xl font-semibold">JSONPlaceholder Test Integration</h2>
          <p>JSONPlaceholder is a public fake REST API used to test read/write flow without a custom backend dependency.</p>
          <p>POST, PATCH, and DELETE requests return HTTP 200/201 but data does not persist. A page refresh shows the original dataset. This is expected — the integration test validates the full query and mutation lifecycle, cache invalidation, and optimistic updates, not data persistence.</p>
          <p>Test page: <a href="/todos" className="text-blue-600 underline">/todos</a></p>
          <p>The /todos page must be removed before production launch.</p>
        </section>

        <footer className="border-t border-gray-200 pt-6 text-sm text-gray-600">
          <p>This documentation is generated from apps/main/app/page.tsx.</p>
          <p>To update it, edit that file directly.</p>
          <p>This portal (apps/main) is an internal development tool only and must not be deployed to production.</p>
        </footer>
      </div>
    </main>
  );
}
