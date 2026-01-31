# Migration Plan: Project Budget Components to `components/ppdo/11_project_plan/`

## Overview
Migrate all components, hooks, types, and utilities from `app/dashboard/project/[year]/*` to the centralized library at `components/ppdo/11_project_plan/` for reuse across multiple pages.

---

## Current Structure Analysis

### Source Location
```
app/dashboard/project/[year]/
├── components/
│   ├── index.ts (barrel export)
│   ├── BudgetBulkToggleDialog.tsx
│   ├── BudgetConfirmationModal.tsx
│   ├── BudgetExpandModal.tsx
│   ├── BudgetItemForm.tsx
│   ├── BudgetModal.tsx
│   ├── BudgetPageHeader.tsx
│   ├── BudgetParticularCombobox.tsx
│   ├── BudgetShareModal.tsx
│   ├── BudgetStatistics.tsx
│   ├── BudgetTrackingTable.tsx
│   ├── BudgetViolationModal.tsx
│   ├── YearBudgetPageHeader.tsx
│   ├── form/
│   │   ├── index.ts
│   │   ├── BudgetItemForm.tsx
│   │   ├── ParticularField.tsx
│   │   ├── YearField.tsx
│   │   ├── AllocatedBudgetField.tsx
│   │   ├── AutoCalculateSwitch.tsx
│   │   ├── ManualInputSection.tsx
│   │   ├── ViolationAlerts.tsx
│   │   ├── InfoBanner.tsx
│   │   ├── FormActions.tsx
│   │   └── utils/
│   │       └── formValidation.ts
│   ├── table/
│   │   ├── BudgetColumnVisibilityMenu.tsx
│   │   ├── BudgetContextMenu.tsx
│   │   ├── BudgetTableEmptyState.tsx
│   │   ├── BudgetTableHeader.tsx
│   │   ├── BudgetTableRow.tsx
│   │   ├── BudgetTableToolbar.tsx
│   │   └── BudgetTableTotalsRow.tsx
│   └── hooks/ (13 hook files)
├── types/
│   ├── index.ts (barrel export)
│   ├── budget.types.ts
│   ├── table.types.ts
│   ├── form.types.ts
│   ├── hook.types.ts
│   ├── access.types.ts
│   └── print.types.ts
├── constants/
│   └── index.ts
├── utils/
│   ├── index.ts
│   └── budgetTableHelpers.ts
├── config/
│   └── budgetSpreadsheetConfig.ts
├── lib/
│   └── print-adapters/
│       └── BudgetPrintAdapter.ts
└── hooks/
    └── usePrintDraft.ts
```

### External Consumers (Files that import from this module)
1. `app/dashboard/project/[year]/page.tsx` - Main page
2. `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/page.tsx`
3. `app/dashboard/trust-funds/[year]/[slug]/page.tsx`
4. `app/dashboard/special-health-funds/[year]/[slug]/page.tsx`
5. `app/dashboard/special-education-funds/[year]/[slug]/page.tsx`
6. `app/dashboard/20_percent_df/[year]/[slug]/page.tsx`
7. `app/dashboard/project/page.tsx`
8. `components/ppdo/twenty-percent-df/components/TwentyPercentDFTable.tsx`
9. `components/ppdo/table/toolbar/adapters/BudgetTableToolbar.tsx`
10. `components/ppdo/table/print-preview/PrintPreviewModal.tsx`
11. `components/ppdo/projects/components/ProjectsTable.tsx`
12. `components/ppdo/breakdown/form/BreakdownForm.tsx`
13. `components/ppdo/inspection/components/RemarksSection.tsx`
14. `components/ppdo/inspection/components/financial/FinancialBreakdownTable.tsx`
15. `components/ppdo/funds/components/FundsTable.tsx`
16. `components/ppdo/BaseShareModal.tsx`

---

## Target Structure

```
components/ppdo/11_project_plan/
├── index.ts                              # Main barrel export
├── README.md                             # Usage documentation
│
├── components/                           # UI Components
│   ├── index.ts
│   ├── BudgetBulkToggleDialog.tsx
│   ├── BudgetConfirmationModal.tsx
│   ├── BudgetExpandModal.tsx
│   ├── BudgetItemForm.tsx
│   ├── BudgetModal.tsx
│   ├── BudgetPageHeader.tsx
│   ├── BudgetParticularCombobox.tsx
│   ├── BudgetShareModal.tsx
│   ├── BudgetStatistics.tsx
│   ├── BudgetTrackingTable.tsx
│   ├── BudgetViolationModal.tsx
│   ├── YearBudgetPageHeader.tsx
│   └── BudgetTableToolbar.tsx            # Moved from table/ subdirectory
│
├── form/                                 # Form components
│   ├── index.ts
│   ├── BudgetItemForm.tsx
│   ├── ParticularField.tsx
│   ├── YearField.tsx
│   ├── AllocatedBudgetField.tsx
│   ├── AutoCalculateSwitch.tsx
│   ├── ManualInputSection.tsx
│   ├── ViolationAlerts.tsx
│   ├── InfoBanner.tsx
│   ├── FormActions.tsx
│   └── formValidation.ts                 # Utils merged here
│
├── table/                                # Table components
│   ├── index.ts
│   ├── BudgetColumnVisibilityMenu.tsx
│   ├── BudgetContextMenu.tsx
│   ├── BudgetTableEmptyState.tsx
│   ├── BudgetTableHeader.tsx
│   ├── BudgetTableRow.tsx
│   └── BudgetTableTotalsRow.tsx
│
├── hooks/                                # Custom hooks
│   ├── index.ts
│   ├── useBudgetAccess.ts
│   ├── useBudgetData.ts
│   ├── useBudgetMutations.ts
│   ├── useBudgetTableState.ts
│   ├── useBudgetTableFilters.ts
│   ├── useBudgetTableSelection.ts
│   ├── useBudgetTableActions.ts
│   ├── useBudgetTablePrint.ts
│   ├── usePrintPreviewState.ts
│   ├── usePrintPreviewActions.ts
│   ├── usePrintPreviewDraft.ts
│   ├── usePrintPreviewInitialization.ts
│   ├── useTableCanvasResize.ts
│   └── usePrintDraft.ts                  # Merged from [year]/hooks/
│
├── types/                                # TypeScript types
│   ├── index.ts
│   ├── budget.types.ts
│   ├── table.types.ts
│   ├── form.types.ts
│   ├── hook.types.ts
│   ├── access.types.ts
│   └── print.types.ts
│
├── constants/                            # Constants
│   ├── index.ts
│   └── budget.constants.ts               # Renamed from index.ts
│
├── utils/                                # Utilities
│   ├── index.ts
│   ├── budgetTableHelpers.ts
│   └── budgetSpreadsheetConfig.ts        # Merged from config/
│
└── adapters/                             # Print adapters
    ├── index.ts
    └── BudgetPrintAdapter.ts
```

---

## Migration Phases

### Phase 0: Preparation & Backup
- [ ] Create backup branch: `backup/project-plan-migration`
- [ ] Verify all tests pass (if any)
- [ ] Document current state

### Phase 1: Create Target Structure
- [ ] Create `components/ppdo/11_project_plan/` directory structure
- [ ] Create all subdirectories (components/, form/, table/, hooks/, types/, constants/, utils/, adapters/)

### Phase 2: Copy & Migrate Files

#### Step 2.1: Types (Foundation)
- [ ] Copy all type files to `types/`
- [ ] Update `types/index.ts` barrel export
- [ ] Fix any relative imports in type files

#### Step 2.2: Constants & Utils
- [ ] Copy constants to `constants/`
- [ ] Copy utils to `utils/` (merge config/ files)
- [ ] Update imports to use `@/components/ppdo/11_project_plan/types`

#### Step 2.3: Hooks
- [ ] Copy all 14 hook files to `hooks/`
- [ ] Update imports within hooks:
  - `@/app/dashboard/project/[year]/types` → `@/components/ppdo/11_project_plan/types`
  - `@/app/dashboard/project/[year]/constants` → `@/components/ppdo/11_project_plan/constants`
  - `@/app/dashboard/project/[year]/utils` → `@/components/ppdo/11_project_plan/utils`

#### Step 2.4: Components
- [ ] Copy main components to `components/`
- [ ] Copy form components to `form/`
- [ ] Copy table components to `table/`
- [ ] Update all imports:
  - `./types` → `@/components/ppdo/11_project_plan/types`
  - `./hooks/*` → `@/components/ppdo/11_project_plan/hooks`
  - `./utils/*` → `@/components/ppdo/11_project_plan/utils`
  - `./constants` → `@/components/ppdo/11_project_plan/constants`
  - `@/app/dashboard/project/[year]/types` → `@/components/ppdo/11_project_plan/types`

### Phase 3: Create Public API
- [ ] Create main `index.ts` with organized exports:
  ```typescript
  // Components
  export { BudgetTrackingTable } from "./components/BudgetTrackingTable";
  export { BudgetStatistics } from "./components/BudgetStatistics";
  // ... etc

  // Form Components
  export { BudgetItemForm, ParticularField, YearField } from "./form";

  // Table Components
  export { BudgetTableRow, BudgetTableHeader } from "./table";

  // Hooks
  export { useBudgetData, useBudgetAccess, useBudgetMutations } from "./hooks";

  // Types
  export type { BudgetItem, BudgetTableProps } from "./types";

  // Utils
  export { extractYearFromURL, formatTimestamp } from "./utils";

  // Constants
  export { BUDGET_TABLE_COLUMNS, STATUS_OPTIONS } from "./constants";
  ```

### Phase 4: Update Consumers (Critical)

Update all files that import from the old location:

1. **Internal route files:**
   - [ ] `app/dashboard/project/[year]/page.tsx`
   - [ ] `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/page.tsx`

2. **Cross-route consumers:**
   - [ ] `app/dashboard/trust-funds/[year]/[slug]/page.tsx`
   - [ ] `app/dashboard/special-health-funds/[year]/[slug]/page.tsx`
   - [ ] `app/dashboard/special-education-funds/[year]/[slug]/page.tsx`
   - [ ] `app/dashboard/20_percent_df/[year]/[slug]/page.tsx`
   - [ ] `app/dashboard/project/page.tsx`

3. **PPDO components:**
   - [ ] `components/ppdo/twenty-percent-df/components/TwentyPercentDFTable.tsx`
   - [ ] `components/ppdo/table/toolbar/adapters/BudgetTableToolbar.tsx`
   - [ ] `components/ppdo/table/print-preview/PrintPreviewModal.tsx`
   - [ ] `components/ppdo/projects/components/ProjectsTable.tsx`
   - [ ] `components/ppdo/breakdown/form/BreakdownForm.tsx`
   - [ ] `components/ppdo/inspection/components/RemarksSection.tsx`
   - [ ] `components/ppdo/inspection/components/financial/FinancialBreakdownTable.tsx`
   - [ ] `components/ppdo/funds/components/FundsTable.tsx`
   - [ ] `components/ppdo/BaseShareModal.tsx`

### Phase 5: Verification
- [ ] Run `npx tsc --noEmit` - expect 0 errors
- [ ] Run `npm run build` - expect successful build
- [ ] Test key user flows:
  - Budget tracking table loads
  - Form submissions work
  - Print preview works
  - Modals open/close correctly

### Phase 6: Cleanup (After Verification)
- [ ] Delete `app/dashboard/project/[year]/components/`
- [ ] Delete `app/dashboard/project/[year]/types/`
- [ ] Delete `app/dashboard/project/[year]/constants/`
- [ ] Delete `app/dashboard/project/[year]/utils/`
- [ ] Delete `app/dashboard/project/[year]/config/`
- [ ] Delete `app/dashboard/project/[year]/lib/`
- [ ] Delete `app/dashboard/project/[year]/hooks/usePrintDraft.ts`
- [ ] Keep `page.tsx`, `layout.tsx`, and route-specific helpers

---

## Import Mapping Reference

| Old Import | New Import |
|------------|------------|
| `from "./components"` | `from "@/components/ppdo/11_project_plan"` |
| `from "./types"` | `from "@/components/ppdo/11_project_plan/types"` |
| `from "./hooks/*"` | `from "@/components/ppdo/11_project_plan/hooks"` |
| `from "./utils/*"` | `from "@/components/ppdo/11_project_plan/utils"` |
| `from "./constants"` | `from "@/components/ppdo/11_project_plan/constants"` |
| `from "@/app/dashboard/project/[year]/types"` | `from "@/components/ppdo/11_project_plan/types"` |
| `from "@/app/dashboard/project/[year]/components"` | `from "@/components/ppdo/11_project_plan"` |
| `from "@/app/dashboard/project/[year]/components/hooks/*"` | `from "@/components/ppdo/11_project_plan/hooks"` |

---

## Risk Mitigation

1. **Breaking Changes**: Update all imports atomically
2. **Type Errors**: Fix type imports first (foundation)
3. **Missing Exports**: Ensure all hooks/components are exported from index.ts
4. **Circular Dependencies**: Watch for imports between hooks and components

---

## Estimated Timeline
- Phase 0-1: 5 minutes
- Phase 2: 20 minutes
- Phase 3: 5 minutes
- Phase 4: 15 minutes
- Phase 5: 10 minutes
- Phase 6: 5 minutes
- **Total: ~60 minutes**

---

## Success Criteria
- [ ] TypeScript check passes (0 errors)
- [ ] Next.js build succeeds
- [ ] Budget tracking page functions correctly
- [ ] All dependent pages (trust funds, special funds, etc.) work
- [ ] No console errors
- [ ] All styles preserved
