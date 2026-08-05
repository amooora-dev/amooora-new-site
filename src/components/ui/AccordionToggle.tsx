import { pa } from '@/lib/style-utils';

type AccordionToggleProps = {
  open: boolean;
};

/**
 * Botão circular "+" que gira 45° e vira "×" quando aberto.
 * Usado nos accordions de FAQ e do Aplicativo Sáfico na home.
 */
export function AccordionToggle({ open }: AccordionToggleProps) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-lg font-light transition-all duration-[220ms]"
      style={{
        width: 28,
        height: 28,
        background: open ? 'var(--primary)' : pa(8),
        color: open ? 'white' : 'var(--primary)',
        transform: open ? 'rotate(45deg)' : 'none',
      }}
    >
      +
    </span>
  );
}
