import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { syncCustomerReminders } from "@/lib/reminders";
import { MarkAllReadButton, ReminderList } from "@/components/reminders/reminder-list";
import { PageHeader } from "@/components/ui/page-header";

export default async function PortalRemindersPage() {
  const { user, customer } = await requirePortalContext();
  await syncCustomerReminders(customer.id);

  const reminders = await prisma.notification.findMany({
    where: {
      customerId: customer.id,
      channel: "IN_APP",
      status: { in: ["PENDING", "SENT"] },
      OR: [{ userId: user.id }, { userId: null }],
    },
    orderBy: [{ readAt: "asc" }, { createdAt: "desc" }],
  });

  const unread = reminders.filter((item) => !item.readAt).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reminders"
        description="Cleaning due dates follow each trap’s frequency. Upcoming notices go out 7 days before monthly service, 14 before quarterly, and 30 before yearly. Email delivery can be added later."
        actions={unread > 0 ? <MarkAllReadButton /> : undefined}
      />
      <ReminderList reminders={reminders} empty="No reminders right now. Due dates will appear here as they approach." />
    </div>
  );
}
