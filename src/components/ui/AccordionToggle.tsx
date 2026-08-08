type AccordionToggleProps = {
  open: boolean;
};

/**
 * Botão circular "+" que gira 45° e vira "×" quando aberto.
 */
export function AccordionToggle({ open }: AccordionToggleProps) {
  return (
    <span
      data-open={open}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-8 text-lg font-light text-primary transition-all duration-[220ms] data-[open=true]:rotate-45 data-[open=true]:bg-primary data-[open=true]:text-white"
    >
      +
    </span>
  );
}
