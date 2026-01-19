// lib/shared/utils/filtering.ts

/**
 * Filters items by search query
 * Generic version that searches through specified fields
 */
export function filterBySearchQuery<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();
  return items.filter((item) => {
    return searchFields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

/**
 * Filters items by status
 */
export function filterByStatus<T extends { status?: string }>(
  items: T[],
  statuses: string[]
): T[] {
  if (statuses.length === 0) return items;
  return items.filter((item) => item.status && statuses.includes(item.status));
}

/**
 * Filters items by year
 */
export function filterByYear<T extends { year?: number }>(
  items: T[],
  years: number[]
): T[] {
  if (years.length === 0) return items;
  return items.filter((item) => item.year && years.includes(item.year));
}

/**
 * Extracts unique values from array of items
 */
export function extractUniqueValues<T, K extends keyof T>(
  items: T[],
  field: K
): T[K][] {
  const values = new Set<T[K]>();
  items.forEach((item) => {
    const value = item[field];
    if (value !== undefined && value !== null) {
      values.add(value);
    }
  });
  return Array.from(values);
}