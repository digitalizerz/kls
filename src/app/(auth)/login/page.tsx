import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Client portal sign in" };

export default function LoginPage() {
  return (
    <>
      <h1 className="font-serif text-2xl">Client portal</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Sign in to manage locations, request service, and download records.
      </p>
      <LoginForm audience="customer" />
    </>
  );
}
