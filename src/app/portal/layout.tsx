import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };
import { AppShell } from "@/components/layout/app-shell";
import { dashboardFont } from "@/components/layout/dashboard-font";
import { portalNav } from "@/config/navigation";
import { portalNotices } from "@/lib/shell-notices";
import { requirePortalContext } from "@/lib/session";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, customer } = await requirePortalContext();

  if (!customer.onboardingCompletedAt) {
    redirect("/onboarding");
  }

  const notices = await portalNotices(customer.id, user.id);

  return (
    <AppShell
      title="Customer portal"
      nav={portalNav}
      homeHref="/portal/dashboard"
      userName={user.name ?? customer.contactName}
      userEmail={user.email ?? customer.email}
      settingsHref="/portal/account"
      notices={notices}
      noticesHref="/portal/reminders"
      searchScope="portal"
      fontClassName={dashboardFont.className}
    >
      {children}
    </AppShell>
  );
}
