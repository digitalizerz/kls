import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardFont } from "@/components/layout/dashboard-font";

export const metadata: Metadata = { robots: { index: false, follow: false } };
import { technicianNav } from "@/config/navigation";
import { technicianNotices } from "@/lib/shell-notices";
import { requireTechnicianContext } from "@/lib/session";

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireTechnicianContext();
  const notices = await technicianNotices(user.id);

  return (
    <AppShell
      title="Field portal"
      nav={technicianNav}
      homeHref="/technician"
      userName={user.name ?? "Technician"}
      userEmail={user.email ?? ""}
      notices={notices}
      searchScope="technician"
      fontClassName={dashboardFont.className}
    >
      {children}
    </AppShell>
  );
}
