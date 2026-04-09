export type DocRule = {
  badExample: string;
  enforces: string;
  goodExample: string;
  id: string;
  name: string;
};

export type DocContentSection = {
  content?: string[];
  id: string;
  rules?: DocRule[];
  title: string;
};

export type DocsPage = {
  id: string;
  sections: DocContentSection[];
  title: string;
};

export type AppLink = {
  href: string;
  id: string;
  label: string;
};
