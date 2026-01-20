// lib/shared/constants/validation.ts

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required.",
  EMPTY_WHITESPACE: "Cannot be empty or only whitespace.",
  INVALID_FORMAT:
    "Only letters (including accents), numbers, underscores, percentage signs, spaces, commas, periods, hyphens, and @ are allowed.",
  MIN_ZERO: "Must be 0 or greater.",
} as const;

export const VALIDATION_LIMITS = {
  MIN_YEAR: 2000,
  MAX_YEAR: 2100,
} as const;

// ✅ UPDATED: Allow accented letters, spaces, %, commas, periods, hyphens, and @
export const CODE_PATTERN = /^[\p{L}0-9_%\s,.\-@]+$/u;