import { cn } from "@/components/utils/twMerge";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { trackNavLink } from "./SiteNav";

export const CtaButton = ({
  ctaHref,
  open,
  setOpen,
  overDarkHero = false,
}: {
  ctaHref: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  overDarkHero?: boolean;
}) => {
  const isMobile = useIsMobile();
  return !isMobile ? (
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
      onClick={() => setOpen((prev) => !prev)}
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open}
      aria-controls='mobile-nav-drawer'
      className={cn(
        `flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border`,
        overDarkHero
          ? "border-white/60 bg-black/20 text-white"
          : "border-primary-27 bg-white/85 text-primary",
      )}
    >
      {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
    </button>
  );
};
