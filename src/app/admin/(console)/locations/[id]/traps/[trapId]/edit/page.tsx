import { notFound } from "next/navigation";
import { updateAdminTrap } from "@/actions/traps";
import { GreaseTrapForm } from "@/components/forms/grease-trap-form";
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
    <GreaseTrapForm
      action={updateAdminTrap}
      locationId={trap.locationId}
      trap={trap}
      showStatus
      cancelHref={`/admin/locations/${trap.locationId}`}
      submitLabel="Save changes"
      shell={{
        breadcrumbs: [
          { href: "/admin/locations", label: "Locations" },
          { href: `/admin/locations/${trap.locationId}`, label: trap.location.locationName },
          { label: "Edit grease trap" },
        ],
        title: "Edit grease trap",
        description: `${trap.location.customer.companyName} · ${trap.location.locationName}`,
        guidance: {
          title: "Interceptor guidance",
          body: "Updates apply to this trap only. If you change the last cleaning date or frequency, the next recommended service date is recalculated.",
          points: [
            "The trap stays on this location.",
            "Custom frequency is used only when frequency is set to Custom.",
            "In-app reminders follow the stored due date. Email is not sent.",
          ],
        },
      }}
    />
  );
}
