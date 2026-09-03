import { notFound } from "next/navigation";
import { createAdminTrap } from "@/actions/traps";
import { GreaseTrapForm } from "@/components/forms/grease-trap-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminNewTrapPage({
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
      <PageHeader title="Add grease trap" description={`${location.customer.companyName} · ${location.locationName}`} />
      <GreaseTrapForm
        action={createAdminTrap}
        locationId={location.id}
        showStatus
        cancelHref={`/admin/locations/${location.id}`}
        submitLabel="Save grease trap"
      />
    </div>
  );
}
