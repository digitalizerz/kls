"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { serviceRequestSchema } from "@/lib/validators/service-request";

export type ServiceRequestState = {
  error?: string;
};

export async function submitServiceRequest(
  _prev: ServiceRequestState,
  formData: FormData,
): Promise<ServiceRequestState> {
  const { user, customer } = await requirePortalContext();

  const trapIds = formData.getAll("trapIds").map(String).filter(Boolean);

  const parsed = serviceRequestSchema.safeParse({
    locationId: formData.get("locationId"),
    trapIds,
    serviceType: formData.get("serviceType"),
    preferredDate: formData.get("preferredDate"),
    alternativeDate: formData.get("alternativeDate") || undefined,
    notes: formData.get("notes") || undefined,
    contactName: formData.get("contactName"),
    contactPhone: formData.get("contactPhone"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the request form." };
  }

  const location = await prisma.location.findFirst({
    where: { id: parsed.data.locationId, customerId: customer.id },
    include: { greaseTraps: true },
  });

  if (!location) {
    return { error: "That location is not on your account." };
  }

  const allowedTrapIds = new Set(location.greaseTraps.map((trap) => trap.id));
  if (parsed.data.trapIds.some((id) => !allowedTrapIds.has(id))) {
    return { error: "One or more selected grease traps do not belong to that location." };
  }

  const request = await prisma.serviceRequest.create({
    data: {
      customerId: customer.id,
      locationId: location.id,
      serviceType: parsed.data.serviceType,
      preferredDate: new Date(parsed.data.preferredDate),
      alternativeDate: parsed.data.alternativeDate
        ? new Date(parsed.data.alternativeDate)
        : null,
      notes: parsed.data.notes,
      contactName: parsed.data.contactName,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
      traps: {
        create: parsed.data.trapIds.map((greaseTrapId) => ({ greaseTrapId })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "SERVICE_REQUEST_SUBMITTED",
      entityType: "ServiceRequest",
      entityId: request.id,
    },
  });

  redirect("/portal/history");
}
