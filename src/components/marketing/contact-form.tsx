"use client";

import { useActionState } from "react";
import { submitContactInquiry, type ContactState } from "@/actions/contact";
import { Alert } from "@/components/ui/alert";
import { capacityGallonOptions } from "@/lib/capacity";

const initial: ContactState = {};

const serviceNeeds = [
  { value: "INTERCEPTOR", label: "Grease interceptor cleaning" },
  { value: "HAULING", label: "Non-hazardous waste hauling" },
  { value: "RECURRING", label: "Recurring service" },
  { value: "ACCOUNT", label: "New account / facility" },
  { value: "DOCUMENTATION", label: "Documentation question" },
  { value: "OTHER", label: "Other" },
] as const;

const fieldClass = "mt-1.5 h-11 w-full border border-rule px-3 text-sm font-medium";

export function ContactForm({ defaultNeed = "INTERCEPTOR" }: { defaultNeed?: string }) {
  const [state, action, pending] = useActionState(submitContactInquiry, initial);
  const selected = serviceNeeds.some((item) => item.value === defaultNeed) ? defaultNeed : "INTERCEPTOR";
  const capacities = capacityGallonOptions();

  return (
    <form action={action} className="border border-rule bg-white p-5 sm:p-6">
      <h2 className="text-2xl font-bold tracking-[-0.03em] text-charcoal">Request service</h2>
      {state.error ? <div className="mt-4"><Alert>{state.error}</Alert></div> : null}
      {state.success ? <div className="mt-4"><Alert tone="success">{state.success}</Alert></div> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-charcoal">
          Name *
          <input name="name" required autoComplete="name" className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Business / organization *
          <input name="companyName" required autoComplete="organization" className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Email *
          <input name="email" type="email" required autoComplete="email" className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Phone *
          <input name="phone" type="tel" required autoComplete="tel" className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-charcoal sm:col-span-2">
          Facility address
          <input name="facilityAddress" autoComplete="street-address" className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          City *
          <input name="city" required autoComplete="address-level2" className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Service needed *
          <select name="serviceNeed" defaultValue={selected} required className={`${fieldClass} bg-white`}>
            {serviceNeeds.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-charcoal sm:col-span-2">
          Interceptor capacity
          <select name="capacityGallons" defaultValue="" className={`${fieldClass} bg-white`}>
            <option value="">Select capacity, if known</option>
            {capacities.map((gallons) => (
              <option key={gallons} value={gallons}>
                {gallons.toLocaleString()} gallons
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-4">
        <input id="switchingProvider" type="checkbox" name="switchingProvider" value="yes" className="peer mt-1" />
        <label htmlFor="switchingProvider" className="text-sm font-semibold text-charcoal">
          Are you switching from another provider?
        </label>
        <label
          htmlFor="previousProvider"
          className="field-rise col-span-2 hidden text-sm font-semibold text-charcoal peer-checked:block"
        >
          Previous service provider
          <input id="previousProvider" name="previousProvider" required className={fieldClass} />
        </label>
      </div>
      <label className="mt-4 block text-sm font-semibold text-charcoal">
        Tell us about the service needed
        <textarea name="message" required rows={4} className="mt-1.5 w-full border border-rule px-3 py-2 text-sm font-medium" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex h-11 items-center bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
