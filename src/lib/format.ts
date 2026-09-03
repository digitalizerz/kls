import type { CleaningFrequency } from "@prisma/client";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value?: Date | string | null) {
  if (!value) return "—";
  return dateTimeFormatter.format(new Date(value));
}

export function formatAddress(parts: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}) {
  return [
    parts.addressLine1,
    parts.addressLine2,
    [parts.city, parts.state].filter(Boolean).join(", "),
    parts.zipCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function mapsUrl(parts: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}) {
  const query = formatAddress(parts);
  if (!query) return null;
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

export function formatFrequency(frequency: CleaningFrequency, customDays?: number | null) {
  switch (frequency) {
    case "MONTHLY":
      return "Monthly";
    case "QUARTERLY":
      return "Quarterly";
    case "YEARLY":
      return "Yearly";
    case "CUSTOM":
      return customDays ? `Every ${customDays} days` : "Custom";
  }
}

export function nextServiceFromFrequency(
  from: Date,
  frequency: CleaningFrequency,
  customDays?: number | null,
) {
  const next = new Date(from);
  switch (frequency) {
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "QUARTERLY":
      next.setMonth(next.getMonth() + 3);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
    case "CUSTOM":
      next.setDate(next.getDate() + (customDays ?? 30));
      break;
  }
  return next;
}

export function daysUntil(value?: Date | string | null) {
  if (!value) return null;
  const target = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function formatServiceType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function toDateInput(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toDateTimeInput(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
