import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };
import { AppShell } from "@/components/layout/app-shell";
import { portalNav } from "@/config/navigation";
import { requirePortalContext } from "@/lib/session";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, customer } = await requirePortalContext();

  if (!customer.onboardingCompletedAt) {
    redirect("/onboarding");
  }

  return (
    <AppShell
      title="Customer portal"
      nav={portalNav}
      homeHref="/portal/dashboard"
      userName={user.name ?? customer.contactName}
      userDetail={customer.companyName}
    >
      {children}
    </AppShell>
  );
}
