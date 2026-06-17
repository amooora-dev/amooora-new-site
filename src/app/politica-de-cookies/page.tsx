import type { Metadata } from 'next';
import Link from 'next/link';
import { POLITICA_DE_COOKIES } from '@/lib/politica-de-cookies';

export const metadata: Metadata = {
  title: 'Política de Cookies e Privacidade — Amooora',
  description:
    'Leia a política de cookies e privacidade da Amooora e entenda como tratamos informações de contato e dados de navegação.',
};

export default function PoliticaDeCookiesPage() {
  return (
    <main className="min-h-screen bg-off-white px-5 py-12 font-sans text-ink md:px-8 md:py-16">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white px-6 py-8 shadow-sm md:px-12 md:py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
        >
          Voltar para o site
        </Link>

        <header className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Política de cookies
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
            {POLITICA_DE_COOKIES.title}
          </h1>
          <p className="mt-4 text-sm font-medium text-ink-soft">
            Data de Vigência: {POLITICA_DE_COOKIES.effectiveDate}
          </p>
          <p className="mt-6 text-base leading-8 text-ink-mid">{POLITICA_DE_COOKIES.intro}</p>
        </header>

        <div className="space-y-8">
          {POLITICA_DE_COOKIES.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl font-bold text-secondary">{section.title}</h2>

              {'paragraphs' in section &&
                section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-base leading-8 text-ink-mid">
                    {paragraph}
                  </p>
                ))}

              {'bullets' in section && (
                <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-8 text-ink-mid">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}

              {'subsections' in section && (
                <div className="mt-5 space-y-5">
                  {section.subsections.map((subsection) => (
                    <section key={subsection.title}>
                      <h3 className="font-sans text-lg font-semibold text-ink">{subsection.title}</h3>
                      {subsection.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="mt-2 text-base leading-8 text-ink-mid">
                          {paragraph}
                        </p>
                      ))}
                    </section>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
