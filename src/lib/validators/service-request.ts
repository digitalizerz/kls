import { z } from "zod";

export const serviceRequestSchema = z.object({
  locationId: z.string().min(1, "Select a location."),
  trapIds: z.array(z.string()).min(1, "Select at least one grease trap."),
  serviceType: z.enum([
    "ROUTINE_CLEANING",
    "EMERGENCY_CLEANING",
    "INSPECTION",
    "REPAIR_COORDINATION",
    "OTHER",
  ]),
  preferredDate: z.string().min(1, "Choose a preferred date."),
  alternativeDate: z.string().optional(),
  notes: z.string().optional(),
  contactName: z.string().min(2),
  contactPhone: z.string().min(7),
  contactEmail: z.string().email(),
});
