import Link from "next/link";
import { ConstellationBackground } from "@/components/shared/constellation-bg";

function SynapseLogo() {
  return (
    <svg
      width="32"
      height="32"
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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: Branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-card p-10 lg:flex">
        <ConstellationBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-soft/30 via-transparent to-transparent" />

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <SynapseLogo />
          <span className="text-lg font-medium tracking-tight text-foreground">
            Synapse
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-2xl font-medium leading-snug tracking-tight text-foreground">
            "The best notes app I've used - it actually{" "}
            <span className="font-display italic text-primary">remembers</span>{" "}
            how my ideas connect."
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Early user, beta testing
          </p>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Synapse
        </p>
      </div>

      {/* Right: Form panel */}
      {/* Right: Form panel */}
      <div className="flex flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <SynapseLogo />
            <span className="text-lg font-medium tracking-tight text-foreground">
              Synapse
            </span>
          </Link>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}