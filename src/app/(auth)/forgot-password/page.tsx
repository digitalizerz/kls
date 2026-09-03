"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ActionState } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initial: ActionState = {};

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);

  return (
    <>
      <h1 className="font-serif text-2xl">Reset password</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Enter the email on the account. We will send reset instructions once email delivery is connected.
      </p>
      <form action={action} className="space-y-4">
        {state.error ? <Alert>{state.error}</Alert> : null}
        {state.success ? <Alert tone="success">{state.success}</Alert> : null}
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required />
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Submitting…" : "Send reset instructions"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="font-medium text-forest">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
