import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };
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
