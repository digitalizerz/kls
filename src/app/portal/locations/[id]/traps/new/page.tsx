import { notFound } from "next/navigation";
import { createPortalTrap } from "@/actions/traps";
import { GreaseTrapForm } from "@/components/forms/grease-trap-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";

export default async function NewTrapPage({
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
      <PageHeader title="Add grease trap" description={location.locationName} />
      <GreaseTrapForm
        action={createPortalTrap}
        locationId={location.id}
        cancelHref={`/portal/locations/${location.id}`}
        submitLabel="Save grease trap"
      />
    </div>
  );
}
