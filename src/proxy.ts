import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/authz";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const user = session?.user;

  const isPortal = pathname.startsWith("/portal") || pathname.startsWith("/onboarding");
  const isTechnician = pathname.startsWith("/technician");
  const isAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/admin/login";

  if (isPortal && !user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (isAdmin && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdmin && user && !isAdminRole(user.role)) {
    if (user.role === "TECHNICIAN") {
      return NextResponse.redirect(new URL("/technician", request.url));
    }
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  if (isTechnician && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isTechnician && user && user.role !== "TECHNICIAN") {
    if (isAdminRole(user.role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  if ((isPortal || isAdmin) && user?.role === "TECHNICIAN") {
    return NextResponse.redirect(new URL("/technician", request.url));
  }

  if (isPortal && user && isAdminRole(user.role)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAuthPage && user) {
    if (isAdminRole(user.role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (user.role === "TECHNICIAN") {
      return NextResponse.redirect(new URL("/technician", request.url));
    }
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/portal",
    "/portal/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/technician",
    "/technician/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
