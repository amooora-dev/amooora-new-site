"use client";

import { SiteNav } from "@/components/layout/SiteNav/SiteNav";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import Image from "next/image";

export function HeroA() {
  const isMobile = useIsMobile();
  const heroBackground = C.hero.background;

  return (
    <section className='min-h-[min(88svh,780px)] pt-[72px] md:min-h-[min(100vh,920px)] md:pt-[84px] relative flex flex-col items-center overflow-hidden bg-white'>
      {isMobile ? (
        <>
          <div
            aria-hidden
            className='hero-bg-mobile-split hero-bg-mobile-left'
            style={{ backgroundImage: `url(${heroBackground})` }}
          />
          <div
            aria-hidden
            className='hero-bg-mobile-split hero-bg-mobile-right'
            style={{ backgroundImage: `url(${heroBackground})` }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className='hero-bg-desktop'
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
      )}

      <SiteNav layout='hero' />

      <div className='px-5 pb-12 md:px-8 md:pb-16 relative z-[5] mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-start text-center'>
        <div className='mb-3 flex justify-center animate-fadeIn'>
          <Image
            src='/images/logo-hero.png'
            alt='Amooora'
            width={240}
            height={240}
            priority
            className='object-contain h-[200px] w-[200px] md:h-[240px] md:w-[240px]'
          />
        </div>

        <div className='mb-6 flex items-center justify-center gap-3 animate-fadeUp'>
          <SectionLabel label={C.hero.eyebrow} centered />
        </div>

        <h1 className='text-[44px] md:text-[70px] mb-3 font-serif font-black leading-[1.0] tracking-[-0.03em] text-ink animate-fadeUp [animation-delay:0.1s] whitespace-nowrap'>
          Um mundo <br className='md:hidden block' />
          inteiro de
          <br />
          <em className='italic text-primary'>acolhimento</em>
          <br />e liberdade
        </h1>

        <p className='mx-auto mt-5 max-w-[460px] font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.7] text-muted-fg animate-fadeUp [animation-delay:0.25s]'>
          {C.hero.description}
        </p>
      </div>
    </section>
  );
}
