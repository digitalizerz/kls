import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { deactivateCustomer } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatAddress, formatDate } from "@/lib/format";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      users: true,
      locations: { include: { greaseTraps: true } },
      serviceJobs: { include: { location: true }, orderBy: { scheduledAt: "desc" }, take: 8 },
      documents: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer"
        title={customer.companyName}
        description={`${customer.contactName} · ${customer.email}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/admin/customers/${customer.id}/edit`} variant="secondary" size="sm">
              Edit
            </ButtonLink>
            <ButtonLink href={`/admin/customers/${customer.id}/locations/new`} size="sm">
              Add location
            </ButtonLink>
            {customer.status !== "INACTIVE" ? (
              <form action={deactivateCustomer}>
                <input type="hidden" name="customerId" value={customer.id} />
                <Button type="submit" variant="danger" size="sm">
                  Deactivate
                </Button>
              </form>
            ) : null}
          </div>
        }
      />
      <StatusBadge status={customer.status} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Billing</p>
          <p className="mt-2 text-sm leading-6">{formatAddress({
            addressLine1: customer.billingAddressLine1,
            addressLine2: customer.billingAddressLine2,
            city: customer.billingCity,
            state: customer.billingState,
            zipCode: customer.billingZipCode,
          })}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Phone</p>
          <p className="mt-2 font-medium">{customer.phone}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Onboarding</p>
          <p className="mt-2 text-sm">{customer.onboardingCompletedAt ? formatDate(customer.onboardingCompletedAt) : "Not completed"}</p>
        </Card>
      </div>

      <Card>
        <CardTitle>Locations</CardTitle>
        <ul className="mt-4 divide-y divide-line">
          {customer.locations.map((location) => (
            <li key={location.id} className="flex items-center justify-between py-3">
              <div>
                <Link href={`/admin/locations/${location.id}`} className="font-medium hover:text-forest">
                  {location.locationName}
                </Link>
                <p className="text-xs text-muted">{location.greaseTraps.length} grease traps</p>
              </div>
              <StatusBadge status={location.status} />
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Service history</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {customer.serviceJobs.map((job) => (
              <li key={job.id} className="flex justify-between py-3 text-sm">
                <span>{job.location.locationName}</span>
                <span className="text-muted">{formatDate(job.scheduledAt)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Account users</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {customer.users.map((user) => (
              <li key={user.id} className="py-3 text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted">{user.email}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
