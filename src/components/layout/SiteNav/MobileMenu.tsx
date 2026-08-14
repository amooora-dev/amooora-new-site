import { MobileMenuProps } from "@/components/types/NavSite.type";
import { cn } from "@/components/utils/twMerge";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { Download, House, X } from "lucide-react";
import { trackNavItem, trackNavLink } from "./SiteNav";
import Link from "next/link";

export const MobileMenu = ({
  open,
  closeMenu,
  page,
  ctaHref,
  navHref,
  links,
}: MobileMenuProps) => {
  return (
    <div
      className={cn(
        `fixed inset-0 z-[110] transition-opacity duration-300`,
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
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
        className={cn(
          `absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out`,
          open ? "translate-x-0" : "translate-x-full",
        )}
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
            <X className='h-5 w-5' />
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
                  <House className='h-5 w-5' />
                </span>{" "}
                Amooora
              </Link>
            </li>
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={navHref(link.id, page)}
                  onClick={() => {
                    closeMenu();
                    trackNavItem(link, "header_mobile", page);
                  }}
                  className='flex min-h-[52px] items-center gap-3 rounded-xl px-3 font-sans text-[15px] font-medium text-ink transition hover:bg-primary-4 active:bg-primary-8'
                >
                  <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-10 text-primary'>
                    {link.Icon && <link.Icon className='h-5 w-5' />}
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
            <Download className='h-4 w-4' />
            {C.nav.ctaDownload}
          </Link>
        </div>
      </div>
    </div>
  );
};
