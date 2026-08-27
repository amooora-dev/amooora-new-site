"use client";

import { AmoooraLogoHeader } from "@/components/brand/AmoooraLogoHeader";
import { trackLinkClick, type LinkClickLocation } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  BookOpen,
  CircleQuestionMark,
  Handbag,
  Heart,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LinkType, SiteNavProps } from "../../types/NavSite.type";
import { cn } from "../../utils/twMerge";
import { CtaButton } from "./CtaNav";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

export function navHref(id: string, page: "home" | "loja") {
  if (id === "loja") return "/loja";
  return page === "home" ? `#${id}` : `/#${id}`;
}

export function trackNavLink(
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

export const trackNavItem = (
  link: LinkType,
  location: LinkClickLocation,
  page: "home" | "loja",
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

const icons = {
  manifesto: BookOpen,
  aplicativo: Smartphone,
  valores: Heart,
  loja: Handbag,
  faq: CircleQuestionMark,
};

export function SiteNav({
  layout = "default",
  page = "home",
  navOverDark,
}: SiteNavProps) {
  const isMobile = useIsMobile();
  const env = process.env.NODE_ENV || "production";
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

  const overDarkHero = false; // (navOverDark ?? page === "loja") && page === "loja" && !scrolled;
  const ctaHref = page === "home" ? "#aplicativo" : "/#aplicativo";
  const links = C.nav.links
    .map((link) => ({
      ...link,
      Icon: icons[link.id as keyof typeof icons],
    }))
    .filter((link) => env !== "production" || link.id !== "loja"); // hide loja link in prod envs`

  return (
    <>
      <nav
        className={cn(
          `fixed inset-x-0 top-0 z-[100] font-sans transition-all duration-[400ms]`,
          overDarkHero ? "border-transparent bg-transparent" : "",
          !overDarkHero &&
            (scrolled
              ? "border-b border-primary-10 bg-white/95 backdrop-blur-[12px]"
              : "border-transparent bg-white"),
        )}
        aria-label='Principal'
      >
        <div
          className={cn(
            `relative mx-auto grid max-w-[1200px] items-center grid-cols-[1fr_auto] gap-3 md:grid-cols-[auto_1fr_auto] md:gap-8 px-4 py-4 md:px-12 md:py-5`,
            scrolled ? "px-4 py-3 md:px-12 md:py-3.5" : "",
          )}
        >
          <Link
            href='/'
            className='justify-self-start bg-transparent shadow-none'
            onClick={() => {
              closeMenu();
              trackNavLink("Amooora", "/", "header_logo");
            }}
          >
            <AmoooraLogoHeader priority />
          </Link>

          {!isMobile ? (
            <DesktopMenu
              layout={layout}
              links={links}
              page={page}
              overDarkHero={overDarkHero}
              Button={CtaButton}
            />
          ) : null}

          {(isMobile || layout === "hero") && (
            <div className='justify-self-end'>
              {
                <CtaButton
                  ctaHref={ctaHref}
                  open={open}
                  setOpen={setOpen}
                  overDarkHero={overDarkHero}
                />
              }
            </div>
          )}
        </div>
      </nav>

      {isMobile && (
        <MobileMenu
          open={open}
          closeMenu={closeMenu}
          page={page}
          ctaHref={ctaHref}
          links={links}
          navHref={navHref}
        />
      )}
    </>
  );
}
