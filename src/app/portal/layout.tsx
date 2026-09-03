import { redirect } from "next/navigation";
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
