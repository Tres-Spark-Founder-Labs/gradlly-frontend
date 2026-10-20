import { SITE } from "@/config/site.config";

export default function HomePage() {
  return (
    <main id="main-content">
      <h1>{SITE.tagline}</h1>
    </main>
  );
}
