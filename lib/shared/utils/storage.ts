// lib/shared/constants/storage.ts

export const STORAGE_KEYS = {
  // Budget module
  BUDGET_FORM_DRAFT: "budget_item_form_draft",
  BUDGET_YEAR_PREFERENCE: "budget_year_preference",
  BUDGET_OPEN_ADD: "budget_open_add",
  
  // Project module
  PROJECT_FORM_DRAFT: "project_form_draft",
  PROJECT_YEAR_PREFERENCE: "budget_year_preference", // Shares with budget
  
  // Common
  SHOW_DETAILS: "showBudgetDetails",
} as const;