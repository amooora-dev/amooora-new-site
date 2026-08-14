import { LinkClickLocation } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { ReactNode } from "react";

export type SiteNavProps = {
  layout?: "default" | "hero";
  page?: "home" | "loja";
  navOverDark?: boolean;
};

export type NavLinkId = (typeof C.nav.links)[number]["id"];

export type LinkType = {
  label: string;
  id: string;
  Icon?: (props: React.SVGProps<SVGSVGElement>) => ReactNode;
};

export type MobileMenuProps = {
  open: boolean;
  closeMenu: () => void;
  page: "home" | "loja";
  ctaHref: string;
  navHref: (id: string, page: "home" | "loja") => string;
  links: LinkType[];
};
