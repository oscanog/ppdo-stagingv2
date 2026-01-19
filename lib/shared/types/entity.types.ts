// lib/shared/types/entity.types.ts

/**
 * Generic entity item for combobox components
 */
export interface EntityComboboxItem {
  id: string;
  code: string;
  displayName: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Configuration for entity combobox
 */
export interface EntityComboboxConfig {
  // Entity display
  entityName: string;
  entityNamePlural: string;
  
  // Validation
  codePattern: RegExp;
  codeErrorMessage: string;
  
  // Creation
  allowCreate: boolean;
  
  // Pagination
  itemsPerPage?: number;
}

/**
 * Searchable entity interface
 */
export interface SearchableEntity {
  code: string;
  fullName: string;
  description?: string;
  category?: string;
}

/**
 * Selectable entity interface
 */
export interface SelectableEntity {
  _id: string;
  isActive?: boolean;
  usageCount?: number;
}