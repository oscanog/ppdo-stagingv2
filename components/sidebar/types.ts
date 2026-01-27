//components\sidebar\types.ts

import type React from "react";

export interface SubMenuItem {
  name: string;
  href?: string;
  submenu?: SubMenuItem[];
  isNew?: boolean;

  // ✅ ADD THIS
  badgeCount?: number;
  badgeColor?: string;
}

export interface NavItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  submenu?: SubMenuItem[];
  category?: string;
  disabled?: boolean;
  isNew?: boolean;
}

export interface NavCategory {
  name: string;
  items: NavItem[];
}

export interface SidebarProps {
  navItems?: NavItem[];
}