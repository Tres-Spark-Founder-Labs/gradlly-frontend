export type DocContentSection = {
  content: string[];
  id: string;
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
