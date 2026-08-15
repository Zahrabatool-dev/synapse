"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Network,
  MessageSquare,
  GraduationCap,
  LayoutTemplate,
  Search,
  Settings,
  PlusCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Notes", icon: FileText },
  { href: "/graph", label: "Graph", icon: Network },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/study", label: "Study", icon: GraduationCap },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/search", label: "Search", icon: Search },
];

function SynapseLogo() {
  return (
    <svg
      width="24"
      height="24"
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <SynapseLogo />
        <span className="text-base font-medium tracking-tight text-foreground">
          Synapse
        </span>
      </div>

      <div className="px-3">
        <Link
          href="/notes/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          New note
        </Link>
      </div>

      <nav className="mt-6 flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-accent-soft text-primary"
                  : "text-muted-foreground hover:bg-accent-soft/50 hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-accent-soft text-primary"
              : "text-muted-foreground hover:bg-accent-soft/50 hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}