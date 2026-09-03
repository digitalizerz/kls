import { notFound } from "next/navigation";
import { assignJobTechnician, cancelServiceJob, completeServiceJob, startServiceJob } from "@/actions/jobs";
import { CompleteJobForm } from "@/components/forms/complete-job-form";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime, formatServiceType } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [job, technicians] = await Promise.all([
    prisma.serviceJob.findUnique({
      where: { id },
      include: {
        customer: true,
        location: true,
        technician: { include: { user: true } },
        traps: { include: { greaseTrap: true } },
        serviceRecord: { include: { cleaningReport: true, complianceManifest: true } },
        request: true,
      },
    }),
    prisma.technician.findMany({
      where: { status: "ACTIVE" },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!job) notFound();
  const canAdvance = job.status === "SCHEDULED" || job.status === "IN_PROGRESS";
  const canComplete = job.status !== "COMPLETED" && job.status !== "CANCELLED";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Service job"
        title={job.customer.companyName}
        description={`${job.location.locationName} · ${formatServiceType(job.serviceType)}`}
      />
      <StatusBadge status={job.status} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Scheduled</p>
          <p className="mt-2 font-medium">{formatDateTime(job.scheduledAt)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Technician</p>
          <p className="mt-2 font-medium">{job.technician?.user.name ?? "Unassigned"}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Traps</p>
          <ul className="mt-2 list-disc pl-4 text-sm">
            {job.traps.map((item) => (
              <li key={item.greaseTrapId}>{item.greaseTrap.nameOrIdentifier}</li>
            ))}
          </ul>
        </Card>
      </div>

      {job.customerNotes ? (
        <Card>
          <CardTitle>Customer notes</CardTitle>
          <p className="mt-2 text-sm">{job.customerNotes}</p>
        </Card>
      ) : null}

      {canComplete ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>Dispatch</CardTitle>
            <form action={assignJobTechnician} className="mt-4 space-y-3">
              <input type="hidden" name="jobId" value={job.id} />
              <select name="technicianId" defaultValue={job.technicianId ?? ""} className="h-11 w-full border border-line bg-white px-3 text-sm">
                <option value="">Unassigned</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.user.name}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm">
                Save assignment
              </Button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {canAdvance && job.status !== "IN_PROGRESS" ? (
                <form action={startServiceJob}>
                  <input type="hidden" name="jobId" value={job.id} />
                  <Button type="submit" size="sm">
                    Mark in progress
                  </Button>
                </form>
              ) : null}
              {job.status !== "CANCELLED" ? (
                <form action={cancelServiceJob}>
                  <input type="hidden" name="jobId" value={job.id} />
                  <Button type="submit" variant="danger" size="sm">
                    Cancel job
                  </Button>
                </form>
              ) : null}
            </div>
          </Card>
          <Card>
            <CardTitle>Complete service</CardTitle>
            <p className="mt-2 mb-4 text-sm text-muted">
              Writes a service record, updates trap due dates, and creates cleaning-report and manifest placeholders.
            </p>
            <CompleteJobForm jobId={job.id} action={completeServiceJob} />
          </Card>
        </div>
      ) : job.serviceRecord ? (
        <Card>
          <CardTitle>Service record</CardTitle>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Completed</dt>
              <dd>{formatDate(job.serviceRecord.completedAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">Gallons removed</dt>
              <dd>{job.serviceRecord.gallonsRemoved ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Cleaning report</dt>
              <dd>{job.serviceRecord.cleaningReport?.status ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Manifest</dt>
              <dd>{job.serviceRecord.complianceManifest?.status ?? "—"}</dd>
            </div>
          </dl>
          {job.serviceRecord.technicianNotes ? (
            <p className="mt-4 text-sm">{job.serviceRecord.technicianNotes}</p>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
