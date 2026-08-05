import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { pa } from '@/lib/style-utils';

type PrimaryButtonProps = {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  className?: string;
  style?: CSSProperties;
};

export function PrimaryButton({ children, onClick, type = 'button', className = '', style }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer rounded-full border-none bg-primary font-sans font-semibold text-white transition-all duration-[250ms] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_var(--hover-shadow)] ${className}`}
      style={{ boxShadow: `0 8px 32px ${pa(27)}`, '--hover-shadow': pa(33), ...style } as CSSProperties}
    >
      {children}
    </button>
  );
}
