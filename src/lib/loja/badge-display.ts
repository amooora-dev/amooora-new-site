const LEGACY_BADGE_LABEL: Record<string, string> = {
  novo: 'NOVO',
  mais_vendido: 'MAIS VENDIDO',
  edicao_limitada: 'EDIÇÃO LIMITADA',
};

function normalizeForCompare(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function formatProductBadge(badge: string): string {
  return LEGACY_BADGE_LABEL[badge] ?? badge;
}

export function getBadgeBgClass(badge: string): string {
  const normalized = normalizeForCompare(badge);

  if (normalized.includes('edicao limitada') || normalized === 'edicao_limitada') {
    return 'bg-accent';
  }

  return 'bg-primary';
}

export function isEdicaoLimitadaBadge(badge: string | null | undefined): boolean {
  if (!badge) return false;
  const normalized = normalizeForCompare(badge);

  return normalized.includes('edicao limitada') || normalized === 'edicao_limitada';
}
