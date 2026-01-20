// lib/shared/hooks/useTableState.ts

import { useState, useCallback, useMemo } from 'react';
import { SortDirection } from '../types/table.types';

/**
 * Table state interface
 */
export interface TableState<TSortField extends string> {
  // Selection
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  
  // Search & Filters
  searchQuery: string;
  statusFilter: string[];
  yearFilter: number[];
  officeFilter: string[];
  
  // Sorting
  sortField: TSortField | null;
  sortDirection: SortDirection;
}

/**
 * Table state actions interface
 */
export interface TableStateActions<TSortField extends string> {
  // Selection
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  toggleRow: (id: string) => void;
  setSelectedIds: (ids: Set<string>) => void;
  
  // Search & Filters
  setSearchQuery: (query: string) => void;
  toggleStatusFilter: (status: string) => void;
  toggleYearFilter: (year: number) => void;
  toggleOfficeFilter: (office: string) => void;
  clearFilters: () => void;
  
  // Sorting
  handleSort: (field: TSortField) => void;
  resetSort: () => void;
}

/**
 * Hook for managing table state (selection, sorting, filtering)
 * 
 * @param totalItems - Total number of items in the table
 * @returns Tuple of [state, actions]
 * 
 * @example
 * ```tsx
 * const [tableState, tableActions] = useTableState<BudgetSortField>(
 *   filteredItems.length
 * );
 * 
 * <input
 *   value={tableState.searchQuery}
 *   onChange={(e) => tableActions.setSearchQuery(e.target.value)}
 * />
 * ```
 */
export function useTableState<TSortField extends string>(
  totalItems: number
): [TableState<TSortField>, TableStateActions<TSortField>] {
  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<number[]>([]);
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  
  // Sort state
  const [sortField, setSortField] = useState<TSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Computed selection state
  const isAllSelected = totalItems > 0 && selectedIds.size === totalItems;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < totalItems;

  // ============================================================================
  // SELECTION ACTIONS
  // ============================================================================

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // ============================================================================
  // FILTER ACTIONS
  // ============================================================================

  const toggleStatusFilter = useCallback((status: string) => {
    setStatusFilter(prev =>
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  }, []);

  const toggleYearFilter = useCallback((year: number) => {
    setYearFilter(prev =>
      prev.includes(year) 
        ? prev.filter(y => y !== year) 
        : [...prev, year]
    );
  }, []);

  const toggleOfficeFilter = useCallback((office: string) => {
    setOfficeFilter(prev =>
      prev.includes(office) 
        ? prev.filter(o => o !== office) 
        : [...prev, office]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter([]);
    setYearFilter([]);
    setOfficeFilter([]);
    setSortField(null);
    setSortDirection(null);
  }, []);

  // ============================================================================
  // SORT ACTIONS
  // ============================================================================

  const handleSort = useCallback((field: TSortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      setSortDirection(prev =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      );
      if (sortDirection === 'desc') {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const resetSort = useCallback(() => {
    setSortField(null);
    setSortDirection(null);
  }, []);

  // ============================================================================
  // RETURN STATE AND ACTIONS
  // ============================================================================

  const state: TableState<TSortField> = useMemo(() => ({
    selectedIds,
    isAllSelected,
    isIndeterminate,
    searchQuery,
    statusFilter,
    yearFilter,
    officeFilter,
    sortField,
    sortDirection,
  }), [
    selectedIds,
    isAllSelected,
    isIndeterminate,
    searchQuery,
    statusFilter,
    yearFilter,
    officeFilter,
    sortField,
    sortDirection,
  ]);

  const actions: TableStateActions<TSortField> = useMemo(() => ({
    selectAll,
    clearSelection,
    toggleRow,
    setSelectedIds,
    setSearchQuery,
    toggleStatusFilter,
    toggleYearFilter,
    toggleOfficeFilter,
    clearFilters,
    handleSort,
    resetSort,
  }), [
    selectAll,
    clearSelection,
    toggleRow,
    toggleStatusFilter,
    toggleYearFilter,
    toggleOfficeFilter,
    clearFilters,
    handleSort,
    resetSort,
  ]);

  return [state, actions];
}