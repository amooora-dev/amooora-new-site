'use client';

import { Fragment, useState, useEffect, useRef, type CSSProperties, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { TWEAK_DEFAULTS } from '@/lib/tweak-defaults';
import {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRadio,
  TweakToggle,
} from '@/components/tweaks/tweaks-panel';
import { PilotSignup } from '@/components/home/PilotSignup';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type {
  CtaProps,
  HeroBProps,
  HeroProps,
  ManifestoParagraph,
  ManifestoProps,
  MobileProps,
  ParticleCanvasProps,
  SectionProps,
} from '@/components/home/types';

function TextWithBreaks({ text }: { text: string }) {
  return text.split('\n').map((line, i, arr) =>
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  );
}

type Particle = {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  opacity: number;
};

/* ── PARTICLE CANVAS ── */
function ParticleCanvas({ color, active }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ particles: Particle[]; raf: number | null }>({ particles: [], raf: null });

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 60;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2
    }));
    stateRef.current.particles = particles;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color + Math.round((1 - dist / 120) * 40).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      stateRef.current.raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (stateRef.current.raf != null) cancelAnimationFrame(stateRef.current.raf);
    };
  }, [color, active]);

  if (!active) return null;
  return <canvas ref={canvasRef} id="particle-canvas" style={{ width: '100%', height: '100%' }} />;
}

/* ── HERO - Direction A: Editorial clean ── */
function HeroA({ accent, particles, isMobile, dir }: HeroProps & { dir: 'A' | 'B' }) {
  const navOffset = isMobile ? 72 : 84;
  const heroBackground = C.hero.background;

  return (
    <section style={{
      position: 'relative',
      minHeight: isMobile ? 'min(88svh, 780px)' : 'min(100vh, 920px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: 'var(--white)',
      paddingTop: navOffset,
    }}>
      {isMobile ? (
        <>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              backgroundImage: `url(${heroBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'min(165vw, 960px) auto',
              backgroundPosition: '38% top',
              clipPath: 'inset(0 42% 0 0)',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              backgroundImage: `url(${heroBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'min(165vw, 960px) auto',
              backgroundPosition: '50% top',
              clipPath: 'inset(0 0 0 42%)',
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            backgroundImage: `url(${heroBackground})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <SiteNav accent={accent} dir={dir} isMobile={isMobile} layout="hero" />

      <div style={{
        position: 'relative', zIndex: 5, textAlign: 'center',
        maxWidth: 560, width: '100%',
        padding: isMobile ? '0 20px 48px' : '0 32px 64px',
        margin: '0 auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 12,
          animation: 'fadeIn 0.8s ease both'
        }}>
          <Image
            src="/images/logo-hero.png"
            alt="Amooora"
            width={260}
            height={260}
            priority
            style={{
              objectFit: 'contain',
              width: isMobile ? '200px' : '240px',
              height: isMobile ? '200px' : '240px',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24,
          animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ width: 32, height: 1, background: accent, opacity: 0.5 }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, opacity: 0.8 }}>
            {C.hero.eyebrow}
          </span>
          <div style={{ width: 32, height: 1, background: accent, opacity: 0.5 }} />
        </div>

        <h1 style={{
          fontFamily: "var(--serif)",
          fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em',
          color: 'var(--ink)', marginBottom: 12,
          animation: 'fadeUp 0.8s 0.1s ease both', fontSize: isMobile ? '44px' : "70px"
        }}>
          {isMobile ? (
            <>
              Um mundo<br />
              inteiro de<br />
              <em style={{ color: accent, fontStyle: 'italic' }}>acolhimento</em><br />
              e liberdade
            </>
          ) : (
            <>
              <span style={{ whiteSpace: 'nowrap' }}>{C.hero.titleLine1}</span><br />
              <em style={{ color: accent, fontStyle: 'italic' }}>{C.hero.titleHighlight}</em><br />
              {C.hero.titleLine3}
            </>
          )}
        </h1>

        <p style={{
          fontFamily: "var(--sans)", fontSize: 'clamp(14px,1.2vw,16px)',
          color: '#717182', fontWeight: 300, lineHeight: 1.7,
          maxWidth: 460, margin: '20px auto 0',
          animation: 'fadeUp 0.8s 0.25s ease both'
        }}>
          {C.hero.description}
        </p>

      </div>

    </section>);

}

/* ── HERO - Direction B: Immersive split ── */
function HeroB({ accent, particles }: HeroBProps) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section style={{
      position: 'relative', minHeight: '100vh', display: 'grid',
      gridTemplateColumns: '1fr 1fr', overflow: 'hidden'
    }}>
      {/* Left - purple block */}
      <div style={{
        background: `linear-gradient(160deg, ${accent} 0%, #3a184f 100%)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '120px 56px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        <ParticleCanvas color="#ffffff" active={particles} />
        <div style={{ position: 'absolute', top: '15%', right: '-20%', width: '80%', height: '80%',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none',
          transform: `translateY(${offset * 0.08}px)` }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
            Para sáficas, com amor
          </p>
          <h1 style={{
            fontFamily: "var(--serif)", fontSize: 'clamp(42px,4.5vw,76px)',
            fontWeight: 900, lineHeight: 1.05, color: 'white', marginBottom: 24
          }}>
            Um mundo<br /><em>inteiro</em><br />de liberdade
          </h1>
          <Link href="#aplicativo" style={{
            display: 'inline-block', fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600,
            background: 'white', color: accent, padding: '14px 32px', borderRadius: 100,
            textDecoration: 'none', marginTop: 8,
            transition: 'all 0.25s'
          }}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)';e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.boxShadow = '';}}>
            Baixar App
          </Link>
        </div>
      </div>

      {/* Right - white editorial */}
      <div style={{
        background: 'var(--white)', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '120px 56px 80px',
        transform: `translateY(${offset * 0.05}px)`
      }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 'clamp(100px,12vw,180px)',
          fontWeight: 900, lineHeight: 0.9, color: `${accent}0d`, letterSpacing: '-0.04em',
          position: 'absolute', top: '20%', right: '-5%', userSelect: 'none', pointerEvents: 'none' }}>
          ✦
        </div>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 12, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: accent, opacity: 0.7, marginBottom: 16 }}>
            Acolhimento
          </p>
          <p style={{ fontFamily: "var(--serif)", fontSize: 'clamp(20px,2vw,28px)',
            fontWeight: 400, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.5 }}>
            "Um espaço feito por sáficas,<br />para sáficas."
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {['Comunidade segura e ativa', 'Aplicativo gratuito', 'Conteúdo autêntico'].map((item, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%',
              background: `${accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
              </div>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: '#3a184f', fontWeight: 400 }}>
                {item}
              </span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${accent}22`,
          display: 'flex', gap: 40 }}>
          {[['10k+', 'usuárias'], ['98%', 'satisfação'], ['∞', 'histórias']].map(([num, label], i) =>
          <div key={i}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 700, color: accent }}>
                {num}
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: '#717182', marginTop: 2 }}>
                {label}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ── VIDEO PARALLAX SECTION ── */
const YT_VIDEO_ID = 'PHO5TkLfpKg';

function applyMobileVideoCover(container: HTMLElement | null) {
  if (!container) return;
  const iframe = container.querySelector('iframe');
  if (!iframe) return;

  Object.assign(iframe.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    transform: 'none',
    border: 'none',
    pointerEvents: 'none',
  });
}

function VideoSection({ isMobile }: MobileProps) {
  const [offset, setOffset] = useState(0);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Parallax
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      setOffset(-ref.current.getBoundingClientRect().top * 0.3);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  // Init YouTube IFrame API
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
              e.target.unloadModule?.('captions');
              e.target.setOption?.('captions', 'track', {});
            } catch {
              /* legendas indisponíveis neste player */
            }
            if (isMobile) {
              applyMobileVideoCover(divRef.current);
              window.setTimeout(() => applyMobileVideoCover(divRef.current), 100);
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
      if (!document.getElementById('yt-api')) {
        const s = document.createElement('script');
        s.id = 'yt-api';
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
      window.onYouTubeIframeAPIReady = init;
    }
    return () => { if (playerRef.current?.destroy) playerRef.current.destroy(); };
  }, [isMobile]);

  // Cover responsivo no mobile
  useEffect(() => {
    if (!isMobile || !divRef.current) return;
    const onResize = () => applyMobileVideoCover(divRef.current);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMobile, ready]);

  // Autoplay agressivo no mobile (iOS/Android bloqueiam com frequência)
  useEffect(() => {
    if (!ready) return;

    playVideo();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playVideo();
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);

    const onVisible = () => {
      if (document.visibilityState === 'visible') playVideo();
    };
    document.addEventListener('visibilitychange', onVisible);

    const resumeOnInteraction = () => playVideo();
    document.addEventListener('touchstart', resumeOnInteraction, { passive: true });
    window.addEventListener('scroll', resumeOnInteraction, { passive: true });

    const retryId = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.getPlayerState) return;
      const state = player.getPlayerState();
      if (state !== 1) {
        player.mute();
        player.playVideo();
      }
    }, isMobile ? 700 : 1500);

    const stopRetryId = window.setTimeout(() => window.clearInterval(retryId), isMobile ? 12000 : 8000);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
      document.removeEventListener('touchstart', resumeOnInteraction);
      window.removeEventListener('scroll', resumeOnInteraction);
      window.clearInterval(retryId);
      window.clearTimeout(stopRetryId);
    };
  }, [ready, isMobile]);

  // React to mute state
  useEffect(() => {
    if (!ready || !playerRef.current) return;
    if (muted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
      playerRef.current.setVolume(80);
    }
  }, [muted, ready]);

  const toggleMute = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  const togglePlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!ready || !playerRef.current) return;
    if (paused) {
      playerRef.current.playVideo();
      setPaused(false);
    } else {
      playerRef.current.pauseVideo();
      setPaused(true);
    }
  };

  return (
    <section ref={ref} style={{
      position: 'relative',
      height: isMobile ? '56.25vw' : '70vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    }}>
      {/* Video layer — pointer-events: none so clicks never reach iframe */}
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: `translateY(${isMobile ? 0 : offset}px)`,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        <div ref={divRef} style={{
          position: 'absolute',
          ...(isMobile ? {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          } : {
            top: '-20%',
            left: '-10%',
            width: '120%',
            height: '140%',
          }),
          border: 'none',
        }} />
      </div>

      {/* Video controls */}
      <div style={{
        position: 'absolute', bottom: 28, right: 28, zIndex: 10,
        display: 'flex', gap: 10, pointerEvents: 'auto'
      }}>
        <button onClick={togglePlay} style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.35)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s', color: 'white'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
        title={paused ? 'Reproduzir' : 'Pausar'}>
          {paused ?
          <span style={{
            width: 0, height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '12px solid white',
            marginLeft: 2
          }} /> :
          <span style={{ display: 'flex', gap: 4 }}>
              <span style={{ width: 3, height: 14, background: 'white', borderRadius: 2 }} />
              <span style={{ width: 3, height: 14, background: 'white', borderRadius: 2 }} />
            </span>
          }
        </button>

        <button onClick={toggleMute} style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.35)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s', color: 'white'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
        title={muted ? 'Ativar som' : 'Silenciar'}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 10H8L13 6V18L8 14H4V10Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
              {!muted && <path d="M16 9C17.2 10 17.2 14 16 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />}
              {!muted && <path d="M18.5 7.5C21 9.8 21 14.2 18.5 16.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />}
            </svg>
            {muted &&
            <span style={{
              position: 'absolute',
              width: 18,
              height: 2,
              background: 'white',
              transform: 'rotate(-45deg)'
            }} />}
          </span>
        </button>
      </div>
    </section>);

}


function Manifesto({ accent, dir, isMobile }: ManifestoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setVisible(true);}, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const paragraphs = C.manifesto.paragraphs;
  const leadingParagraphs = paragraphs.slice(0, -1);
  const closingParagraph = paragraphs[paragraphs.length - 1];

  const renderParagraph = (p: ManifestoParagraph, i: number, delayOffset = 0, isLast = false) =>
    <div key={i} style={{
      marginBottom: isLast ? 0 : (p.big ? 28 : 16),
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: `all 0.8s ${0.1 + delayOffset + i * 0.12}s ease`
    }}>
      {p.big ?
      <p style={{ fontFamily: "var(--serif)",
        fontSize: 'clamp(28px,4vw,54px)', fontWeight: 700,
        lineHeight: 1.15, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          <TextWithBreaks text={p.text} />
        </p> :
      <p style={{ fontFamily: "var(--sans)",
        fontSize: 'clamp(14px,1.2vw,16px)', fontWeight: 300,
        lineHeight: 1.8, color: '#717182' }}>
          <TextWithBreaks text={p.text} />
        </p>
      }
    </div>;

  const labelBlock =
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32,
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
      transition: 'all 0.7s ease' }}>
      <div style={{ width: 48, height: 1.5, background: accent }} />
      <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
        letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>
        {C.manifesto.label}
      </span>
    </div>;

  const imageBlock =
    <div style={{
      display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', alignItems: 'flex-start',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateX(24px)',
      transition: 'all 0.9s 0.2s ease',
      marginBottom: isMobile ? 32 : 0
    }}>
      <Image
        src={C.manifesto.image}
        alt="Manifesto Amooora"
        width={440}
        height={440}
        style={{
          width: '100%',
          maxWidth: isMobile ? 320 : 440,
          height: 'auto',
          objectFit: 'contain',
          borderRadius: 4
        }}
      />
    </div>;


  return (
    <section id="manifesto" ref={sectionRef} style={{
      padding: isMobile ? '80px 0' : '120px 0', background: dir === 'B' ? '#faf7fb' : 'var(--white)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px', position: 'relative', zIndex: 2 }}>
        {isMobile ?
        <>
          {imageBlock}
          {labelBlock}
          {paragraphs.map((p, i) => renderParagraph(p, i, 0, i === paragraphs.length - 1))}
        </> :
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 56,
          alignItems: 'start'
        }}>
          <div>
            {labelBlock}
            {leadingParagraphs.map((p, i) => renderParagraph(p, i))}
            <div style={{
              width: 'calc(100% + 56px + (100% * 0.95 / 1.05))'
            }}>
              {renderParagraph(closingParagraph, paragraphs.length - 1, 0, true)}
            </div>
          </div>
          {imageBlock}
        </div>
        }
      </div>
    </section>);

}

/* ── APP ACCORDION ── */
type AppAccordionProps = {
  accent: string;
  items: typeof C.app.items;
  open: number | null;
  setOpen: (index: number | null) => void;
  variant: 'desktop' | 'mobile';
};

function AppAccordion({ accent, items, open, setOpen, variant }: AppAccordionProps) {
  const isMobileCard = variant === 'mobile';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: isMobileCard ? 12 : 0
    }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={isMobileCard ? {
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(96,16,59,0.06)',
            overflow: 'hidden'
          } : {
            borderTop: `1px solid ${accent}20`,
            borderBottom: i === items.length - 1 ? `1px solid ${accent}20` : 'none'
          }}>
            <button onClick={() => setOpen(isOpen ? null : i)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: isMobileCard ? '18px 20px' : '18px 0',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12
            }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 'clamp(14px,1.2vw,16px)', fontWeight: 600,
                color: isOpen ? accent : '#717182', transition: 'color 0.2s' }}>
                {item.label}
              </span>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: isOpen ? accent : `${accent}14`,
                color: isOpen ? 'white' : accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 300,
                transition: 'all 0.22s',
                transform: isOpen ? 'rotate(45deg)' : 'none'
              }}>+</span>
            </button>

            {isOpen &&
            <div style={{
              padding: isMobileCard ? '0 20px 20px' : '0 0 20px',
              animation: 'fadeUp 0.3s ease both'
            }}>
                {item.blocks.map((b, bi) =>
              <div key={bi} style={{
                padding: '14px 0 14px 16px',
                borderLeft: `2px solid ${accent}`,
                marginBottom: bi < item.blocks.length - 1 ? 12 : 0
              }}>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600,
                  color: 'var(--ink)', marginBottom: 6 }}>{b.q}</p>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: '#717182',
                  lineHeight: 1.7, fontWeight: 300 }}>{b.a}</p>
                  </div>
              )}
              </div>
            }
          </div>);

      })}
    </div>
  );
}

/* ── APP SECTION ── */
function AppSection({ accent, cta, isMobile }: SectionProps & CtaProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setVisible(true);}, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = C.app.items;
  const introFull = C.app.intro.slice(0, 2);
  const introSplit = C.app.intro.slice(2);
  const introParagraphStyle = (marginBottom: number, centered = false): CSSProperties => ({
    fontFamily: "var(--sans)",
    fontSize: 'clamp(14px,1.2vw,16px)', fontWeight: 300,
    lineHeight: 1.8, color: '#717182', marginBottom,
    ...(centered ? { textAlign: 'center' as const } : {})
  });

  const mockupImage = (
    <Image
      src="/images/app-mockup.png"
      alt="Amooora App"
      width={520}
      height={1040}
      style={{
        width: '100%',
        maxWidth: isMobile ? 320 : 520,
        height: 'auto',
        objectFit: 'contain',
        filter: isMobile ? 'none' : 'drop-shadow(0 32px 64px rgba(147,45,111,0.25))',
        animation: isMobile ? 'none' : 'floatY 5s ease-in-out infinite'
      }}
    />
  );

  if (isMobile) {
    const { mobile } = C.app;
    return (
      <section id="aplicativo" ref={ref} style={{
        padding: '80px 0', background: '#faf7fb',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingInline: 20 }}>
          <div style={{
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'all 0.7s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 36, height: 1.5, background: accent }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>{C.app.label}</span>
            </div>
            <h2 style={{ fontFamily: "var(--serif)",
              fontSize: 'clamp(28px,3.5vw,50px)', fontWeight: 900, color: 'var(--ink)',
              lineHeight: 1.1, marginBottom: 24 }}>
              {C.app.title}
            </h2>
            <p style={introParagraphStyle(40, true)}>
              {mobile.intro}
            </p>

            <div style={{
              display: 'flex', justifyContent: 'center', marginBottom: 40
            }}>
              {mockupImage}
            </div>

            <span style={{
              display: 'inline-block',
              fontFamily: "var(--sans)",
              fontSize: 14,
              fontWeight: 600,
              color: accent,
              background: `${accent}14`,
              padding: '10px 22px',
              borderRadius: 100,
              marginBottom: 16
            }}>
              {mobile.comingSoonTitle}
            </span>
            <p style={introParagraphStyle(40, true)}>
              {mobile.comingSoonSubtitle}
            </p>
          </div>

          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              fontFamily: "var(--sans)",
              fontSize: 'clamp(20px,4.5vw,24px)',
              fontWeight: 800,
              color: 'var(--ink)',
              lineHeight: 1.2,
              marginBottom: 20
            }}>
              {mobile.offersTitle}
            </h3>

            <AppAccordion
              accent={accent}
              items={items}
              open={open}
              setOpen={setOpen}
              variant="mobile"
            />

            <PilotSignup accent={accent} cta={cta} isMobile={isMobile} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="aplicativo" ref={ref} style={{
      padding: '120px 0', background: '#faf7fb',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingInline: 48 }}>

        {/* Cabeçalho + 2 primeiros parágrafos em largura total */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1.5, background: accent }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>{C.app.label}</span>
          </div>
          <h2 style={{ fontFamily: "var(--serif)",
            fontSize: 'clamp(28px,3.5vw,50px)', fontWeight: 900, color: 'var(--ink)',
            lineHeight: 1.1, marginBottom: 12 }}>
            {C.app.title}
          </h2>
          {introFull.map((paragraph, i) =>
          <p key={i} style={introParagraphStyle(i === introFull.length - 1 ? 20 : 20)}>
              <TextWithBreaks text={paragraph} />
            </p>
          )}
        </div>

        {/* A partir do 3º parágrafo: texto + mockup lado a lado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start'
        }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>

          {introSplit.map((paragraph, i) =>
          <p key={i} style={introParagraphStyle(i === introSplit.length - 1 ? 40 : 20)}>
              <TextWithBreaks text={paragraph} />
            </p>
          )}

          <AppAccordion
            accent={accent}
            items={items}
            open={open}
            setOpen={setOpen}
            variant="desktop"
          />

          <PilotSignup accent={accent} cta={cta} isMobile={isMobile} />
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(40px)',
          transition: 'all 1s 0.2s ease'
        }}>
          {mockupImage}
        </div>
        </div>
      </div>
    </section>);

}

/* ── VALUES ── */
function Values({ accent, isMobile }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setVisible(true);}, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const vals = C.values.items;


  return (
    <section id="valores" ref={ref} style={{ padding: isMobile ? '80px 0' : '120px 0', background: 'var(--white)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>

        {isMobile && C.values.image &&
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: isMobile ? 40 : 56,
          opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
          transition: 'all 0.8s ease'
        }}>
          <Image
            src={C.values.image}
            alt="Nossos Valores Amooora"
            width={360}
            height={360}
            style={{
              width: '100%',
              maxWidth: isMobile ? 280 : 360,
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
        }

        {/* Header row */}
        <div style={{ marginBottom: 72, opacity: visible ? 1 : 0, transition: 'all 0.7s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 1.5, background: accent }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>{C.values.label}</span>
          </div>
          <h2 style={{ fontFamily: "var(--serif)",
            fontSize: 'clamp(32px,4vw,56px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.1 }}>
            {C.values.titleLine1}
          </h2>
        </div>

        {/* Values grid — 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
          {vals.map((v, i) => {
            const isHov = hovered === i;
            return (
              <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'grid', gridTemplateColumns: '72px 1fr',
                gap: 0,
                padding: '32px 40px 32px 0',
                borderTop: `1px solid ${accent}18`,
                borderRight: !isMobile && i % 2 === 0 ? `1px solid ${accent}18` : 'none',
                paddingRight: !isMobile && i % 2 === 0 ? 40 : 0,
                paddingLeft: !isMobile && i % 2 === 1 ? 40 : 0,
                background: isHov ? `${accent}06` : 'transparent',
                transition: 'background 0.25s',
                cursor: 'default',
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(20px)',
                transitionDelay: `${0.05 * i}s`,
                transitionProperty: 'opacity, transform, background',
                transitionDuration: '0.6s, 0.6s, 0.25s'
              }}>
                {/* Number */}
                <div style={{
                  fontFamily: "var(--serif)",
                  fontSize: 48, fontWeight: 900, lineHeight: 1,
                  color: isHov ? accent : `${accent}22`,
                  transition: 'color 0.25s',
                  paddingTop: 4, userSelect: 'none',
                  letterSpacing: '-0.04em'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                {/* Content */}
                <div>
                  <h3 style={{ fontFamily: "var(--sans)", fontSize: 'clamp(14px,1.2vw,16px)', fontWeight: 600,
                    color: '#717182', marginBottom: 10, lineHeight: 1.8,
                    transition: 'color 0.25s', ...(isHov ? { color: accent } : {}) }}>
                    {v.title}
                  </h3>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: '#717182',
                    lineHeight: 1.75, fontWeight: 300 }}>{v.desc}</p>
                </div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

/* ── FAQ ── */
function FAQ({ accent, isMobile }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setVisible(true);}, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = C.faq.items;


  return (
    <section id="faq" ref={ref} style={{ padding: isMobile ? '80px 0 24px' : '120px 0 32px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
          opacity: visible ? 1 : 0, transition: 'all 0.7s ease' }}>
          <div style={{ width: 36, height: 1.5, background: accent }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>{C.faq.label}</span>
        </div>
        <h2 style={{ fontFamily: "var(--serif)",
          fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 900, color: 'var(--ink)',
          marginBottom: 56, opacity: visible ? 1 : 0, transition: 'all 0.7s 0.1s ease' }}>
          {C.faq.title}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{
                borderTop: `1px solid ${accent}22`,
                borderBottom: i === items.length - 1 ? `1px solid ${accent}22` : 'none',
                opacity: visible ? 1 : 0, transition: `all 0.6s ${0.05 * i}s ease`
              }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', gap: 16
                }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 'clamp(14px,1.2vw,16px)', fontWeight: 600,
                    color: isOpen ? accent : '#717182', transition: 'color 0.2s' }}>
                    {item.q}
                  </span>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? accent : `${accent}14`,
                    color: isOpen ? 'white' : accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 300, transition: 'all 0.25s',
                    transform: isOpen ? 'rotate(45deg)' : 'none'
                  }}>+</span>
                </button>
                {isOpen &&
                <div style={{
                  fontFamily: "var(--sans)", fontSize: 15, color: '#717182',
                  lineHeight: 1.8, paddingBottom: 24, fontWeight: 300,
                  animation: 'fadeUp 0.3s ease both'
                }}>
                    {item.a}
                  </div>
                }
              </div>);

          })}
        </div>
      </div>
    </section>);

}

/* ── LOJA (ex-Galeria) ── */
function Gallery({ accent, cta, isMobile }: SectionProps & CtaProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setVisible(true);}, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const photos = C.gallery.photos;

  return (
    <section id="loja" ref={ref} style={{ padding: isMobile ? '80px 0' : '120px 0', background: '#faf7fb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ marginBottom: 48, opacity: visible ? 1 : 0, transition: 'all 0.7s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1.5, background: accent }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>
              {C.gallery.label}
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--serif)",
            fontSize: 'clamp(28px,3.5vw,50px)', fontWeight: 900, color: 'var(--ink)',
            lineHeight: 1.1, marginBottom: 12 }}>
            {C.gallery.title}
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gridTemplateRows: isMobile ? 'repeat(2, 200px)' : '280px',
          gap: 12
        }}>
          {photos.map((src, i) =>
          <div key={i} style={{
            borderRadius: 16, overflow: 'hidden', position: 'relative',
            background: '#F5EBFF',
            opacity: visible ? 1 : 0, transform: visible ? 'none' : 'scale(0.96)',
            transition: `all 0.7s ${0.05 * i}s ease`
          }}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'scale(1.02)';e.currentTarget.style.zIndex = '2';e.currentTarget.style.boxShadow = `0 20px 60px ${accent}33`;}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.zIndex = '';e.currentTarget.style.boxShadow = '';}}>
              <div style={{
                width: '100%', height: '100%',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover', backgroundPosition: 'center'
              }} />
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48,
          opacity: visible ? 1 : 0, transition: 'all 0.7s 0.5s ease' }}>
          <Link href={C.gallery.ctaUrl} style={{
            display: 'inline-block',
            fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600,
            background: cta, color: 'white', padding: '14px 32px', borderRadius: 100,
            textDecoration: 'none', boxShadow: `0 8px 32px ${cta}44`,
            transition: 'all 0.25s'
          }}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)';e.currentTarget.style.boxShadow = `0 12px 40px ${cta}55`;}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.boxShadow = `0 8px 32px ${cta}44`;}}>
            {C.gallery.cta}
          </Link>
        </div>
      </div>
    </section>);

}

/* ── FOOTER ── */
function Newsletter({ cta, isMobile }: CtaProps & MobileProps) {
  return (
    <section style={{ background: 'var(--white)', padding: isMobile ? '24px 20px 36px' : '24px 0 36px' }}>
      <div style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: isMobile ? 0 : '0 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMobile ? 'flex-start' : 'center',
        textAlign: isMobile ? 'left' : 'center',
      }}>
        <p style={{
          fontFamily: "var(--sans)",
          fontSize: 'clamp(15px,1.4vw,17px)',
          fontWeight: 400,
          lineHeight: 1.7,
          color: '#717182',
          maxWidth: isMobile ? 480 : 'none',
          marginBottom: 20,
          whiteSpace: isMobile ? 'normal' : 'nowrap',
        }}>
          {C.newsletter.title}
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            gap: 10,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: isMobile ? 'flex-start' : 'center',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? 480 : 520,
          }}
        >
          <input
            type="email"
            placeholder={C.newsletter.placeholder}
            aria-label={C.newsletter.placeholder}
            style={{
              flex: isMobile ? undefined : 1,
              minHeight: 48,
              borderRadius: 8,
              border: '1px solid #e8eaf2',
              padding: '0 16px',
              fontFamily: "var(--sans)",
              fontSize: 16,
              color: '#0f1b3d',
              outline: 'none',
              width: isMobile ? '100%' : 'auto',
              minWidth: 0,
              background: 'white',
            }}
          />
          <button
            type="submit"
            style={{
              alignSelf: isMobile ? 'flex-start' : 'auto',
              flexShrink: 0,
              minHeight: 48,
              padding: '0 24px',
              borderRadius: 100,
              border: 'none',
              background: cta,
              color: 'white',
              fontFamily: "var(--sans)",
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 8px 32px ${cta}44`,
              transition: 'all 0.25s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${cta}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = `0 8px 32px ${cta}44`;
            }}
          >
            {C.newsletter.button}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ── MAIN APP ── */
export default function HomePage() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [isMobile, setIsMobile] = useState(false);
  const [accent, setAccent] = useState('#932D6F');
  const [cta, setCta] = useState('#932D6F');
  const dir = t.direction;
  const particles = t.showParticles;

  useEffect(() => {
    document.title = C.site.title;
    const sync = () => {
      setIsMobile(window.innerWidth <= 900);
      const root = getComputedStyle(document.documentElement);
      setAccent(root.getPropertyValue('--primary').trim() || '#932D6F');
      setCta(root.getPropertyValue('--primary').trim() || '#932D6F');
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  return (
    <div>
      {dir === 'A' ?
      <HeroA accent={accent} particles={particles} isMobile={isMobile} dir={dir} /> :
      <>
        <SiteNav accent={accent} dir={dir} isMobile={isMobile} />
        <HeroB accent={accent} particles={particles} />
      </>
      }

      <VideoSection isMobile={isMobile} />
      <Manifesto accent={accent} dir={dir} isMobile={isMobile} />
      <AppSection accent={accent} cta={cta} isMobile={isMobile} />
      <Values accent={accent} isMobile={isMobile} />
      <Gallery accent={accent} cta={cta} isMobile={isMobile} />
      <FAQ accent={accent} isMobile={isMobile} />
      <Newsletter cta={cta} isMobile={isMobile} />
      <SiteFooter accent={accent} isMobile={isMobile} />

      <TweaksPanel>
        <TweakSection label="Direção de Design" />
        <TweakRadio label="Estilo"
        value={t.direction}
        options={[
        { value: 'A', label: 'A — Editorial Clean' },
        { value: 'B', label: 'B — Split Imersivo' }]
        }
        onChange={(v) => setTweak('direction', v as 'A' | 'B')} />
        <TweakSection label="Visual" />
        <TweakToggle label="Partículas no hero" value={t.showParticles} onChange={(v) => setTweak('showParticles', v)} />
      </TweaksPanel>
    </div>);

}
