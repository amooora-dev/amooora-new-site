import type { Metadata } from 'next';
import { requireAdminSession } from '@/lib/admin/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin — Amooora',
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
