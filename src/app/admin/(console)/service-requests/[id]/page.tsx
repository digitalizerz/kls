import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { scheduleServiceRequest } from "@/actions/admin";
import { deleteServiceRequest } from "@/actions/delete";
import { DeleteButton } from "@/components/forms/delete-button";
import { FormSection } from "@/components/forms/admin-form";
import { PendingButton } from "@/components/forms/pending-button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock } from "lucide-react";
import { formatDate, formatServiceType } from "@/lib/format";

export default async function AdminServiceRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      customer: true,
      location: true,
      traps: { include: { greaseTrap: true } },
      job: true,
    },
  });
  if (!request) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Service request"
        title={request.customer.companyName}
        description={request.location.locationName}
        actions={
          <DeleteButton
            action={deleteServiceRequest}
            fields={{ id: request.id, returnTo: "/admin/service-requests" }}
            title="Delete this service request?"
            confirm="Delete this service request? A job already created from it stays on the schedule."
          />
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Request</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Status</dt>
              <dd>
                <StatusBadge status={request.status} />
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Type</dt>
              <dd>{formatServiceType(request.serviceType)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Preferred</dt>
              <dd>{formatDate(request.preferredDate)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Alternative</dt>
              <dd>{formatDate(request.alternativeDate)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm">{request.notes ?? "No customer notes."}</p>
          <p className="mt-4 text-sm text-muted">
            {request.contactName} · {request.contactPhone} · {request.contactEmail}
          </p>
          <ul className="mt-4 list-disc pl-5 text-sm">
            {request.traps.map((item) => (
              <li key={item.greaseTrapId}>{item.greaseTrap.nameOrIdentifier}</li>
            ))}
          </ul>
        </Card>
        <Card>
          {request.jobId ? (
            <p className="text-sm">
              This request is already scheduled as a job on {formatDate(request.job?.scheduledAt)}.
            </p>
          ) : (
            <form action={scheduleServiceRequest} className="dash-fields">
              <FormSection
                icon={<CalendarClock className="h-4 w-4" aria-hidden="true" />}
                title="Approve / schedule"
                description="Technician assignment can be added on the job later. Completing this creates a ServiceJob."
              >
                <input type="hidden" name="requestId" value={request.id} />
                <div className="grid gap-4">
                  <Field label="Actual service date & time" htmlFor="scheduledAt">
                    <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
                  </Field>
                  <Field label="Internal notes" htmlFor="internalNotes">
                    <Textarea id="internalNotes" name="internalNotes" />
                  </Field>
                </div>
                <div className="mt-5">
                  <PendingButton pendingLabel="Scheduling…">Schedule job</PendingButton>
                </div>
              </FormSection>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
