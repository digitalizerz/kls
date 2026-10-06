"use server";

import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validators/contact";

export type ContactState = {
  error?: string;
  success?: string;
};

export async function submitContactInquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    facilityAddress: formData.get("facilityAddress"),
    capacityGallons: formData.get("capacityGallons"),
    serviceNeed: formData.get("serviceNeed"),
    message: formData.get("message"),
    switchingProvider: formData.get("switchingProvider") || undefined,
    previousProvider: formData.get("previousProvider"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { switchingProvider, previousProvider, message, facilityAddress, capacityGallons, ...inquiry } = parsed.data;
  const details = [
    message,
    facilityAddress ? `Facility address: ${facilityAddress.trim()}` : null,
    capacityGallons ? `Interceptor capacity: ${Number(capacityGallons).toLocaleString()} gallons` : null,
    switchingProvider === "yes" && previousProvider
      ? `Switching from another provider: ${previousProvider.trim()}`
      : null,
  ].filter(Boolean);

  await prisma.contactInquiry.create({
    data: { ...inquiry, message: details.join("\n\n") },
  });

  return {
    success: "Thanks. A KLS team member will follow up shortly.",
  };
}
