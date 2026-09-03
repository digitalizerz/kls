"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, requirePortalContext } from "@/lib/session";

export async function markNotificationRead(formData: FormData) {
  const { user, customer } = await requirePortalContext();
  const id = String(formData.get("notificationId") ?? "");
  await prisma.notification.updateMany({
    where: {
      id,
      customerId: customer.id,
      OR: [{ userId: user.id }, { userId: null }],
    },
    data: { readAt: new Date() },
  });
  revalidatePath("/portal/reminders");
  revalidatePath("/portal/dashboard");
}

export async function markAllNotificationsRead() {
  const { user, customer } = await requirePortalContext();
  await prisma.notification.updateMany({
    where: {
      customerId: customer.id,
      readAt: null,
      status: { in: ["PENDING", "SENT"] },
      OR: [{ userId: user.id }, { userId: null }],
    },
    data: { readAt: new Date() },
  });
  revalidatePath("/portal/reminders");
  revalidatePath("/portal/dashboard");
}

export async function markAdminNotificationRead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("notificationId") ?? "");
  await prisma.notification.updateMany({
    where: { id },
    data: { readAt: new Date() },
  });
  revalidatePath("/admin/reminders");
  revalidatePath("/admin");
}
