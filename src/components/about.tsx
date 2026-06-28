import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeading } from "./section-heading";

const STATS = [
  { value: 2, suffix: "+", label: "Years" },
  { value: 50, suffix: "M+", label: "Views" },
  { value: 200, suffix: "+", label: "Videos" },
  { value: 15, suffix: "+", label: "Clients" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          index="02"
          kicker="ABOUT"
          title={
            <>
              Crafting frames that <br className="hidden md:block" />
              <span className="font-serif italic font-normal text-[color:var(--text-secondary)]">make people stay.</span>
            </>
          }
          description="DKSH specializes in high-retention edits, cinematic storytelling and motion graphics — turning raw footage into work that holds attention from the first frame to the last."
        />

        <div className="grid grid-cols-2 gap-y-12 border-t border-white/[0.06] pt-16 md:grid-cols-4 md:gap-y-0">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.6, 0.05, 0.2, 1] }}
              className="md:border-r md:border-white/[0.06] md:px-8 md:last:border-r-0"
            >
              <div className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 font-mono text-[10px] tracking-[0.3em] text-[color:var(--text-secondary)]">
                {s.label.toUpperCase()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}