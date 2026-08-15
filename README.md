# AI Notes

An AI-powered note-taking app built with Next.js, combining a distraction-free rich-text editor, a visual knowledge graph (Obsidian-style), and AI features like chat-with-your-notes, flashcard generation, and voice-to-note transcription.

## Features

- **Rich Text Editor** - Tiptap-based editor for writing and formatting notes
- **Knowledge Graph View** - Visualize connections between notes as an interactive node graph (React Flow)
- **AI Chat** - Ask questions and get answers grounded in your own notes
- **AI Flashcards** - Auto-generate flashcards from note content for studying
- **Voice-to-Note** - Record audio, transcribe it, clean it up with AI, and insert it directly into a note
- **Full-Text Search** - Instantly search across all note titles and content
- **Authentication** - Email/password auth with a complete forgot-password / reset-password flow (Supabase)
- **Responsive Dashboard** - Sidebar navigation across Notes, Graph, Chat, Study, Templates, Search, and Settings

## Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (New York style, Slate base)
- [Zustand](https://github.com/pmndrs/zustand) - state management
- [TanStack Query](https://tanstack.com/query) + [Axios](https://axios-http.com/) - data fetching & caching
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - form handling & validation
- [Tiptap](https://tiptap.dev/) - rich text editor
- [React Flow](https://reactflow.dev/) - graph visualization
- [Framer Motion](https://www.framer.com/motion/) - animations
- [Sonner](https://sonner.emilkowal.ski/) - toast notifications
- [Lucide](https://lucide.dev/) - icons

**Backend / Services**
- [Supabase](https://supabase.com/) - authentication & database
- Next.js API routes (`app/api/ai/*`) - server-side proxy for AI calls (chat, flashcards, voice cleanup)

## Project Structure

```
ai-notes-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── notes/[id]/
│   │   ├── graph/
│   │   ├── chat/
│   │   ├── study/
│   │   ├── templates/
│   │   ├── search/
│   │   └── settings/
│   ├── api/
│   │   └── ai/
│   │       ├── chat/
│   │       ├── flashcards/
│   │       └── voice-cleanup/
│   ├── not-found.tsx
│   ├── error.tsx
│   └── globals.css
├── components/
│   ├── editor/
│   ├── graph/
│   ├── ai/
│   ├── shared/
│   └── ui/            # shadcn components
├── lib/
│   ├── hooks/
│   ├── supabase.ts
│   └── note-text.ts
└── tailwind.config.ts
```

- **Route groups** - `(auth)` and `(dashboard)` keep separate layouts without affecting the URL structure.
- **Dynamic routes** - `notes/[id]` renders each note on its own page.
- **API routes** - All AI calls are proxied server-side through `app/api/ai/*` so API keys are never exposed to the client.

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project (URL + anon key)

```

### Supabase Setup

For password reset to work, whitelist the redirect URL:

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Add `http://localhost:3000/reset-password` under Redirect URLs (add your production domain too when deploying)

### Run the Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Design System

Theming is driven by CSS variables (HSL, space-separated) defined in `app/globals.css` and mapped into Tailwind's color system in `tailwind.config.ts`. This enables utility classes like `bg-background`, `text-primary`, and `bg-accent-soft` to automatically adapt between light and dark mode via the `.dark` class on `<html>`, managed by `next-themes`.

## Roadmap

- [x] Core note editor (Tiptap)
- [x] Knowledge graph view (React Flow)
- [x] AI chat, flashcards, and voice-to-note
- [x] Auth with forgot/reset password
- [x] Full-text search
- [x] Custom 404 / error pages
- [ ] Skeleton loaders across pages
- [ ] Page transitions
- [ ] Responsive polish (simplified mobile graph, full-screen mobile chat)
- [ ] Micro-interactions

## License

This project is a personal/portfolio project. All rights reserved unless otherwise specified.
