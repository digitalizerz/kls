import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate } from "@/lib/format";

export default async function AdminServiceRecordsPage() {
  await requireAdmin();
  const records = await prisma.serviceRecord.findMany({
    include: {
      job: { include: { customer: true, location: true } },
      cleaningReport: true,
      complianceManifest: true,
    },
    orderBy: { completedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service records"
        description="Completion data captured on a job. This is what future reports and manifests will read from."
      />
      <Table>
        <thead>
          <tr>
            <Th>Completed</Th>
            <Th>Customer</Th>
            <Th>Location</Th>
            <Th>Gallons</Th>
            <Th>Report</Th>
            <Th>Manifest</Th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <Td>{formatDate(record.completedAt)}</Td>
              <Td className="font-medium">{record.job.customer.companyName}</Td>
              <Td>{record.job.location.locationName}</Td>
              <Td>{record.gallonsRemoved ?? "—"}</Td>
              <Td>{record.cleaningReport?.status ?? "—"}</Td>
              <Td>{record.complianceManifest?.status ?? "—"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
