"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users,
  BookOpen,
  Briefcase,
  ListChecks,
  Lightbulb,
  FileText,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Template {
  id: string;
  title: string;
  description: string;
  icon: typeof Users;
  content: object;
}

const TEMPLATES: Template[] = [
  {
    id: "meeting",
    title: "Meeting notes",
    description: "Agenda, discussion points, and action items.",
    icon: Users,
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Attendees" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Agenda" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Action items" }] },
        { type: "paragraph" },
      ],
    },
  },
  {
    id: "journal",
    title: "Daily journal",
    description: "Reflect on today — wins, thoughts, gratitude.",
    icon: BookOpen,
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Today I'm grateful for" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "What's on my mind" }] },
        { type: "paragraph" },
      ],
    },
  },
  {
    id: "project-brief",
    title: "Project brief",
    description: "Goals, scope, and success criteria at a glance.",
    icon: Briefcase,
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Goal" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Scope" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Success criteria" }] },
        { type: "paragraph" },
      ],
    },
  },
  {
    id: "todo",
    title: "Task list",
    description: "A simple, focused to-do list.",
    icon: ListChecks,
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "To do" }] },
        { type: "paragraph" },
      ],
    },
  },
  {
    id: "idea",
    title: "Idea dump",
    description: "Capture a raw idea before it slips away.",
    icon: Lightbulb,
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "The idea" }] },
        { type: "paragraph" },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Why it matters" }] },
        { type: "paragraph" },
      ],
    },
  },
  {
    id: "blank",
    title: "Blank note",
    description: "Start from a completely empty page.",
    icon: FileText,
    content: { type: "doc", content: [{ type: "paragraph" }] },
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [creatingId, setCreatingId] = useState<string | null>(null);

  async function handleUseTemplate(template: Template) {
    setCreatingId(template.id);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        title: template.title,
        content: template.content,
      }),
    });

    setCreatingId(null);

    if (!res.ok) {
      toast.error("Couldn't create note. Try again.");
      return;
    }

    const note = await res.json();
    router.push(`/notes/${note.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        Templates
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Start from a template instead of a blank page.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => {
          const isCreating = creatingId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => handleUseTemplate(template)}
              disabled={creatingId !== null}
              className="group flex flex-col items-start rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 disabled:pointer-events-none disabled:opacity-60"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-primary">
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <template.icon className="h-5 w-5" />
                )}
              </div>
              <h3 className="font-medium text-foreground group-hover:text-primary">
                {template.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {template.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}