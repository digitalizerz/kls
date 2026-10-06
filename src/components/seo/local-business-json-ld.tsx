import { serviceArea } from "@/config/service-area";
import { siteConfig } from "@/config/site";
import { siteUrl } from "@/lib/site-url";

export function LocalBusinessJsonLd() {
  const url = siteUrl();
  const phone = `+1${siteConfig.phone.replace(/\D/g, "")}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: siteConfig.legalName,
        alternateName: siteConfig.displayName,
        url,
        telephone: phone,
        email: siteConfig.email,
        image: `${url}${siteConfig.heroImage}`,
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: serviceArea.primaryCity,
          addressRegion: "TX",
          addressCountry: "US",
        },
        areaServed: [
          ...serviceArea.cities.map((name) => ({
            "@type": "City",
            name,
            containedInPlace: { "@type": "State", name: "Texas" },
          })),
          ...serviceArea.counties.map((name) => ({
            "@type": "AdministrativeArea",
            name: `${name} County`,
            containedInPlace: { "@type": "State", name: "Texas" },
          })),
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "07:00",
            closes: "17:00",
          },
        ],
      },
      {
        "@type": "Service",
        name: "Grease interceptor cleaning",
        serviceType: "Grease interceptor cleaning and pumping",
        provider: { "@type": "LocalBusiness", name: siteConfig.legalName },
        areaServed: { "@type": "City", name: "Houston" },
        url: `${url}/services`,
      },
      {
        "@type": "Service",
        name: "Non-hazardous waste hauling",
        serviceType: "Non-hazardous waste hauling",
        provider: { "@type": "LocalBusiness", name: siteConfig.legalName },
        areaServed: { "@type": "City", name: "Houston" },
        url: `${url}/services`,
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
