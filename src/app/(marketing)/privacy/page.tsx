import type { Metadata } from "next";
import { phoneHref, siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

const effectiveDate = "October 6, 2026";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-4xl font-bold tracking-[-0.03em] text-charcoal">Privacy Policy</h1>
      <p className="mt-4 text-sm font-semibold text-steel">Effective date: {effectiveDate}</p>
      <p className="text-sm font-semibold text-steel">Last updated: {effectiveDate}</p>

      <p className="mt-6 text-base leading-7 text-steel">
        {siteConfig.legalName} (&quot;KLS,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects the privacy of our customers, prospective customers, website visitors, and users of our online services.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        This Privacy Policy explains how we collect, use, disclose, protect, and otherwise process information when you visit our website, request service, create or use a customer account, upload documents, communicate with us, or otherwise interact with KLS.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        By using our website or services, you acknowledge the practices described in this Privacy Policy.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">1. Information we collect</h2>
      <p className="mt-4 text-base leading-7 text-steel">The information we collect depends on how you interact with KLS.</p>

      <h3 className="mt-8 text-lg font-bold text-charcoal">Information you provide to us</h3>
      <p className="mt-4 text-base leading-7 text-steel">We may collect information you provide directly, including:</p>
      <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7 text-steel">
        <li>
          <span className="font-semibold text-charcoal">Contact information</span>, such as your name, business or organization name, email address, telephone number, mailing address, and facility address.
        </li>
        <li>
          <span className="font-semibold text-charcoal">Account information</span>, such as login credentials, account preferences, organization information, authorized users, and information associated with your KLS customer account. Account passwords are stored in a protected form, not as the password you type.
        </li>
        <li>
          <span className="font-semibold text-charcoal">Facility information</span>, such as facility locations, grease interceptor capacity, interceptor details, service requirements, access instructions, and other information necessary to evaluate, schedule, or perform services.
        </li>
        <li>
          <span className="font-semibold text-charcoal">Service information</span>, such as requested services, service frequency, preferred service dates, emergency service requests, previous service provider information, service notes, and communications regarding a service request.
        </li>
        <li>
          <span className="font-semibold text-charcoal">Documents and files</span> you choose to upload or provide to KLS, such as pick-up manifests, interceptor sizing documents, building plans, plumbing plans, previous service records, permits, photographs, and other facility or operational documentation.
        </li>
        <li>
          <span className="font-semibold text-charcoal">Communications</span>, including information you provide when contacting us by telephone, email, website form, customer portal, or other communication method. A request submitted through the website contact form is stored in KLS records so the team can follow up. The website does not currently send that request by automated email.
        </li>
      </ul>

      <h3 className="mt-8 text-lg font-bold text-charcoal">Information collected automatically</h3>
      <p className="mt-4 text-base leading-7 text-steel">
        When you use our website or online services, the hosting environment may record technical information needed to operate the site, including IP address, browser type, device type, operating system, pages requested, referring page, and the date and time of access.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS does not currently use a third-party analytics or advertising service on this website. Signed-in areas use a session cookie, described in Section 6.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">2. How we use information</h2>
      <p className="mt-4 text-base leading-7 text-steel">KLS may use information we collect to:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Respond to service inquiries and quote requests;</li>
        <li>Establish and administer customer accounts;</li>
        <li>Evaluate facility and service requirements;</li>
        <li>Schedule and coordinate grease interceptor cleaning and non-hazardous waste hauling;</li>
        <li>Respond to emergency service requests;</li>
        <li>Maintain facility and interceptor information;</li>
        <li>Maintain service histories and customer records;</li>
        <li>Receive, organize, store, and retrieve manifests and facility documentation;</li>
        <li>Communicate with customers regarding scheduled or completed services;</li>
        <li>Show due-date reminders inside a signed-in account;</li>
        <li>Provide customer portal functionality;</li>
        <li>Authenticate users and protect customer accounts;</li>
        <li>Process transactions and maintain billing records when billing is part of the relationship;</li>
        <li>Provide customer support;</li>
        <li>Improve our website, portal, services, and operations;</li>
        <li>Detect, investigate, and prevent fraud, misuse, security incidents, or unauthorized access;</li>
        <li>Maintain records required for business, contractual, insurance, accounting, regulatory, or legal purposes;</li>
        <li>Comply with applicable laws and lawful governmental requests;</li>
        <li>Enforce our agreements, policies, and terms; and</li>
        <li>Protect the rights, safety, property, and operations of KLS, our customers, and others.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        We may also use aggregated or de-identified information for business analytics, service improvement, planning, and other legitimate business purposes where the information cannot reasonably be used to identify an individual.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">3. Facility and operational documentation</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers may provide KLS with facility-related documentation to assist with service delivery, recordkeeping, and account management. These materials may contain confidential operational or business information.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS uses such documentation for purposes related to providing and administering our services, including evaluating service requirements, maintaining facility records, coordinating service, and providing documentation associated with completed services.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Uploaded files are associated with the organization and facility account. They are not published at a public web address. Retrieving a file requires a signed-in account that is allowed to see that record.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Customers are responsible for ensuring that they have the authority to provide documents and information uploaded or otherwise submitted to KLS. Please do not upload information that is unnecessary for KLS to provide the requested services.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">4. How we share information</h2>
      <p className="mt-4 text-base leading-7 text-steel">KLS does not sell personal information in exchange for money.</p>
      <p className="mt-4 text-base leading-7 text-steel">We may disclose information in the following circumstances.</p>

      <h3 className="mt-8 text-lg font-bold text-charcoal">Service providers</h3>
      <p className="mt-4 text-base leading-7 text-steel">
        We provide information to vendors that host and operate the website and customer portal. At the time of this policy, the production application is hosted with Vercel, and account, facility, and service records are stored in a database hosted with Neon. Those providers process information as needed to run the service, subject to their terms and applicable law.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Uploaded documents are stored by the application and are not placed at a public web address. KLS does not currently use a separate cloud-file vendor, analytics vendor, email-marketing platform, text-message vendor, or payment-card processor through this website. If one of those vendors is added, this policy will be updated.
      </p>

      <h3 className="mt-8 text-lg font-bold text-charcoal">Service operations</h3>
      <p className="mt-4 text-base leading-7 text-steel">
        Information may be disclosed to employees, technicians, contractors, transportation providers, disposal or processing facilities, or other parties involved in performing or documenting requested services when reasonably necessary for those services. A technician assigned to a job can see the facility and service information needed for that job.
      </p>

      <h3 className="mt-8 text-lg font-bold text-charcoal">Legal and regulatory requirements</h3>
      <p className="mt-4 text-base leading-7 text-steel">We may disclose information when we reasonably believe disclosure is required to:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Comply with applicable law or regulation;</li>
        <li>Respond to a subpoena, court order, or other lawful request;</li>
        <li>Cooperate with regulatory or governmental authorities;</li>
        <li>Establish, exercise, or defend legal claims;</li>
        <li>Investigate suspected fraud or unlawful activity; or</li>
        <li>Protect the rights, property, safety, or security of KLS or others.</li>
      </ul>

      <h3 className="mt-8 text-lg font-bold text-charcoal">Business transactions</h3>
      <p className="mt-4 text-base leading-7 text-steel">
        If KLS is involved in a merger, acquisition, financing, reorganization, bankruptcy, sale of assets, or similar business transaction, information may be disclosed or transferred as part of that transaction, subject to applicable law.
      </p>

      <h3 className="mt-8 text-lg font-bold text-charcoal">At your direction</h3>
      <p className="mt-4 text-base leading-7 text-steel">We may disclose information when you request or authorize us to do so.</p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">5. Payment information</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        This website does not currently collect or store payment card numbers. If KLS later accepts electronic payments, payment information may be processed by a third-party payment processor. In that case, KLS may receive information about a transaction, such as the customer name, billing information, transaction amount, payment status, and transaction identifier. Where a payment provider processes the card directly, KLS does not need to receive or store the complete payment card number. That provider&apos;s handling of payment information is governed by its own privacy and security practices, and this policy will be updated when that arrangement is in place.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">6. Cookies and similar technologies</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        The customer portal, technician area, and staff area use a session cookie so a signed-in user stays authenticated. That cookie is necessary for those signed-in services. KLS does not currently set analytics cookies or advertising cookies.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        You can control cookies through your browser settings. Blocking the session cookie will prevent signing in. If KLS later uses non-essential cookies, we will provide the choices required by applicable law and update this policy.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">7. Data security</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS uses administrative and technical safeguards designed to protect information against unauthorized access, loss, misuse, alteration, or disclosure. Portal and document access is limited to signed-in users who are allowed to see the record. Account passwords are stored in a protected form. The production site is served over an encrypted connection.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        No website, network, storage system, or method of electronic transmission can be guaranteed to be completely secure. We cannot guarantee absolute security of information you submit.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Users are responsible for maintaining the confidentiality of their account credentials and should notify KLS promptly if they believe their account has been accessed without authorization.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">8. Data retention</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS retains information for as long as reasonably necessary for the purposes for which it was collected and for legitimate business, contractual, operational, accounting, insurance, regulatory, dispute-resolution, and legal purposes. Retention periods may vary depending on the type of information.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Service records, manifests, transaction records, and facility documentation may need to be retained for longer periods than general website inquiries. When information is no longer reasonably required, KLS may delete, anonymize, or otherwise dispose of it, subject to applicable legal and operational requirements.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">9. Your privacy rights</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Depending on where you reside and applicable law, you may have rights concerning your personal information. These may include the right to:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Request access to certain personal information;</li>
        <li>Request correction of inaccurate information;</li>
        <li>Request deletion of certain information;</li>
        <li>Obtain information regarding how certain information is processed or disclosed;</li>
        <li>Opt out of certain uses of personal information where applicable; and</li>
        <li>Appeal certain decisions regarding a privacy request where required by law.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        These rights are subject to exceptions and limitations under applicable law. To submit a privacy request, contact us at{" "}
        <a className="font-semibold text-brand" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        . We may need to verify your identity before processing a request. Authorized agents may submit requests where permitted by applicable law, subject to appropriate verification.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">10. Texas privacy rights</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS is based in Texas. To the extent the Texas Data Privacy and Security Act or another applicable Texas privacy law applies to KLS or a particular processing activity, eligible Texas residents may exercise the rights provided by applicable law.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Certain information, organizations, processing activities, and businesses may be exempt from some or all requirements of those laws. KLS will evaluate verified privacy requests based on the laws applicable to the request at the time it is received.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">11. Business and employee information</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Many KLS customers are businesses, institutions, and other organizations. Information submitted by an employee, representative, facilities manager, contractor, or other individual on behalf of an organization may be associated with that organization&apos;s account.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        The organization may have access to information, documents, service records, and activities associated with its account, subject to account permissions. If you use KLS services on behalf of an organization, you are responsible for ensuring that you are authorized to provide information and act on behalf of that organization.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">12. Email, telephone, and service communications</h2>
      <p className="mt-4 text-base leading-7 text-steel">KLS may contact customers and prospective customers regarding:</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-steel">
        <li>Service requests;</li>
        <li>Account administration;</li>
        <li>Scheduling;</li>
        <li>Service updates;</li>
        <li>Emergency requests;</li>
        <li>Documentation;</li>
        <li>Billing;</li>
        <li>Customer support;</li>
        <li>Security matters; and</li>
        <li>Other communications related to the business relationship.</li>
      </ul>
      <p className="mt-4 text-base leading-7 text-steel">
        Due-date reminders are currently shown inside the signed-in account. They are not sent by email or text message from the website.
      </p>
      <p className="mt-4 text-base leading-7 text-steel">
        Where KLS sends marketing communications, recipients may opt out of marketing emails using the unsubscribe mechanism provided in the communication or by contacting KLS. Opting out of marketing communications does not prevent KLS from sending necessary transactional, operational, account, safety, or service-related communications.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">13. Text messages</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS does not currently send text messages from this website or customer portal. If KLS later offers SMS, we may use a telephone number you provide to send communications related to service requests, scheduling, account activity, or service updates, where you have provided the consent required for that message. Message and data rates may apply. Where required, consent to receive marketing text messages is not a condition of purchasing KLS services. Instructions for opting out will be provided if text messages are offered.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">14. Third-party websites and services</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        Our website or portal may contain links to websites or services operated by third parties. KLS is not responsible for the privacy, security, content, or practices of third-party websites or services. Review the privacy policies of those parties before providing information to them.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">15. Children&apos;s privacy</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        KLS provides commercial services to businesses, institutions, and their representatives. Our website and services are not directed to children under 13, and we do not knowingly collect personal information directly from children under 13 through our website or customer portal. If we learn that personal information from a child under 13 has been collected in circumstances requiring deletion, we will take reasonable steps to address it.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">16. Changes to this Privacy Policy</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        We may update this Privacy Policy periodically to reflect changes in our services, technology, business practices, or legal requirements. When we make changes, we will update the &quot;Last updated&quot; date at the top of this policy. If changes are material, we may provide additional notice where appropriate or required by law.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-[-0.02em] text-charcoal">17. Contact us</h2>
      <p className="mt-4 text-base leading-7 text-steel">
        If you have questions about this Privacy Policy, KLS&apos;s privacy practices, or a request regarding your information, contact:
      </p>
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
