import type { UserRole } from "@prisma/client";

const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export function isAdminRole(role: UserRole) {
  return ADMIN_ROLES.includes(role);
}

export function canAccessCustomer(role: UserRole, customerId: string, recordCustomerId: string) {
  if (isAdminRole(role)) return true;
  if (role === "CUSTOMER") return customerId === recordCustomerId;
  return false;
}

export function assertCustomerScope(role: UserRole, customerId: string | null, recordCustomerId: string) {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return;
  if (role === "CUSTOMER" && customerId && customerId === recordCustomerId) return;
  throw new Error("Not authorized to access this record.");
}
