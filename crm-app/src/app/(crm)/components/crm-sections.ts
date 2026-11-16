import {
  Activity,
  ChartNoAxesColumn,
  Clapperboard,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  MonitorSmartphone,
  ShieldCheck,
  Tag,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { Permission } from "@/constants/permissions";

export type CrmSection = {
  /** Stable id, safe to pass from server to client components. */
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** What the section is for, shown on the overview page. */
  description: string;
  /** Permission needed to see the section. Null means every approved user. */
  permission: Permission | null;
  /** False until the section's page exists; it is listed as "Soon". */
  isAvailable: boolean;
};

/** Every area of the dashboard, in navigation order. Add new pages here. */
export const CRM_SECTIONS: CrmSection[] = [
  {
    key: "overview",
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "The numbers your team asks about every morning.",
    permission: null,
    isAvailable: true,
  },
  {
    key: "subscribers",
    label: "Subscribers",
    href: "/subscribers",
    icon: Users,
    description: "Accounts with their profiles, viewing and payments.",
    permission: "subscribers.view",
    isAvailable: true,
  },
  {
    key: "payments",
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
    description: "Record payments and issue refunds.",
    permission: "payments.view",
    isAvailable: false,
  },
  {
    key: "plans",
    label: "Plans",
    href: "/plans",
    icon: Tag,
    description: "Prices, streams, profiles and resolution per plan.",
    permission: "plans.view",
    isAvailable: false,
  },
  {
    key: "catalog",
    label: "Catalog",
    href: "/catalog",
    icon: Clapperboard,
    description: "Movies, genres, certifications and ratings.",
    permission: "catalog.view",
    isAvailable: false,
  },
  {
    key: "devices",
    label: "Devices",
    href: "/devices",
    icon: MonitorSmartphone,
    description: "The devices subscribers watch on.",
    permission: "devices.view",
    isAvailable: false,
  },
  {
    key: "activity",
    label: "Activity",
    href: "/activity",
    icon: Activity,
    description: "Watch sessions and ratings as they happen.",
    permission: "activity.view",
    isAvailable: false,
  },
  {
    key: "campaigns",
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    description: "Promos, win-backs and new releases, from sent to redeemed.",
    permission: "campaigns.view",
    isAvailable: false,
  },
  {
    key: "promo-codes",
    label: "Promo codes",
    href: "/promo-codes",
    icon: Ticket,
    description: "Discount codes and who redeemed them.",
    permission: "promoCodes.view",
    isAvailable: false,
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: ChartNoAxesColumn,
    description: "Revenue, churn and viewing over time.",
    permission: "reports.view",
    isAvailable: false,
  },
  {
    key: "users",
    label: "Users",
    href: "/users",
    icon: ShieldCheck,
    description: "Approve staff accounts and assign roles.",
    permission: "users.view",
    isAvailable: false,
  },
];
