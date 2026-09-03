import { prisma } from "@/lib/db";
import { requireTechnicianContext } from "@/lib/session";
import { TechnicianJobCard } from "@/components/technician/job-card";
import { PageHeader } from "@/components/ui/page-header";

export default async function TechnicianHistoryPage() {
  const { technician } = await requireTechnicianContext();
  const jobs = await prisma.serviceJob.findMany({
    where: { technicianId: technician.id, status: "COMPLETED" },
    include: { customer: true, location: true },
    orderBy: { completedAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed work"
        description="Jobs you have finished. Customers see the service history and any photos from the portal."
      />
      {jobs.length === 0 ? (
        <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
          No completed jobs yet.
        </p>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job) => (
            <TechnicianJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
