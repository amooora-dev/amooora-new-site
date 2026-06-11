import { requireAdminSession } from '@/lib/admin/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
