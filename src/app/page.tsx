import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganizationJsonLd, buildWebSiteJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Amooora — Um mundo inteiro de acolhimento e liberdade',
  description:
    'Somos a plataforma referência para a comunidade sáfica. Chegamos para somar, criar e espalhar conteúdo, informação e serviços com a nossa cara.',
  path: '/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
      <HomePage />
    </>
  );
}
