import type { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      customerId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    customerId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    customerId?: string | null;
  }
}
