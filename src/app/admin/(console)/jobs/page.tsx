import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDateTime, formatServiceType } from "@/lib/format";
import Link from "next/link";

export default async function AdminJobsPage() {
  await requireAdmin();
  const jobs = await prisma.serviceJob.findMany({
    include: {
      customer: true,
      location: true,
      technician: { include: { user: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule / jobs"
        description="Confirmed work. Assign a technician so the job appears in the field portal."
      />
      <Table>
        <thead>
          <tr>
            <Th>When</Th>
            <Th>Customer</Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th>Technician</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <Td>{formatDateTime(job.scheduledAt)}</Td>
              <Td>
                <Link href={`/admin/jobs/${job.id}`} className="font-medium hover:text-forest">
                  {job.customer.companyName}
                </Link>
              </Td>
              <Td>{job.location.locationName}</Td>
              <Td>{formatServiceType(job.serviceType)}</Td>
              <Td>{job.technician?.user.name ?? "Unassigned"}</Td>
              <Td>
                <StatusBadge status={job.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
