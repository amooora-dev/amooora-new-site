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
 * - `centered`: centraliza e espelha a linha nos dois lados (ex.: —— texto ——)
 */
export function SectionLabel({
  label,
  children,
  centered = false,
  light = false,
}: SectionLabelProps) {
  const text = label ?? children;
  const rule = (
    <div
      className={cn(
        `h-px w-9 shrink-0`,
        light ? "bg-white/60" : "bg-primary",
      )}
    />
  );

  return (
    <div
      className={cn(
        `flex items-center gap-3`,
        centered ? "justify-center" : "",
        light ? "text-white/60" : "text-primary",
      )}
    >
      {rule}
      <span className='font-sans text-[11px] font-semibold uppercase tracking-[0.2em]'>
        {text}
      </span>
      {centered ? rule : null}
    </div>
  );
}
