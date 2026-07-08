import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  createPageMetadata,
} from '@/lib/seo';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';

export const metadata: Metadata = createPageMetadata({
  title: 'Amooora — Um mundo inteiro de acolhimento e liberdade',
  description:
    'Somos a plataforma referência para a comunidade sáfica. Chegamos para somar, criar e espalhar conteúdo, informação e serviços com a nossa cara.',
  path: '/',
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd(),
          buildWebSiteJsonLd(),
          buildFaqPageJsonLd(C.faq.items),
        ]}
      />
      <HomePage />
    </>
  );
}
