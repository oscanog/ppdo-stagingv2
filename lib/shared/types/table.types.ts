// lib/shared/types/table.types.ts

/**
 * Generic sort direction type
 */
export type SortDirection = "asc" | "desc" | null;

/**
 * Generic sort state for any entity
 */
export interface SortState<T extends string> {
  field: T | null;
  direction: SortDirection;
}

/**
 * Context menu state for right-click menus
 */
export interface ContextMenuState<T> {
  x: number;
  y: number;
  entity: T;
}

/**
 * Selection state for table rows
 */
export interface SelectionState {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

/**
 * Generic table column definition
 */
export interface TableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
}

/**
 * Filter state for tables
 */
export interface FilterState {
  searchQuery: string;
  statusFilter: string[];
  yearFilter: number[];
  officeFilter?: string[];
}