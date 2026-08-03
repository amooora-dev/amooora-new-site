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
      className={`cursor-pointer rounded-full border-none bg-primary font-sans font-semibold text-white transition-all duration-[250ms] ${className}`}
      style={{ boxShadow: `0 8px 32px ${pa(27)}`, ...style }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 12px 40px ${pa(33)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `0 8px 32px ${pa(27)}`;
      }}
    >
      {children}
    </button>
  );
}
