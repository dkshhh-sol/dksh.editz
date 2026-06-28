export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-2 font-mono text-sm tracking-[0.25em]">
          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--accent-purple)]" />
          DKSH
        </div>
        <div className="font-mono text-xs text-[color:var(--text-secondary)]">
          © 2026 — All rights reserved
        </div>
        <div className="font-mono text-xs text-[color:var(--text-secondary)]">
          Built with Next.js
        </div>
      </div>
    </footer>
  );
}