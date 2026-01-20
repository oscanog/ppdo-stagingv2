// services/filtering/filterPresets.ts
// NEW FILE - CREATE THIS

/**
 * Common filter presets for Budget and Project modules
 * Provides ready-to-use filter configurations for common scenarios
 */

import { FilterConfig } from "./tableFilters";

/**
 * Preset: Show only ongoing items from current year
 */
export function ongoingThisYearPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[]
): FilterConfig<TItem, TSortField> {
  const currentYear = new Date().getFullYear();
  
  return {
    searchQuery: "",
    searchFields,
    statusFilter: ["ongoing"],
    yearFilter: [currentYear],
    sortField: null,
    sortDirection: null,
  };
}

/**
 * Preset: Show completed items sorted by budget utilized (desc)
 */
export function completedByBudgetPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[],
  budgetField: TSortField
): FilterConfig<TItem, TSortField> {
  return {
    searchQuery: "",
    searchFields,
    statusFilter: ["completed"],
    yearFilter: [],
    sortField: budgetField,
    sortDirection: "desc",
  };
}

/**
 * Preset: Show delayed items sorted by utilization rate
 */
export function delayedByUtilizationPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[],
  utilizationField: TSortField
): FilterConfig<TItem, TSortField> {
  return {
    searchQuery: "",
    searchFields,
    statusFilter: ["delayed"],
    yearFilter: [],
    sortField: utilizationField,
    sortDirection: "desc",
  };
}

/**
 * Preset: Show all items from specific years
 */
export function specificYearsPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[],
  years: number[]
): FilterConfig<TItem, TSortField> {
  return {
    searchQuery: "",
    searchFields,
    statusFilter: [],
    yearFilter: years,
    sortField: null,
    sortDirection: null,
  };
}

/**
 * Preset: High utilization items (>80%)
 */
export function highUtilizationPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[],
  utilizationField: TSortField
): FilterConfig<TItem, TSortField> {
  return {
    searchQuery: "",
    searchFields,
    statusFilter: [],
    yearFilter: [],
    sortField: utilizationField,
    sortDirection: "desc",
    customFilters: [
      (items) =>
        items.filter(
          (item) => (item[utilizationField] as number) >= 80
        ),
    ],
  };
}

/**
 * Preset: Low utilization items (<60%)
 */
export function lowUtilizationPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[],
  utilizationField: TSortField
): FilterConfig<TItem, TSortField> {
  return {
    searchQuery: "",
    searchFields,
    statusFilter: [],
    yearFilter: [],
    sortField: utilizationField,
    sortDirection: "asc",
    customFilters: [
      (items) =>
        items.filter(
          (item) => (item[utilizationField] as number) < 60
        ),
    ],
  };
}

/**
 * Preset: Budget exceeding allocated amount
 */
export function budgetExceededPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[],
  allocatedField: keyof TItem,
  utilizedField: keyof TItem
): FilterConfig<TItem, TSortField> {
  return {
    searchQuery: "",
    searchFields,
    statusFilter: [],
    yearFilter: [],
    sortField: null,
    sortDirection: null,
    customFilters: [
      (items) =>
        items.filter(
          (item) =>
            (item[utilizedField] as number) > (item[allocatedField] as number)
        ),
    ],
  };
}

/**
 * Preset: Empty filter (show all)
 */
export function showAllPreset<TItem, TSortField extends keyof TItem>(
  searchFields: (keyof TItem)[]
): FilterConfig<TItem, TSortField> {
  return {
    searchQuery: "",
    searchFields,
    statusFilter: [],
    yearFilter: [],
    sortField: null,
    sortDirection: null,
  };
}