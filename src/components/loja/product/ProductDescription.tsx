'use client';

import { formatProductDescription } from '@/lib/product-description';

type ProductDescriptionProps = {
  html: string;
  className?: string;
};

export function ProductDescription({ html, className = '' }: ProductDescriptionProps) {
  const content = formatProductDescription(html);
  if (!content) return null;

  return (
    <div
      className={`product-description font-sans text-sm leading-relaxed text-muted-fg ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
