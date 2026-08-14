import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { cn } from "../utils/twMerge";

type PrimaryButtonProps = {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
  style?: CSSProperties;
};

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
  style,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        `cursor-pointer rounded-full border-none bg-primary font-sans font-semibold text-white shadow-primary-cta transition-all duration-[250ms] hover:-translate-y-0.5 hover:shadow-primary-cta-hover`,
        className,
      )}
      style={style}
    >
      {children}
    </button>
  );
}
