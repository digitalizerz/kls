"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { onboardingSchema } from "@/lib/validators/onboarding";
import { nextServiceFromFrequency } from "@/lib/format";
import { buildStorageKey, getFileStorage } from "@/lib/storage";

export type OnboardingState = {
  error?: string;
};

export async function completeOnboarding(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const { user, customer } = await requirePortalContext();

  const parsed = onboardingSchema.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    billingAddressLine1: formData.get("billingAddressLine1"),
    billingAddressLine2: formData.get("billingAddressLine2") || undefined,
    billingCity: formData.get("billingCity"),
    billingState: formData.get("billingState"),
    billingZipCode: formData.get("billingZipCode"),
    locationName: formData.get("locationName"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    locationContactName: formData.get("locationContactName"),
    locationContactPhone: formData.get("locationContactPhone"),
    locationContactEmail: formData.get("locationContactEmail"),
    waterPurveyor: formData.get("waterPurveyor"),
    trapName: formData.get("trapName"),
    capacityGallons: formData.get("capacityGallons") || undefined,
    onsiteLocationDescription: formData.get("onsiteLocationDescription"),
    cleaningFrequency: formData.get("cleaningFrequency"),
    lastCleanedAt: formData.get("lastCleanedAt") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please complete the required fields." };
  }

  const lastCleanedAt = parsed.data.lastCleanedAt
    ? new Date(parsed.data.lastCleanedAt)
    : null;

  const location = await prisma.$transaction(async (tx) => {
    await tx.customer.update({
      where: { id: customer.id },
      data: {
        companyName: parsed.data.companyName,
        contactName: parsed.data.contactName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        billingAddressLine1: parsed.data.billingAddressLine1,
        billingAddressLine2: parsed.data.billingAddressLine2,
        billingCity: parsed.data.billingCity,
        billingState: parsed.data.billingState.toUpperCase(),
        billingZipCode: parsed.data.billingZipCode,
        status: "ACTIVE",
        onboardingCompletedAt: new Date(),
      },
    });

    const createdLocation = await tx.location.create({
      data: {
        customerId: customer.id,
        locationName: parsed.data.locationName,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2,
        city: parsed.data.city,
        state: parsed.data.state.toUpperCase(),
        zipCode: parsed.data.zipCode,
        contactName: parsed.data.locationContactName,
        contactPhone: parsed.data.locationContactPhone,
        contactEmail: parsed.data.locationContactEmail,
        waterPurveyor: parsed.data.waterPurveyor,
      },
    });

    await tx.greaseTrap.create({
      data: {
        locationId: createdLocation.id,
        nameOrIdentifier: parsed.data.trapName,
        capacityGallons: parsed.data.capacityGallons,
        onsiteLocationDescription: parsed.data.onsiteLocationDescription,
        cleaningFrequency: parsed.data.cleaningFrequency,
        lastCleanedAt,
        nextRecommendedServiceAt: lastCleanedAt
          ? nextServiceFromFrequency(lastCleanedAt, parsed.data.cleaningFrequency)
          : null,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: user.id,
        action: "CUSTOMER_ONBOARDING_COMPLETED",
        entityType: "Customer",
        entityId: customer.id,
      },
    });

    return createdLocation;
  });

  const files = formData.getAll("documents").filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length > 0) {
    const storage = getFileStorage();
    for (const file of files) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const key = buildStorageKey(["customers", customer.id, "onboarding", file.name]);
      await storage.put({ key, bytes, mimeType: file.type || "application/octet-stream" });
      await prisma.document.create({
        data: {
          customerId: customer.id,
          locationId: location.id,
          uploadedById: user.id,
          type: "OTHER",
          title: file.name,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          storageKey: key,
        },
      });
    }
  }

  redirect("/portal/dashboard");
}
