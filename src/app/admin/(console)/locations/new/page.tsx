import { createAdminLocation } from "@/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminNewLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  await requireAdmin();
  const { customer } = await searchParams;
  const customers = await prisma.customer.findMany({
    select: { id: true, companyName: true },
    orderBy: { companyName: "asc" },
  });
  const defaultCustomerId = customers.some((item) => item.id === customer) ? customer : undefined;

  return (
    <LocationForm
      action={createAdminLocation}
      customers={customers}
      defaultCustomerId={defaultCustomerId}
      showStatus
      cancelHref="/admin/locations"
      submitLabel="Save location"
      shell={{
        breadcrumbs: [
          { href: "/admin/locations", label: "Locations" },
          { label: "Add location" },
        ],
        title: "Add location",
        description: "Set up a service location for an existing customer.",
        guidance: {
          title: "Location guidance",
          body: "Choose the customer this site belongs to. Grease traps are added to the location after it is saved.",
          points: [
            "The location is added to the selected customer's account.",
            "You can add grease traps and set service details next.",
            "Jobs and service requests use this location.",
          ],
        },
      }}
    />
  );
}
