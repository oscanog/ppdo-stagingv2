// lib/shared/hooks/useURLParams.ts

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Hook for syncing state with URL parameters
 * Useful for maintaining filter state across page refreshes
 * 
 * @param paramName - URL parameter name
 * @param fallbackKey - Optional sessionStorage key for fallback
 * @returns Current value from URL or fallback
 * 
 * @example
 * ```tsx
 * const yearFromURL = useURLParams('year', 'budget_year_preference');
 * 
 * useEffect(() => {
 *   if (yearFromURL) {
 *     setYearFilter([parseInt(yearFromURL)]);
 *   }
 * }, [yearFromURL]);
 * ```
 */
export function useURLParams(
  paramName: string,
  fallbackKey?: string
): string | null {
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    // Priority 1: Read from URL query params
    const urlValue = searchParams.get(paramName);
    
    if (urlValue) {
      setValue(urlValue);
      return;
    }

    // Priority 2: Fallback to sessionStorage
    if (fallbackKey && typeof window !== 'undefined') {
      try {
        const sessionValue = sessionStorage.getItem(fallbackKey);
        if (sessionValue) {
          setValue(sessionValue);
        }
      } catch (error) {
        console.error(`Failed to read from sessionStorage: ${fallbackKey}`, error);
      }
    }
  }, [paramName, fallbackKey, searchParams]);

  return value;
}

/**
 * Hook for syncing array values with URL parameters
 * Handles multiple values for the same parameter (e.g., ?year=2024&year=2023)
 * 
 * @param paramName - URL parameter name
 * @param fallbackKey - Optional sessionStorage key for fallback
 * @returns Array of values from URL or fallback
 * 
 * @example
 * ```tsx
 * const yearsFromURL = useURLParamsArray('year');
 * 
 * useEffect(() => {
 *   if (yearsFromURL.length > 0) {
 *     setYearFilter(yearsFromURL.map(y => parseInt(y)));
 *   }
 * }, [yearsFromURL]);
 * ```
 */
export function useURLParamsArray(
  paramName: string,
  fallbackKey?: string
): string[] {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    // Get all values for this parameter
    const urlValues = searchParams.getAll(paramName);
    
    if (urlValues.length > 0) {
      setValues(urlValues);
      return;
    }

    // Fallback to sessionStorage
    if (fallbackKey && typeof window !== 'undefined') {
      try {
        const sessionValue = sessionStorage.getItem(fallbackKey);
        if (sessionValue) {
          setValues([sessionValue]);
        }
      } catch (error) {
        console.error(`Failed to read from sessionStorage: ${fallbackKey}`, error);
      }
    }
  }, [paramName, fallbackKey, searchParams]);

  return values;
}

/**
 * Hook for syncing filter state to URL
 * Updates URL when filter values change
 * 
 * @param paramName - URL parameter name
 * @param values - Array of values to sync
 * 
 * @example
 * ```tsx
 * const [yearFilter, setYearFilter] = useState<number[]>([]);
 * 
 * // Sync yearFilter to URL
 * useSyncToURL('year', yearFilter.map(String));
 * ```
 */
export function useSyncToURL(
  paramName: string,
  values: (string | number)[]
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentParams = new URLSearchParams(window.location.search);
    
    // Remove existing values for this param
    currentParams.delete(paramName);

    // Add new values
    if (values.length > 0) {
      values.forEach(value => {
        currentParams.append(paramName, String(value));
      });
    }

    // Update URL
    const newUrl = currentParams.toString()
      ? `${window.location.pathname}?${currentParams.toString()}`
      : window.location.pathname;
    
    window.history.replaceState(null, '', newUrl);
  }, [paramName, values]);
}

/**
 * Hook for managing year filter with URL sync
 * Combines URL reading and syncing in one hook
 * 
 * @param storageKey - SessionStorage fallback key
 * @returns Tuple of [yearFilter, setYearFilter]
 * 
 * @example
 * ```tsx
 * const [yearFilter, setYearFilter] = useYearFilter('budget_year_preference');
 * ```
 */
export function useYearFilter(
  storageKey: string = 'budget_year_preference'
): [number[], (years: number[]) => void] {
  const searchParams = useSearchParams();
  const [yearFilter, setYearFilter] = useState<number[]>([]);

  // Initialize from URL or sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const yearParam = urlParams.get('year');

    if (yearParam) {
      const year = parseInt(yearParam);
      if (!isNaN(year)) {
        setYearFilter([year]);
        return;
      }
    }

    // Fallback to sessionStorage
    try {
      const sessionYear = sessionStorage.getItem(storageKey);
      if (sessionYear) {
        const year = parseInt(sessionYear);
        if (!isNaN(year)) {
          setYearFilter([year]);
        }
      }
    } catch (error) {
      console.error('Failed to read year from sessionStorage', error);
    }
  }, [searchParams, storageKey]);

  // Sync to URL when yearFilter changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    
    if (yearFilter.length > 0) {
      yearFilter.forEach(year => params.append('year', String(year)));

      // Preserve other params
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.forEach((value, key) => {
        if (key !== 'year') {
          params.append(key, value);
        }
      });
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    window.history.replaceState(null, '', newUrl);
  }, [yearFilter]);

  return [yearFilter, setYearFilter];
}