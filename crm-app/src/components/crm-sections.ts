import {
  Activity,
  ChartNoAxesColumn,
  Clapperboard,
  CreditCard,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { Permission } from "@/constants/permissions";

export type CrmSection = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission: Permission | null;
  isAvailable: boolean;
};

export const CRM_SECTIONS: CrmSection[] = [
  {
    key: "overview",
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: null,
    isAvailable: true,
  },
  {
    key: "subscribers",
    label: "Subscribers",
    href: "/subscribers",
    icon: Users,
    permission: "subscribers.view",
    isAvailable: true,
  },
  {
    key: "profiles",
    label: "Profiles",
    href: "/profiles",
    icon: UserRound,
    permission: "subscribers.view",
    isAvailable: true,
  },
  {
    key: "payments",
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
    permission: "payments.view",
    isAvailable: true,
  },
  {
    key: "movies",
    label: "Movies",
    href: "/movies",
    icon: Clapperboard,
    permission: "catalog.view",
    isAvailable: true,
  },
  {
    key: "activity",
    label: "Activity",
    href: "/activity",
    icon: Activity,
    permission: "activity.view",
    isAvailable: true,
  },
  {
    key: "countries",
    label: "Countries",
    href: "/countries",
    icon: Globe,
    permission: "reports.view",
    isAvailable: true,
  },
  {
    key: "promo-codes",
    label: "Promo codes",
    href: "/promo-codes",
    icon: Ticket,
    permission: "promoCodes.view",
    isAvailable: true,
  },
  {
    key: "reports",
    label: "Churn & retention",
    href: "/reports",
    icon: ChartNoAxesColumn,
    permission: "reports.view",
    isAvailable: true,
  },
  {
    key: "users",
    label: "Users",
    href: "/users",
    icon: ShieldCheck,
    permission: "users.view",
    isAvailable: true,
  },
];
