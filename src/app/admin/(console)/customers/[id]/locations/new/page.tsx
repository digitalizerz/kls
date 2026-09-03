import { notFound } from "next/navigation";
import { createAdminLocation } from "@/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminNewLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Add location" description={customer.companyName} />
      <LocationForm
        action={createAdminLocation}
        customerId={customer.id}
        showStatus
        cancelHref={`/admin/customers/${customer.id}`}
        submitLabel="Save location"
      />
    </div>
  );
}
