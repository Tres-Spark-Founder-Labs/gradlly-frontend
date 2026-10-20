import { Hero } from "@/components/landing/Hero";
import { Nav } from "@/components/landing/Nav";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
      </main>
    </>
  );
}
