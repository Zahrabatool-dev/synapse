import Link from "next/link";

function SynapseLogo() {
  return (
    <svg
      width="20"
      height="20"
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

export function Footer() {
  return (
    <footer id="footer-section" className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SynapseLogo />
          <span>Synapse</span>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Synapse. Where your ideas connect.
        </p>

        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup" className="transition-colors hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}