'use client';

import type { ProdutoLoja } from '@/lib/loja-data';

type Cor = ProdutoLoja['cores'][number];

type ColorSwatchesProps = {
  cores: Cor[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-9 w-9',
} as const;

export function ColorSwatches({
  cores,
  selectedIndex,
  onSelect,
  size = 'md',
  showLabel = true,
  className = '',
}: ColorSwatchesProps) {
  if (!cores.length) return null;

  const selected = cores[selectedIndex];

  return (
    <div className={className}>
      {showLabel && (
        <p className="mb-2 font-sans text-xs font-medium text-ink">
          Cor{selected ? `: ${selected.nome}` : ''}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2" role="listbox" aria-label="Cores disponíveis">
        {cores.map((cor, i) => {
          const active = i === selectedIndex;
          return (
            <button
              key={`${cor.nome}-${cor.hex}`}
              type="button"
              role="option"
              aria-selected={active}
              aria-label={cor.nome}
              title={cor.nome}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
              className={`relative rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${sizeClasses[size]} ${
                active
                  ? 'border-primary ring-2 ring-primary/25 scale-110'
                  : 'border-black/10 hover:border-primary/40 hover:scale-105'
              }`}
              style={{
                background: cor.hex,
                boxShadow: cor.hex.toLowerCase() === '#ffffff' ? 'inset 0 0 0 1px #e8eaf2' : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
