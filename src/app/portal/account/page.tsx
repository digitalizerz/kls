import { requirePortalContext } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { formatAddress } from "@/lib/format";

export default async function AccountPage() {
  const { user, customer } = await requirePortalContext();

  return (
    <div className="space-y-6">
      <PageHeader title="Account" description="Business profile for this customer organization." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Business</p>
          <p className="mt-2 text-lg font-semibold">{customer.companyName}</p>
          <p className="mt-3 text-sm">{customer.contactName}</p>
          <p className="text-sm text-muted">{customer.email}</p>
          <p className="text-sm text-muted">{customer.phone}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Billing address</p>
          <p className="mt-2 text-sm leading-6">
            {formatAddress({
              addressLine1: customer.billingAddressLine1,
              addressLine2: customer.billingAddressLine2,
              city: customer.billingCity,
              state: customer.billingState,
              zipCode: customer.billingZipCode,
            })}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Signed in as</p>
          <p className="mt-2 text-sm">{user.email}</p>
          <p className="text-sm text-muted">Role: Customer</p>
        </Card>
      </div>
    </div>
  );
}
