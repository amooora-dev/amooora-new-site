'use client';

import Link from 'next/link';
import { CONTEUDO_LOJA } from '@/lib/loja-data';
import { trackLinkClick } from '@/lib/analytics';

const { hero } = CONTEUDO_LOJA;

type HeroCTAsProps = {
  variant: 'dark' | 'light';
};

export function LojaHeroCTAs({ variant }: HeroCTAsProps) {
  const primaryClass =
    'rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:brightness-95';
  const secondaryClass =
    variant === 'dark'
      ? 'rounded-full border border-white/70 px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-white/10'
      : 'rounded-full border border-primary bg-white px-6 py-3 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5';

  return (
    <div className="flex flex-wrap gap-4">
      <a
        href="#produtos"
        className={primaryClass}
        onClick={() => trackLinkClick({
          linkText: hero.ctaPrimario,
          linkUrl: '#produtos',
          linkType: 'nav_anchor',
          location: 'store_hero',
          sectionId: 'produtos',
        })}
      >
        {hero.ctaPrimario}
      </a>
      <Link
        href="/#manifesto"
        className={secondaryClass}
        onClick={() => trackLinkClick({
          linkText: hero.ctaSecundario,
          linkUrl: '/#manifesto',
          linkType: 'nav_anchor',
          location: 'store_hero',
          sectionId: 'manifesto',
        })}
      >
        {hero.ctaSecundario}
      </Link>
    </div>
  );
}
