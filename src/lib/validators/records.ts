import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
};

export const locationSchema = z.object({
  locationName: z.string().min(2, "Enter a location name."),
  addressLine1: z.string().min(3, "Enter a street address."),
  addressLine2: z.preprocess(emptyToUndefined, z.string().optional()),
  city: z.string().min(2, "Enter a city."),
  state: z.string().min(2).max(2, "Use a 2-letter state code."),
  zipCode: z.string().min(5, "Enter a ZIP code."),
  contactName: z.preprocess(emptyToUndefined, z.string().optional()),
  contactPhone: z.preprocess(emptyToUndefined, z.string().optional()),
  contactEmail: z.preprocess(emptyToUndefined, z.string().email("Enter a valid email.").optional()),
  waterPurveyor: z.preprocess(emptyToUndefined, z.string().optional()),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const greaseTrapSchema = z
  .object({
    nameOrIdentifier: z.string().min(2, "Enter a trap name or identifier."),
    capacityGallons: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().positive("Capacity must be a positive number.").optional(),
    ),
    onsiteLocationDescription: z.preprocess(emptyToUndefined, z.string().optional()),
    cleaningFrequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]),
    customFrequencyDays: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().positive().optional(),
    ),
    lastCleanedAt: z.preprocess(emptyToUndefined, z.string().optional()),
    notes: z.preprocess(emptyToUndefined, z.string().optional()),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  })
  .refine(
    (data) => data.cleaningFrequency !== "CUSTOM" || data.customFrequencyDays,
    { message: "Enter the number of days for a custom frequency.", path: ["customFrequencyDays"] },
  );

export const customerSchema = z.object({
  companyName: z.string().min(2, "Enter a company name."),
  contactName: z.string().min(2, "Enter a primary contact."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(7, "Enter a phone number."),
  billingAddressLine1: z.preprocess(emptyToUndefined, z.string().optional()),
  billingAddressLine2: z.preprocess(emptyToUndefined, z.string().optional()),
  billingCity: z.preprocess(emptyToUndefined, z.string().optional()),
  billingState: z.preprocess(emptyToUndefined, z.string().max(2).optional()),
  billingZipCode: z.preprocess(emptyToUndefined, z.string().optional()),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
  status: z.enum(["PENDING_ONBOARDING", "ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  portalUserName: z.preprocess(emptyToUndefined, z.string().optional()),
  portalUserEmail: z.preprocess(emptyToUndefined, z.string().email().optional()),
  portalPassword: z.preprocess(emptyToUndefined, z.string().min(8).optional()),
});

export const documentUploadSchema = z.object({
  title: z.preprocess(emptyToUndefined, z.string().optional()),
  type: z.enum([
    "COMPLIANCE_MANIFEST",
    "CLEANING_REPORT",
    "PREVIOUS_SERVICE_REPORT",
    "PHOTO",
    "OTHER",
  ]),
  locationId: z.preprocess(emptyToUndefined, z.string().optional()),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
  visibility: z.enum(["CUSTOMER_VISIBLE", "INTERNAL_ONLY"]).optional(),
});

export const completeJobSchema = z.object({
  gallonsRemoved: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().nonnegative().optional(),
  ),
  wasteHauler: z.preprocess(emptyToUndefined, z.string().optional()),
  wasteDestination: z.preprocess(emptyToUndefined, z.string().optional()),
  discrepancies: z.preprocess(emptyToUndefined, z.string().optional()),
  technicianNotes: z.preprocess(emptyToUndefined, z.string().optional()),
  customerSignatureName: z.preprocess(emptyToUndefined, z.string().optional()),
});
