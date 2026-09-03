import { notFound } from "next/navigation";
import { updatePortalTrap } from "@/actions/traps";
import { GreaseTrapForm } from "@/components/forms/grease-trap-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";

export default async function EditTrapPage({
  params,
}: {
  params: Promise<{ id: string; trapId: string }>;
}) {
  const { id, trapId } = await params;
  const { customer } = await requirePortalContext();
  const trap = await prisma.greaseTrap.findFirst({
    where: { id: trapId, locationId: id, location: { customerId: customer.id } },
    include: { location: true },
  });
  if (!trap) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit grease trap" description={trap.location.locationName} />
      <GreaseTrapForm
        action={updatePortalTrap}
        locationId={trap.locationId}
        trap={trap}
        cancelHref={`/portal/locations/${trap.locationId}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
