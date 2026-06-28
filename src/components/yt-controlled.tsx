import { useEffect, useRef, useState } from "react";
import { cursorHover } from "@/lib/cursor";
import { loadYouTubeAPI, NO_CHROME_PLAYER_VARS, fmtTime } from "@/lib/yt";

type Props = {
  videoId: string;
  autoPlay?: boolean;
  startMuted?: boolean;
  className?: string;
};

export function YtControlled({
  videoId,
  autoPlay = true,
  startMuted = true,
  className,
}: Props) {
  const screenRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(startMuted);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let tickHandle = 0;
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId,
        playerVars: {
          ...NO_CHROME_PLAYER_VARS,
          autoplay: autoPlay ? 1 : 0,
          mute: startMuted ? 1 : 0,
        },
        events: {
          onReady: (e: any) => {
            try {
              if (startMuted) e.target.mute();
              else e.target.unMute();
              if (autoPlay) e.target.playVideo();
              setDuration(e.target.getDuration() || 0);
              setReady(true);
            } catch {}
          },
          onStateChange: (e: any) => {
            const YTS = window.YT?.PlayerState;
            if (!YTS) return;
            if (e.data === YTS.PLAYING) {
              setIsPlaying(true);
              setDuration(e.target.getDuration() || 0);
            } else if (e.data === YTS.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === YTS.ENDED) {
              setIsPlaying(false);
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
      tickHandle = window.setTimeout(tick, 250) as unknown as number;
    };
    tick();

    return () => {
      cancelled = true;
      clearTimeout(tickHandle);
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  };
  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) {
      p.unMute();
      p.setVolume(80);
      setIsMuted(false);
    } else {
      p.mute();
      setIsMuted(true);
    }
  };
  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(Number(e.target.value));
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
    <div
      ref={screenRef}
      className={
        className ??
        "group/screen relative aspect-video w-full overflow-hidden bg-black"
      }
    >
      {/* Iframe mount */}
      <div className="absolute inset-0">
        <div ref={hostRef} className="h-full w-full" />
        {/* Click-to-toggle overlay covers the iframe so YT never receives clicks */}
        <div
          className="absolute inset-0"
          onClick={togglePlay}
          {...cursorHover(isPlaying ? "PAUSE" : "PLAY")}
        />
      </div>

      {/* Controls */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pb-2 pt-6 opacity-0 transition-opacity duration-300 group-hover/screen:opacity-100 focus-within:opacity-100 sm:px-4 sm:pb-3 sm:pt-10 ${
          ready ? "" : "hidden"
        }`}
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
              onMouseUp={(e) =>
                commitSeek(Number((e.target as HTMLInputElement).value))
              }
              onTouchEnd={(e) =>
                commitSeek(Number((e.target as HTMLInputElement).value))
              }
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
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-[color:var(--accent-purple)]/70"
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
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-[color:var(--accent-purple)]/70"
            >
              {isMuted ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
              )}
            </button>
            <span className="ml-1 hidden tabular-nums sm:inline">
              {fmtTime(current)} / {fmtTime(duration)}
            </span>
          </div>
          <button
            onClick={toggleFullscreen}
            {...cursorHover("FULLSCREEN")}
            aria-label="Fullscreen"
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-[color:var(--accent-purple)]/70"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}