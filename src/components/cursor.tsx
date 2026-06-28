import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 });
  const sy = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 });
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLabel = (e: Event) => setLabel((e as CustomEvent<string>).detail);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("dksh:cursor", onLabel as EventListener);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("dksh:cursor", onLabel as EventListener);
    };
  }, [x, y]);

  if (!enabled) return null;

  const expanded = label !== "";

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{
            width: expanded ? 72 : down ? 10 : 14,
            height: expanded ? 72 : down ? 10 : 14,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 select-none text-[10px] font-medium tracking-[0.2em] text-black"
        style={{ x: sx, y: sy }}
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.div>
    </>
  );
}