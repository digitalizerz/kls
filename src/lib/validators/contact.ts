import { z } from "zod";
import { isStandardCapacity } from "@/lib/capacity";

const emptyToUndefined = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
};

export const contactSchema = z
  .object({
    name: z.string().min(2, "Enter your name."),
    companyName: z.string().min(2, "Enter your business name."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().min(7, "Enter a phone number."),
    city: z.string().min(2, "Enter a city."),
    facilityAddress: z.preprocess(emptyToUndefined, z.string().optional()),
    capacityGallons: z.preprocess(emptyToUndefined, z.string().optional()),
    serviceNeed: z.string().min(2, "Choose a service."),
    message: z.string().min(10, "Tell us a little about what you need."),
    switchingProvider: z.preprocess(emptyToUndefined, z.literal("yes").optional()),
    previousProvider: z.preprocess(emptyToUndefined, z.string().optional()),
  })
  .superRefine((data, ctx) => {
    if (data.capacityGallons && !isStandardCapacity(Number(data.capacityGallons))) {
      ctx.addIssue({
        code: "custom",
        message: "Choose an interceptor capacity.",
        path: ["capacityGallons"],
      });
    }
    if (data.switchingProvider === "yes" && (!data.previousProvider || data.previousProvider.trim().length < 2)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the previous service provider.",
        path: ["previousProvider"],
      });
    }
  });
