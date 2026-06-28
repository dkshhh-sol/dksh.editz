import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cursorHover } from "@/lib/cursor";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#clients", label: "Clients" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, 0.2, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-20 md:px-10">
        <a
          href="#top"
          {...cursorHover("SCROLL")}
          className="flex items-center gap-2 font-mono text-sm tracking-[0.25em]"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--accent-purple)] shadow-[0_0_12px_rgba(157,107,255,0.8)]" />
          DKSH
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                {...cursorHover("SCROLL")}
                className="group relative inline-flex items-center px-4 py-2 text-sm text-[color:var(--text-secondary)] transition-colors hover:text-foreground"
              >
                <span className="mr-2 font-mono text-[10px] text-[color:var(--text-secondary)]/60 transition-colors group-hover:text-[color:var(--accent-purple)]">
                  0{LINKS.indexOf(l) + 1}
                </span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          {...cursorHover("OPEN")}
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm transition-all hover:border-[color:var(--accent-purple)]/60 hover:bg-[color:var(--accent-purple)]/10 md:inline-flex"
        >
          Available for work
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </a>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
        >
          <span className="relative block h-2.5 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-white transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-white transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.4, ease: [0.6, 0.05, 0.2, 1] }}
        className="overflow-hidden border-t border-white/[0.06] bg-[#050505]/95 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col px-6 py-4">
          {LINKS.map((l) => (
            <li key={l.href} className="border-b border-white/[0.04] last:border-0">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-lg"
              >
                <span>{l.label}</span>
                <span className="font-mono text-xs text-[color:var(--text-secondary)]">
                  0{LINKS.indexOf(l) + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.header>
  );
}