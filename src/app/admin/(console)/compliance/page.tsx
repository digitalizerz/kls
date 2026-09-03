import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate } from "@/lib/format";

export default async function AdminCompliancePage() {
  await requireAdmin();
  const manifests = await prisma.complianceManifest.findMany({
    include: {
      serviceRecord: {
        include: { job: { include: { customer: true, location: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance"
        description="Placeholder records only. Official manifests will be generated from stored service data once the client template is provided. This is not a legal form."
      />
      <Table>
        <thead>
          <tr>
            <Th>Customer</Th>
            <Th>Location</Th>
            <Th>Jurisdiction</Th>
            <Th>Status</Th>
            <Th>Service date</Th>
          </tr>
        </thead>
        <tbody>
          {manifests.map((manifest) => (
            <tr key={manifest.id}>
              <Td className="font-medium">{manifest.serviceRecord.job.customer.companyName}</Td>
              <Td>{manifest.serviceRecord.job.location.locationName}</Td>
              <Td>{manifest.jurisdiction ?? "—"}</Td>
              <Td>
                <StatusBadge status={manifest.status} />
              </Td>
              <Td>{formatDate(manifest.serviceRecord.completedAt)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
