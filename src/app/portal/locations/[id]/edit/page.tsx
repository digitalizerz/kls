import { notFound } from "next/navigation";
import { updatePortalLocation } from "@/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { customer } = await requirePortalContext();
  const location = await prisma.location.findFirst({
    where: { id, customerId: customer.id },
  });
  if (!location) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit location" description={location.locationName} />
      <LocationForm
        action={updatePortalLocation}
        location={location}
        cancelHref={`/portal/locations/${location.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
