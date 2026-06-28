import { useEffect, useRef, useState } from "react";
import { loadYouTubeAPI, NO_CHROME_PLAYER_VARS } from "@/lib/yt";

type Props = {
  videoId: string;
  poster?: string;
  className?: string;
  alt?: string;
};

/**
 * Silent, viewport-driven YouTube player with zero YT chrome.
 * Mounts the iframe only when the card is near the viewport,
 * pauses when offscreen, and destroys after sustained absence.
 * The iframe is pointer-events:none so YT can never receive hover/click.
 */
export function YtAmbient({ videoId, poster, className, alt = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const destroyTimer = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const posterUrl = poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible) {
          if (destroyTimer.current) {
            clearTimeout(destroyTimer.current);
            destroyTimer.current = null;
          }
          setMounted(true);
          try {
            playerRef.current?.playVideo?.();
          } catch {}
        } else {
          try {
            playerRef.current?.pauseVideo?.();
          } catch {}
          // Destroy after a few seconds offscreen to free memory
          if (destroyTimer.current) clearTimeout(destroyTimer.current);
          destroyTimer.current = window.setTimeout(() => {
            try {
              playerRef.current?.destroy?.();
            } catch {}
            playerRef.current = null;
            setMounted(false);
            setIframeReady(false);
          }, 6000);
        }
      },
      { threshold: 0.25 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (destroyTimer.current) clearTimeout(destroyTimer.current);
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mounted || playerRef.current || !hostRef.current) return;
    let cancelled = false;
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId,
        playerVars: {
          ...NO_CHROME_PLAYER_VARS,
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: videoId,
        },
        events: {
          onReady: (e: any) => {
            try {
              e.target.mute();
              e.target.playVideo();
              setIframeReady(true);
            } catch {}
          },
          onStateChange: (e: any) => {
            const YTS = window.YT?.PlayerState;
            if (YTS && e.data === YTS.ENDED) {
              try {
                e.target.playVideo();
              } catch {}
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [mounted, videoId]);

  return (
    <div ref={wrapRef} className={className ?? "absolute inset-0"}>
      {/* Poster always rendered; fades out once iframe is ready */}
      <img
        src={posterUrl}
        alt={alt}
        loading="lazy"
        className={`absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-500 ${
          iframeReady ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Iframe mount, pointer-events disabled so YT never sees hover/click */}
      {mounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2"
        >
          <div ref={hostRef} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}