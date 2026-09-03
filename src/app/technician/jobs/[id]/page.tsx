import { notFound } from "next/navigation";
import { completeTechnicianJob, startTechnicianJob } from "@/actions/technician";
import { CompleteJobForm } from "@/components/forms/complete-job-form";
import { TechnicianPhotoUploadForm } from "@/components/technician/photo-upload-form";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db";
import {
  formatAddress,
  formatDate,
  formatDateTime,
  formatFrequency,
  formatServiceType,
  mapsUrl,
} from "@/lib/format";
import { requireTechnicianContext } from "@/lib/session";

export default async function TechnicianJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { technician } = await requireTechnicianContext();
  const { id } = await params;
  const job = await prisma.serviceJob.findFirst({
    where: { id, technicianId: technician.id },
    include: {
      customer: true,
      location: true,
      traps: { include: { greaseTrap: true } },
      serviceRecord: true,
      documents: { where: { type: "PHOTO" }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!job) notFound();

  const canStart = job.status === "SCHEDULED";
  const canComplete = job.status === "SCHEDULED" || job.status === "IN_PROGRESS";
  const directions = mapsUrl(job.location);
  const phone = job.location.contactPhone ?? job.customer.phone;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatServiceType(job.serviceType)}
        title={job.customer.companyName}
        description={job.location.locationName}
        actions={<StatusBadge status={job.status} />}
      />

      <Card>
        <p className="text-sm font-medium">{formatAddress(job.location)}</p>
        <p className="mt-2 text-sm text-muted">{formatDateTime(job.scheduledAt)}</p>
        {job.location.contactName ? (
          <p className="mt-2 text-sm text-muted">
            Site contact: {job.location.contactName}
            {job.location.contactPhone ? ` · ${job.location.contactPhone}` : ""}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {directions ? (
            <a
              href={directions}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center border border-forest/25 px-3 text-sm font-medium text-forest hover:border-forest hover:bg-forest/5"
            >
              Directions
            </a>
          ) : null}
          {phone ? (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex h-9 items-center justify-center border border-forest/25 px-3 text-sm font-medium text-forest hover:border-forest hover:bg-forest/5"
            >
              Call site
            </a>
          ) : null}
          {canStart ? (
            <form action={startTechnicianJob}>
              <input type="hidden" name="jobId" value={job.id} />
              <Button type="submit" size="sm">
                Start job
              </Button>
            </form>
          ) : null}
        </div>
      </Card>

      <Card>
        <CardTitle>Grease traps</CardTitle>
        <ul className="mt-3 divide-y divide-line">
          {job.traps.map((item) => (
            <li key={item.greaseTrapId} className="py-3">
              <p className="text-sm font-medium">{item.greaseTrap.nameOrIdentifier}</p>
              <p className="text-xs text-muted">
                {item.greaseTrap.onsiteLocationDescription ?? "No on-site notes"}
                {item.greaseTrap.capacityGallons ? ` · ${item.greaseTrap.capacityGallons} gal` : ""}
                {` · ${formatFrequency(item.greaseTrap.cleaningFrequency, item.greaseTrap.customFrequencyDays)}`}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      {job.customerNotes ? (
        <Card>
          <CardTitle>Customer notes</CardTitle>
          <p className="mt-2 text-sm">{job.customerNotes}</p>
        </Card>
      ) : null}

      {job.internalNotes ? (
        <Card>
          <CardTitle>Dispatch notes</CardTitle>
          <p className="mt-2 text-sm">{job.internalNotes}</p>
        </Card>
      ) : null}

      {job.status !== "CANCELLED" ? (
        <Card>
          <CardTitle>Field photos</CardTitle>
          <p className="mt-2 mb-4 text-sm text-muted">
            Photos attach to this job and are visible to the customer. Official reports stay as placeholders.
          </p>
          <TechnicianPhotoUploadForm jobId={job.id} />
          {job.documents.length > 0 ? (
            <ul className="mt-4 divide-y divide-line">
              {job.documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted">{formatDate(doc.createdAt)}</p>
                  </div>
                  <a href={`/api/documents/${doc.id}`} className="text-sm text-forest">
                    Download
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ) : null}

      {canComplete ? (
        <Card>
          <CardTitle>Complete service</CardTitle>
          <p className="mt-2 mb-4 text-sm text-muted">
            Writes the service record and updates trap due dates. This does not generate an official state manifest.
          </p>
          <CompleteJobForm
            jobId={job.id}
            action={completeTechnicianJob}
            requireSignature
            submitLabel="Complete job"
          />
        </Card>
      ) : job.serviceRecord ? (
        <Card>
          <CardTitle>Service record</CardTitle>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Completed</dt>
              <dd>{formatDateTime(job.serviceRecord.completedAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">Gallons removed</dt>
              <dd>{job.serviceRecord.gallonsRemoved ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Customer signature</dt>
              <dd>{job.serviceRecord.customerSignatureName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Waste destination</dt>
              <dd>{job.serviceRecord.wasteDestination ?? "—"}</dd>
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
