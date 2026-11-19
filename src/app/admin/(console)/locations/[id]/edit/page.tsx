import { notFound } from "next/navigation";
import { updateAdminLocation } from "@/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminEditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const location = await prisma.location.findUnique({
    where: { id },
    include: { customer: true },
  });
  if (!location) notFound();

  return (
    <LocationForm
      action={updateAdminLocation}
      location={location}
      customerName={location.customer.companyName}
      showStatus
      cancelHref={`/admin/locations/${location.id}`}
      submitLabel="Save changes"
      shell={{
        breadcrumbs: [
          { href: "/admin/locations", label: "Locations" },
          { href: `/admin/locations/${location.id}`, label: location.locationName },
          { label: "Edit location" },
        ],
        title: "Edit location",
        description: location.customer.companyName,
        guidance: {
          title: "Location guidance",
          body: "Changes here update this service site. Grease traps, jobs, and documents stay attached to the location.",
          points: [
            "The customer for this location stays the same.",
            "Trap service dates are edited on each grease trap.",
            "Inactive locations remain on the account and can be filtered in the locations list.",
          ],
        },
      }}
    />
  );
}
