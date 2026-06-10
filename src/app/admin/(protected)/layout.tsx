import { requireAdminSession } from '@/lib/admin/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      <AdminSidebar email={session.email} />
      <main className="flex-1 overflow-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
