import { AppShell } from "@/components/layout/app-shell";
import { adminNav } from "@/config/navigation";
import { requireAdmin } from "@/lib/session";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AppShell
      title="KLS operations"
      nav={adminNav}
      homeHref="/admin"
      userName={user.name ?? "KLS staff"}
      userDetail={user.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}
    >
      {children}
    </AppShell>
  );
}
