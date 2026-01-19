// lib/shared/hooks/index.ts

/**
 * Shared hooks for Budget and Project modules
 * 
 * These hooks eliminate duplicate logic across forms and tables
 */

// Number formatting hook
export {
  useFormattedNumber,
  type UseFormattedNumberReturn,
} from './useFormattedNumber';

// Table state management hook
export {
  useTableState,
  type TableState,
  type TableStateActions,
} from './useTableState';

// Auto-save hooks
export {
  useAutoSave,
  useLoadDraft,
  useClearDraft,
  useHasDraft,
} from './useAutoSave';

// URL parameter hooks
export {
  useURLParams,
  useURLParamsArray,
  useSyncToURL,
  useYearFilter,
} from './useURLParams';