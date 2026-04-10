export type DocRule = {
  badExample: string;
  enforces: string;
  goodExample: string;
  id: string;
  name: string;
};

export type DocExample = {
  code: string;
  id: string;
  language: "ts" | "tsx" | "bash";
  title: string;
};

export type DocContentSection = {
  content?: string[];
  examples?: DocExample[];
  id: string;
  rules?: DocRule[];
  title: string;
};

export type DocsPage = {
  id: string;
  sections: DocContentSection[];
  summary?: string;
  title: string;
};

export type AppLink = {
  href: string;
  id: string;
  label: string;
};
