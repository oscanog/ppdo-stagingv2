// lib/shared/constants/display.ts

export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
} as const;

export const TIMEOUTS = {
  DEBOUNCE_SEARCH: 300,
  DRAFT_SAVE: 500,
  HEADER_SKELETON: 600,
  NEW_ITEM_HIGHLIGHT: 3000,
} as const;

export const ANIMATION = {
  NEW_PROJECT_DURATION: 2000, // 2 seconds
  SCROLL_DELAY: 100, // 100ms
} as const;

export const LIMITS = {
  UTILIZATION_WARNING: 60,
  UTILIZATION_DANGER: 80,
  PROJECT_STATUS_GOOD: 50,
  PROJECT_STATUS_WARNING: 30,
} as const;

export const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
] as const;