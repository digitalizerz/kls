"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, requirePortalContext } from "@/lib/session";
import { locationSchema } from "@/lib/validators/records";

export type RecordActionState = {
  error?: string;
};

function locationData(formData: FormData) {
  return locationSchema.safeParse({
    locationName: formData.get("locationName"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    contactName: formData.get("contactName"),
    contactPhone: formData.get("contactPhone"),
    contactEmail: formData.get("contactEmail"),
    waterPurveyor: formData.get("waterPurveyor"),
    notes: formData.get("notes"),
    status: formData.get("status") || undefined,
  });
}

export async function createPortalLocation(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const { user, customer } = await requirePortalContext();
  const parsed = locationData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the location details." };
  }

  const location = await prisma.location.create({
    data: {
      customerId: customer.id,
      locationName: parsed.data.locationName,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2,
      city: parsed.data.city,
      state: parsed.data.state.toUpperCase(),
      zipCode: parsed.data.zipCode,
      contactName: parsed.data.contactName,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
      waterPurveyor: parsed.data.waterPurveyor,
      notes: parsed.data.notes,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "LOCATION_CREATED",
      entityType: "Location",
      entityId: location.id,
    },
  });

  redirect(`/portal/locations/${location.id}`);
}

export async function updatePortalLocation(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const { user, customer } = await requirePortalContext();
  const locationId = String(formData.get("locationId") ?? "");
  const parsed = locationData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the location details." };
  }

  const existing = await prisma.location.findFirst({
    where: { id: locationId, customerId: customer.id },
  });
  if (!existing) return { error: "Location not found." };

  await prisma.location.update({
    where: { id: locationId },
    data: {
      locationName: parsed.data.locationName,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2,
      city: parsed.data.city,
      state: parsed.data.state.toUpperCase(),
      zipCode: parsed.data.zipCode,
      contactName: parsed.data.contactName,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
      waterPurveyor: parsed.data.waterPurveyor,
      notes: parsed.data.notes,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "LOCATION_UPDATED",
      entityType: "Location",
      entityId: locationId,
    },
  });

  redirect(`/portal/locations/${locationId}`);
}

export async function createAdminLocation(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const customerId = String(formData.get("customerId") ?? "");
  const parsed = locationData(formData);
  if (!customerId) return { error: "Customer is required." };
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the location details." };
  }

  const location = await prisma.location.create({
    data: {
      customerId,
      locationName: parsed.data.locationName,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2,
      city: parsed.data.city,
      state: parsed.data.state.toUpperCase(),
      zipCode: parsed.data.zipCode,
      contactName: parsed.data.contactName,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
      waterPurveyor: parsed.data.waterPurveyor,
      notes: parsed.data.notes,
      status: parsed.data.status ?? "ACTIVE",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "LOCATION_CREATED",
      entityType: "Location",
      entityId: location.id,
    },
  });

  redirect(`/admin/locations/${location.id}`);
}

export async function updateAdminLocation(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const locationId = String(formData.get("locationId") ?? "");
  const parsed = locationData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the location details." };
  }

  await prisma.location.update({
    where: { id: locationId },
    data: {
      locationName: parsed.data.locationName,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2,
      city: parsed.data.city,
      state: parsed.data.state.toUpperCase(),
      zipCode: parsed.data.zipCode,
      contactName: parsed.data.contactName,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
      waterPurveyor: parsed.data.waterPurveyor,
      notes: parsed.data.notes,
      status: parsed.data.status ?? "ACTIVE",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "LOCATION_UPDATED",
      entityType: "Location",
      entityId: locationId,
    },
  });

  redirect(`/admin/locations/${locationId}`);
}
