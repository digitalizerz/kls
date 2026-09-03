"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initial: ActionState = {};

export function LoginForm({ audience }: { audience: "customer" | "admin" }) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="audience" value={audience} />
      {state.error ? <Alert>{state.error}</Alert> : null}
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      {audience === "customer" ? (
        <p className="text-center text-sm text-muted">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-forest">
            Register
          </Link>
          {" · "}
          <Link href="/forgot-password" className="font-medium text-forest">
            Forgot password
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-muted">
          Staff access only. Customer accounts use the{" "}
          <Link href="/login" className="font-medium text-forest">
            client portal login
          </Link>
          .
        </p>
      )}
    </form>
  );
}
