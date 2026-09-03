"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { notifyJobScheduled } from "@/lib/reminders";

export async function scheduleServiceRequest(formData: FormData) {
  const admin = await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const scheduledAt = String(formData.get("scheduledAt") ?? "");
  const internalNotes = String(formData.get("internalNotes") ?? "") || null;

  if (!requestId || !scheduledAt) {
    redirect("/admin/service-requests");
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { traps: true },
  });

  if (!request || request.jobId) {
    redirect("/admin/service-requests");
  }

  const job = await prisma.$transaction(async (tx) => {
    const job = await tx.serviceJob.create({
      data: {
        customerId: request.customerId,
        locationId: request.locationId,
        serviceType: request.serviceType,
        status: "SCHEDULED",
        scheduledAt: new Date(scheduledAt),
        customerNotes: request.notes,
        internalNotes,
        traps: {
          create: request.traps.map((trap) => ({ greaseTrapId: trap.greaseTrapId })),
        },
      },
    });

    await tx.serviceRequest.update({
      where: { id: request.id },
      data: { status: "SCHEDULED", jobId: job.id, internalNotes },
    });

    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "SERVICE_JOB_SCHEDULED",
        entityType: "ServiceJob",
        entityId: job.id,
        metadata: { requestId: request.id },
      },
    });

    return job;
  });

  await notifyJobScheduled(job.id);
  redirect("/admin/jobs");
}

export async function deactivateCustomer(formData: FormData) {
  const admin = await requireAdmin();
  const customerId = String(formData.get("customerId") ?? "");
  if (!customerId) return;

  await prisma.customer.update({
    where: { id: customerId },
    data: { status: "INACTIVE" },
  });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "CUSTOMER_DEACTIVATED",
      entityType: "Customer",
      entityId: customerId,
    },
  });
  redirect(`/admin/customers/${customerId}`);
}
