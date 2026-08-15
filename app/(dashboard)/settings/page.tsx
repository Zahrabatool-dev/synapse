"use client";

import { useEffect, useState } from "react";
import { User, Sparkles, Mic, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const TONE_OPTIONS = [
  { value: "concise", label: "Concise", description: "Short, to-the-point answers" },
  { value: "balanced", label: "Balanced", description: "Clear and moderately detailed" },
  { value: "detailed", label: "Detailed", description: "Thorough, in-depth answers" },
];

const VOICE_LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "ur-PK", label: "Urdu" },
  { value: "hi-IN", label: "Hindi" },
  { value: "ar-SA", label: "Arabic" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tone, setTone] = useState("balanced");
  const [voiceLang, setVoiceLang] = useState("en-US");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        setName(user.user_metadata?.full_name ?? "");
        setTone(user.user_metadata?.ai_tone ?? "balanced");
        setVoiceLang(user.user_metadata?.voice_lang ?? "en-US");
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        ai_tone: tone,
        voice_lang: voiceLang,
      },
    });
    setSaving(false);

    if (error) {
      toast.error("Couldn't save settings");
      return;
    }
    toast.success("Settings saved");
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        Settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your profile and preferences
      </p>

      {/* Profile Section */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <User className="h-4 w-4 text-primary" />
          Profile
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground outline-none"
            />
          </div>
        </div>
      </section>

      {/* AI Preferences */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          AI response style
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Applies to Chat and AI-generated content
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTone(opt.value)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                tone === opt.value
                  ? "border-primary bg-accent-soft"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    tone === opt.value ? "text-primary" : "text-foreground"
                  }`}
                >
                  {opt.label}
                </span>
                {tone === opt.value && <Check className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{opt.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Voice Input */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <Mic className="h-4 w-4 text-primary" />
          Voice input language
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Used when recording voice notes in the editor
        </p>

        <select
          value={voiceLang}
          onChange={(e) => setVoiceLang(e.target.value)}
          className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/40"
        >
          {VOICE_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-6"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
      </button>
    </div>
  );
}