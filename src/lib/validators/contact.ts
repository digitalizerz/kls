import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  companyName: z.string().min(2, "Enter your business name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a phone number."),
  city: z.string().optional(),
  serviceNeed: z.string().optional(),
  message: z.string().min(10, "Tell us a little about what you need."),
});
