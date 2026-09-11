import { trackLinkClick } from "@/lib/analytics";
import Link from "next/link";

function footerHref(id: string, page: "home" | "loja") {
  if (!id) return "#";
  if (id === "loja") return "/loja";
  return page === "home" ? `#${id}` : `/#${id}`;
}

export function FooterNavLink({
  label,
  id,
  page,
  inline = false,
}: {
  label: string;
  id: string;
  page: "home" | "loja";
  inline?: boolean;
}) {
  const href = id ? footerHref(id, page) : "#";
    return (
      <Link
        href={href}
        className={
          inline
            ? "font-sans text-sm text-white/60 no-underline transition-colors duration-200 hover:text-white"
            : "mb-2 block font-sans text-sm text-white/60 no-underline transition-colors duration-200 hover:text-white"
        }
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