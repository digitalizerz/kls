import Link from "next/link";
import { Phone, ShieldCheck, UserRound } from "lucide-react";
import { siteConfig } from "@/config/site";

const items = [
  {
    icon: ShieldCheck,
    title: "Regulatory Approval in Progress",
    body: "KLS is completing regulatory approval and is not yet accepting service requests.",
  },
  {
    icon: UserRound,
    title: "Open an Account",
    body: "Create a client account now so you'll be ready once service is available.",
    href: "/register",
    linkLabel: "Open an account",
  },
  {
    icon: Phone,
    title: "Questions?",
  },
] as const;

export function StatusStrip() {
  return (
    <div className="relative z-10 -mt-20 px-4 pb-4 lg:-mt-24 lg:px-8">
      <div className="mx-auto grid max-w-[90rem] overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_24px_60px_-32px_rgba(16,28,25,0.45)] lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={index > 0 ? "border-t border-black/8 px-7 py-8 lg:border-t-0 lg:border-l" : "px-7 py-8"}
          >
            <item.icon className="h-6 w-6 text-pine" strokeWidth={1.5} aria-hidden="true" />
            <h2 className="mt-5 text-lg font-bold tracking-[-0.02em] text-inkwell">{item.title}</h2>
            {"body" in item ? <p className="mt-2 text-sm leading-6 text-steel">{item.body}</p> : null}
            {"href" in item ? (
              <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-pine hover:text-pine-mid">
                {item.linkLabel}
              </Link>
            ) : null}
            {item.title === "Questions?" ? (
              <div className="mt-2 space-y-2 text-sm leading-6 text-steel">
                <p>
                  General inquiries:{" "}
                  <a className="font-medium text-inkwell hover:text-pine" href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </a>
                </p>
                <p>
                  Billing &amp; accounting:{" "}
                  <a className="font-medium text-inkwell hover:text-pine" href={`mailto:${siteConfig.accountingEmail}`}>
                    {siteConfig.accountingEmail}
                  </a>
                </p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
