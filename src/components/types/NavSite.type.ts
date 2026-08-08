import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";

export type SiteNavProps = {
  layout?: "default" | "hero";
  page?: "home" | "loja";
  navOverDark?: boolean;
};

export type NavLinkId = (typeof C.nav.links)[number]["id"];
