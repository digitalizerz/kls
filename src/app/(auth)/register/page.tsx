import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="font-serif text-2xl">Create a customer account</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        For restaurant groups, hotels, and other commercial kitchens. KLS staff accounts are issued separately.
      </p>
      <RegisterForm />
    </>
  );
}
