'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { logoutAction } from '@/app/admin/login/actions';
import {
  IconClose,
  IconDashboard,
  IconLogout,
  IconMenu,
  IconProducts,
  IconStore,
} from '@/components/admin/admin-icons';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: IconProducts },
] as const;

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/admin/produtos/novo')) return 'Novo produto';
  if (pathname.match(/^\/admin\/produtos\/[^/]+$/)) return 'Editar produto';
  if (pathname.startsWith('/admin/produtos')) return 'Produtos';
  return 'Dashboard';
}

function SidebarContent({
  email,
  pathname,
  onNavigate,
}: {
  email: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <>
      <div className="border-b border-black/[0.06] px-5 py-5">
        <Link href="/admin/dashboard" onClick={onNavigate} className="block">
          <Image
            src="/images/logo-header.png"
            alt="Amooora"
            width={140}
            height={56}
            className="h-9 w-auto"
          />
        </Link>
        <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Painel da Loja
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-fg">
          Menu
        </p>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-medium transition ${
                active
                  ? 'bg-primary/[0.08] text-primary'
                  : 'text-muted-fg hover:bg-muted hover:text-ink'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-fg group-hover:bg-primary/10 group-hover:text-primary'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}

        <div className="my-4 border-t border-black/[0.06]" />

        <p className="mb-2 px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-fg">
          Atalhos
        </p>
        <Link
          href="/loja"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-medium text-muted-fg transition hover:bg-muted hover:text-primary"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-fg">
            <IconStore className="h-5 w-5" />
          </span>
          Ver loja pública
        </Link>
      </nav>

      <div className="border-t border-black/[0.06] p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-sans text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-xs font-medium text-ink">Administrador</p>
            <p className="truncate font-sans text-[11px] text-muted-fg">{email}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 px-4 py-2.5 font-sans text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/[0.04]"
          >
            <IconLogout className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </>
  );
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeMobile]);

  return (
    <div className="flex min-h-screen bg-off-white font-sans">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-black/[0.06] bg-white shadow-[1px_0_8px_rgba(0,0,0,0.04)] lg:flex">
        <SidebarContent email={email} pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-black/[0.06] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          onClick={closeMobile}
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg hover:bg-muted hover:text-ink"
          aria-label="Fechar menu"
        >
          <IconClose />
        </button>
        <SidebarContent email={email} pathname={pathname} onNavigate={closeMobile} />
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-black/[0.06] bg-white/95 px-4 shadow-sm backdrop-blur-md md:h-16 md:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-muted lg:hidden"
            aria-label="Abrir menu"
          >
            <IconMenu />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-primary">CMS Amooora</p>
            <h2 className="truncate font-serif text-lg font-bold text-ink">{pageTitle}</h2>
          </div>
          <Link
            href="/admin/produtos/novo"
            className="hidden items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-sans text-sm font-semibold text-white shadow-sm transition hover:bg-tertiary hover:shadow md:inline-flex"
          >
            + Produto
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
