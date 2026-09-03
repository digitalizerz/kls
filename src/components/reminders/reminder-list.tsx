import Link from "next/link";
import { markAdminNotificationRead, markAllNotificationsRead, markNotificationRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { reminderHref } from "@/lib/reminders";

type Reminder = {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: Date | null;
  sentAt: Date | null;
  scheduledFor: Date | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
};

export function ReminderList({
  reminders,
  empty,
  forAdmin = false,
}: {
  reminders: Reminder[];
  empty: string;
  forAdmin?: boolean;
}) {
  if (reminders.length === 0) {
    return <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-muted">{empty}</p>;
  }

  return (
    <ul className="divide-y divide-line border border-line bg-panel">
      {reminders.map((reminder) => (
        <li key={reminder.id} className={`px-4 py-4 ${reminder.readAt ? "opacity-70" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{reminder.title}</p>
              <p className="mt-1 text-sm text-muted">{reminder.body}</p>
              <p className="mt-2 text-xs text-muted">{formatDate(reminder.sentAt ?? reminder.scheduledFor)}</p>
            </div>
            <StatusBadge status={reminder.type} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href={reminderHref(reminder.relatedEntityType, reminder.relatedEntityId, forAdmin)}
              className="text-sm text-forest"
            >
              Open
            </Link>
            {reminder.readAt ? null : (
              <form action={forAdmin ? markAdminNotificationRead : markNotificationRead}>
                <input type="hidden" name="notificationId" value={reminder.id} />
                <button type="submit" className="text-sm text-muted hover:text-ink">
                  Mark read
                </button>
              </form>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MarkAllReadButton() {
  return (
    <form action={markAllNotificationsRead}>
      <Button type="submit" variant="secondary" size="sm">
        Mark all read
      </Button>
    </form>
  );
}
