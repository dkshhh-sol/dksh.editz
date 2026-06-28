import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "Initializing Workspace...",
  "Loading Assets...",
  "Connecting Media Cache...",
  "Building Timeline...",
  "Ready.",
];

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 6 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setProgress(100);
        setStep(STEPS.length - 1);
        setTimeout(() => setDone(true), 500);
        setTimeout(onDone, 1100);
        return;
      }
      setProgress(p);
      setStep(Math.min(STEPS.length - 2, Math.floor((p / 100) * (STEPS.length - 1))));
    }, 140);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          {/* Subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative w-[min(560px,86vw)]">
            <div className="mb-10 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-[color:var(--accent-purple)]/20 ring-1 ring-[color:var(--accent-purple)]/50" />
                <span className="font-mono text-xs tracking-[0.3em] text-[color:var(--text-secondary)]">
                  DKSH / STUDIO
                </span>
              </div>
              <span className="font-mono text-xs tabular-nums text-[color:var(--text-secondary)]">
                {String(Math.round(progress)).padStart(3, "0")}%
              </span>
            </div>

            <div className="h-px w-full overflow-hidden bg-white/[0.06]">
              <motion.div
                className="h-full bg-gradient-to-r from-[color:var(--accent-purple-soft)] to-[color:var(--accent-purple)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            <div className="mt-8 h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.6, 0.05, 0.2, 1] }}
                  className="font-mono text-sm text-[color:var(--text-secondary)]"
                >
                  <span className="text-[color:var(--accent-purple)]">→ </span>
                  {STEPS[step]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}