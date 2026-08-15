"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

function SynapseLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <line x1="6" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-border" />
      <line x1="22" y1="6" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-border" />
      <line x1="14" y1="14" x2="8" y2="22" stroke="currentColor" strokeWidth="1.5" className="text-border" />
      <circle cx="6" cy="8" r="2.5" className="fill-muted-foreground" />
      <circle cx="22" cy="6" r="2.5" className="fill-muted-foreground" />
      <circle cx="8" cy="22" r="2.5" className="fill-muted-foreground" />
      <circle cx="14" cy="14" r="3.5" className="fill-primary" />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <SynapseLogo />
          <span className="text-lg font-medium tracking-tight text-foreground">
            Synapse
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
        <a
            href="#demo"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Try Demo
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign up free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}