import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatAddress, formatDateTime, formatServiceType } from "@/lib/format";

type JobCardJob = {
  id: string;
  status: string;
  scheduledAt: Date;
  serviceType: string;
  customer: { companyName: string };
  location: {
    locationName: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
  };
};

export function TechnicianJobCard({ job }: { job: JobCardJob }) {
  return (
    <Link href={`/technician/jobs/${job.id}`} className="block">
      <Card className="transition-colors hover:border-forest/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">{job.customer.companyName}</p>
            <p className="mt-1 text-sm">{job.location.locationName}</p>
            <p className="mt-1 text-sm text-muted">{formatAddress(job.location)}</p>
            <p className="mt-2 text-xs text-muted">
              {formatDateTime(job.scheduledAt)} · {formatServiceType(job.serviceType)}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </Card>
    </Link>
  );
}
