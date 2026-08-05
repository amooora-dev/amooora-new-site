'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Detecta quando um elemento entra na viewport e mantém o estado "visível"
 * (não volta a false ao sair). Usado para animações de reveal ao rolar a página.
 */
export function useInViewReveal<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}
