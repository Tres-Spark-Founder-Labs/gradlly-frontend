import type { AppLink, DocsPage } from "@/types/docs";

export const docsNavigation: AppLink[] = [
  { id: "toast", label: "Toast", href: "#toast" },
  { id: "forms", label: "Forms", href: "#forms" },
  { id: "zod", label: "Zod", href: "#zod" },
  { id: "react-hook-form", label: "React Hook Form", href: "#react-hook-form" },
  { id: "eslint", label: "ESLint rules", href: "#eslint" },
  { id: "architecture", label: "Project architecture", href: "#architecture" },
];

export const docsPages: DocsPage[] = [
  {
    id: "toast",
    title: "Toast (react-hot-toast)",
    summary: "Shared, typed toast API from @gradlly/hooks used across applications.",
    sections: [
      {
        id: "toast-usage",
        title: "How to import and use",
        content: [
          "Use the shared useToast hook to keep UX and configuration consistent across apps.",
          "All variants (success, error, loading, default) accept message and optional react-hot-toast options.",
        ],
        examples: [
          {
            id: "toast-import",
            title: "Toast usage",
            language: "ts",
            code: 'import { useToast } from "@gradlly/hooks";\n\nconst toast = useToast();\ntoast.success("Logged in");\ntoast.error("Invalid credentials");\ntoast.loading("Signing in...");',
          },
        ],
      },
    ],
  },
  {
    id: "forms",
    title: "Forms (React Hook Form + Zod)",
    summary: "Use useAppForm to centralize schema-based validation and typing.",
    sections: [
      {
        id: "forms-pattern",
        title: "Form architecture",
        content: [
          "UI components should be presentational and receive register/errors/onSubmit/loading from a feature hook.",
          "Feature hooks hold submission logic, side effects, and routing decisions.",
        ],
        examples: [
          {
            id: "forms-login-hook",
            title: "Login hook pattern",
            language: "ts",
            code: 'const { register, handleSubmit, formState } = useAppForm(loginSchema);\n\nconst onSubmit = handleSubmit(async (values) => {\n  await signInAsync(values);\n  toast.success("Signed in successfully.");\n});',
          },
        ],
      },
    ],
  },
  {
    id: "zod",
    title: "Zod",
    sections: [
      {
        id: "zod-schema",
        title: "Schema definition and inference",
        content: [
          "Define schemas next to feature use-cases (e.g., auth/schemas/login.schema.ts).",
          "Use z.infer<typeof schema> for exact TypeScript form values and payload typing.",
          "Keep validation rules explicit (email format, min length, required fields).",
        ],
        examples: [
          {
            id: "zod-login",
            title: "Login schema",
            language: "ts",
            code: 'export const loginSchema = z.object({\n  email: z.email("Please enter a valid email address."),\n  password: z.string().min(8, "Password must be at least 8 characters."),\n  rememberMe: z.boolean().optional(),\n});',
          },
        ],
      },
    ],
  },
  {
    id: "react-hook-form",
    title: "React Hook Form",
    sections: [
      {
        id: "rhf-integration",
        title: "Integration with Zod",
        content: [
          "useAppForm wraps useForm and applies zodResolver internally.",
          "Consumers call useAppForm(schema) rather than repeating resolver setup in UI files.",
        ],
      },
    ],
  },
  {
    id: "eslint",
    title: "ESLint setup",
    sections: [
      {
        id: "eslint-source",
        title: "Configuration source",
        content: [
          "The monorepo ESLint preset is defined in packages/config/eslint/eslint.config.js and consumed by each app/package.",
          "Type-aware linting is enabled through project tsconfig references, so architectural and TypeScript checks run together.",
        ],
      },
    ],
  },
  {
    id: "architecture",
    title: "Project architecture",
    sections: [
      {
        id: "main-layout",
        title: "apps/main localized structure",
        content: [
          "apps/main/features/auth now separates schemas, hooks, and services so UI and business logic remain decoupled.",
          "apps/main/lib/form provides a reusable app-level form abstraction.",
          "packages/hooks contains shared, reusable hooks including the toast system.",
        ],
      },
    ],
  },
];
