import type React from "react";

export interface SubMenuItem {
  name: string;
  href: string;
  isNew?: boolean;
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