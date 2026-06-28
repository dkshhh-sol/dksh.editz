import { useEffect, useRef, useState } from "react";
import { Play, Menu, X } from "lucide-react";
import bgVideo from "@/assets/background.mp4";

const VIDEO_URL = bgVideo;

function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    const frames: HTMLCanvasElement[] = [];
    let targetW = 0;
    let targetH = 0;

    const capture = () => {
      if (cancelled || video.ended) return;
      if (!targetW && video.videoWidth) {
        // Sharper capture: match the device's pixel resolution (capped at 1920)
        // instead of the old 960 downsample. Responsive — small screens stay light.
        const maxW = Math.min(1920, Math.round(window.innerWidth * (window.devicePixelRatio || 1)));
        const ratio = Math.min(1, maxW / video.videoWidth);
        targetW = Math.round(video.videoWidth * ratio);
        targetH = Math.round(video.videoHeight * ratio);
      }
      if (targetW) {
        const c = document.createElement("canvas");
        c.width = targetW;
        c.height = targetH;
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, targetW, targetH);
          frames.push(c);
        }
      }
      const v = video as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => void;
      };
      if (typeof v.requestVideoFrameCallback === "function") {
        v.requestVideoFrameCallback(capture);
      } else {
        requestAnimationFrame(capture);
      }
    };

    const onEnded = () => {
      framesRef.current = frames;
      setDone(true);
    };

    video.addEventListener("ended", onEnded);
    const onCanPlay = () => {
      video.play().catch(() => {});
      const v = video as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => void;
      };
      if (typeof v.requestVideoFrameCallback === "function") {
        v.requestVideoFrameCallback(capture);
      } else {
        requestAnimationFrame(capture);
      }
    };
    video.addEventListener("loadeddata", onCanPlay, { once: true });

    return () => {
      cancelled = true;
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = frames[0].width;
    canvas.height = frames[0].height;

    let i = 0;
    let dir = 1;
    const interval = 1000 / 30;
    let last = performance.now();
    let raf = 0;

    const loop = (t: number) => {
      if (t - last >= interval) {
        ctx.drawImage(frames[i], 0, 0);
        i += dir;
        if (i >= frames.length - 1) { i = frames.length - 1; dir = -1; }
        else if (i <= 0) { i = 0; dir = 1; }
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  return (
    <div className="absolute inset-0 z-0 scale-[1.08] origin-center overflow-hidden">
      {!done && (
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          autoPlay
          className="h-full w-full object-cover"
        />
      )}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover"
        style={{ display: done ? "block" : "none", width: "100%", height: "100%" }}
      />
    </div>
  );
}

function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="white" aria-hidden>
      <path d="M 256 256 L 128 256 C 198.692 256 256 198.692 256 128 C 256 57.308 198.692 0 128 0 C 57.308 0 0 57.308 0 128 C 0 198.692 57.308 256 128 256 L 0 256 L 0 0 L 256 0 Z M 128 104 C 141.255 104 152 114.745 152 128 C 152 141.255 141.255 152 128 152 C 114.745 152 104 141.255 104 128 C 104 114.745 114.745 104 128 104 Z" />
    </svg>
  );
}

export function QuietpressHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = ["Work", "Showreel", "Motion", "Contact"];

  return (
    <section className="quietpress relative h-screen w-full overflow-hidden bg-black text-white">
      <BoomerangVideoBg />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-base tracking-tight text-white">DKSH</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l} href="#" className="text-sm text-white/90 transition-colors hover:text-white">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#work"
            className="flex items-center gap-2 rounded-xl bg-white p-1 pr-3 text-gray-900 transition-transform duration-200 hover:scale-105 active:scale-95 sm:pr-4"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#9D6BFF]">
              <Play size={14} strokeWidth={2} className="text-white" fill="currentColor" />
            </span>
            <span className="text-sm">
              <span className="hidden sm:inline">Watch </span>Showreel
            </span>
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="liquid-glass grid h-9 w-9 place-items-center rounded-xl text-white md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="absolute inset-x-0 top-16 z-20 md:hidden">
          <div className="liquid-glass mx-4 rounded-2xl p-2">
            {navLinks.map((l) => (
              <a
                key={l}
                href="#"
                className="block rounded-xl px-4 py-3 text-sm text-white/90 hover:bg-white/10"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-start px-4 pt-28 sm:px-6 sm:pt-36 md:pt-44">
        <div
          className="liquid-glass animate-fade-up delay-1 mb-5 rounded-lg px-4 py-1.5 text-xs text-white sm:mb-6 sm:text-sm"
          style={{ background: "rgba(255, 255, 255, 0.16)" }}
        >
          Reel 04 · Cinematic grade
        </div>
        <h1 className="animate-fade-up delay-2 max-w-3xl text-4xl leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          edits cut for the
          <br />
          story that lands.
        </h1>
        <p className="animate-fade-up delay-3 mt-5 max-w-md text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base md:text-lg">
          High-retention edits, cinematic color, and motion graphics for creators. Every frame placed with intent, every cut earning the next second.
        </p>
        <div className="animate-fade-up delay-4 mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#work"
            className="rounded-xl bg-white px-7 py-2.5 text-center text-sm text-gray-900 transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Watch showreel
          </a>
          <a
            href="#contact"
            className="liquid-glass rounded-xl px-7 py-2.5 text-center text-sm text-white transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Start a project
          </a>
        </div>
      </div>
    </section>
  );
}