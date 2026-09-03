import type { ComponentProps } from "react";
import { prisma } from "@/lib/db";
import { requireTechnicianContext } from "@/lib/session";
import { TechnicianJobCard } from "@/components/technician/job-card";
import { PageHeader } from "@/components/ui/page-header";

export default async function TechnicianJobsPage() {
  const { technician } = await requireTechnicianContext();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const assigned = await prisma.serviceJob.findMany({
    where: {
      technicianId: technician.id,
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
    },
    include: { customer: true, location: true },
    orderBy: { scheduledAt: "asc" },
  });

  const inProgress = assigned.filter((job) => job.status === "IN_PROGRESS");
  const today = assigned.filter(
    (job) => job.status === "SCHEDULED" && job.scheduledAt >= start && job.scheduledAt < end,
  );
  const upcoming = assigned.filter(
    (job) => job.status === "SCHEDULED" && job.scheduledAt >= end,
  );
  const overdue = assigned.filter(
    (job) => job.status === "SCHEDULED" && job.scheduledAt < start,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assigned jobs"
        description="Open work assigned to you. Start the job when you arrive, add photos, then complete with the customer’s printed name."
      />

      <JobSection title="In progress" jobs={inProgress} empty="No jobs in progress." />
      <JobSection title="Overdue / leftover" jobs={overdue} empty="No leftover scheduled jobs." hideIfEmpty />
      <JobSection title="Today" jobs={today} empty="Nothing else on today’s calendar." />
      <JobSection title="Upcoming" jobs={upcoming} empty="No later jobs on your board." />
    </div>
  );
}

function JobSection({
  title,
  jobs,
  empty,
  hideIfEmpty = false,
}: {
  title: string;
  jobs: ComponentProps<typeof TechnicianJobCard>["job"][];
  empty: string;
  hideIfEmpty?: boolean;
}) {
  if (hideIfEmpty && jobs.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted">{title}</h2>
      {jobs.length === 0 ? (
        <p className="border border-dashed border-line px-4 py-6 text-sm text-muted">{empty}</p>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job) => (
            <TechnicianJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
