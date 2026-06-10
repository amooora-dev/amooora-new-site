/** Protocolo do painel Tweaks com o host do Cursor (iframe pai). */

export function isEditModeHost(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.parent !== window;
  } catch {
    // iframe cross-origin — trata como embed no host
    return true;
  }
}

export function postToEditModeHost(message: Record<string, unknown>) {
  if (typeof window === 'undefined' || !isEditModeHost()) return;
  window.parent.postMessage(message, '*');
}

export function isTweaksEnvironment(): boolean {
  return process.env.NODE_ENV === 'development' || isEditModeHost();
}

export function shouldOpenTweaksFromQuery(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    process.env.NODE_ENV === 'development' &&
    !isEditModeHost() &&
    new URLSearchParams(window.location.search).has('tweaks')
  );
}
