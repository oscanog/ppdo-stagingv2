// components/sidebar/navItems.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavItem } from "./types";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import {
  LayoutDashboard,
  Gauge,
  FileEdit,
  Settings as SettingsIcon,
  Calculator,
  Vault,
  Building2,
  FileText,
  Bug,
  Lightbulb,
} from "lucide-react";

export function useNavItems(): NavItem[] {
  const { user } = useCurrentUser();

  const isSuperAdmin = user?.role === "super_admin";

  // 👤 User/Admin → personal reports
  const myReports = useQuery(api.bugReports.getMyReports);

  // 👑 Always call stats (safe for all roles)
  const stats = useQuery(api.bugReports.getStats);

  // 👤 User/Admin → pending bugs only
  const myPendingBugCount =
    myReports?.filter((r) => r.status === "pending").length || 0;

  // 👑 Super admin → ALL pending bugs
  const globalPendingBugCount = stats?.pending || 0;

  const bugBadgeCount = isSuperAdmin
    ? globalPendingBugCount
    : myPendingBugCount;

  const bugBadgeColor = isSuperAdmin ? "green" : "default";

  // 👤 User/Admin → personal suggestions
  const mySuggestions = useQuery(api.suggestions.getMySuggestions);

  // 👑 Always call suggestion stats (safe for all roles)
  const suggestionStats = useQuery(api.suggestions.getStats);

  // 👤 User/Admin → pending suggestions only
  const myPendingSuggestionCount =
    mySuggestions?.filter((s) => s.status === "pending").length || 0;

  // 👑 Super admin → ALL pending suggestions
  const globalPendingSuggestionCount = suggestionStats?.pending || 0;

  const suggestionBadgeCount = isSuperAdmin
    ? globalPendingSuggestionCount
    : myPendingSuggestionCount;

  const suggestionBadgeColor = isSuperAdmin ? "blue" : "default";

  return [
    {
      name: "Dashboard",
      href: "/dashboard",
      category: "My Workspace",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Personal KPI",
      href: "/dashboard/personal-kpi",
      category: "My Workspace",
      icon: <Gauge size={20} />,
    },
    {
      name: "Projects (11 plans)",
      href: "/dashboard/project",
      category: "Department",
      icon: <Calculator size={20} />,
    },
    {
      name: "Trust Funds (Project Organs)",
      href: "/dashboard/trust-funds",
      category: "Department",
      icon: <Vault size={20} />,
      isNew: true,
    },
    {
      name: "Particulars",
      href: "/dashboard/particulars",
      category: "Department",
      icon: <FileText size={20} />,
      isNew: true,
    },
    {
      name: "Office",
      href: "/dashboard/office",
      category: "Cross Department",
      icon: <Building2 size={20} />,
    },
    {
      name: "CMS",
      href: "/dashboard/cms",
      category: "Control Panel",
      icon: <FileEdit size={20} />,
    },
    {
      name: "Settings",
      category: "Control Panel",
      icon: <SettingsIcon size={20} />,
      submenu: [
        {
          name: "User Management",
          href: "/dashboard/settings/user-management",
        },
        {
          name: "Updates",
          href: "/dashboard/settings/updates",
          submenu: [
            {
              name: "Changelogs",
              href: "/dashboard/settings/updates/changelogs",
            },
            {
              name: "Bugs",
              href: "/dashboard/settings/updates/bugs-report",
              badgeCount: bugBadgeCount,
              badgeColor: bugBadgeColor,
            },
            {
              name: "Suggestions",
              href: "/dashboard/settings/suggestions",
              badgeCount: suggestionBadgeCount,
              badgeColor: suggestionBadgeColor,
            },
          ],
        },
      ],
    },
  ];
}
