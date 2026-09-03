import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";

export default async function AdminTechniciansPage() {
  await requireAdmin();
  const technicians = await prisma.technician.findMany({
    include: {
      user: true,
      _count: { select: { jobs: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technicians"
        description="Field logins use the same credentials as the technician portal. Assigned jobs show there for start, photos, and completion."
      />
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Employee ID</Th>
            <Th>Jobs</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((tech) => (
            <tr key={tech.id}>
              <Td className="font-medium">{tech.user.name}</Td>
              <Td>{tech.user.email}</Td>
              <Td>{tech.employeeId ?? "—"}</Td>
              <Td>{tech._count.jobs}</Td>
              <Td>
                <StatusBadge status={tech.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
