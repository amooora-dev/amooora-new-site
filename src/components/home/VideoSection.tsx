"use client";

import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useEffect, useRef, useState } from "react";

const YT_VIDEO_ID = "PHO5TkLfpKg";

function applyMobileVideoCover(container: HTMLElement | null) {
  if (!container) return;
  const iframe = container.querySelector("iframe");
  if (!iframe) return;
  Object.assign(iframe.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    transform: "none",
    border: "none",
    pointerEvents: "none",
  });
}

export function VideoSection() {
  const isMobile = useIsMobile();
  const [offset, setOffset] = useState(0);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      setOffset(-ref.current.getBoundingClientRect().top * 0.3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const playVideo = () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      player.mute();
      player.playVideo();
      const state = player.getPlayerState?.();
      if (state === 1) setPaused(false);
    } catch {
      /* player ainda não disponível */
    }
  };

  useEffect(() => {
    const init = () => {
      if (!divRef.current) return;
      playerRef.current = new window.YT!.Player(divRef.current, {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: YT_VIDEO_ID,
          controls: 0,
          disablekb: 1,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          iv_load_policy: 3,
          enablejsapi: 1,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            try {
              e.target.unloadModule?.("captions");
              e.target.setOption?.("captions", "track", {});
            } catch {
              /* legendas indisponíveis */
            }
            if (isMobile) {
              applyMobileVideoCover(divRef.current);
              window.setTimeout(
                () => applyMobileVideoCover(divRef.current),
                100,
              );
            }
            e.target.playVideo();
            setReady(true);
            setPaused(false);
            [200, 600, 1200, 2500].forEach((delay) => {
              window.setTimeout(() => {
                e.target.mute();
                e.target.playVideo();
                if (isMobile) applyMobileVideoCover(divRef.current);
              }, delay);
            });
          },
          onStateChange: (e) => {
            if (e.data === 0) e.target.playVideo();
            if (e.data === 1) setPaused(false);
            if (e.data === 2) setPaused(true);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      init();
    } else {
      if (!document.getElementById("yt-api")) {
        const s = document.createElement("script");
        s.id = "yt-api";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      window.onYouTubeIframeAPIReady = init;
    }
    return () => {
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !divRef.current) return;
    const onResize = () => applyMobileVideoCover(divRef.current);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile, ready]);

  useEffect(() => {
    if (!ready) return;
    playVideo();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playVideo();
      },
      { threshold: 0.05 },
    );
    if (ref.current) observer.observe(ref.current);
    const onVisible = () => {
      if (document.visibilityState === "visible") playVideo();
    };
    document.addEventListener("visibilitychange", onVisible);
    const resumeOnInteraction = () => playVideo();
    document.addEventListener("touchstart", resumeOnInteraction, {
      passive: true,
    });
    window.addEventListener("scroll", resumeOnInteraction, { passive: true });
    const retryId = window.setInterval(
      () => {
        const player = playerRef.current;
        if (!player?.getPlayerState) return;
        const state = player.getPlayerState();
        if (state !== 1) {
          player.mute();
          player.playVideo();
        }
      },
      isMobile ? 700 : 1500,
    );
    const stopRetryId = window.setTimeout(
      () => window.clearInterval(retryId),
      isMobile ? 12000 : 8000,
    );
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      document.removeEventListener("touchstart", resumeOnInteraction);
      window.removeEventListener("scroll", resumeOnInteraction);
      window.clearInterval(retryId);
      window.clearTimeout(stopRetryId);
    };
  }, [ready, isMobile]);

  useEffect(() => {
    if (!ready || !playerRef.current) return;
    if (muted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
      playerRef.current.setVolume(80);
    }
  }, [muted, ready]);

  return (
    <section
      ref={ref}
      className={`relative flex select-none items-center justify-center overflow-hidden ${
        isMobile ? 'h-[56.25vw]' : 'h-[70vh]'
      }`}
    >
      {/* Camada de vídeo — pointer-events: none para o click não chegar no iframe */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ transform: `translateY(${isMobile ? 0 : offset}px)` }}
      >
        <div
          ref={divRef}
          className={
            isMobile
              ? 'absolute inset-0 border-none'
              : 'absolute -left-[10%] -top-[20%] h-[140%] w-[120%] border-none'
          }
        />
      </div>

      {/* Controles */}
      <div className='absolute bottom-7 right-7 z-10 flex gap-2.5'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!ready || !playerRef.current) return;
            if (paused) {
              playerRef.current.playVideo();
              setPaused(false);
            } else {
              playerRef.current.pauseVideo();
              setPaused(true);
            }
          }}
          className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/35 bg-white/[0.18] text-white backdrop-blur-sm transition-colors hover:bg-white/30'
          title={paused ? "Reproduzir" : "Pausar"}
        >
          {paused ? (
            <span className='ml-0.5 border-y-8 border-l-[12px] border-y-transparent border-l-white' />
          ) : (
            <span className='flex gap-1'>
              <span className='h-3.5 w-[3px] rounded-sm bg-white' />
              <span className='h-3.5 w-[3px] rounded-sm bg-white' />
            </span>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setMuted((m) => !m);
          }}
          className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/35 bg-white/[0.18] text-white backdrop-blur-sm transition-colors hover:bg-white/30'
          title={muted ? "Ativar som" : "Silenciar"}
        >
          <span className='relative inline-flex h-5 w-5 items-center justify-center'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              aria-hidden='true'
            >
              <path
                d='M4 10H8L13 6V18L8 14H4V10Z'
                stroke='white'
                strokeWidth='1.8'
                strokeLinejoin='round'
              />
              {!muted && (
                <path
                  d='M16 9C17.2 10 17.2 14 16 15'
                  stroke='white'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
              )}
              {!muted && (
                <path
                  d='M18.5 7.5C21 9.8 21 14.2 18.5 16.5'
                  stroke='white'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
              )}
            </svg>
            {muted && (
              <span className='absolute h-0.5 w-[18px] rotate-[-45deg] bg-white' />
            )}
          </span>
        </button>
      </div>
    </section>
  );
}
