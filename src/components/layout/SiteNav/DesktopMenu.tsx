import { LinkType } from "@/components/types/NavSite.type";
import { cn } from "@/components/utils/twMerge";
import Link from "next/link";
import { CtaButton } from "./CtaNav";
import { navHref, trackNavItem } from "./SiteNav";

export const DesktopMenu = ({
  layout,
  links,
  page,
  overDarkHero,
  ctaHref,
  open,
  setOpen,
}: {
  layout: "default" | "hero";
  links: LinkType[];
  page: "home" | "loja";
  overDarkHero?: boolean;
  ctaHref: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={cn(
        layout === "hero"
          ? "flex items-center justify-center justify-self-center gap-7"
          : "",
        layout === "default"
          ? "col-[2/-1] flex items-center justify-self-end gap-7"
          : "",
      )}
    >
      {links.map((link) => (
        <Link
          key={link.id}
          href={navHref(link.id, page)}
          className={cn(
            overDarkHero
              ? "whitespace-nowrap font-sans text-sm font-medium text-white no-underline opacity-90 transition-opacity duration-200 hover:opacity-100"
              : "whitespace-nowrap font-sans text-sm font-medium text-ink no-underline opacity-70 transition-opacity duration-200 hover:opacity-100",
          )}
          onClick={() => trackNavItem(link, "header_desktop", page)}
        >
          {link.label}
        </Link>
      ))}
      {layout === "default" ? (
        <CtaButton
          ctaHref={ctaHref}
          open={open}
          setOpen={setOpen}
          overDarkHero={overDarkHero}
        />
      ) : null}
    </div>
  );
};
