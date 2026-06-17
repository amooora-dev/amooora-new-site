import Link from 'next/link';
import type { ReactNode } from 'react';

export const adminInputClass =
  'w-full rounded-lg border border-black/12 bg-white px-4 py-2.5 font-sans text-sm text-ink outline-none transition placeholder:text-muted-fg/70 focus:border-primary focus:ring-2 focus:ring-primary/15';

export const adminLabelClass = 'mb-1.5 block font-sans text-sm font-medium text-ink';

export function AdminCard({
  children,
  className = '',
  padding = 'p-6',
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-sans text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary: 'bg-primary text-white shadow-sm hover:brightness-95 hover:shadow-md active:scale-[0.98]',
    secondary:
      'border border-primary/25 bg-white text-primary hover:border-primary/40 hover:bg-primary/[0.04]',
    ghost: 'text-muted-fg hover:bg-black/[0.04] hover:text-ink',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function AdminPageHeader({
  title,
  description,
  breadcrumb,
  action,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  action?: ReactNode;
}) {
  return (
    <header className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 font-sans text-xs text-muted-fg">
          {breadcrumb.map((item, i) => (
            <span key={item.label} className="flex items-center gap-1">
              {i > 0 && <span className="text-black/20">/</span>}
              {item.href ? (
                <Link href={item.href} className="transition hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink md:text-3xl">{title}</h1>
          {description && <p className="mt-1 font-sans text-sm text-muted-fg md:text-base">{description}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function AdminAlert({
  children,
  variant = 'info',
}: {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
}) {
  const styles = {
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-950',
    info: 'border-primary/15 bg-primary/[0.04] text-ink',
  };

  return (
    <div className={`rounded-xl border px-4 py-3 font-sans text-sm ${styles[variant]}`} role="status">
      {children}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  icon,
  accent = 'primary',
}: {
  label: string;
  value: number | string;
  icon?: ReactNode;
  accent?: 'primary' | 'tertiary' | 'green';
}) {
  const accentBg = {
    primary: 'bg-primary/10 text-primary',
    tertiary: 'bg-tertiary/10 text-tertiary',
    green: 'bg-green-100 text-green-800',
  };

  return (
    <AdminCard className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-sans text-sm text-muted-fg">{label}</p>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{value}</p>
        </div>
        {icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentBg[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </AdminCard>
  );
}

export function AdminBadge({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'muted';
}) {
  const styles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-800',
    muted: 'bg-black/[0.06] text-muted-fg',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 font-sans text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
