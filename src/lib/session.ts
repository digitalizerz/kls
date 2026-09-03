import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { isAdminRole } from "@/lib/authz";

export { isAdminRole };

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requirePortalContext() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "CUSTOMER" || !user.customerId) {
    if (isAdminRole(user.role)) redirect("/admin");
    if (user.role === "TECHNICIAN") redirect("/technician");
    redirect("/login");
  }

  const customer = await prisma.customer.findUnique({
    where: { id: user.customerId },
  });

  if (!customer || customer.status === "INACTIVE" || customer.status === "SUSPENDED") {
    await signOut({ redirectTo: "/login" });
    redirect("/login");
  }

  return { user, customer };
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!isAdminRole(user.role)) {
    if (user.role === "TECHNICIAN") redirect("/technician");
    redirect("/portal/dashboard");
  }

  return user;
}

export async function requireTechnician() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "TECHNICIAN") {
    if (isAdminRole(user.role)) redirect("/admin");
    redirect("/portal/dashboard");
  }

  return user;
}

export async function requireTechnicianContext() {
  const user = await requireTechnician();
  const technician = await prisma.technician.findUnique({
    where: { userId: user.id },
  });

  if (!technician || technician.status !== "ACTIVE") {
    await signOut({ redirectTo: "/login" });
    redirect("/login");
  }

  return { user, technician };
}
