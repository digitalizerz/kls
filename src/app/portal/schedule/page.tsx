import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { ServiceRequestForm } from "@/components/portal/service-request-form";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button-link";

export default async function SchedulePage() {
  const { customer } = await requirePortalContext();
  const locations = await prisma.location.findMany({
    where: { customerId: customer.id, status: "ACTIVE" },
    include: {
      greaseTraps: {
        where: { status: "ACTIVE" },
        select: { id: true, nameOrIdentifier: true },
      },
    },
    orderBy: { locationName: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule service"
        description="Submit a request with preferred dates. KLS will confirm the actual job on the schedule."
      />
      {locations.length === 0 ? (
        <EmptyState
          title="Add a location first"
          description="Service requests are attached to a location and one or more grease traps."
          action={<ButtonLink href="/portal/locations">View locations</ButtonLink>}
        />
      ) : (
        <ServiceRequestForm
          locations={locations.map((location) => ({
            id: location.id,
            locationName: location.locationName,
            traps: location.greaseTraps,
          }))}
          contact={{
            name: customer.contactName,
            phone: customer.phone,
            email: customer.email,
          }}
        />
      )}
    </div>
  );
}
