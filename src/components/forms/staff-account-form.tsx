"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { HardHat, KeyRound, ShieldCheck } from "lucide-react";
import type { RecordActionState } from "@/actions/locations";
import { AdminFormFrame, FormActions, FormSection } from "@/components/forms/admin-form";
import { UnsavedChanges } from "@/components/forms/unsaved-changes";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initial: RecordActionState = {};

export function StaffAccountForm({
  kind,
  action,
  account,
}: {
  kind: "technician" | "admin";
  action: (prev: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  account?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    employeeId: string;
    status: "ACTIVE" | "INACTIVE";
    notes: string;
    roleLabel: string;
  };
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [dirty, setDirty] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const technician = kind === "technician";
  const editing = Boolean(account);

  useEffect(() => {
    if (state.error) alertRef.current?.focus();
  }, [state.error]);

  return (
    <form action={formAction} className="dash-fields" onInput={() => setDirty(true)} onSubmit={() => setDirty(false)}>
      <UnsavedChanges dirty={dirty && !pending} />
      {account ? <input type="hidden" name="id" value={account.id} /> : null}
      <AdminFormFrame
        breadcrumbs={[
          { href: technician ? "/admin/technicians" : "/admin/admins", label: technician ? "Technicians" : "Admins" },
          { label: editing ? (technician ? "Edit technician" : "Edit admin") : technician ? "Add technician" : "Add admin" },
        ]}
        icon={technician ? <HardHat className="h-5 w-5" aria-hidden="true" /> : <ShieldCheck className="h-5 w-5" aria-hidden="true" />}
        title={editing ? (technician ? "Edit technician" : "Edit admin") : technician ? "Add technician" : "Add admin"}
        description={
          editing
            ? technician
              ? "Update this field login. A blank password keeps the current one."
              : "Update this operations login. A blank password keeps the current one."
            : technician
              ? "Create a field login. The technician signs in and sees jobs assigned to them."
              : "Create an operations login. This person can manage customers, jobs, documents, and technicians."
        }
        guidance={
          technician
            ? {
                title: "Technician access",
                body: editing
                  ? "The email is the technician portal login. Leave the password blank unless it should change."
                  : "The email and temporary password are the technician portal login. Assign jobs after the account exists.",
                points: [
                  "The technician signs in with this email.",
                  "Assigned jobs appear in the technician portal.",
                  "An inactive technician cannot sign in.",
                ],
              }
            : {
                title: "Admin access",
                body: editing
                  ? "Only a super admin can change an admin account. The role stays the same."
                  : "Only a super admin can add another admin. The new account is an admin, not a super admin.",
                points: editing
                  ? [
                      "The email is the operations sign-in address.",
                      "A new password replaces the current one.",
                      "A blank password leaves the current password in place.",
                    ]
                  : [
                      "The admin signs in at the operations login.",
                      "They can add technicians and run day-to-day work.",
                      "They cannot add or remove other admins.",
                    ],
              }
        }
      >
        {state.error ? (
          <div ref={alertRef} tabIndex={-1}>
            <Alert>{state.error}</Alert>
          </div>
        ) : null}
        <FormSection
          icon={technician ? <HardHat className="h-4 w-4" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
          title="Account"
          description={technician ? "Name and contact for this field technician." : "Name and contact for this admin."}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="name">
              <Input id="name" name="name" required autoComplete="name" placeholder="Full name" defaultValue={account?.name ?? ""} />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="name@example.com" defaultValue={account?.email ?? ""} />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Optional" defaultValue={account?.phone ?? ""} />
            </Field>
            {technician ? (
              <Field label="Employee ID" htmlFor="employeeId">
                <Input id="employeeId" name="employeeId" placeholder="Optional" defaultValue={account?.employeeId ?? ""} />
              </Field>
            ) : (
              <Field label="Role" htmlFor="admin-role">
                <Input id="admin-role" defaultValue={account?.roleLabel ?? "Admin"} disabled />
              </Field>
            )}
          </div>
        </FormSection>
        {technician ? (
          <FormSection
            icon={<HardHat className="h-4 w-4" aria-hidden="true" />}
            title="Field status"
            description="Inactive technicians stay on the list and cannot sign in."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status" htmlFor="status">
                <Select id="status" name="status" defaultValue={account?.status ?? "ACTIVE"}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </Select>
              </Field>
              <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
                <Textarea id="notes" name="notes" placeholder="Optional notes for KLS staff" defaultValue={account?.notes ?? ""} />
              </Field>
            </div>
          </FormSection>
        ) : null}
        <FormSection
          icon={<KeyRound className="h-4 w-4" aria-hidden="true" />}
          title="Login"
          description={
            editing
              ? "Leave the password blank to keep the current one. Password reset email is not sent."
              : "Share this temporary password with the person. Password reset email is not sent."
          }
        >
          <Field
            label={editing ? "New password" : "Temporary password"}
            htmlFor="password"
            hint={editing ? "Optional. At least 8 characters when set." : "At least 8 characters."}
          >
            <Input
              id="password"
              name="password"
              type="password"
              required={!editing}
              minLength={8}
              autoComplete="new-password"
            />
          </Field>
        </FormSection>
        <FormActions
          pending={pending}
          submitLabel={editing ? (technician ? "Save technician" : "Save admin") : technician ? "Add technician" : "Add admin"}
          pendingLabel="Saving…"
          cancelHref={technician ? "/admin/technicians" : "/admin/admins"}
        />
      </AdminFormFrame>
    </form>
  );
}
