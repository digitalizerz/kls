import type { NavItem } from "@/types/navigation";

export const publicNav = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-kls", label: "Why KLS" },
  { href: "/#service-options", label: "Service options" },
  { href: "/#contact", label: "Contact" },
] as const;

export const portalNav: NavItem[] = [
  { href: "/portal/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/portal/reminders", label: "Reminders", icon: "Bell" },
  { href: "/portal/locations", label: "Locations", icon: "Building2" },
  { href: "/portal/schedule", label: "Schedule service", icon: "CalendarPlus" },
  { href: "/portal/history", label: "Service history", icon: "ClipboardList" },
  { href: "/portal/documents", label: "Documents", icon: "FolderOpen" },
  { href: "/portal/account", label: "Account", icon: "CircleUser" },
];

export const technicianNav: NavItem[] = [
  { href: "/technician", label: "Jobs", icon: "LayoutDashboard" },
  { href: "/technician/history", label: "Completed", icon: "ClipboardList" },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/reminders", label: "Reminders", icon: "Bell" },
  { href: "/admin/customers", label: "Customers", icon: "Users" },
  { href: "/admin/locations", label: "Locations", icon: "Building2" },
  { href: "/admin/grease-traps", label: "Grease traps", icon: "Droplets" },
  { href: "/admin/service-requests", label: "Service requests", icon: "Inbox" },
  { href: "/admin/jobs", label: "Schedule / Jobs", icon: "CalendarClock" },
  { href: "/admin/service-records", label: "Service records", icon: "ClipboardList" },
  { href: "/admin/documents", label: "Documents", icon: "FolderOpen" },
  { href: "/admin/compliance", label: "Compliance", icon: "FileCheck" },
  { href: "/admin/technicians", label: "Technicians", icon: "HardHat" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
];
