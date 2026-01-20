// lib/shared/types/form.types.ts

/**
 * Common validation messages
 */
export interface ValidationMessages {
  REQUIRED: string;
  EMPTY_WHITESPACE: string;
  INVALID_FORMAT: string;
  MIN_ZERO: string;
}

/**
 * Form state for auto-save functionality
 */
export interface FormDraftState<T> {
  values: T;
  timestamp: number;
  isDirty: boolean;
}

/**
 * Violation detail for budget validations
 */
export interface ViolationDetail {
  label: string;
  amount: number;
  limit: number;
  diff: number;
}

/**
 * Violation data structure
 */
export interface ViolationData {
  hasViolation: boolean;
  message: string;
  details?: ViolationDetail[];
}