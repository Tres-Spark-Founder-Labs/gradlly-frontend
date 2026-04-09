export type DocSection = {
  id: string;
  title: string;
  content: string[];
  links?: Array<{
    label: string;
    href: string;
  }>;
};
