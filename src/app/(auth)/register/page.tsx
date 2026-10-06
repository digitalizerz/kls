import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-[-0.03em]">Create a customer account</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        For commercial and institutional facilities with kitchen operations. KLS staff accounts are issued separately.
      </p>
      <RegisterForm />
    </>
  );
}
