import type { LucideIcon } from "lucide-react";
import { Building2, CookingPot, GraduationCap, Hospital, Utensils } from "lucide-react";

export type Industry = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Facility types KLS serves. Revise this list when the client confirms it. */
export const industries: Industry[] = [
  {
    title: "Restaurants & commercial kitchens",
    description:
      "Restaurants, hospitality kitchens, commissaries, and other high-volume commercial food-service operations.",
    icon: Utensils,
  },
  {
    title: "Food processing facilities",
    description:
      "Facilities generating grease and non-hazardous waste through food production and processing operations.",
    icon: CookingPot,
  },
  {
    title: "Hospitals & medical centers",
    description:
      "Institutional food-service operations that need dependable interceptor service and organized documentation.",
    icon: Hospital,
  },
  {
    title: "Schools & universities",
    description: "Cafeterias, campus dining operations, and institutional kitchens.",
    icon: GraduationCap,
  },
  {
    title: "Multi-site operations",
    description:
      "Organizations managing multiple food-service locations that need consistent service and facility-level records.",
    icon: Building2,
  },
];
