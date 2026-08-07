type AmoooraLogoHeaderProps = {
  height: number;
  className?: string;
  priority?: boolean;
};

/**
 * Logo horizontal do header — PNG com fundo transparente.
 * `height` é dinâmico (mobile/desktop), por isso permanece em style.
 */
export function AmoooraLogoHeader({ height, className = '', priority = false }: AmoooraLogoHeaderProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-header.png"
      alt="Amooora"
      width={Math.round(height * 2.2)}
      height={height}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      className={`block w-auto bg-transparent shadow-none ${className}`.trim()}
      style={{ height }}
    />
  );
}
