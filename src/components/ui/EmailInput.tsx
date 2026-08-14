import type { ChangeEvent } from 'react';
import { cn } from '../utils/twMerge';

type EmailInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
};

/**
 * Input de email padronizado — borda, tipografia e cor do texto consistentes.
 */
export function EmailInput({ value, onChange, placeholder, required, className = '' }: EmailInputProps) {
  return (
    <input
      type="email"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={placeholder}
      required={required}
      className={cn(`min-h-[48px] rounded-lg border border-black/10 bg-white px-4 font-sans text-base text-ink outline-none`, className)}
    />
  );
}
