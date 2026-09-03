import { notFound } from "next/navigation";
import { updateAdminTrap } from "@/actions/traps";
import { GreaseTrapForm } from "@/components/forms/grease-trap-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminEditTrapPage({
  params,
}: {
  params: Promise<{ id: string; trapId: string }>;
}) {
  await requireAdmin();
  const { id, trapId } = await params;
  const trap = await prisma.greaseTrap.findFirst({
    where: { id: trapId, locationId: id },
    include: { location: { include: { customer: true } } },
  });
  if (!trap) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit grease trap"
        description={`${trap.location.customer.companyName} · ${trap.location.locationName}`}
      />
      <GreaseTrapForm
        action={updateAdminTrap}
        locationId={trap.locationId}
        trap={trap}
        showStatus
        cancelHref={`/admin/locations/${trap.locationId}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
