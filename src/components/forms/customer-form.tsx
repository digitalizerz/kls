"use client";

import { useActionState } from "react";
import type { Customer } from "@prisma/client";
import { createCustomer, updateCustomer } from "@/actions/customers";
import type { RecordActionState } from "@/actions/locations";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initial: RecordActionState = {};

export function CustomerForm({ customer }: { customer?: Customer }) {
  const action = customer ? updateCustomer : createCustomer;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4 border border-line bg-panel p-5">
      {customer ? <input type="hidden" name="customerId" value={customer.id} /> : null}
      {state.error ? <Alert>{state.error}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name" htmlFor="companyName" className="sm:col-span-2">
          <Input id="companyName" name="companyName" defaultValue={customer?.companyName ?? ""} required />
        </Field>
        <Field label="Primary contact" htmlFor="contactName">
          <Input id="contactName" name="contactName" defaultValue={customer?.contactName ?? ""} required />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} required />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" defaultValue={customer?.phone ?? ""} required />
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={customer?.status ?? "ACTIVE"}>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_ONBOARDING">Pending onboarding</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </Select>
        </Field>
        <Field label="Billing street" htmlFor="billingAddressLine1" className="sm:col-span-2">
          <Input id="billingAddressLine1" name="billingAddressLine1" defaultValue={customer?.billingAddressLine1 ?? ""} />
        </Field>
        <Field label="Billing line 2" htmlFor="billingAddressLine2" className="sm:col-span-2">
          <Input id="billingAddressLine2" name="billingAddressLine2" defaultValue={customer?.billingAddressLine2 ?? ""} />
        </Field>
        <Field label="City" htmlFor="billingCity">
          <Input id="billingCity" name="billingCity" defaultValue={customer?.billingCity ?? ""} />
        </Field>
        <Field label="State" htmlFor="billingState">
          <Input id="billingState" name="billingState" maxLength={2} defaultValue={customer?.billingState ?? ""} />
        </Field>
        <Field label="ZIP" htmlFor="billingZipCode">
          <Input id="billingZipCode" name="billingZipCode" defaultValue={customer?.billingZipCode ?? ""} />
        </Field>
        <Field label="Internal notes" htmlFor="notes" className="sm:col-span-2">
          <Textarea id="notes" name="notes" defaultValue={customer?.notes ?? ""} />
        </Field>
      </div>

      {customer ? null : (
        <div className="border-t border-line pt-4">
          <p className="mb-3 text-sm font-medium">Optional portal login</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="User name" htmlFor="portalUserName">
              <Input id="portalUserName" name="portalUserName" />
            </Field>
            <Field label="Login email" htmlFor="portalUserEmail">
              <Input id="portalUserEmail" name="portalUserEmail" type="email" />
            </Field>
            <Field label="Temporary password" htmlFor="portalPassword">
              <Input id="portalPassword" name="portalPassword" type="password" minLength={8} />
            </Field>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="clay" disabled={pending}>
          {pending ? "Saving…" : customer ? "Save customer" : "Create customer"}
        </Button>
        <ButtonLink href={customer ? `/admin/customers/${customer.id}` : "/admin/customers"} variant="secondary">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
