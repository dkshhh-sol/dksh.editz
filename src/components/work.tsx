import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { cursorHover } from "@/lib/cursor";
import { YtAmbient } from "./yt-ambient";
import { YtControlled } from "./yt-controlled";

type Project = {
  id: string;
  title: string;
  category: string;
  videoId: string;
  description: string;
  software: string[];
};

const yt = (url: string) => url.split("/embed/")[1];

const PROJECTS: Project[] = [
  // Long form
  { id: "lf1", title: "Documentary Cut · 01", category: "Long Form", videoId: yt("https://www.youtube.com/embed/cONxhTSxaXc"), description: "Long-form narrative edit balancing pacing, b-roll cadence and atmospheric sound design.", software: ["Premiere Pro", "After Effects"] },
  { id: "lf2", title: "Long-Form Feature · 02", category: "Long Form", videoId: yt("https://www.youtube.com/embed/Pr6uugzWkTg"), description: "Multi-segment edit built for retention with sharp scene transitions and motion accents.", software: ["Premiere Pro", "Photoshop"] },
  { id: "lf3", title: "Long-Form Feature · 03", category: "Long Form", videoId: yt("https://www.youtube.com/embed/SVMBLtLpPnQ"), description: "Story-driven edit with layered audio design and color-graded sequences.", software: ["Premiere Pro", "After Effects"] },

  // Short form
  { id: "sf1", title: "Short · Hook 01", category: "Short Form", videoId: yt("https://www.youtube.com/embed/Yw2-hdcUbuM"), description: "Vertical short engineered for the first 3 seconds — hook, payoff, loop.", software: ["Premiere Pro", "After Effects"] },
  { id: "sf2", title: "Short · Hook 02", category: "Short Form", videoId: yt("https://www.youtube.com/embed/6AeguPhFguE"), description: "Fast-cut short with kinetic typography and beat-synced edits.", software: ["After Effects"] },
  { id: "sf3", title: "Short · Hook 03", category: "Short Form", videoId: yt("https://www.youtube.com/embed/3K7tICqSbEk"), description: "High-retention short with seamless transitions and punchy sound design.", software: ["Premiere Pro"] },
  { id: "sf4", title: "Short · Hook 04", category: "Short Form", videoId: yt("https://www.youtube.com/embed/I2AS_EsOE-E"), description: "Story-led short focused on emotional pacing and clean cuts.", software: ["Premiere Pro", "Photoshop"] },
  { id: "sf5", title: "Short · Hook 05", category: "Short Form", videoId: yt("https://www.youtube.com/embed/WXc-Lar-hU4"), description: "Visually dense short with composited motion overlays.", software: ["After Effects"] },
  { id: "sf6", title: "Short · Hook 06", category: "Short Form", videoId: yt("https://www.youtube.com/embed/EpJUAzs6SWU"), description: "Punchy short cut to a tight rhythm and layered SFX.", software: ["Premiere Pro"] },

  // Motion
  { id: "mg1", title: "Motion Piece · 01", category: "Motion Graphics", videoId: yt("https://www.youtube.com/embed/QxLSZBYBZYs"), description: "Type-driven motion graphics piece with custom transitions.", software: ["After Effects"] },
  { id: "mg2", title: "Motion Piece · 02", category: "Motion Graphics", videoId: yt("https://www.youtube.com/embed/U4rVK0LmNLg"), description: "Animated brand sequence with kinetic typography and shape morphs.", software: ["After Effects"] },
  { id: "mg3", title: "Motion Piece · 03", category: "Motion Graphics", videoId: yt("https://www.youtube.com/embed/Ud6pDWE5gpY"), description: "Hybrid motion design blending 2D animation with edited footage.", software: ["After Effects", "Premiere Pro"] },
];

const CATEGORIES = ["All", "Motion Graphics", "Long Form", "Short Form"] as const;
type Category = (typeof CATEGORIES)[number];
type GridCategory = Exclude<Category, "All">;

const ORDER: GridCategory[] = ["Motion Graphics", "Long Form", "Short Form"];

const GRID_CLASS: Record<GridCategory, string> = {
  "Motion Graphics": "grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2",
  "Long Form": "grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "Short Form": "grid gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const ASPECT_CLASS: Record<GridCategory, string> = {
  "Motion Graphics": "aspect-video",
  "Long Form": "aspect-[16/10]",
  "Short Form": "aspect-[9/16]",
};

export function Work() {
  const [cat, setCat] = useState<Category>("All");
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups: GridCategory[] = cat === "All" ? ORDER : [cat as GridCategory];

  return (
    <section id="work" className="relative px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          index="01"
          kicker="SELECTED WORK"
          title={
            <>
              Frames, <br />
              <span className="font-serif italic font-normal text-[color:var(--text-secondary)]">cut with intent.</span>
            </>
          }
        />

        <div className="mb-12 flex flex-wrap gap-2 md:mb-16">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              {...cursorHover("VIEW")}
              onClick={() => setCat(c)}
              className={`rounded-full border px-5 py-2 text-sm transition-all ${
                cat === c
                  ? "border-[color:var(--accent-purple)]/60 bg-[color:var(--accent-purple)]/15 text-foreground"
                  : "border-white/10 text-[color:var(--text-secondary)] hover:border-white/20 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-20 md:space-y-28">
          {groups.map((g) => {
            const list = PROJECTS.filter((p) => p.category === g);
            if (list.length === 0) return null;
            return (
              <div key={g}>
                {cat === "All" && (
                  <div className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-[color:var(--text-secondary)] md:mb-8">
                    <span className="h-px w-10 bg-white/20" />
                    <span>{g.toUpperCase()}</span>
                  </div>
                )}
                <motion.div layout className={GRID_CLASS[g]}>
                  <AnimatePresence mode="popLayout">
                    {list.map((p, i) => (
                      <ProjectCard
                        key={p.id}
                        p={p}
                        i={i}
                        aspect={ASPECT_CLASS[g]}
                        onOpen={() => setOpen(p)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectModal p={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ p, i, aspect, onOpen }: { p: Project; i: number; aspect: string; onOpen: () => void }) {
  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: [0.6, 0.05, 0.2, 1] }}
      {...cursorHover("OPEN")}
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[color:var(--surface)] text-left transition-all hover:border-[color:var(--accent-purple)]/40 hover:shadow-[0_30px_80px_-30px_rgba(157,107,255,0.4)]"
    >
      <div className={`relative ${aspect} w-full overflow-hidden bg-black`}>
        <YtAmbient videoId={p.videoId} alt={p.title} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] tracking-[0.3em] text-white/70">
          {p.category.toUpperCase()}
        </div>
        <div className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur transition-all group-hover:border-[color:var(--accent-purple)] group-hover:bg-[color:var(--accent-purple)]/20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </div>
      </div>
      <div className="flex items-center justify-between p-5">
        <div className="text-base font-medium">{p.title}</div>
        <div className="font-mono text-[10px] tracking-[0.25em] text-[color:var(--text-secondary)]">
          0{(i % 9) + 1}
        </div>
      </div>
    </motion.button>
  );
}

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl md:p-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.6, 0.05, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[color:var(--surface)]"
      >
        <button
          {...cursorHover("VIEW")}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 backdrop-blur hover:border-[color:var(--accent-purple)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <YtControlled videoId={p.videoId} autoPlay startMuted />
        <div className="grid gap-6 p-6 md:grid-cols-3 md:p-10">
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] tracking-[0.3em] text-[color:var(--accent-purple)]">
              {p.category.toUpperCase()}
            </div>
            <h3 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-4xl">{p.title}</h3>
            <p className="mt-4 text-[color:var(--text-secondary)]">{p.description}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-[color:var(--text-secondary)]">
              SOFTWARE
            </div>
            <ul className="mt-3 space-y-1">
              {p.software.map((s) => (
                <li key={s} className="text-sm">{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}