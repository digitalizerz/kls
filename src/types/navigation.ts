export type NavIcon =
  | "LayoutDashboard"
  | "Building2"
  | "CalendarPlus"
  | "ClipboardList"
  | "FolderOpen"
  | "CircleUser"
  | "Users"
  | "Droplets"
  | "Inbox"
  | "CalendarClock"
  | "FileCheck"
  | "HardHat"
  | "ShieldCheck"
  | "Bell"
  | "Settings";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
};
