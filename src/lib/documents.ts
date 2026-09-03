import { prisma } from "@/lib/db";
import { isAdminRole } from "@/lib/authz";
import { getCurrentUser } from "@/lib/session";

export async function getAuthorizedDocument(documentId: string) {
  const user = await getCurrentUser();
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!document) return null;

  if (user && isAdminRole(user.role)) return document;

  if (user?.role === "CUSTOMER" && user.customerId === document.customerId) {
    return document.visibility === "CUSTOMER_VISIBLE" ? document : null;
  }

  if (user?.role === "TECHNICIAN") {
    const technician = await prisma.technician.findUnique({
      where: { userId: user.id },
    });
    if (!technician || technician.status !== "ACTIVE") return null;

    if (document.serviceJobId) {
      const job = await prisma.serviceJob.findUnique({
        where: { id: document.serviceJobId },
        select: { technicianId: true },
      });
      if (job?.technicianId === technician.id) return document;
    }
  }

  return null;
}
