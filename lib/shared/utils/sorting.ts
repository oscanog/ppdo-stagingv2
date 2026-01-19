// lib/shared/utils/sorting.ts

import { SortDirection } from "../types/table.types";

/**
 * Generic sort function for any entity
 * @param items - Array of items to sort
 * @param field - Field to sort by
 * @param direction - Sort direction
 * @returns Sorted array
 */
export function sortItems<T>(
  items: T[],
  field: keyof T | null,
  direction: SortDirection
): T[] {
  if (!field || !direction) return items;

  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
}

/**
 * Sorts items with pinned items first
 * @param items - Array of items with optional isPinned property
 * @returns Sorted array with pinned items first
 */
export function sortWithPinnedFirst<T extends { isPinned?: boolean }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
}