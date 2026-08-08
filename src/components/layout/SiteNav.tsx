"use client";

import { AmoooraLogoHeader } from "@/components/brand/AmoooraLogoHeader";
import { trackLinkClick, type LinkClickLocation } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SiteNavProps } from "../types/NavSite.type";


function navHref(id: string, page: "home" | "loja") {
  if (id === "loja") return "/loja";
  return page === "home" ? `#${id}` : `/#${id}`;
}

function trackNavLink(
  label: string,
  href: string,
  location: LinkClickLocation,
  sectionId?: string,
) {
  trackLinkClick({
    linkText: label,
    linkUrl: href,
    linkType:
      sectionId === "loja" || !href.includes("#") ? "nav_route" : "nav_anchor",
    location,
    sectionId,
  });
}

function navLinkType(id: string, href: string): "nav_anchor" | "nav_route" {
  return id === "loja" || !href.includes("#") ? "nav_route" : "nav_anchor";
}

function HomeMenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.75}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 10.75 12 3l9 7.75' />
      <path d='M5.5 9.5V20h13V9.5' />
      <path d='M9.5 20v-6h5v6' />
    </svg>
  );
}

function NavIcon({
  id,
  className = "h-5 w-5",
}: {
  id: NavLinkId;
  className?: string;
}) {
  const props = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };
  switch (id) {
    case "manifesto":
      return (
        <svg {...props}>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
          />
        </svg>
      );
    case "aplicativo":
      return (
        <svg {...props}>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
          />
        </svg>
      );
    case "valores":
      return (
        <svg {...props}>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
          />
        </svg>
      );
    case "loja":
      return (
        <svg {...props}>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
          />
        </svg>
      );
    case "faq":
      return (
        <svg {...props}>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      );
    default:
      return null;
  }
}

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      className='h-5 w-5'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.75}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      {open ? (
        <>
          <path d='M18 6 6 18' />
          <path d='M6 6l12 12' />
        </>
      ) : (
        <>
          <path d='M3 6h18' />
          <path d='M3 12h18' />
          <path d='M3 18h18' />
        </>
      )}
    </svg>
  );
}

export function SiteNav({
  layout = "default",
  page = "home",
  navOverDark,
}: SiteNavProps) {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobile || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    closeMenu();
  }, [page, closeMenu]);

  const overDarkHero =
    (navOverDark ?? page === "loja") && page === "loja" && !scrolled;
  const ctaHref = page === "home" ? "#aplicativo" : "/#aplicativo";
  const logoHeight = isMobile ? 34 : 44;
  const links = C.nav.links;

  const trackNavItem = (
    link: (typeof links)[number],
    location: LinkClickLocation,
  ) => {
    const href = navHref(link.id, page);
    trackLinkClick({
      linkText: link.label,
      linkUrl: href,
      linkType: navLinkType(link.id, href),
      location,
      sectionId: link.id !== "loja" ? link.id : undefined,
    });
  };

  const desktopLinkClass = overDarkHero
    ? "whitespace-nowrap font-sans text-sm font-medium text-white no-underline opacity-90 transition-opacity duration-200 hover:opacity-100"
    : "whitespace-nowrap font-sans text-sm font-medium text-ink no-underline opacity-70 transition-opacity duration-200 hover:opacity-100";

  const ctaButton = !isMobile ? (
    <Link
      href={ctaHref}
      className='whitespace-nowrap rounded-full bg-primary px-[22px] py-2.5 font-sans text-[13px] font-semibold text-white no-underline shadow-primary-nav transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-primary-nav-hover'
      onClick={() =>
        trackNavLink(C.nav.ctaDownload, ctaHref, "header_cta", "aplicativo")
      }
    >
      {C.nav.ctaDownload}
    </Link>
  ) : (
    <button
      type='button'
      onClick={() => setOpen((v) => !v)}
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open}
      aria-controls='mobile-nav-drawer'
      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border ${
        overDarkHero
          ? "border-white/60 bg-black/20 text-white"
          : "border-primary-27 bg-white/85 text-primary"
      }`}
    >
      
      <MenuToggleIcon open={open} />
    </button>
  );

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] font-sans transition-all duration-[400ms] ${
          overDarkHero
            ? "border-transparent bg-transparent"
            : scrolled
              ? "border-b border-primary-10 bg-white/95 backdrop-blur-[12px]"
              : "border-transparent bg-white"
        }`}
        aria-label='Principal'
      >
        <div
          className={`relative mx-auto grid max-w-[1200px] items-center ${
            isMobile
              ? `grid-cols-[1fr_auto] gap-3 ${scrolled ? "px-4 py-3" : "px-4 py-4"}`
              : `grid-cols-[auto_1fr_auto] gap-8 ${scrolled ? "px-12 py-3.5" : "px-12 py-5"}`
          }`}
        >
          <Link
            href='/'
            className='justify-self-start bg-transparent shadow-none'
            onClick={() => {
              closeMenu();
              trackNavLink("Amooora", "/", "header_logo");
            }}
          >
            <AmoooraLogoHeader height={logoHeight} priority />
          </Link>

          {!isMobile && layout === "hero" && (
            <div className='flex items-center justify-center justify-self-center gap-7'>
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={navHref(link.id, page)}
                  className={desktopLinkClass}
                  onClick={() => trackNavItem(link, "header_desktop")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {!isMobile && layout === "default" && (
            <div className='col-[2/-1] flex items-center justify-self-end gap-7'>
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={navHref(link.id, page)}
                  className={desktopLinkClass}
                  onClick={() => trackNavItem(link, "header_desktop")}
                >
                  {link.label}
                </Link>
              ))}
              {ctaButton}
            </div>
          )}

          {(isMobile || layout === "hero") && (
            <div className='justify-self-end'>{ctaButton}</div>
          )}
        </div>
      </nav>

      {isMobile && (
        <div
          className={`fixed inset-0 z-[110] transition-opacity duration-300 ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!open}
        >
          <button
            type='button'
            className='absolute inset-0 bg-black/45'
            aria-label='Fechar menu'
            tabIndex={open ? 0 : -1}
            onClick={closeMenu}
          />

          <div
            id='mobile-nav-drawer'
            role='dialog'
            aria-modal='true'
            aria-label='Menu de navegação'
            className={`absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className='flex items-center justify-between border-b border-black/5 px-5 py-4'>
              <span className='font-sans text-sm font-semibold uppercase tracking-[0.15em] text-primary'>
                Menu
              </span>
              <button
                type='button'
                onClick={closeMenu}
                aria-label='Fechar menu'
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-primary transition hover:bg-primary-4'
              >
                <MenuToggleIcon open />
              </button>
            </div>

            <nav
              className='flex-1 overflow-y-auto px-3 py-4'
              aria-label='Seções do site'
            >
              <ul className='space-y-1'>
                <li>
                  <Link
                    href='/'
                    onClick={() => {
                      closeMenu();
                      trackNavLink("Amooora", "/", "header_mobile");
                    }}
                    className='flex min-h-[52px] items-center gap-3 rounded-xl px-3 font-sans text-[15px] font-medium text-ink transition hover:bg-primary-4 active:bg-primary-8'
                  >
                    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-10 text-primary'>
                      <HomeMenuIcon className='h-5 w-5' />
                    </span>
                    Amooora
                  </Link>
                </li>
                {links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={navHref(link.id, page)}
                      onClick={() => {
                        closeMenu();
                        trackNavItem(link, "header_mobile");
                      }}
                      className='flex min-h-[52px] items-center gap-3 rounded-xl px-3 font-sans text-[15px] font-medium text-ink transition hover:bg-primary-4 active:bg-primary-8'
                    >
                      <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-10 text-primary'>
                        <NavIcon id={link.id} />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className='border-t border-black/5 p-5'>
              <Link
                href={ctaHref}
                onClick={() => {
                  closeMenu();
                  trackNavLink(
                    C.nav.ctaDownload,
                    ctaHref,
                    "header_cta",
                    "aplicativo",
                  );
                }}
                className='flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-semibold text-white shadow-md transition hover:brightness-95'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={1.75}
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                  />
                </svg>
                {C.nav.ctaDownload}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
