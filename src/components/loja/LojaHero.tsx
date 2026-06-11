import Image from 'next/image';
import Link from 'next/link';
import { CONTEUDO_LOJA, type LojaHeroModelo } from '@/lib/loja-data';

const { hero } = CONTEUDO_LOJA;

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`mb-6 flex items-center gap-4 ${light ? 'text-white/60' : 'text-primary'}`}>
      <div className={`h-0.5 w-12 ${light ? 'bg-white/60' : 'bg-primary'}`} />
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
}

function HeroCTAs({ variant }: { variant: 'dark' | 'light' }) {
  const primaryClass =
    'rounded-full bg-accent px-6 py-3 font-sans text-sm font-semibold text-white transition hover:brightness-95';
  const secondaryClass =
    variant === 'dark'
      ? 'rounded-full border border-white/70 px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-white/10'
      : 'rounded-full border border-primary bg-white px-6 py-3 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5';

  return (
    <div className="flex flex-wrap gap-4">
      <a href="#produtos" className={primaryClass}>
        {hero.ctaPrimario}
      </a>
      <Link href="/#manifesto" className={secondaryClass}>
        {hero.ctaSecundario}
      </Link>
    </div>
  );
}

function HeroModelo1({ navOffset }: { navOffset: number }) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: `min(62vh, ${hero.alturaMaxPx}px)` }}
    >
      <Image
        src={hero.imagemModelo1}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/85 via-[#3a184f]/70 to-[#3a184f]/40"
        aria-hidden="true"
      />

      <div
        className="relative z-10 mx-auto flex max-w-[1200px] flex-col justify-center px-6 pb-10 md:px-12 lg:px-20"
        style={{ minHeight: `min(62vh, ${hero.alturaMaxPx}px)`, paddingTop: navOffset }}
      >
        <SectionLabel light>{hero.label}</SectionLabel>
        <h1 className="mb-4 max-w-3xl font-serif text-4xl font-bold leading-[1.05] text-white md:text-5xl lg:text-[64px]">
          {hero.titulo}
        </h1>
        <p className="mb-6 font-serif text-xl italic text-white md:text-2xl">{hero.subtitulo}</p>
        <p className="mb-8 max-w-xl font-sans text-lg leading-relaxed text-white">{hero.descricao}</p>
        <HeroCTAs variant="dark" />
      </div>
    </section>
  );
}

function HeroModelo2Visual({ isMobile }: { isMobile: boolean }) {
  if (hero.imagemVisual) {
    return (
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] lg:max-w-none lg:aspect-auto lg:min-h-[420px]">
        <Image
          src={hero.imagemVisual}
          alt="Coleção Amooora"
          fill
          priority
          className="object-contain object-center"
          sizes="(max-width: 1024px) 90vw, 50vw"
        />
      </div>
    );
  }

  const [topLeft, topRight, bottomLeft, bottomRight] = hero.produtosDestaque;

  return (
    <div
      className="relative mx-auto w-full max-w-[520px]"
      style={{ height: isMobile ? 320 : 420 }}
    >
      <div className="absolute left-[2%] top-[4%] z-10 w-[44%] rotate-[-4deg] drop-shadow-lg">
        <Image
          src={topLeft}
          alt=""
          width={400}
          height={500}
          priority
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="absolute right-0 top-0 z-20 w-[46%] rotate-[3deg] drop-shadow-lg">
        <Image
          src={topRight}
          alt=""
          width={400}
          height={500}
          priority
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="absolute bottom-[2%] left-[8%] z-30 w-[42%] rotate-[2deg] drop-shadow-lg">
        <Image
          src={bottomLeft}
          alt=""
          width={400}
          height={500}
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="absolute bottom-0 right-[4%] z-40 w-[44%] rotate-[-2deg] drop-shadow-lg">
        <Image
          src={bottomRight}
          alt=""
          width={400}
          height={500}
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}

function HeroModelo2({ navOffset, isMobile }: { navOffset: number; isMobile: boolean }) {
  return (
    <section
      className="w-full bg-white"
      style={{ minHeight: isMobile ? 'auto' : `min(62vh, ${hero.alturaMaxPx}px)` }}
    >
      <div
        className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 pb-12 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-20 lg:pb-16"
        style={{ paddingTop: navOffset + (isMobile ? 16 : 32) }}
      >
        <HeroModelo2Visual isMobile={isMobile} />

        <div className="flex flex-col justify-center text-center lg:text-left">
          <SectionLabel>{hero.label}</SectionLabel>
          <h1 className="mb-4 font-serif text-4xl font-bold leading-[1.05] text-[#3a184f] md:text-5xl lg:text-[56px]">
            {hero.titulo}
          </h1>
          <p className="mb-6 font-serif text-xl italic text-primary md:text-2xl">{hero.subtitulo}</p>
          <p className="mb-8 font-sans text-base leading-relaxed text-muted-fg md:text-lg">
            {hero.descricao}
          </p>
          <div className="flex justify-center lg:justify-start">
            <HeroCTAs variant="light" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LojaHero({
  modelo,
  navOffset,
  isMobile,
}: {
  modelo: LojaHeroModelo;
  navOffset: number;
  isMobile: boolean;
}) {
  if (modelo === 1) return <HeroModelo1 navOffset={navOffset} />;
  return <HeroModelo2 navOffset={navOffset} isMobile={isMobile} />;
}

export function lojaNavOverDark(modelo: LojaHeroModelo) {
  return modelo === 1;
}
