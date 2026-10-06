import type { Metadata } from "next";
import Link from "next/link";
import { phoneHref, siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

const effectiveDate = "October 6, 2026";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-4xl font-bold tracking-[-0.03em] text-charcoal">Terms of Service</h1>
      <p className="mt-4 text-sm font-semibold text-steel">Effective date: {effectiveDate}</p>
      <p className="text-sm font-semibold text-steel">Last updated: {effectiveDate}</p>

      <p className="mt-6 text-base leading-7 text-steel">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website, customer portal, online services, and related digital services operated by {siteConfig.legalName} (&quot;KLS,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        These Terms also establish certain general conditions applicable to service requests submitted through KLS&apos;s website or customer portal. Specific grease interceptor cleaning, non-hazardous waste hauling, emergency, recurring, or other field services may be subject to additional quotes, proposals, service agreements, work orders, manifests, invoices, policies, or other terms provided by KLS.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        By accessing or using our website, creating an account, submitting a service request, or otherwise using our online services, you agree to these Terms.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        If you use KLS on behalf of a business, institution, or other organization, you represent that you are authorized to act on behalf of that organization.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">1. About KLS</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS provides commercial services that may include grease interceptor cleaning, non-hazardous waste hauling, scheduled service, emergency response, service documentation, and related services. KLS primarily serves commercial and institutional facilities, including facilities with significant kitchen or food-service operations.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        The specific services available to a customer depend on location, facility requirements, equipment, waste characteristics, scheduling, applicable regulations, and KLS&apos;s acceptance of the requested work. Information on this website is general information. It does not guarantee that a particular service is available or appropriate for a particular facility.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">2. Service requests</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers may request service through the KLS website, customer portal, telephone, email, or another method made available by KLS.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Submitting a request does not automatically create a confirmed service appointment or guarantee service availability. A service request may require review or confirmation by KLS before it is accepted. KLS may request additional information regarding the facility, interceptor, waste, access requirements, service history, documentation, or other circumstances before accepting or performing work.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Service dates and times displayed, requested, or discussed are not confirmed unless KLS communicates confirmation.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">3. Emergency service</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS publishes a telephone number for urgent or emergency service requests. Online forms, portal requests, email, and other electronic communications should not be relied upon for immediate emergency response.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        If you are experiencing a spill, backup, overflow, or other condition requiring urgent KLS service, call{" "}
        <a className="font-semibold text-brand" href={phoneHref()}>
          {siteConfig.phone}
        </a>
        .
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Availability of emergency service may depend on location, personnel, equipment, site conditions, and other circumstances. Nothing on the website guarantees a specific response or arrival time unless KLS expressly agrees to one in writing.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        If a situation presents an immediate threat to life, health, public safety, or property requiring emergency governmental assistance, contact the appropriate emergency authority.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">4. Customer accounts</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Certain KLS services may require or allow creation of an online customer account. You agree to provide accurate, current, and complete information when establishing and maintaining an account.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">You are responsible for:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Maintaining the confidentiality of your login credentials;</li>
        <li>Restricting unauthorized access to your account;</li>
        <li>Keeping account and contact information current;</li>
        <li>Ensuring users associated with your organization have appropriate authorization; and</li>
        <li>Promptly notifying KLS of suspected unauthorized access.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        You are responsible for activities performed through your account by users you authorize. KLS may suspend or restrict account access where reasonably necessary to protect customers, KLS, its systems, or other parties.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">5. Organizations and authorized users</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        A KLS account may represent a business, restaurant, hospital, school, university, food-processing facility, commercial kitchen, or other organization. Organizations may authorize individuals to access information associated with their account.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">Depending on permissions, authorized users may be able to view or manage:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Facility information;</li>
        <li>Service locations;</li>
        <li>Interceptor information;</li>
        <li>Service requests;</li>
        <li>Service history;</li>
        <li>Pickup manifests;</li>
        <li>Uploaded documents;</li>
        <li>Account information; and</li>
        <li>Other records associated with the organization.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        Users accessing KLS on behalf of an organization represent that they have authority to perform the actions they take through the account.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">6. Facility information</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers are responsible for providing reasonably accurate information regarding facilities and service locations. This may include facility address, site contact information, interceptor location, interceptor capacity, access requirements, known service conditions, previous service information, and other information reasonably necessary for KLS to evaluate or perform requested services.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers should promptly notify KLS if relevant information changes. KLS may rely on information provided by the customer when evaluating, scheduling, or performing services.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">7. Waste information and service eligibility</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Services described on this website are intended for waste streams and services that KLS is authorized, equipped, and willing to handle. Customers must accurately disclose known information concerning materials presented for collection, pumping, transportation, or handling.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Unless KLS expressly agrees otherwise in writing, customers must not knowingly present hazardous, prohibited, regulated, contaminated, incompatible, or misidentified materials as non-hazardous waste.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">KLS may inspect, question, test where appropriate, reject, suspend, or discontinue service if KLS reasonably believes that:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>A waste stream has been inaccurately described;</li>
        <li>Materials are outside the scope of the requested service;</li>
        <li>Handling the material may be unsafe;</li>
        <li>Applicable requirements prevent KLS from handling the material;</li>
        <li>Site conditions prevent safe service; or</li>
        <li>Additional information or authorization is required.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        Additional costs resulting from undisclosed, misidentified, prohibited, or unexpected materials may be addressed in the applicable quote, service agreement, work order, or invoice to the extent permitted by law. This website does not itself set those charges.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">8. Site access and customer responsibilities</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        The customer is responsible for providing reasonable and safe access to the service location. This may include ensuring that KLS personnel and equipment can access the service area, interceptor access points are reasonably identifiable and accessible, gates, loading areas, or restricted areas can be accessed as arranged, vehicles are able to enter and exit the service area where reasonably required, known hazards are disclosed before service, and necessary facility contacts or permissions are available.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS may delay, reschedule, modify, or decline work where site conditions prevent safe or reasonable service.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">9. Documents and uploads</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS may allow customers to upload documents associated with their organization, facilities, or services. Documents may include pickup manifests, interceptor sizing documents, building plans, plumbing plans, previous service records, permits, photographs, and other facility documentation.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        By uploading information, you represent that you have the authority to provide the material to KLS and permit KLS to use it as reasonably necessary to provide, administer, document, and support the requested services. You retain ownership of materials you submit. You grant KLS a limited right to host, store, copy, process, transmit, and use submitted materials as reasonably necessary to provide and administer KLS services, maintain business records, comply with applicable requirements, and operate the customer portal.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Do not upload malicious files, unlawful material, or information that you are not authorized to provide. Uploaded files are not published at a public web address.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">10. Service records and manifests</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS may make certain service records, manifests, photographs, facility information, and other documentation available through the customer portal. The portal is intended to assist customers with organization and retrieval of records.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers remain responsible for understanding and satisfying any recordkeeping, retention, filing, reporting, inspection, or compliance obligations applicable to their own facilities and operations. KLS does not represent that use of the portal alone satisfies every legal, regulatory, contractual, or inspection requirement applicable to a customer.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        This website does not generate an official compliance form. Official forms come from the applicable jurisdiction&apos;s template.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">11. Regulatory and compliance information</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS may provide information concerning documentation, service intervals, manifests, interceptor information, or other operational matters. Unless expressly stated otherwise in a written agreement, that information is provided for general service and operational purposes and is not legal, engineering, environmental consulting, or regulatory advice.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Requirements can vary based on jurisdiction, facility type, waste stream, interceptor, permit, and other circumstances. Customers are responsible for determining the requirements applicable to their facilities. KLS does not guarantee that use of its website, portal, services, or documentation will independently cause a facility to satisfy all applicable regulatory or legal requirements.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">12. Pricing, quotes, and payment</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        This website does not publish a price list. Any price discussed with KLS is an estimate unless KLS expressly identifies it as final in a quote, proposal, work order, service agreement, or invoice.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">Actual pricing may depend on factors including:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Service type;</li>
        <li>Interceptor capacity;</li>
        <li>Waste volume;</li>
        <li>Facility location;</li>
        <li>Frequency;</li>
        <li>Site accessibility;</li>
        <li>Equipment required;</li>
        <li>Emergency or after-hours service;</li>
        <li>Waste characteristics;</li>
        <li>Additional labor; and</li>
        <li>Other service conditions.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers agree to pay charges they authorize in accordance with the applicable invoice, quote, work order, agreement, or payment terms. This website does not collect payment card numbers. Past-due balances may be subject to remedies permitted by the applicable agreement and law.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">13. Cancellations and rescheduling</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Cancellation, rescheduling, missed-access, trip, mobilization, or similar charges may apply when they are disclosed in the applicable quote, service agreement, work order, scheduling confirmation, or other applicable policy. These Terms do not set those charges.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers should notify KLS as soon as reasonably possible when service needs to be changed or canceled. Emergency and specially dispatched services may be subject to different cancellation conditions stated in the applicable confirmation or agreement.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">14. Electronic communications</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        By using KLS&apos;s online services, you consent to receive communications relating to your account or requested services. These may include account notices, service confirmations, scheduling communications, service updates, documentation notices, billing communications, security alerts, and customer support communications.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Due-date reminders are currently shown inside a signed-in account. The website does not currently send those reminders, or contact-form submissions, by automated email or text message. KLS may also contact you by telephone or email.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">15. Text messaging</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS does not currently send text messages from this website or customer portal. If KLS later offers SMS and you provide the required consent, KLS may send text messages relating to service scheduling, service updates, account activity, customer support, or other authorized purposes. Message and data rates may apply. Where required by applicable law, consent to receive marketing text messages is not a condition of purchasing services. Instructions for opting out will be provided if a text-message program is offered. Opting out of promotional text messages does not necessarily affect operational communications delivered through other channels.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">16. Acceptable use</h2>
      <p className="mt-4 text-base leading-7 text-steel">You may not use the KLS website, portal, or online services to:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Violate applicable law;</li>
        <li>Access another customer&apos;s information without authorization;</li>
        <li>Attempt to bypass authentication or security measures;</li>
        <li>Interfere with the operation or security of KLS systems;</li>
        <li>Upload malware or malicious code;</li>
        <li>Scrape or harvest information through unauthorized automated means;</li>
        <li>Impersonate another person or organization;</li>
        <li>Submit knowingly false or misleading information;</li>
        <li>Probe or test systems without authorization; or</li>
        <li>Use KLS services for fraudulent or unlawful purposes.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">KLS may restrict or terminate access for material violations of these Terms.</p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">17. Intellectual property</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        The KLS website, customer portal, software, design, graphics, branding, text, and other KLS-provided content are owned by or licensed to KLS and are protected by applicable intellectual-property laws. Except as expressly permitted, you may not reproduce, modify, distribute, sell, license, reverse engineer, or commercially exploit KLS-provided website or portal content without authorization. These Terms do not transfer ownership of KLS intellectual property to you.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">18. Third-party services</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        The production website is hosted with Vercel, and account and service records are stored in a database hosted with Neon. Uploaded documents are stored by the application and are not placed at a public web address. KLS does not currently use a payment, analytics, or text-message vendor through this website.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS is not responsible for independent third-party websites or services outside KLS&apos;s control. Your use of a third-party service may also be subject to that provider&apos;s terms and privacy practices.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">19. Website and portal availability</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS seeks to maintain reliable website and portal services, but uninterrupted availability cannot be guaranteed. Online services may occasionally be unavailable because of maintenance, upgrades, outages, security events, third-party service interruptions, or circumstances outside KLS&apos;s reasonable control.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Temporary portal unavailability does not eliminate a customer&apos;s responsibility to contact KLS through another available method when necessary, including the emergency telephone number for an active spill, backup, or overflow.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">20. Disclaimer of warranties</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        To the fullest extent permitted by applicable law, the website, portal, and online functionality are provided on an &quot;as is&quot; and &quot;as available&quot; basis. KLS does not warrant that the website or portal will be uninterrupted, error-free, or free from every harmful component.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Nothing in this section eliminates warranties or obligations that cannot lawfully be excluded, or any express commitments contained in a separate written agreement with KLS. Physical services provided by KLS may be subject to separate contractual terms.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">21. Limitation of liability</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        To the fullest extent permitted by applicable law, KLS will not be liable for indirect, incidental, special, exemplary, punitive, or consequential damages arising solely from use of or inability to use the website or customer portal, including loss of data, revenue, profits, or business opportunities.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Limitations applicable to physical services, waste handling, property damage, service performance, indemnification, or similar operational matters are governed by the applicable service agreement, work order, quote, or other written agreement. Nothing in these Terms limits liability that cannot legally be limited or excluded.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">22. Indemnification</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        To the extent permitted by applicable law, you agree to indemnify and hold harmless KLS and its officers, employees, and agents from third-party claims, damages, liabilities, and reasonable expenses arising from your material violation of these Terms, information or materials you provide without authorization, your unlawful use of the website or portal, or your knowing misrepresentation of materials or waste presented to KLS.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Broader indemnification obligations relating to physical services belong in the applicable commercial service agreement, not in these website Terms.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">23. Suspension and termination</h2>
      <p className="mt-4 text-base leading-7 text-steel">KLS may suspend or terminate access to an online account where reasonably necessary because of:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Material violation of these Terms;</li>
        <li>Suspected fraud or unlawful activity;</li>
        <li>Security concerns;</li>
        <li>Unauthorized access;</li>
        <li>Nonpayment where applicable;</li>
        <li>Misuse of KLS systems; or</li>
        <li>Termination of the underlying customer relationship.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        Termination of portal access does not automatically eliminate outstanding payment, documentation, or other obligations.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">24. Privacy</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS&apos;s collection and handling of personal information is described in the{" "}
        <Link href="/privacy" className="font-semibold text-brand">
          Privacy Policy
        </Link>
        . The Privacy Policy should be read together with these Terms.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">25. Governing law</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        These Terms are governed by the laws of the State of Texas, without regard to conflict-of-law principles, except where applicable law requires otherwise. A dispute concerning a separate service agreement may be governed by the dispute-resolution provisions in that agreement.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">26. Changes to these Terms</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS may update these Terms from time to time to reflect changes in our services, website, technology, business practices, or applicable requirements. The current version will be posted on this website with an updated &quot;Last updated&quot; date. Where required, we may provide additional notice of material changes. Continued use of the website or online services after revised Terms become effective constitutes acceptance to the extent permitted by applicable law.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">27. Severability</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        If any provision of these Terms is determined to be invalid or unenforceable, the remaining provisions will remain in effect to the extent permitted by law.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">28. Entire agreement for online services</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        These Terms, together with the Privacy Policy and any additional terms presented through the online services, are the agreement concerning use of the KLS website and customer portal.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        They do not supersede a separately executed service agreement, proposal, work order, quote, or other written contract with KLS concerning physical services. If there is a conflict regarding those physical services, the applicable written service agreement controls.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">29. Contact KLS</h2>
      <p className="mt-4 text-base leading-7 text-steel">Questions about these Terms may be directed to:</p>
      <p className="mt-4 text-base leading-7 text-charcoal">
        <span className="font-semibold">{siteConfig.legalName}</span>
        <br />
        Texas, United States
        <br />
        Email:{" "}
        <a className="font-semibold text-brand" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        <br />
        Phone:{" "}
        <a className="font-semibold text-brand" href={phoneHref()}>
          {siteConfig.phone}
        </a>
      </p>
    </article>
  );
}
