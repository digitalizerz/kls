"use server";

import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { isAdminRole } from "@/lib/authz";
import { getCurrentUser } from "@/lib/session";

export type SearchHit = {
  href: string;
  label: string;
  detail: string;
  kind: "Customer" | "Location" | "Grease trap" | "Job";
};

export async function searchOperations(query: string): Promise<SearchHit[]> {
  const q = query.trim().slice(0, 80);
  if (q.length < 2) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  if (isAdminRole(user.role)) return searchAdmin(q);
  if (user.role === "TECHNICIAN") return searchTechnician(user.id, q);
  if (user.role === "CUSTOMER" && user.customerId) return searchPortal(user.customerId, q);
  return [];
}

async function searchAdmin(q: string): Promise<SearchHit[]> {
  const [customers, locations, traps] = await Promise.all([
    prisma.customer.findMany({
      where: {
        OR: [
          { companyName: { contains: q, mode: "insensitive" } },
          { contactName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, companyName: true, contactName: true },
      orderBy: { companyName: "asc" },
      take: 3,
    }),
    prisma.location.findMany({
      where: {
        OR: [
          { locationName: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { customer: { companyName: { contains: q, mode: "insensitive" } } },
        ],
      },
      select: { id: true, locationName: true, city: true, customer: { select: { companyName: true } } },
      orderBy: { locationName: "asc" },
      take: 3,
    }),
    prisma.greaseTrap.findMany({
      where: {
        OR: [
          { nameOrIdentifier: { contains: q, mode: "insensitive" } },
          { location: { locationName: { contains: q, mode: "insensitive" } } },
          { location: { customer: { companyName: { contains: q, mode: "insensitive" } } } },
        ],
      },
      select: {
        id: true,
        nameOrIdentifier: true,
        location: { select: { id: true, locationName: true, customer: { select: { companyName: true } } } },
      },
      orderBy: { nameOrIdentifier: "asc" },
      take: 3,
    }),
  ]);

  return [
    ...customers.map((customer) => ({
      href: `/admin/customers/${customer.id}`,
      label: customer.companyName,
      detail: customer.contactName,
      kind: "Customer" as const,
    })),
    ...locations.map((location) => ({
      href: `/admin/locations/${location.id}`,
      label: location.locationName,
      detail: `${location.customer.companyName} · ${location.city}`,
      kind: "Location" as const,
    })),
    ...traps.map((trap) => ({
      href: `/admin/locations/${trap.location.id}/traps/${trap.id}/edit`,
      label: trap.nameOrIdentifier,
      detail: `${trap.location.customer.companyName} · ${trap.location.locationName}`,
      kind: "Grease trap" as const,
    })),
  ];
}

async function searchPortal(customerId: string, q: string): Promise<SearchHit[]> {
  const [locations, traps] = await Promise.all([
    prisma.location.findMany({
      where: {
        customerId,
        OR: [
          { locationName: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, locationName: true, city: true },
      orderBy: { locationName: "asc" },
      take: 5,
    }),
    prisma.greaseTrap.findMany({
      where: {
        location: { customerId },
        OR: [
          { nameOrIdentifier: { contains: q, mode: "insensitive" } },
          { location: { locationName: { contains: q, mode: "insensitive" } } },
        ],
      },
      select: {
        id: true,
        nameOrIdentifier: true,
        location: { select: { id: true, locationName: true } },
      },
      orderBy: { nameOrIdentifier: "asc" },
      take: 5,
    }),
  ]);

  return [
    ...locations.map((location) => ({
      href: `/portal/locations/${location.id}`,
      label: location.locationName,
      detail: location.city,
      kind: "Location" as const,
    })),
    ...traps.map((trap) => ({
      href: `/portal/locations/${trap.location.id}/traps/${trap.id}/edit`,
      label: trap.nameOrIdentifier,
      detail: trap.location.locationName,
      kind: "Grease trap" as const,
    })),
  ].slice(0, 8);
}

async function searchTechnician(userId: string, q: string): Promise<SearchHit[]> {
  const jobs = await prisma.serviceJob.findMany({
    where: {
      technician: { userId, status: "ACTIVE" },
      OR: [
        { customer: { companyName: { contains: q, mode: "insensitive" } } },
        { location: { locationName: { contains: q, mode: "insensitive" } } },
      ],
    },
    select: {
      id: true,
      scheduledAt: true,
      customer: { select: { companyName: true } },
      location: { select: { locationName: true } },
    },
    orderBy: { scheduledAt: "desc" },
    take: 8,
  });

  return jobs.map((job) => ({
    href: `/technician/jobs/${job.id}`,
    label: job.customer.companyName,
    detail: `${job.location.locationName} · ${formatDateTime(job.scheduledAt)}`,
    kind: "Job" as const,
  }));
}
