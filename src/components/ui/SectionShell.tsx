import type { ReactNode } from 'react';

type SectionShellProps = {
  children: ReactNode;
  /** max-w 860px (FAQ, newsletter) em vez de 1200px */
  narrow?: boolean;
  className?: string;
};

/**
 * Container horizontal padrão das seções da home/loja.
 * Classes definidas em globals.css (.section-shell / .section-shell-narrow).
 */
export function SectionShell({ children, narrow = false, className = '' }: SectionShellProps) {
  return (
    <div className={`${narrow ? 'section-shell-narrow' : 'section-shell'} ${className}`.trim()}>
      {children}
    </div>
  );
}
