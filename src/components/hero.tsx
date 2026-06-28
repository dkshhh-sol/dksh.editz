import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cursorHover } from "@/lib/cursor";

const ROLES = ["VIDEO EDITOR", "MOTION DESIGNER", "VISUAL STORYTELLER"];
const VIDEO_ID = "eJ14PtKtRtU";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<any> | null = null;
function loadYouTubeAPI(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { damping: 30, stiffness: 120 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { damping: 30, stiffness: 120 });
  const [mounted, setMounted] = useState(false);

  const playerRef = useRef<any>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // Init YT player
  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !playerHostRef.current) return;
      playerRef.current = new YT.Player(playerHostRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          loop: 1,
          playlist: VIDEO_ID,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
            setDuration(e.target.getDuration() || 0);
            setReady(true);
          },
          onStateChange: (e: any) => {
            const YTS = window.YT.PlayerState;
            if (e.data === YTS.PLAYING) {
              setIsPlaying(true);
              setDuration(e.target.getDuration() || 0);
            } else if (e.data === YTS.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === YTS.ENDED) {
              e.target.playVideo();
            }
          },
        },
      });
    });

    const tick = () => {
      const p = playerRef.current;
      if (p && typeof p.getCurrentTime === "function") {
        try {
          if (!scrubbing) setCurrent(p.getCurrentTime() || 0);
          const d = p.getDuration?.() || 0;
          if (d) setDuration(d);
        } catch {}
      }
      raf = window.setTimeout(tick, 250) as unknown as number;
    };
    tick();

    return () => {
      cancelled = true;
      clearTimeout(raf);
      try { playerRef.current?.destroy?.(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo(); else p.playVideo();
  };
  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) { p.unMute(); p.setVolume(80); setIsMuted(false); }
    else { p.mute(); setIsMuted(true); }
  };
  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setCurrent(v);
  };
  const commitSeek = (v: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(v, true);
    setScrubbing(false);
  };
  const toggleFullscreen = () => {
    const el = screenRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const progressPct = duration ? (current / duration) * 100 : 0;

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden pt-24 md:pt-32"
    >
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(157,107,255,0.35) 0%, rgba(80,60,200,0.15) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
          }}
        />
      </div>

      {/* Top meta strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: mounted ? 1 : 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-secondary)] md:mb-12"
      >
        <span className="h-px w-8 bg-white/20" />
        <span>SCENE 01 / SHOWREEL 2026</span>
        <span className="h-px w-8 bg-white/20" />
      </motion.div>

      {/* Monitor */}
      <motion.div
        style={{ perspective: 1400 }}
        className="relative z-10 w-[min(1100px,92vw)] px-2 sm:px-0"
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.6, 0.05, 0.2, 1], delay: 0.4 }}
          className="group relative aspect-[21/9] w-full"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[28px] opacity-80 blur-3xl md:-inset-10 md:rounded-[40px]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(157,107,255,0.45), rgba(60,90,255,0.2) 50%, transparent 75%)",
            }}
          />
          {/* Bezel */}
          <div className="relative h-full w-full rounded-[18px] border border-white/[0.08] bg-gradient-to-b from-[#161616] to-[#0a0a0a] p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:rounded-[28px] sm:p-2 md:rounded-[36px] md:p-3">
            <div
              ref={screenRef}
              className="group/screen relative h-full w-full overflow-hidden rounded-[12px] bg-black sm:rounded-[20px] md:rounded-[28px]"
            >
              {/* YT player mount */}
              <div className="absolute inset-0">
                <div ref={playerHostRef} className="h-full w-full" />
                {/* Block all pointer events on iframe so YT UI never appears */}
                <div
                  className="absolute inset-0"
                  onClick={togglePlay}
                  {...cursorHover(isPlaying ? "PAUSE" : "PLAY")}
                />
              </div>

              {/* Soft scanline / vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)",
                }}
              />
              {/* Corner HUD */}
              <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.3em] text-white/70 sm:left-4 sm:top-4 sm:gap-2 sm:text-[10px]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                REC · SHOWREEL
              </div>
              <div className="pointer-events-none absolute right-2 top-2 font-mono text-[8px] tracking-[0.3em] text-white/70 sm:right-4 sm:top-4 sm:text-[10px]">
                {fmt(current)}
              </div>

              {/* Custom controls */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pb-2 pt-6 opacity-0 transition-opacity duration-300 group-hover/screen:opacity-100 sm:px-4 sm:pb-3 sm:pt-10 ${ready ? "" : "hidden"}`}
                style={{ pointerEvents: "auto" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Seek */}
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 flex-1 items-center">
                    <div className="absolute inset-x-0 h-[3px] rounded-full bg-white/15" />
                    <div
                      className="absolute h-[3px] rounded-full bg-[color:var(--accent-purple)]"
                      style={{ width: `${progressPct}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={current}
                      onMouseDown={() => setScrubbing(true)}
                      onTouchStart={() => setScrubbing(true)}
                      onChange={onSeek}
                      onMouseUp={(e) => commitSeek(Number((e.target as HTMLInputElement).value))}
                      onTouchEnd={(e) => commitSeek(Number((e.target as HTMLInputElement).value))}
                      className="relative z-10 h-3 w-full cursor-pointer appearance-none bg-transparent
                        [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                        [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
                    />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-white/80">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={togglePlay}
                      {...cursorHover(isPlaying ? "PAUSE" : "PLAY")}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition hover:bg-[color:var(--accent-purple)]/70 sm:h-8 sm:w-8"
                    >
                      {isPlaying ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7V5z" /></svg>
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      {...cursorHover(isMuted ? "UNMUTE" : "MUTE")}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition hover:bg-[color:var(--accent-purple)]/70 sm:h-8 sm:w-8"
                    >
                      {isMuted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
                      )}
                    </button>
                    <span className="ml-1 hidden tabular-nums sm:inline">{fmt(current)} / {fmt(duration)}</span>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    {...cursorHover("FULLSCREEN")}
                    aria-label="Fullscreen"
                    className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition hover:bg-[color:var(--accent-purple)]/70 sm:h-8 sm:w-8"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Monitor stand */}
          <div
            aria-hidden
            className="mx-auto mt-2 h-3 w-32 rounded-b-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] md:h-4"
          />
          <div
            aria-hidden
            className="mx-auto h-1 w-48 rounded-full bg-black/60 blur-[3px]"
          />
        </motion.div>
      </motion.div>

      {/* Title block */}
      <div className="relative z-10 mt-16 flex flex-col items-center md:mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.2, 1], delay: 0.8 }}
          className="text-balance text-center text-[18vw] font-bold leading-[0.85] tracking-[-0.05em] md:text-[clamp(96px,12vw,200px)]"
        >
          DKSH
        </motion.h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:mt-8 md:gap-x-10">
          {ROLES.map((r, i) => (
            <motion.span
              key={r}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.1, ease: [0.6, 0.05, 0.2, 1] }}
              className="font-mono text-[10px] tracking-[0.35em] text-[color:var(--text-secondary)] md:text-xs"
            >
              {r}
            </motion.span>
          ))}
        </div>

        <motion.a
          href="#work"
          {...cursorHover("VIEW")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.6, 0.05, 0.2, 1] }}
          className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-7 py-3.5 text-sm transition-all hover:border-[color:var(--accent-purple)]/60 md:mt-14"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-[color:var(--accent-purple-soft)] to-[color:var(--accent-purple)] transition-transform duration-500 ease-[cubic-bezier(0.6,0.05,0.2,1)] group-hover:translate-y-0"
          />
          View Work
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-[color:var(--text-secondary)]"
      >
        <span className="inline-block animate-pulse">↓ SCROLL</span>
      </motion.div>
    </section>
  );
}