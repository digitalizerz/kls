import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatServiceType } from "@/lib/format";

export default async function HistoryPage() {
  const { customer } = await requirePortalContext();
  const [jobs, requests] = await Promise.all([
    prisma.serviceJob.findMany({
      where: { customerId: customer.id },
      include: {
        location: true,
        traps: { include: { greaseTrap: true } },
        serviceRecord: { include: { cleaningReport: true, complianceManifest: true } },
      },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.serviceRequest.findMany({
      where: { customerId: customer.id, status: "REQUESTED" },
      include: { location: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service history"
        description="Completed jobs, scheduled work, and requests still waiting on KLS confirmation."
      />

      {requests.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted">
            Open requests
          </h2>
          <Table>
            <thead>
              <tr>
                <Th>Submitted</Th>
                <Th>Location</Th>
                <Th>Type</Th>
                <Th>Preferred date</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <Td>{formatDate(request.createdAt)}</Td>
                  <Td>{request.location.locationName}</Td>
                  <Td>{formatServiceType(request.serviceType)}</Td>
                  <Td>{formatDate(request.preferredDate)}</Td>
                  <Td>
                    <StatusBadge status={request.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : null}

      {jobs.length === 0 ? (
        <EmptyState title="No service jobs yet" description="When a request is scheduled it will appear here." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Location</Th>
              <Th>Grease trap(s)</Th>
              <Th>Service</Th>
              <Th>Status</Th>
              <Th>Records</Th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <Td>{formatDate(job.scheduledAt)}</Td>
                <Td>{job.location.locationName}</Td>
                <Td>
                  {job.traps.map((item) => item.greaseTrap.nameOrIdentifier).join(", ") || "—"}
                </Td>
                <Td>{formatServiceType(job.serviceType)}</Td>
                <Td>
                  <StatusBadge status={job.status} />
                </Td>
                <Td className="text-xs text-muted">
                  {[
                    job.serviceRecord?.cleaningReport ? "Cleaning report" : null,
                    job.serviceRecord?.complianceManifest ? "Manifest placeholder" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
