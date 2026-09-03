"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { isAdminRole } from "@/lib/session";
import { loginSchema, registerSchema, forgotPasswordSchema } from "@/lib/validators/auth";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;
  const audience = String(formData.get("audience") ?? "customer");

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email },
      include: { customer: true },
    });
  } catch {
    return { error: "Cannot reach the database. Check DATABASE_URL on Vercel and redeploy." };
  }

  if (!user?.passwordHash || !user.isActive) {
    return { error: "Those credentials were not accepted." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Those credentials were not accepted." };
  }

  let redirectTo = "/portal/dashboard";
  if (audience === "admin") {
    if (!isAdminRole(user.role)) {
      return { error: "This login is for KLS staff only." };
    }
    redirectTo = "/admin";
  } else if (user.role === "TECHNICIAN") {
    redirectTo = "/technician";
  } else if (isAdminRole(user.role)) {
    redirectTo = "/admin";
  } else if (!user.customer || user.customer.status === "INACTIVE" || user.customer.status === "SUSPENDED") {
    return { error: "This account is not active. Contact KLS if you need access." };
  } else if (!user.customer.onboardingCompletedAt) {
    redirectTo = "/onboarding";
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Those credentials were not accepted." };
    }
    throw error;
  }

  redirect(redirectTo);
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const customer = await prisma.customer.create({
    data: {
      companyName: `${parsed.data.name} (pending)`,
      contactName: parsed.data.name,
      email,
      phone: parsed.data.phone,
      status: "PENDING_ONBOARDING",
    },
  });

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone,
      passwordHash,
      role: "CUSTOMER",
      customerId: customer.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "CUSTOMER_REGISTERED",
      entityType: "Customer",
      entityId: customer.id,
      metadata: { email },
    },
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/onboarding",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created. Please sign in to continue." };
    }
    throw error;
  }

  redirect("/onboarding");
}

export async function logoutAction() {
  const session = await auth();
  const isAdmin = session?.user ? isAdminRole(session.user.role) : false;
  await signOut({ redirectTo: isAdmin ? "/admin/login" : "/login" });
}

export async function forgotPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  // Always succeed so we do not reveal whether an account exists.
  // Email delivery will be wired when a provider is selected.
  return {
    success: "If an account exists for that email, password reset instructions will be sent.",
  };
}
