import { cn } from "../utils/twMerge";

type SectionLabelProps = {
  label?: string;
  children?: React.ReactNode;
  centered?: boolean;
  light?: boolean;
};

/**
 * Linha decorativa + label em caixa alta com espaçamento.
 * Usado no cabeçalho de seções da home e loja.
 * - `light`: versão branca para fundos escuros (loja hero, etc.)
 * - `centered`: centraliza a linha + label
 */
export function SectionLabel({
  label,
  children,
  centered = false,
  light = false,
}: SectionLabelProps) {
  const text = label ?? children;

  return (
    <div
      className={cn(
        `flex items-center gap-3`,
        centered ? "justify-center" : "",
        light ? "text-white/60" : "text-primary",
      )}
    >
      <div
        className={cn(
          `h-px w-9 shrink-0`,
          light ? "bg-white/60" : "bg-primary",
        )}
      />
      <span className='font-sans text-[11px] font-semibold uppercase tracking-[0.2em]'>
        {text}
      </span>
    </div>
  );
}
