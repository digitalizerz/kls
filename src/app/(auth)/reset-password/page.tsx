import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="font-serif text-2xl">Set a new password</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Password reset email delivery is not connected yet. Use a seed account in development, or ask a KLS administrator to update the password.
      </p>
      <Link href="/login" className="text-sm font-medium text-forest">
        Back to sign in
      </Link>
    </>
  );
}
