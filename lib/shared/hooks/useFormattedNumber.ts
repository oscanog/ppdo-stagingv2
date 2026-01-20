// lib/shared/hooks/useFormattedNumber.ts

import { useState, useCallback, useEffect } from 'react';
import {
  formatNumberWithCommas,
  parseFormattedNumber,
  formatNumberForDisplay,
} from '../utils/formatting';

/**
 * Return type for useFormattedNumber hook
 */
export interface UseFormattedNumberReturn {
  displayValue: string;
  numericValue: number;
  handleChange: (value: string) => void;
  handleBlur: () => void;
  setValue: (value: number) => void;
  reset: () => void;
}

/**
 * Hook for managing formatted number inputs
 * Handles real-time comma formatting and proper display
 * 
 * @param initialValue - Initial numeric value (default: 0)
 * @param onChange - Optional callback when value changes
 * @returns Object with display value, numeric value, and handlers
 * 
 * @example
 * ```tsx
 * const allocated = useFormattedNumber(
 *   form.getValues("totalBudgetAllocated"),
 *   (value) => form.setValue("totalBudgetAllocated", value)
 * );
 * 
 * <Input
 *   value={allocated.displayValue}
 *   onChange={(e) => allocated.handleChange(e.target.value)}
 *   onBlur={allocated.handleBlur}
 * />
 * ```
 */
export function useFormattedNumber(
  initialValue: number = 0,
  onChange?: (value: number) => void
): UseFormattedNumberReturn {
  const [displayValue, setDisplayValue] = useState(
    initialValue > 0 ? formatNumberForDisplay(initialValue) : ''
  );
  const [numericValue, setNumericValue] = useState(initialValue);

  // Sync with external changes to initialValue
  useEffect(() => {
    if (initialValue !== numericValue) {
      setNumericValue(initialValue);
      setDisplayValue(initialValue > 0 ? formatNumberForDisplay(initialValue) : '');
    }
  }, [initialValue]);

  /**
   * Handle input change - formats with commas in real-time
   */
  const handleChange = useCallback((value: string) => {
    const formatted = formatNumberWithCommas(value);
    setDisplayValue(formatted);
    const numeric = parseFormattedNumber(formatted);
    setNumericValue(numeric);
    onChange?.(numeric);
  }, [onChange]);

  /**
   * Handle input blur - formats for display
   */
  const handleBlur = useCallback(() => {
    if (numericValue > 0) {
      setDisplayValue(formatNumberForDisplay(numericValue));
    } else {
      setDisplayValue('');
    }
  }, [numericValue]);

  /**
   * Programmatically set the value
   */
  const setValue = useCallback((value: number) => {
    setNumericValue(value);
    setDisplayValue(value > 0 ? formatNumberForDisplay(value) : '');
    onChange?.(value);
  }, [onChange]);

  /**
   * Reset to initial value
   */
  const reset = useCallback(() => {
    setNumericValue(0);
    setDisplayValue('');
    onChange?.(0);
  }, [onChange]);

  return { 
    displayValue, 
    numericValue, 
    handleChange, 
    handleBlur, 
    setValue,
    reset,
  };
}