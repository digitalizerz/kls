import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { scheduleServiceRequest } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
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
            <form action={scheduleServiceRequest} className="space-y-4">
              <input type="hidden" name="requestId" value={request.id} />
              <p className="text-sm font-medium">Approve / schedule</p>
              <Field label="Actual service date & time" htmlFor="scheduledAt">
                <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
              </Field>
              <Field label="Internal notes" htmlFor="internalNotes">
                <Textarea id="internalNotes" name="internalNotes" />
              </Field>
              <p className="text-xs text-muted">
                Technician assignment can be added on the job later. Completing this creates a ServiceJob.
              </p>
              <Button type="submit" variant="clay">
                Schedule job
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
