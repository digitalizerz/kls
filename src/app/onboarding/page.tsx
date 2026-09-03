import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { OnboardingWizard } from "@/components/portal/onboarding-wizard";
import { requirePortalContext } from "@/lib/session";

export default async function OnboardingPage() {
  const { customer } = await requirePortalContext();
  if (customer.onboardingCompletedAt) {
    redirect("/portal/dashboard");
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Logo />
        <div className="mt-8 border border-line bg-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Customer onboarding</p>
          <h1 className="mt-2 font-serif text-3xl">Set up the business, first location, and grease trap</h1>
          <p className="mt-2 mb-8 text-sm text-muted">
            Traps belong to a location, not to a login. You can add more sites after this.
          </p>
          <OnboardingWizard
            defaults={{
              contactName: customer.contactName,
              email: customer.email,
              phone: customer.phone,
              companyName: customer.companyName,
            }}
          />
        </div>
      </div>
    </div>
  );
}
