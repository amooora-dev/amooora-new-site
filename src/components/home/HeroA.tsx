"use client";

import { SiteNav } from "@/components/layout/SiteNav";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import Image from "next/image";

export function HeroA() {
  const isMobile = useIsMobile();
  const heroBackground = C.hero.background;

  return (
    <section
      className='relative flex flex-col items-center overflow-hidden bg-white'
      style={{
        minHeight: isMobile ? "min(88svh, 780px)" : "min(100vh, 920px)",
        paddingTop: isMobile ? 72 : 84,
      }}
    >
      {isMobile ? (
        <>
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 z-0'
            style={{
              backgroundImage: `url(${heroBackground})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "min(165vw, 960px) auto",
              backgroundPosition: "38% top",
              clipPath: "inset(0 42% 0 0)",
            }}
          />
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 z-0'
            style={{
              backgroundImage: `url(${heroBackground})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "min(165vw, 960px) auto",
              backgroundPosition: "50% top",
              clipPath: "inset(0 0 0 42%)",
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 z-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
      )}

      <SiteNav layout='hero' />

      <div
        className='relative z-[5] mx-auto flex w-full flex-1 flex-col items-center justify-start text-center'
        style={{
          maxWidth: 560,
          padding: isMobile ? "0 20px 48px" : "0 32px 64px",
        }}
      >
        <div className='mb-3 flex justify-center animate-fadeIn'>
          <Image
            src='/images/logo-hero.png'
            alt='Amooora'
            width={260}
            height={260}
            priority
            style={{
              objectFit: "contain",
              width: isMobile ? 200 : 240,
              height: isMobile ? 200 : 240,
            }}
          />
        </div>

        <div className='mb-6 flex items-center justify-center gap-3 animate-fadeUp'>
          <SectionLabel label={C.hero.eyebrow} centered />
        </div>

        <h1
          className='font-serif font-black leading-[1.0] tracking-[-0.03em] text-ink animate-fadeUp'
          style={{
            fontSize: isMobile ? 44 : 70,
            marginBottom: 12,
            animationDelay: "0.1s",
          }}
        >
          {isMobile ? (
            <>
              Um mundo
              <br />
              inteiro de
              <br />
              <em className='italic text-primary'>acolhimento</em>
              <br />e liberdade
            </>
          ) : (
            <>
              <span className='whitespace-nowrap'>{C.hero.titleLine1}</span>
              <br />
              <em className='italic text-primary'>{C.hero.titleHighlight}</em>
              <br />
              {C.hero.titleLine3}
            </>
          )}
        </h1>

        <p
          className='mx-auto mt-5 max-w-[460px] font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.7] text-muted-fg animate-fadeUp'
          style={{ animationDelay: "0.25s" }}
        >
          {C.hero.description}
        </p>
      </div>
    </section>
  );
}
