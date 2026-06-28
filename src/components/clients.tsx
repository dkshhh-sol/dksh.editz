import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { cursorHover } from "@/lib/cursor";
import vedantImg from "@/assets/vedant.jpg";
import prathamImg from "@/assets/pratham.png";
import jeenerdsImg from "@/assets/jeenerds.png";

const CLIENTS = [
  {
    name: "Vedant Rusty",
    handle: "@vedantrusty",
    subs: "570K+ subscribers",
    href: "https://www.youtube.com/@vedantrusty",
    img: vedantImg,
  },
  {
    name: "Pratham Jiwnani",
    handle: "@prathamjiwnani6419",
    subs: "11K+ subscribers",
    href: "https://www.youtube.com/@prathamjiwnani6419",
    img: prathamImg,
  },
  {
    name: "JEE Nerds",
    handle: "@JEENerds",
    subs: "55K+ subscribers",
    href: "https://www.youtube.com/@JEENerds",
    img: jeenerdsImg,
  },
];

export function Clients() {
  return (
    <section id="clients" className="relative px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          index="04"
          kicker="CLIENTS"
          title={
            <>
              Trusted by <br />
              <span className="text-[color:var(--text-secondary)]">creators who ship.</span>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {CLIENTS.map((c, i) => (
            <motion.a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              {...cursorHover("OPEN")}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.6, 0.05, 0.2, 1] }}
              whileHover={{ y: -6 }}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-[color:var(--surface)] p-6 transition-all hover:border-[color:var(--accent-purple)]/40 hover:shadow-[0_30px_80px_-30px_rgba(157,107,255,0.45)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-xl font-semibold tracking-[-0.02em]">{c.name}</div>
                  <div className="mt-1 font-mono text-xs text-[color:var(--text-secondary)]">{c.handle}</div>
                  <div className="mt-2 font-mono text-[11px] tracking-[0.15em] text-[color:var(--accent-purple)]">
                    {c.subs.toUpperCase()}
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all group-hover:border-[color:var(--accent-purple)] group-hover:bg-[color:var(--accent-purple)]/15">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}