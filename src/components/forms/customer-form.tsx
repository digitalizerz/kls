"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Building2, CreditCard, KeyRound, UserRound } from "lucide-react";
import type { Customer } from "@prisma/client";
import { createCustomer, updateCustomer } from "@/actions/customers";
import type { RecordActionState } from "@/actions/locations";
import { AdminFormFrame, FormActions, FormSection } from "@/components/forms/admin-form";
import { UnsavedChanges } from "@/components/forms/unsaved-changes";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initial: RecordActionState = {};

export function CustomerForm({ customer }: { customer?: Customer }) {
  const action = customer ? updateCustomer : createCustomer;
  const [state, formAction, pending] = useActionState(action, initial);
  const [dirty, setDirty] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const cancelHref = customer ? `/admin/customers/${customer.id}` : "/admin/customers";

  useEffect(() => {
    if (state.error) alertRef.current?.focus();
  }, [state.error]);

  return (
    <form
      action={formAction}
      className="dash-fields"
      onInput={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
    >
      <UnsavedChanges dirty={dirty && !pending} />
      {customer ? <input type="hidden" name="customerId" value={customer.id} /> : null}
      <AdminFormFrame
        breadcrumbs={[
          { href: "/admin/customers", label: "Customers" },
          { label: customer ? "Edit customer" : "Create customer" },
        ]}
        icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
        title={customer ? "Edit customer" : "Create customer"}
        description={
          customer
            ? customer.companyName
            : "Creates the business account first. Add locations and traps next. Optional portal login can be issued here."
        }
        guidance={{
          title: "Customer guidance",
          body: "A customer is the business account. Locations, grease traps, jobs, and documents hang off that account.",
          points: [
            "Save the customer before adding locations.",
            "Portal login is optional and can be added later.",
            "Billing details are stored on the customer, not on each location.",
          ],
        }}
      >
        {state.error ? (
          <div ref={alertRef} tabIndex={-1} className="outline-none">
            <Alert>{state.error}</Alert>
          </div>
        ) : null}
        <FormSection
          icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
          title="Customer information"
          description="The business this account represents."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name" htmlFor="companyName" className="sm:col-span-2">
              <Input id="companyName" name="companyName" defaultValue={customer?.companyName ?? ""} autoComplete="organization" required />
            </Field>
            <Field label="Status" htmlFor="status">
              <Select id="status" name="status" defaultValue={customer?.status ?? "ACTIVE"}>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_ONBOARDING">Pending onboarding</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </Select>
            </Field>
          </div>
        </FormSection>
        <FormSection
          icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
          title="Contact details"
          description="Primary person KLS should reach for this account."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary contact" htmlFor="contactName">
              <Input id="contactName" name="contactName" defaultValue={customer?.contactName ?? ""} autoComplete="name" required />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} autoComplete="email" required />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" name="phone" type="tel" defaultValue={customer?.phone ?? ""} autoComplete="tel" required />
            </Field>
          </div>
        </FormSection>
        <FormSection
          icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
          title="Billing information"
          description="Optional billing address for this customer."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Billing street" htmlFor="billingAddressLine1" className="sm:col-span-2">
              <Input id="billingAddressLine1" name="billingAddressLine1" defaultValue={customer?.billingAddressLine1 ?? ""} autoComplete="billing street-address" />
            </Field>
            <Field label="Billing line 2" htmlFor="billingAddressLine2" className="sm:col-span-2">
              <Input id="billingAddressLine2" name="billingAddressLine2" defaultValue={customer?.billingAddressLine2 ?? ""} />
            </Field>
            <Field label="City" htmlFor="billingCity">
              <Input id="billingCity" name="billingCity" defaultValue={customer?.billingCity ?? ""} autoComplete="billing address-level2" />
            </Field>
            <Field label="State" htmlFor="billingState">
              <Input id="billingState" name="billingState" maxLength={2} defaultValue={customer?.billingState ?? ""} autoComplete="billing address-level1" />
            </Field>
            <Field label="ZIP" htmlFor="billingZipCode">
              <Input id="billingZipCode" name="billingZipCode" defaultValue={customer?.billingZipCode ?? ""} inputMode="numeric" autoComplete="billing postal-code" />
            </Field>
          </div>
        </FormSection>
        <FormSection
          icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
          title="Internal notes"
          description="Notes visible to KLS staff."
        >
          <Field label="Internal notes" htmlFor="notes">
            <Textarea id="notes" name="notes" defaultValue={customer?.notes ?? ""} />
          </Field>
        </FormSection>
        {customer ? null : (
          <FormSection
            icon={<KeyRound className="h-4 w-4" aria-hidden="true" />}
            title="Optional portal login"
            description="Leave blank to create the customer without a portal user."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="User name" htmlFor="portalUserName">
                <Input id="portalUserName" name="portalUserName" autoComplete="name" />
              </Field>
              <Field label="Login email" htmlFor="portalUserEmail">
                <Input id="portalUserEmail" name="portalUserEmail" type="email" autoComplete="email" />
              </Field>
              <Field label="Temporary password" htmlFor="portalPassword">
                <Input id="portalPassword" name="portalPassword" type="password" minLength={8} autoComplete="new-password" />
              </Field>
            </div>
          </FormSection>
        )}
        <FormActions
          pending={pending}
          submitLabel={customer ? "Save customer" : "Create customer"}
          pendingLabel="Saving…"
          cancelHref={cancelHref}
        />
      </AdminFormFrame>
    </form>
  );
}
