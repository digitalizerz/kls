import { Badge, badgeDot } from "@/components/ui/badge";
import { formatStatus } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusTone: Record<string, React.ComponentProps<typeof Badge>["tone"]> = {
  REQUESTED: "warn",
  SCHEDULED: "forest",
  IN_PROGRESS: "info",
  COMPLETED: "ok",
  CANCELLED: "muted",
  ACTIVE: "ok",
  INACTIVE: "muted",
  ADMIN: "forest",
  SUPER_ADMIN: "ok",
  SUSPENDED: "danger",
  PENDING_ONBOARDING: "warn",
  DRAFT: "muted",
  READY: "forest",
  ISSUED: "ok",
  READY_FOR_GENERATION: "warn",
  SIGNED: "ok",
  OVERDUE: "danger",
  DUE_SOON: "warn",
  UPCOMING_SERVICE: "warn",
  OVERDUE_SERVICE: "danger",
  SCHEDULED_SERVICE: "forest",
  SERVICE_COMPLETED: "ok",
  DOCUMENT_AVAILABLE: "forest",
  GENERAL: "muted",
  UNREAD: "info",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone[status] ?? "default";
  return (
    <Badge tone={tone}>
      <span className={cn("h-1.5 w-1.5 rounded-full", badgeDot[tone])} aria-hidden="true" />
      {formatStatus(status)}
    </Badge>
  );
}
