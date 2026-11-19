import { notFound } from "next/navigation";
import { deleteServiceJob } from "@/actions/delete";
import { assignJobTechnician, cancelServiceJob, completeServiceJob, startServiceJob } from "@/actions/jobs";
import { DeleteButton } from "@/components/forms/delete-button";
import { FormSection } from "@/components/forms/admin-form";
import { CompleteJobForm } from "@/components/forms/complete-job-form";
import { PendingButton } from "@/components/forms/pending-button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db";
import { CalendarClock, UserRound } from "lucide-react";
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
        actions={
          <DeleteButton
            action={deleteServiceJob}
            fields={{ id: job.id, returnTo: "/admin/jobs" }}
            title="Delete this job?"
            confirm="Delete this job? Its service record, cleaning report, and compliance manifest are removed. Uploaded documents stay on the customer."
          />
        }
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
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <FormSection
              icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
              title="Dispatch"
              description="Assign an active technician. The job appears in that technician's field portal."
            >
              <form action={assignJobTechnician} className="dash-fields space-y-4">
                <input type="hidden" name="jobId" value={job.id} />
                <Field label="Technician" htmlFor="technicianId">
                  <Select id="technicianId" name="technicianId" defaultValue={job.technicianId ?? ""}>
                    <option value="">Unassigned</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.user.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <PendingButton pendingLabel="Saving…" size="sm">
                  Save assignment
                </PendingButton>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {canAdvance && job.status !== "IN_PROGRESS" ? (
                  <form action={startServiceJob}>
                    <input type="hidden" name="jobId" value={job.id} />
                    <PendingButton pendingLabel="Updating…" size="sm">
                      Mark in progress
                    </PendingButton>
                  </form>
                ) : null}
                {job.status !== "CANCELLED" ? (
                  <form action={cancelServiceJob}>
                    <input type="hidden" name="jobId" value={job.id} />
                    <PendingButton pendingLabel="Cancelling…" variant="danger" size="sm">
                      Cancel job
                    </PendingButton>
                  </form>
                ) : null}
              </div>
            </FormSection>
            <CompleteJobForm jobId={job.id} action={completeServiceJob} />
          </div>
          <aside className="h-fit rounded-[1.25rem] border border-[#d7eadf] bg-[#f3faf6] p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-dash-rich">
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-dash-ink">Scheduling</h2>
                <p className="mt-2 text-sm leading-6 text-dash-muted">
                  This job was created from a scheduled request. Assign a technician here, then complete the job to write the service record.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-5 text-dash-ink">
              <li>Saving the assignment does not change the scheduled time.</li>
              <li>Completing the job updates trap due dates and creates report and manifest placeholders.</li>
              <li>Those placeholders are not official compliance forms.</li>
            </ul>
          </aside>
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
