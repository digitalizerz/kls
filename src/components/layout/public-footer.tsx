import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { phoneHref, siteConfig } from "@/config/site";

const links = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/why-kls", label: "Why KLS" },
  { href: "/service-options", label: "Service options" },
  { href: "/register", label: "Open an account" },
  { href: "/login", label: "Client portal" },
  { href: "/contact", label: "Contact" },
];

export function PublicFooter() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-6">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">{siteConfig.description}</p>
          <p className="mt-3 text-sm font-semibold text-white/80">{siteConfig.serviceArea}</p>
        </div>
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/50">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white/80">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/50">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <a href={phoneHref()} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.emergencyAvailability}</li>
            <li>Office {siteConfig.officeHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-white/50 sm:flex-row sm:justify-between lg:px-6">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="flex gap-4">
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
