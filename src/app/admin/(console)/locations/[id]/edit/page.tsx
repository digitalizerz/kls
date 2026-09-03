import { notFound } from "next/navigation";
import { updateAdminLocation } from "@/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
import { PageHeader } from "@/components/ui/page-header";
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
    <div className="space-y-6">
      <PageHeader title="Edit location" description={location.customer.companyName} />
      <LocationForm
        action={updateAdminLocation}
        location={location}
        showStatus
        cancelHref={`/admin/locations/${location.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
