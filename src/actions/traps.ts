"use server";

import type { CleaningFrequency } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextServiceFromFrequency } from "@/lib/format";
import { syncTrapReminders } from "@/lib/reminders";
import { requireAdmin, requirePortalContext } from "@/lib/session";
import { greaseTrapSchema } from "@/lib/validators/records";
import type { RecordActionState } from "@/actions/locations";

function trapPayload(formData: FormData) {
  return greaseTrapSchema.safeParse({
    nameOrIdentifier: formData.get("nameOrIdentifier"),
    capacityGallons: formData.get("capacityGallons"),
    onsiteLocationDescription: formData.get("onsiteLocationDescription"),
    cleaningFrequency: formData.get("cleaningFrequency"),
    customFrequencyDays: formData.get("customFrequencyDays"),
    lastCleanedAt: formData.get("lastCleanedAt"),
    notes: formData.get("notes"),
    status: formData.get("status") || undefined,
  });
}

function trapWriteData(parsed: {
  nameOrIdentifier: string;
  capacityGallons?: number;
  onsiteLocationDescription?: string;
  cleaningFrequency: CleaningFrequency;
  customFrequencyDays?: number;
  lastCleanedAt?: string;
  notes?: string;
  status?: "ACTIVE" | "INACTIVE";
}) {
  const lastCleanedAt = parsed.lastCleanedAt ? new Date(parsed.lastCleanedAt) : null;
  return {
    nameOrIdentifier: parsed.nameOrIdentifier,
    capacityGallons: parsed.capacityGallons,
    onsiteLocationDescription: parsed.onsiteLocationDescription,
    cleaningFrequency: parsed.cleaningFrequency,
    customFrequencyDays:
      parsed.cleaningFrequency === "CUSTOM" ? parsed.customFrequencyDays ?? null : null,
    lastCleanedAt,
    nextRecommendedServiceAt: lastCleanedAt
      ? nextServiceFromFrequency(
          lastCleanedAt,
          parsed.cleaningFrequency,
          parsed.customFrequencyDays,
        )
      : null,
    notes: parsed.notes,
    status: parsed.status ?? "ACTIVE",
  };
}

export async function createPortalTrap(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const { user, customer } = await requirePortalContext();
  const locationId = String(formData.get("locationId") ?? "");
  const parsed = trapPayload(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the grease trap details." };
  }

  const location = await prisma.location.findFirst({
    where: { id: locationId, customerId: customer.id },
  });
  if (!location) return { error: "Location not found." };

  const trap = await prisma.greaseTrap.create({
    data: { locationId, ...trapWriteData(parsed.data) },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "GREASE_TRAP_CREATED",
      entityType: "GreaseTrap",
      entityId: trap.id,
    },
  });

  await syncTrapReminders(trap.id);
  redirect(`/portal/locations/${locationId}`);
}

export async function updatePortalTrap(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const { user, customer } = await requirePortalContext();
  const trapId = String(formData.get("trapId") ?? "");
  const parsed = trapPayload(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the grease trap details." };
  }

  const trap = await prisma.greaseTrap.findFirst({
    where: { id: trapId, location: { customerId: customer.id } },
  });
  if (!trap) return { error: "Grease trap not found." };

  await prisma.greaseTrap.update({
    where: { id: trapId },
    data: trapWriteData(parsed.data),
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "GREASE_TRAP_UPDATED",
      entityType: "GreaseTrap",
      entityId: trapId,
    },
  });

  await syncTrapReminders(trapId);
  redirect(`/portal/locations/${trap.locationId}`);
}

export async function createAdminTrap(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const locationId = String(formData.get("locationId") ?? "");
  const parsed = trapPayload(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the grease trap details." };
  }

  const trap = await prisma.greaseTrap.create({
    data: { locationId, ...trapWriteData(parsed.data) },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "GREASE_TRAP_CREATED",
      entityType: "GreaseTrap",
      entityId: trap.id,
    },
  });

  await syncTrapReminders(trap.id);
  redirect(`/admin/locations/${locationId}`);
}

export async function updateAdminTrap(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const trapId = String(formData.get("trapId") ?? "");
  const parsed = trapPayload(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the grease trap details." };
  }

  const trap = await prisma.greaseTrap.update({
    where: { id: trapId },
    data: trapWriteData(parsed.data),
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "GREASE_TRAP_UPDATED",
      entityType: "GreaseTrap",
      entityId: trapId,
    },
  });

  await syncTrapReminders(trap.id);
  redirect(`/admin/locations/${trap.locationId}`);
}
