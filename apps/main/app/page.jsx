import { BookADemo } from "@/components/landing/BookADemo";
import { Continuo } from "@/components/landing/Continuo";
import { Footer } from "@/components/landing/Footer";
import { GradllyAms } from "@/components/landing/GradllyAms";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Nav } from "@/components/landing/Nav";
import { Passport } from "@/components/landing/Passport";
import { Problem } from "@/components/landing/Problem";
import { WhoItsFor } from "@/components/landing/WhoItsFor";

/**
 * The ten sections of docs/marketing/content-v1.md, in its order.
 *
 * Only two components here ship JavaScript: Nav, for the mobile menu, and
 * BookADemo, for the form. Everything else is a server component, and the
 * page's motion is CSS.
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <Problem />
        <Continuo />
        <GradllyAms />
        <Passport />
        <HowItWorks />
        <WhoItsFor />
        <BookADemo />
      </main>
      <Footer />
    </>
  );
}
