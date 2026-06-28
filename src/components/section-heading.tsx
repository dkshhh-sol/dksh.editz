import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  index,
  kicker,
  title,
  description,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="mb-16 md:mb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.6, 0.05, 0.2, 1] }}
        className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-[color:var(--text-secondary)]"
      >
        <span>{index}</span>
        <span className="h-px w-12 bg-white/20" />
        <span>{kicker}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.6, 0.05, 0.2, 1], delay: 0.1 }}
        className="text-balance text-5xl font-bold leading-[0.9] tracking-[-0.04em] md:text-7xl lg:text-8xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}