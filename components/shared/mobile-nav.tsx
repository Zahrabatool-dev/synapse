"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-card">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-base font-medium text-foreground">
                Synapse
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-3">
              <Link
                href="/notes/new"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
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
                    onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent-soft/50 hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}