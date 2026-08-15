"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Network,
  MessageSquare,
  GraduationCap,
  LayoutTemplate,
  Settings,
  PlusCircle,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Command,
} from "@/components/ui/command";

const NAV_COMMANDS = [
  { href: "/dashboard", label: "Go to Notes", icon: FileText },
  { href: "/graph", label: "Go to Graph", icon: Network },
  { href: "/chat", label: "Go to Chat", icon: MessageSquare },
  { href: "/study", label: "Go to Study Mode", icon: GraduationCap },
  { href: "/templates", label: "Go to Templates", icon: LayoutTemplate },
  { href: "/settings", label: "Go to Settings", icon: Settings },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  function runCommand(action: () => void) {
    setOpen(false);
    action();
  }

 return (
    <CommandDialog open={open} onOpenChange={setOpen} className="top-1/2 -translate-y-1/2">
      <Command>
        <CommandInput placeholder="Search notes or jump to a page..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick actions">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/notes/new"))}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create new note
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigate">
            {NAV_COMMANDS.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}