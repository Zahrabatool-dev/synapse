"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-border/60">
      
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-20 text-center">
        {/* baaki sab andar ka content waisa hi rehne do */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-mono">Now with AI that thinks alongside you</span>
        </div>

        <h1 className="text-balance text-5xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Where your ideas
          <br />
          <span className="font-display italic text-primary">connect</span>
          {" "}themselves
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground sm:text-xl">
          Synapse writes, links, and talks through your notes with you -
          not just where you store them, but where they start thinking back.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" asChild className="group">
            <Link href="/signup">
              Start writing smarter
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#demo">Try the demo</a>
          </Button>
        </div>
      </div>
    </section>
  );
}