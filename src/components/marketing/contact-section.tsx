"use client";

import { useActionState } from "react";
import { submitContactInquiry, type ContactState } from "@/actions/contact";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

const initial: ContactState = {};

export function ContactSection() {
  const [state, action, pending] = useActionState(submitContactInquiry, initial);

  return (
    <section id="contact" className="scroll-mt-20 bg-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Contact</p>
          <h2 className="mt-3 font-serif text-3xl text-ink">Tell us about the kitchen.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">
            New customers, add a location, or ask about an overdue interceptor. We will follow up with scheduling — this form does not book a time automatically.
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="font-medium">
                <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-medium">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Hours</dt>
              <dd className="font-medium">{siteConfig.hours}</dd>
            </div>
          </dl>
        </div>
        <form action={action} className="border border-line p-6">
          {state.error ? <Alert>{state.error}</Alert> : null}
          {state.success ? <Alert tone="success">{state.success}</Alert> : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="name">
              <Input id="name" name="name" required />
            </Field>
            <Field label="Business" htmlFor="companyName">
              <Input id="companyName" name="companyName" required />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" required />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" name="phone" type="tel" required />
            </Field>
            <Field label="City" htmlFor="city">
              <Input id="city" name="city" />
            </Field>
            <Field label="What do you need?" htmlFor="serviceNeed">
              <Select id="serviceNeed" name="serviceNeed" defaultValue="ROUTINE_CLEANING">
                <option value="ROUTINE_CLEANING">Routine cleaning</option>
                <option value="EMERGENCY_CLEANING">Emergency / backup</option>
                <option value="MULTI_LOCATION">Multi-location program</option>
                <option value="RECORDS">Records / compliance questions</option>
              </Select>
            </Field>
          </div>
          <Field label="Message" htmlFor="message" className="mt-4">
            <Textarea id="message" name="message" required placeholder="Locations, trap sizes, last service date if you know it." />
          </Field>
          <Button type="submit" variant="clay" className="mt-5 w-full sm:w-auto" disabled={pending}>
            {pending ? "Sending…" : "Send request"}
          </Button>
        </form>
      </div>
    </section>
  );
}
