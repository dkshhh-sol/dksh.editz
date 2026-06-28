import { motion } from "framer-motion";
import { cursorHover } from "@/lib/cursor";

const LINES = [
  { key: "EMAIL", value: "mehtadaksh095@gmail.com", href: "mailto:mehtadaksh095@gmail.com" },
  { key: "INSTAGRAM", value: "@dksh.editzz", href: "https://www.instagram.com/dksh.editzz/" },
  { key: "LINKEDIN", value: "in/daksh-mehta-303975232", href: "https://www.linkedin.com/in/daksh-mehta-303975232/" },
];

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.2, 1] }}
          className="mb-16 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-[color:var(--text-secondary)]"
        >
          <span>05</span>
          <span className="h-px w-12 bg-white/20" />
          <span>CONTACT</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.6, 0.05, 0.2, 1] }}
          className="text-balance text-6xl font-bold leading-[0.88] tracking-[-0.05em] md:text-[12vw] lg:text-[180px]"
        >
          Let's Work <br />
          <span className="font-serif italic font-normal text-[color:var(--text-secondary)]">Together.</span>
        </motion.h2>

        <div className="mt-20 grid gap-12 md:grid-cols-[1fr_auto] md:items-end md:gap-20">
          {/* Terminal block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[color:var(--surface)] font-mono text-sm"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[color:var(--text-secondary)]">
                ~/dksh — contact.sh
              </span>
            </div>
            <div className="p-5 md:p-7">
              <div className="text-[color:var(--text-secondary)]">
                <span className="text-[color:var(--accent-purple)]">dksh</span>
                <span className="text-white">:</span>~$ cat contact.json
              </div>
              <div className="mt-4 space-y-3">
                {LINES.map((l) => (
                  <div
                    key={l.key}
                    className="grid grid-cols-[110px_1fr] items-center gap-4 border-b border-white/[0.04] py-2 last:border-0"
                  >
                    <span className="text-[color:var(--text-secondary)]">{l.key}</span>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...cursorHover("OPEN")}
                      className="group flex items-center justify-between text-foreground transition-colors hover:text-[color:var(--accent-purple)]"
                    >
                      <span className="truncate">{l.value}</span>
                      <span className="ml-3 opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center text-[color:var(--text-secondary)]">
                <span className="text-[color:var(--accent-purple)]">dksh</span>
                <span className="text-white">:</span>~$
                <span className="ml-2 inline-block h-4 w-2 animate-pulse bg-[color:var(--accent-purple)]" />
              </div>
            </div>
          </motion.div>

          <motion.a
            href="mailto:mehtadaksh095@gmail.com"
            {...cursorHover("OPEN")}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="group relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[color:var(--accent-purple-soft)] to-[color:var(--accent-purple)] text-center text-sm font-medium tracking-[0.15em] shadow-[0_30px_80px_-20px_rgba(157,107,255,0.5)] md:h-52 md:w-52"
          >
            START
            <br />
            A PROJECT
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-[color:var(--accent-purple)] opacity-50 blur-2xl"
            />
          </motion.a>
        </div>
      </div>
    </section>
  );
}