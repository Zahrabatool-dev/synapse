import { Navbar } from "@/components/shared/navbar";
import { Hero } from "@/components/shared/hero";
import { BentoGrid } from "@/components/shared/bento-grid";
import { CtaSection } from "@/components/shared/cta-section";
import { Footer } from "@/components/shared/footer";
import { Reveal } from "@/components/shared/reveal";

export default function Home() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Reveal>
        <BentoGrid />
      </Reveal>
      <Reveal>
        <CtaSection />
      </Reveal>
        <Footer />
    </main>
  );
}