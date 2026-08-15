import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section id="cta" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-soft/40 via-transparent to-transparent" />

          <div className="relative">
            <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Start writing{" "}
              <span className="font-display italic text-primary">smarter</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
              Free to start. No credit card. Your notes, thinking back at you within minutes.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild className="group">
                <Link href="/signup">
                  Create your first note
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}