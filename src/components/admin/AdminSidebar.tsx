'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/admin/login/actions';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/produtos', label: 'Produtos' },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-black/5 bg-white">
      <div className="border-b border-black/5 p-6">
        <Link href="/admin/dashboard">
          <Image
            src="/images/logo-header.png"
            alt="Amooora"
            width={140}
            height={56}
            className="h-10 w-auto"
          />
        </Link>
        <p className="mt-3 font-sans text-xs uppercase tracking-[0.15em] text-primary">
          CMS Loja
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-2.5 font-sans text-sm transition ${
                active ? 'bg-primary text-white' : 'text-ink hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/5 p-4">
        <p className="truncate font-sans text-xs text-muted-fg">{email}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-full border border-primary/30 px-4 py-2 font-sans text-sm text-primary transition hover:bg-primary/5"
          >
            Sair
          </button>
        </form>
        <Link
          href="/loja"
          className="mt-2 block text-center font-sans text-xs text-muted-fg hover:text-primary"
        >
          Ver loja pública →
        </Link>
      </div>
    </aside>
  );
}
