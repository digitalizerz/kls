import { notFound } from "next/navigation";
import { createAdminTrap } from "@/actions/traps";
import { GreaseTrapForm } from "@/components/forms/grease-trap-form";
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
    <GreaseTrapForm
      action={createAdminTrap}
      locationId={location.id}
      showStatus
      cancelHref={`/admin/locations/${location.id}`}
      submitLabel="Save grease trap"
      shell={{
        breadcrumbs: [
          { href: "/admin/locations", label: "Locations" },
          { href: `/admin/locations/${location.id}`, label: location.locationName },
          { label: "Add grease trap" },
        ],
        title: "Add grease trap",
        description: `${location.customer.companyName} · ${location.locationName}`,
        guidance: {
          title: "Interceptor guidance",
          body: "A grease trap belongs to this location. Its cleaning frequency and last cleaning date are used to calculate the next recommended service date.",
          points: [
            "The trap is saved on this location only.",
            "A last cleaning date is needed before a next service date is calculated.",
            "Due dates can create in-app reminders. Email is not sent.",
          ],
        },
      }}
    />
  );
}
