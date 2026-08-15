"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Intro", fraction: 0.06 },
  { id: "demo", label: "Demo", fraction: 0.4 },
  { id: "cta", label: "Start", fraction: 0.78 },
  { id: "footer-section", label: "Footer", fraction: 0.95 },
];

export function ScrollSpine() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    let ticking = false;

    function updateProgress() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(1, Math.max(0, pct)));
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const progressPct = progress * 100;

  return (
    <div
      className="pointer-events-none fixed left-6 top-0 z-40 hidden h-screen w-6 lg:block"
      aria-hidden="false"
    >
      <svg
        className="absolute left-0 top-0 h-full w-6"
        viewBox="0 0 12 100"
        preserveAspectRatio="none"
      >
        <path
          d="M6,0 C9,8 3,16 6,24 C9,32 3,40 6,48 C9,56 3,64 6,72 C9,80 3,88 6,96 C7,98 6,100 6,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M6,0 C9,8 3,16 6,24 C9,32 3,40 6,48 C9,56 3,64 6,72 C9,80 3,88 6,96 C7,98 6,100 6,100"
          fill="none"
          stroke="rgb(56, 189, 248)"
          strokeWidth="1.5"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 - progressPct}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {SECTIONS.map((section) => {
        const passed = progressPct >= section.fraction * 100 - 2;
        const active = activeId === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() =>
              document
                .getElementById(section.id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label={`Jump to ${section.label}`}
            className="pointer-events-auto absolute left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ top: `${section.fraction * 100}%` }}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                active
                  ? "h-3 w-3 bg-primary shadow-[0_0_10px_2px_rgba(56,189,248,0.7)]"
                  : passed
                  ? "h-2 w-2 bg-primary/60"
                  : "h-1.5 w-1.5 bg-muted-foreground/40"
              }`}
            />
            <span className="pointer-events-none absolute left-4 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        );
      })}
    </div>
  );
}