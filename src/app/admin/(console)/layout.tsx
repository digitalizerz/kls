import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardFont } from "@/components/layout/dashboard-font";

export const metadata: Metadata = { robots: { index: false, follow: false } };
import { adminNav } from "@/config/navigation";
import { adminNotices } from "@/lib/shell-notices";
import { requireAdmin } from "@/lib/session";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const notices = await adminNotices();

  return (
    <AppShell
      title="KLS operations"
      nav={adminNav}
      homeHref="/admin"
      userName={user.name ?? "KLS staff"}
      userEmail={user.email ?? ""}
      settingsHref="/admin/settings"
      notices={notices}
      noticesHref="/admin/reminders"
      searchScope="admin"
      fontClassName={dashboardFont.className}
    >
      {children}
    </AppShell>
  );
}
