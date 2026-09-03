import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/format";

const statusTone: Record<string, React.ComponentProps<typeof Badge>["tone"]> = {
  REQUESTED: "warn",
  SCHEDULED: "forest",
  IN_PROGRESS: "forest",
  COMPLETED: "ok",
  CANCELLED: "muted",
  ACTIVE: "ok",
  INACTIVE: "muted",
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
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone[status] ?? "default"}>{formatStatus(status)}</Badge>;
}
