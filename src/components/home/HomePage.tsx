'use client';

import { useEffect } from 'react';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { HeroA } from '@/components/home/HeroA';
import { VideoSection } from '@/components/home/VideoSection';
import { Manifesto } from '@/components/home/Manifesto';
import { AppSection } from '@/components/home/AppSection';
import { Values } from '@/components/home/Values';
import { Gallery } from '@/components/home/Gallery';
import { FAQ } from '@/components/home/FAQ';
import { Newsletter } from '@/components/home/Newsletter';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function HomePage() {
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = C.site.title;
  }, []);

  return (
    <div>
      <HeroA isMobile={isMobile} />
      <VideoSection isMobile={isMobile} />
      <Manifesto isMobile={isMobile} />
      <AppSection isMobile={isMobile} />
      <Values isMobile={isMobile} />
      <Gallery isMobile={isMobile} />
      <FAQ isMobile={isMobile} />
      <Newsletter isMobile={isMobile} />
      <SiteFooter isMobile={isMobile} />
    </div>
  );
}
