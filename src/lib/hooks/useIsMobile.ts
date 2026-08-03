'use client';

import { useState, useEffect } from 'react';

/**
 * Retorna true quando a viewport tem largura ≤ breakpoint (default: 900px).
 * Usa hidratação segura: valor inicial false no servidor, sincroniza no client.
 */
export function useIsMobile(breakpoint = 900): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const sync = () => setIsMobile(window.innerWidth <= breakpoint);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [breakpoint]);

  return isMobile;
}
