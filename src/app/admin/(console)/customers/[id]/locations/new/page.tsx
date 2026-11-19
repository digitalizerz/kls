import { notFound } from "next/navigation";
import { createAdminLocation } from "@/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
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
    <LocationForm
      action={createAdminLocation}
      customerId={customer.id}
      customerName={customer.companyName}
      showStatus
      cancelHref={`/admin/customers/${customer.id}`}
      submitLabel="Save location"
      shell={{
        breadcrumbs: [
          { href: "/admin/customers", label: "Customers" },
          { href: `/admin/customers/${customer.id}`, label: customer.companyName },
          { label: "Add location" },
        ],
        title: "Add location",
        description: `Set up a service location for ${customer.companyName}.`,
        guidance: {
          title: "Location guidance",
          body: "A location belongs to this customer. Grease traps are added to the location after it is saved.",
          points: [
            "The location is added to this customer's account.",
            "You can add grease traps and set service details next.",
            "Jobs and service requests use this location.",
          ],
        },
      }}
    />
  );
}
