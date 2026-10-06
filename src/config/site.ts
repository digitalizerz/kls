export const siteConfig = {
  /** Public brand. Change independently of legalName once the client confirms the DBA. */
  displayName: "KLS Environmental",
  shortName: "KLS",
  /** Legal entity currently used on the site. Not a decision about KLS Transports LLC. */
  legalName: "KLS Environmental LLC",
  name: "KLS Environmental",
  tagline:
    "Grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional kitchen operations.",
  description:
    "Grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional kitchens in Houston and Greater Houston, Texas.",
  phone: "(832) 539-1391",
  email: "service@klsenviro.com",
  emergencyAvailability: "Emergency response 24/7",
  officeHours: "Monday–Friday, 7:00 a.m.–5:00 p.m.",
  hours: "Emergency response 24/7. Office Monday–Friday, 7:00 a.m.–5:00 p.m.",
  serviceArea: "Houston and Greater Houston, Texas",
  heroImage: "/images/kls-vacuum-truck.jpg",
  address: {
    line1: "Update with operating address",
    city: "",
    state: "",
    zip: "",
  },
};

export function phoneHref(phone = siteConfig.phone) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "/contact";
}

export const seedCredentials = {
  customer: { email: "oscar.d@example.net", password: "Password123!" },
  admin: { email: "zoe.m@example.net", password: "Password123!" },
  superAdmin: { email: "ivan.p@example.net", password: "Password123!" },
};
