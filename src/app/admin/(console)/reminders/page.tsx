import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { syncAllReminders } from "@/lib/reminders";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function AdminRemindersPage() {
  await requireAdmin();
  await syncAllReminders();

  const reminders = await prisma.notification.findMany({
    where: {
      channel: "IN_APP",
      status: { in: ["PENDING", "SENT"] },
    },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reminder schedule"
        description="In-app notices created from trap due dates, scheduled jobs, and completed service. Email is not sent yet."
      />
      <Table>
        <thead>
          <tr>
            <Th>Customer</Th>
            <Th>Type</Th>
            <Th>Title</Th>
            <Th>Due / scheduled</Th>
            <Th>Read</Th>
          </tr>
        </thead>
        <tbody>
          {reminders.length === 0 ? (
            <tr>
              <Td colSpan={5} className="py-8 text-center text-muted">
                No reminder notices have been generated yet.
              </Td>
            </tr>
          ) : (
            reminders.map((reminder) => (
              <tr key={reminder.id}>
                <Td className="font-medium">{reminder.customer?.companyName ?? "—"}</Td>
                <Td>
                  <StatusBadge status={reminder.type} />
                </Td>
                <Td>{reminder.title}</Td>
                <Td>{formatDate(reminder.scheduledFor ?? reminder.sentAt)}</Td>
                <Td>{reminder.readAt ? formatDate(reminder.readAt) : "Unread"}</Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
