import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { phoneHref, siteConfig } from "@/config/site";

const company = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About KLS" },
  { href: "/service-options", label: "Service options" },
  { href: "/contact", label: "Contact" },
];

export function PublicFooter() {
  return (
    <footer className="bg-inkwell text-white">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1.2fr] lg:px-8">
        <div>
          <Logo tone="light" />
          <p className="mt-5 text-sm font-semibold text-white">
            <a href={phoneHref()} className="hover:text-lime">
              {siteConfig.phone}
            </a>
          </p>
        </div>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/45">Company</p>
          <ul className="mt-4 space-y-3 text-sm">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-lime">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/45">Support</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a href={phoneHref()} className="font-semibold text-white hover:text-lime">
                Emergency Response
              </a>
            </li>
            <li>
              <Link href="/login" target="_blank" rel="noopener noreferrer" className="hover:text-lime">
                Client Portal
              </Link>
            </li>
            <li>
              <span className="block text-white/45">General Inquiries</span>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-lime">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <span className="block text-white/45">Billing &amp; Accounting</span>
              <a href={`mailto:${siteConfig.accountingEmail}`} className="hover:text-lime">
                {siteConfig.accountingEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} {siteConfig.displayName}. All rights reserved.</p>
          <p className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
