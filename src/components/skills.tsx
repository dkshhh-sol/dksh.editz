import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { cursorHover } from "@/lib/cursor";

const FACES = [
  { label: "Premiere Pro", short: "Pr", color: "#9D6BFF" },
  { label: "After Effects", short: "Ae", color: "#C39BFF" },
  { label: "Photoshop", short: "Ps", color: "#3DA9FC" },
  { label: "Premiere Pro", short: "Pr", color: "#9D6BFF" },
  { label: "After Effects", short: "Ae", color: "#C39BFF" },
  { label: "Photoshop", short: "Ps", color: "#3DA9FC" },
];

const SIZE = 260; // base cube size

export function Skills() {
  const [rot, setRot] = useState({ x: -20, y: -30 });
  const drag = useRef<{ on: boolean; lx: number; ly: number }>({ on: false, lx: 0, ly: 0 });
  const auto = useRef(true);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (auto.current && !drag.current.on) {
        setRot((r) => ({ x: r.x, y: r.y + 0.2 }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (cx: number, cy: number) => {
    drag.current = { on: true, lx: cx, ly: cy };
    auto.current = false;
  };
  const onMove = (cx: number, cy: number) => {
    if (!drag.current.on) return;
    const dx = cx - drag.current.lx;
    const dy = cy - drag.current.ly;
    setRot((r) => ({ x: r.x - dy * 0.5, y: r.y + dx * 0.5 }));
    drag.current.lx = cx;
    drag.current.ly = cy;
  };
  const onUp = () => {
    drag.current.on = false;
    setTimeout(() => (auto.current = true), 1500);
  };

  useEffect(() => {
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const mu = () => onUp();
    const tm = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const tu = () => onUp();
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm);
    window.addEventListener("touchend", tu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", tu);
    };
  }, []);

  const half = SIZE / 2;
  const transforms = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  return (
    <section id="skills" className="relative px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-2 md:gap-24">
        <div>
          <SectionHeading
            index="03"
            kicker="TOOLKIT"
            title={
              <>
                The tools <br />
                <span className="font-serif italic font-normal text-[color:var(--text-secondary)]">behind the cut.</span>
              </>
            }
            description="A focused stack — used precisely. Drag the cube to rotate."
          />
        </div>

        <div
          {...cursorHover("DRAG")}
          className="relative flex min-h-[420px] items-center justify-center select-none"
          onMouseDown={(e) => onDown(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY);
          }}
          style={{ perspective: 1400 }}
        >
          {/* Floor glow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(157,107,255,0.4), transparent 70%)",
            }}
          />
          <motion.div
            className="relative"
            style={{
              width: SIZE,
              height: SIZE,
              transformStyle: "preserve-3d",
              transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            }}
          >
            {FACES.map((f, i) => (
              <div
                key={i}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm"
                style={{
                  transform: transforms[i],
                  boxShadow: `inset 0 0 60px ${f.color}22`,
                }}
              >
                <div
                  className="text-7xl font-bold tracking-[-0.05em]"
                  style={{ color: f.color }}
                >
                  {f.short}
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.3em] text-[color:var(--text-secondary)]">
                  {f.label.toUpperCase()}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}