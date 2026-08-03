/**
 * Retorna uma expressão CSS `color-mix` para a cor primária com opacidade.
 * @param pct Percentual de opacidade de 0 a 100
 * @example pa(10) → 'color-mix(in srgb, var(--primary) 10%, transparent)'
 */
export const pa = (pct: number) =>
  `color-mix(in srgb, var(--primary) ${pct}%, transparent)`;
