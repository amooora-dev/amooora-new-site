"use client";

import { PrivacyModal } from "@/components/layout/PrivacyModal";
import { trackLinkClick } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type SiteFooterProps = {
  page?: "home" | "loja";
};

function footerHref(id: string, page: "home" | "loja") {
  if (!id) return "#";
  if (id === "loja") return "/loja";
  return page === "home" ? `#${id}` : `/#${id}`;
}

function FooterNavLink({
  label,
  id,
  page,
}: {
  label: string;
  id: string;
  page: "home" | "loja";
}) {
  if (id) {
    const href = footerHref(id, page);
    return (
      <Link
        href={href}
        className='mb-2 block font-sans text-sm text-white/60 no-underline transition-colors duration-200 hover:text-white'
        onClick={() =>
          trackLinkClick({
            linkText: label,
            linkUrl: href,
            linkType:
              id === "loja" || !href.includes("#") ? "nav_route" : "nav_anchor",
            location: "footer",
            sectionId: id !== "loja" ? id : undefined,
          })
        }
      >
        {label}
      </Link>
    );
  }
  return (
    <a
      href='#'
      className='mb-2 block font-sans text-sm text-white/60 no-underline transition-colors duration-200 hover:text-white'
    >
      {label}
    </a>
  );
}

export function SiteFooter({ page = "home" }: SiteFooterProps) {
  const isMobile = useIsMobile();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const navLinks = C.footer.navLinks;
  const navCol1 = navLinks.slice(0, 4);
  const navCol2 = navLinks.slice(4);

  return (
    <>
      <footer className='bg-primary px-5 pb-5 pt-10 text-white md:px-12 md:pb-6 md:pt-12'>
        <div className='mx-auto max-w-[1200px]'>
          <div className='mb-5 grid grid-cols-1 gap-7 md:mb-7 md:grid-cols-[2fr_1fr] md:gap-10'>
            <div>
              <Image
                src='/images/logo.png'
                alt='Amooora'
                width={1984}
                height={1467}
                className='mb-3 h-[52px] w-auto object-contain brightness-0 invert'
              />
              <p className='max-w-[320px] font-sans text-sm font-light leading-[1.8] text-white/50'>
                {C.footer.description}
              </p>

              <div className='mt-6 flex flex-row flex-wrap items-center gap-4 md:mt-4'>
                <a
                  href={C.footer.instagramUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 font-sans text-[12px] text-white/80 no-underline transition-opacity hover:opacity-100'
                  onClick={() =>
                    trackLinkClick({
                      linkText: C.footer.instagram,
                      linkUrl: C.footer.instagramUrl,
                      linkType: "external",
                      location: "footer_social",
                    })
                  }
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='shrink-0'
                  >
                    <rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
                    <circle cx='12' cy='12' r='4' />
                    <circle
                      cx='17.5'
                      cy='6.5'
                      r='1'
                      fill='currentColor'
                      stroke='none'
                    />
                  </svg>
                  {C.footer.instagram}
                </a>

                <a
                  href={`mailto:${C.footer.email}`}
                  className='flex items-center gap-2 font-sans text-[12px] text-white/60 no-underline transition-colors hover:text-white'
                  onClick={() =>
                    trackLinkClick({
                      linkText: C.footer.email,
                      linkUrl: `mailto:${C.footer.email}`,
                      linkType: "external",
                      location: "footer_social",
                    })
                  }
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='shrink-0'
                  >
                    <rect x='2' y='4' width='20' height='16' rx='2' />
                    <polyline points='2,4 12,13 22,4' />
                  </svg>
                  {C.footer.email}
                </a>
              </div>
            </div>

            <div>
              <div className='mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30'>
                {C.footer.navLabel}
              </div>
              <div className='grid grid-cols-2 gap-x-6'>
                <div>
                  {navCol1.map((link) => (
                    <FooterNavLink
                      key={link.label}
                      label={link.label}
                      id={link.id}
                      page={page}
                    />
                  ))}
                </div>
                <div>
                  {navCol2.map((link) => (
                    <FooterNavLink
                      key={link.label}
                      label={link.label}
                      id={link.id}
                      page={page}
                    />
                  ))}
                  <button
                    onClick={() => {
                      setPrivacyOpen(true);
                      trackLinkClick({
                        linkText: "Política de Privacidade",
                        linkUrl: "/politica-de-cookies",
                        linkType: "internal",
                        location: "footer",
                      });
                    }}
                    className='mb-0 cursor-pointer border-none bg-transparent p-0 text-left font-sans text-sm text-white/60 transition-colors duration-200 hover:text-white'
                  >
                    Política de Privacidade
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col flex-wrap items-start justify-between gap-2 border-t border-white/[0.08] pt-4 md:flex-row md:items-center md:gap-3 md:pt-5'>
            <span className='font-sans text-xs text-white/30'>
              {C.footer.copyright}
            </span>
            {!isMobile && (
              <span className='footer-signature font-serif text-xs italic'>
                {C.footer.signature}
              </span>
            )}
          </div>
        </div>
      </footer>

      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </>
  );
}
