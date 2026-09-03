"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notifyJobCancelled } from "@/lib/reminders";
import { loadCompletableJob, markJobInProgress, writeJobCompletion } from "@/lib/service-jobs";
import { requireAdmin } from "@/lib/session";
import { completeJobSchema } from "@/lib/validators/records";
import type { RecordActionState } from "@/actions/locations";

export async function assignJobTechnician(formData: FormData) {
  const admin = await requireAdmin();
  const jobId = String(formData.get("jobId") ?? "");
  const technicianId = String(formData.get("technicianId") ?? "") || null;

  await prisma.serviceJob.update({
    where: { id: jobId },
    data: { technicianId },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SERVICE_JOB_ASSIGNED",
      entityType: "ServiceJob",
      entityId: jobId,
      metadata: { technicianId },
    },
  });

  redirect(`/admin/jobs/${jobId}`);
}

export async function startServiceJob(formData: FormData) {
  const admin = await requireAdmin();
  const jobId = String(formData.get("jobId") ?? "");

  const result = await markJobInProgress(admin.id, jobId);
  if ("error" in result) {
    redirect("/admin/jobs");
  }

  redirect(`/admin/jobs/${jobId}`);
}

export async function cancelServiceJob(formData: FormData) {
  const admin = await requireAdmin();
  const jobId = String(formData.get("jobId") ?? "");

  await prisma.serviceJob.update({
    where: { id: jobId },
    data: { status: "CANCELLED" },
  });
  await prisma.serviceRequest.updateMany({
    where: { jobId },
    data: { status: "CANCELLED" },
  });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SERVICE_JOB_CANCELLED",
      entityType: "ServiceJob",
      entityId: jobId,
    },
  });

  await notifyJobCancelled(jobId);
  redirect(`/admin/jobs/${jobId}`);
}

export async function completeServiceJob(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const jobId = String(formData.get("jobId") ?? "");
  const parsed = completeJobSchema.safeParse({
    gallonsRemoved: formData.get("gallonsRemoved"),
    wasteHauler: formData.get("wasteHauler"),
    wasteDestination: formData.get("wasteDestination"),
    discrepancies: formData.get("discrepancies"),
    technicianNotes: formData.get("technicianNotes"),
    customerSignatureName: formData.get("customerSignatureName"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the completion details." };
  }

  const job = await loadCompletableJob(jobId);
  if (!job) return { error: "Job not found." };

  const result = await writeJobCompletion(admin.id, job, parsed.data);
  if ("error" in result) return { error: result.error };

  redirect(`/admin/jobs/${jobId}`);
}
