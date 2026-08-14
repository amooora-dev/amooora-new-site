import { useIsMobile } from "@/lib/hooks/useIsMobile";
import Image from "next/image";
import { cn } from "../utils/twMerge";

type AmoooraLogoHeaderProps = {
  className?: string;
  priority?: boolean;
};

/**
 * Logo horizontal do header — PNG com fundo transparente.
 * `height` é dinâmico (mobile/desktop), por isso permanece em style.
 */
export function AmoooraLogoHeader({
  className = "",
  priority = false,
}: AmoooraLogoHeaderProps) {
  const isMobile = useIsMobile();
  const height = isMobile ? 34 : 44;
  const width = Math.round((height * 147) / 44);

  return (
    <Image
      src='/images/logo-header.png'
      alt='Amooora'
      width={width}
      height={height}
      decoding='async'
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      className={cn("block w-auto bg-transparent shadow-none", className)}
      style={{ height, width: "auto" }}
    />
  );
}
